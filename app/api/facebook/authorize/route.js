import { NextResponse } from 'next/server';

export async function GET(request) {
  const clientId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  // Validate environment variables
  if (!clientId) {
    console.error('❌ FACEBOOK_APP_ID is not set in environment variables');
    return NextResponse.json(
      { error: 'Facebook is not configured. Missing FACEBOOK_APP_ID.' },
      { status: 500 }
    );
  }

  if (!redirectUri) {
    console.error('❌ FACEBOOK_REDIRECT_URI is not set in environment variables');
    return NextResponse.json(
      { error: 'Facebook is not configured. Missing FACEBOOK_REDIRECT_URI.' },
      { status: 500 }
    );
  }

  // Facebook OAuth URL - same Graph API version as lib/facebook.js
  const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');

  // Scopes for reading Facebook Page posts and the linked Instagram account's media
  // pages_show_list: See list of pages user manages
  // pages_read_engagement: Read page posts and engagement data
  // instagram_basic: Read the linked Instagram professional account's profile and media
  // business_management: Reach pages and Instagram accounts owned through a Business portfolio
  // pages_manage_metadata: Subscribe the app to the page's webhooks (comment events)
  // pages_read_user_content: Read the text of other people's comments
  // pages_messaging: Send comment-to-DM private replies on Facebook
  // instagram_manage_comments: Receive Instagram comment webhooks and reply to comments
  // instagram_manage_messages: Send comment-to-DM private replies on Instagram
  const scopes = [
    'pages_show_list',
    'pages_read_engagement',
    'instagram_basic',
    'business_management',
    'pages_manage_metadata',
    'pages_read_user_content',
    'pages_messaging',
    'instagram_manage_comments',
    'instagram_manage_messages'
  ].join(',');

  authUrl.searchParams.append('scope', scopes);

  // Generate state for CSRF protection; the callback checks it against this cookie
  const state = crypto.randomUUID();
  authUrl.searchParams.append('state', state);

  console.log('🔐 Redirecting to Facebook OAuth:', authUrl.toString());

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('fb_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/facebook',
    maxAge: 60 * 10,
  });
  return response;
}
