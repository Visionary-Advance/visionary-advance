// lib/facebook.js
import { createClient } from '@supabase/supabase-js';

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

// Facebook Graph API version (matches lib/meta.js)
const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// Exchange authorization code for access token
export async function exchangeCodeForTokens(code) {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
    code: code
  });

  const response = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Token exchange error:', error);
    throw new Error(`Token exchange failed: ${JSON.stringify(error)}`);
  }

  const tokens = await response.json();
  console.log('✅ Facebook token exchange successful');

  // Exchange short-lived token for long-lived token (60 days)
  const longLivedTokens = await getLongLivedToken(tokens.access_token);

  return longLivedTokens;
}

// Exchange short-lived token for long-lived token
async function getLongLivedToken(shortLivedToken) {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    fb_exchange_token: shortLivedToken
  });

  const response = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Long-lived token exchange error:', error);
    // Fall back to short-lived token if exchange fails
    return { access_token: shortLivedToken, expires_in: 3600 };
  }

  const tokens = await response.json();
  console.log('✅ Long-lived token obtained (valid for ~60 days)');

  return tokens;
}

// Get Facebook user info
export async function getFacebookUserInfo(accessToken) {
  const response = await fetch(
    `${GRAPH_API_BASE}/me?fields=id,name&access_token=${accessToken}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ User info error:', error);
    throw new Error(`Failed to get user info: ${JSON.stringify(error)}`);
  }

  const userInfo = await response.json();
  console.log('✅ Got Facebook user info:', userInfo.name);

  return userInfo;
}

// Get the Facebook pages the user granted access to, each with its page token
// and the Instagram professional account linked to it (if any)
export async function getFacebookPages(accessToken) {
  const response = await fetch(
    `${GRAPH_API_BASE}/me/accounts?fields=id,name,access_token,category,instagram_business_account{id,username}&access_token=${accessToken}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Pages fetch error:', error);
    throw new Error(`Failed to get pages: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  const pages = result.data || [];

  console.log(`✅ Found ${pages.length} Facebook page(s)`);

  return pages;
}

// Store tokens in Supabase, one row per page (keyed by page ID)
// Stores the PAGE access token (not user token) since that's what we need for reading posts
export async function storeFacebookTokens(userId, userName, userTokens, pages) {
  if (!pages || pages.length === 0) {
    throw new Error('No Facebook pages found. You need to manage at least one Facebook page.');
  }

  // Page tokens derived from long-lived user tokens don't expire, but we'll set a far future date
  // User token expires in ~60 days, but page token is permanent
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year
  const now = new Date().toISOString();

  // /me/accounts only returns the pages the user picked in the login dialog, so store them all
  const { data, error } = await getSupabaseClient()
    .from('facebook_accounts')
    .upsert(pages.map((page) => ({
      account_id: page.id, // Store page ID as account_id
      account_name: page.name, // Store page name
      access_token: page.access_token, // Store PAGE token (this is what reads posts)
      refresh_token: userTokens.access_token, // Store user token as "refresh" for re-fetching page token if needed
      instagram_account_id: page.instagram_business_account?.id ?? null,
      instagram_username: page.instagram_business_account?.username ?? null,
      token_expires_at: expiresAt,
      updated_at: now
    })), {
      onConflict: 'account_id'
    })
    .select();

  if (error) {
    console.error('❌ Error storing Facebook account:', error);
    throw error;
  }

  console.log('✅ Stored Facebook page token for:', pages.map((p) => p.name).join(', '));
  return data;
}

// Get a stored Facebook account (page) by page ID. Without one, falls back to
// the most recently connected page, for callers from before multi-page support.
export async function getFacebookAccount(pageId) {
  let query = getSupabaseClient().from('facebook_accounts').select('*');
  query = pageId
    ? query.eq('account_id', pageId)
    : query.order('updated_at', { ascending: false }).limit(1);

  const { data: account, error } = await query.maybeSingle();

  if (error || !account) {
    return null;
  }

  return account;
}

// Get posts from a connected Facebook page
export async function getPagePosts(limit = 10, pageId) {
  const account = await getFacebookAccount(pageId);

  if (!account) {
    throw new Error('No Facebook page connected');
  }

  const fields = [
    'id',
    'message',
    'created_time',
    'full_picture',
    'permalink_url',
    'attachments{media_type,media,url,title,description}',
    // likes/comments summaries need advanced access (and pages_read_user_content), so they're left out
    'shares'
  ].join(',');

  const response = await fetch(
    `${GRAPH_API_BASE}/${account.account_id}/posts?fields=${fields}&limit=${limit}&access_token=${account.access_token}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Posts fetch error:', error);
    throw new Error(`Failed to get posts: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  return result.data || [];
}

// Get recent media from the Instagram account linked to a connected page.
// Uses the page token, which carries instagram_basic when the user granted it.
export async function getInstagramMedia(account, limit = 10) {
  if (!account?.instagram_account_id) {
    return [];
  }

  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp'
  ].join(',');

  const response = await fetch(
    `${GRAPH_API_BASE}/${account.instagram_account_id}/media?fields=${fields}&limit=${limit}&access_token=${account.access_token}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Instagram media fetch error:', error);
    throw new Error(`Failed to get Instagram media: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  return result.data || [];
}

// Get a single post by ID
export async function getPost(postId) {
  const account = await getFacebookAccount();

  if (!account) {
    throw new Error('No Facebook page connected');
  }

  const fields = [
    'id',
    'message',
    'created_time',
    'full_picture',
    'permalink_url',
    'attachments{media_type,media,url,title,description}',
    // likes/comments summaries need advanced access (and pages_read_user_content), so they're left out
    'shares'
  ].join(',');

  const response = await fetch(
    `${GRAPH_API_BASE}/${postId}?fields=${fields}&access_token=${account.access_token}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Post fetch error:', error);
    throw new Error(`Failed to get post: ${JSON.stringify(error)}`);
  }

  return await response.json();
}
