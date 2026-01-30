// lib/facebook.js
import { createClient } from '@supabase/supabase-js';

// Same Supabase instance as other integrations (tokens database)
const supabase = createClient(
  process.env.SUPABASE_TOKENS_URL,
  process.env.SUPABASE_TOKENS_SERVICE_KEY
);

// Facebook Graph API version
const GRAPH_API_VERSION = 'v19.0';
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

// Get Facebook pages the user manages (returns first page with its token)
export async function getFacebookPages(accessToken) {
  const response = await fetch(
    `${GRAPH_API_BASE}/me/accounts?fields=id,name,access_token,category&access_token=${accessToken}`,
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

// Store tokens in Supabase (using existing facebook_accounts table schema)
// Stores the PAGE access token (not user token) since that's what we need for reading posts
export async function storeFacebookTokens(userId, userName, userTokens, pages) {
  if (!pages || pages.length === 0) {
    throw new Error('No Facebook pages found. You need to manage at least one Facebook page.');
  }

  // Use the first page's access token - page tokens don't expire when derived from long-lived user tokens
  const page = pages[0];

  // Page tokens derived from long-lived user tokens don't expire, but we'll set a far future date
  // User token expires in ~60 days, but page token is permanent
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year

  const { data, error } = await supabase
    .from('facebook_accounts')
    .upsert({
      account_id: page.id, // Store page ID as account_id
      account_name: page.name, // Store page name
      access_token: page.access_token, // Store PAGE token (this is what reads posts)
      refresh_token: userTokens.access_token, // Store user token as "refresh" for re-fetching page token if needed
      token_expires_at: expiresAt,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'account_id'
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error storing Facebook account:', error);
    throw error;
  }

  console.log('✅ Stored Facebook page token for:', page.name);
  return data;
}

// Get the stored Facebook account (page)
export async function getFacebookAccount() {
  const { data: account, error } = await supabase
    .from('facebook_accounts')
    .select('*')
    .single();

  if (error || !account) {
    return null;
  }

  return account;
}

// Get posts from the connected Facebook page
export async function getPagePosts(limit = 10) {
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
    'likes.summary(true)',
    'comments.summary(true)',
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
    'likes.summary(true)',
    'comments.summary(true)',
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
