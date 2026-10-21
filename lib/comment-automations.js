// lib/comment-automations.js
// Comment-to-DM automations: when someone comments a keyword on a connected
// Facebook Page post or Instagram post, send them a private reply (DM).
//
// Meta allows one private reply per comment, within 7 days of the comment. If
// the person answers the DM, the normal 24-hour messaging window opens.
// Rules and the event log live in supabase/migrations/20261020_comment_automations.sql.

import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Same Graph API version as lib/facebook.js
const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

// Lazy-load Supabase client to avoid build-time initialization errors
let supabase = null;
function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return supabase;
}

/* -------------------------------------------------------------------------- */
/* Signature                                                                   */
/* -------------------------------------------------------------------------- */

// Meta signs the raw body with the app secret: X-Hub-Signature-256: sha256=<hex>
export function verifyMetaSignature(rawBody, header) {
  const secret = process.env.FACEBOOK_APP_SECRET;
  if (!secret) {
    return { valid: false, reason: 'FACEBOOK_APP_SECRET is not configured' };
  }
  if (!header?.startsWith('sha256=')) {
    return { valid: false, reason: 'Missing signature header' };
  }

  const expected = Buffer.from(
    crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  );
  const received = Buffer.from(header.slice('sha256='.length));

  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    return { valid: false, reason: 'Signature mismatch' };
  }
  return { valid: true };
}

/* -------------------------------------------------------------------------- */
/* Payload parsing                                                             */
/* -------------------------------------------------------------------------- */

// Flatten a webhook payload into the new comments it carries.
// Facebook: object 'page', field 'feed', value.item 'comment' + verb 'add'
// Instagram: object 'instagram', field 'comments'
export function extractComments(payload) {
  const comments = [];

  for (const entry of payload?.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};

      if (payload.object === 'page' && change.field === 'feed') {
        if (value.item !== 'comment' || value.verb !== 'add') continue;
        comments.push({
          platform: 'facebook',
          accountId: entry.id, // page ID
          commentId: value.comment_id,
          postId: value.post_id,
          text: value.message || '',
          fromId: value.from?.id,
          fromName: value.from?.name,
        });
      } else if (payload.object === 'instagram' && change.field === 'comments') {
        comments.push({
          platform: 'instagram',
          accountId: entry.id, // IG professional account ID
          commentId: value.id,
          postId: value.media?.id,
          text: value.text || '',
          fromId: value.from?.id,
          fromName: value.from?.username,
        });
      }
    }
  }

  return comments.filter((c) => c.commentId);
}

/* -------------------------------------------------------------------------- */
/* Rule matching                                                               */
/* -------------------------------------------------------------------------- */

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function keywordMatches(text, keyword, matchType) {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return false;
  const haystack = text.toLowerCase();

  if (matchType === 'contains') return haystack.includes(kw);

  // Whole word: "price" matches "Price?" and "#price" but not "priceless"
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(kw)}($|[^\\p{L}\\p{N}])`, 'u').test(haystack);
}

// Post-specific rules win over page-wide ones, which win over global ones
function ruleSpecificity(rule) {
  return (rule.post_id ? 2 : 0) + (rule.page_id ? 1 : 0);
}

export function findMatchingRule(rules, comment, pageId) {
  return rules
    .filter((rule) =>
      (rule.platform === 'both' || rule.platform === comment.platform) &&
      (!rule.page_id || rule.page_id === pageId) &&
      (!rule.post_id || rule.post_id === comment.postId) &&
      rule.keywords.some((kw) => keywordMatches(comment.text, kw, rule.match_type))
    )
    .sort((a, b) => ruleSpecificity(b) - ruleSpecificity(a))[0] || null;
}

/* -------------------------------------------------------------------------- */
/* Graph API calls                                                             */
/* -------------------------------------------------------------------------- */

async function graphPost(path, body, accessToken) {
  const response = await fetch(`${GRAPH_API_BASE}/${path}?access_token=${accessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || JSON.stringify(result));
  }
  return result;
}

// Private reply. Both platforms go through the page's messages endpoint with
// the page token; the comment ID tells Meta which platform and person to DM.
export function sendPrivateReply(account, commentId, text) {
  return graphPost(
    `${account.account_id}/messages`,
    { recipient: { comment_id: commentId }, message: { text } },
    account.access_token
  );
}

// Public reply under the comment (e.g. "Sent you a DM 👋")
export function replyToComment(platform, account, commentId, text) {
  const edge = platform === 'instagram' ? 'replies' : 'comments';
  return graphPost(`${commentId}/${edge}`, { message: text }, account.access_token);
}

/* -------------------------------------------------------------------------- */
/* Webhook handler                                                             */
/* -------------------------------------------------------------------------- */

async function findAccount(comment) {
  const column = comment.platform === 'instagram' ? 'instagram_account_id' : 'account_id';
  const { data } = await getSupabaseClient()
    .from('facebook_accounts')
    .select('account_id, account_name, access_token, instagram_account_id')
    .eq(column, comment.accountId)
    .maybeSingle();
  return data;
}

async function updateEvent(commentId, fields) {
  await getSupabaseClient()
    .from('social_comment_events')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('comment_id', commentId);
}

async function processComment(comment, rules) {
  // Our own comments (including the public "check your DMs" reply) come back
  // through the webhook too; ignoring them prevents reply loops.
  if (comment.fromId && comment.fromId === comment.accountId) {
    return { commentId: comment.commentId, result: 'own_comment' };
  }

  const account = await findAccount(comment);
  if (!account) {
    return { commentId: comment.commentId, result: 'unknown_account' };
  }

  const rule = findMatchingRule(rules, comment, account.account_id);
  if (!rule) {
    return { commentId: comment.commentId, result: 'no_match' };
  }

  // Claim the comment before sending anything. The unique comment_id makes a
  // repeat delivery from Meta fail here instead of sending a second DM.
  const { error: claimError } = await getSupabaseClient()
    .from('social_comment_events')
    .insert({
      comment_id: comment.commentId,
      platform: comment.platform,
      page_id: account.account_id,
      post_id: comment.postId,
      rule_id: rule.id,
      commenter_id: comment.fromId,
      commenter_name: comment.fromName,
      comment_text: comment.text,
    });

  if (claimError) {
    if (claimError.code === '23505') {
      return { commentId: comment.commentId, result: 'duplicate' };
    }
    throw claimError;
  }

  try {
    const dm = await sendPrivateReply(account, comment.commentId, rule.dm_message);

    // The DM is what matters; a failed public reply is logged but not fatal
    let publicReplyId = null;
    let publicReplyError = null;
    if (rule.public_reply) {
      try {
        publicReplyId = (await replyToComment(comment.platform, account, comment.commentId, rule.public_reply)).id;
      } catch (err) {
        publicReplyError = `Public reply failed: ${err.message}`;
      }
    }

    await updateEvent(comment.commentId, {
      status: 'sent',
      dm_message_id: dm.message_id || null,
      public_reply_id: publicReplyId,
      error: publicReplyError,
    });
    console.log(`✅ Comment DM sent (${comment.platform}, rule "${rule.name}") to`, comment.fromName || comment.fromId);
    return { commentId: comment.commentId, result: 'sent', ruleId: rule.id };
  } catch (err) {
    console.error('❌ Comment DM failed:', comment.commentId, err.message);
    await updateEvent(comment.commentId, { status: 'failed', error: err.message });
    return { commentId: comment.commentId, result: 'failed', error: err.message };
  }
}

export async function handleMetaWebhook(payload) {
  const comments = extractComments(payload);
  if (comments.length === 0) return { processed: 0, results: [] };

  const { data: rules, error } = await getSupabaseClient()
    .from('social_comment_rules')
    .select('*')
    .eq('active', true);

  if (error) throw error;

  const results = [];
  for (const comment of comments) {
    results.push(await processComment(comment, rules || []));
  }
  return { processed: comments.length, results };
}
