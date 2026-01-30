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

  // Facebook OAuth URL - using Graph API v19.0
  const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');

  // Scopes for reading Facebook Page posts
  // pages_show_list: See list of pages user manages
  // pages_read_engagement: Read page posts and engagement data
  const scopes = [
    'pages_show_list',
    'pages_read_engagement'
  ].join(',');

  authUrl.searchParams.append('scope', scopes);

  // Generate state for CSRF protection
  const state = Math.random().toString(36).substring(7);
  authUrl.searchParams.append('state', state);

  console.log('🔐 Redirecting to Facebook OAuth:', authUrl.toString());

  return NextResponse.redirect(authUrl.toString());
}
