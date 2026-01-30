import { NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  getFacebookPages,
  storeFacebookTokens
} from '@/lib/facebook';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');

  if (error) {
    console.error('❌ Facebook OAuth error:', error, errorReason);
    const errorType = error === 'access_denied' ? 'access_denied' : 'oauth_failed';
    return NextResponse.redirect(
      new URL(`/connect-facebook?error=${errorType}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }

  try {
    // Exchange code for access token
    const tokens = await exchangeCodeForTokens(code);

    // Get pages the user manages (with page access tokens)
    const pages = await getFacebookPages(tokens.access_token);

    if (pages.length === 0) {
      console.error('❌ No Facebook pages found for this user');
      return NextResponse.redirect(
        new URL('/connect-facebook?error=no_pages', request.url)
      );
    }

    // Store the page token (first page)
    await storeFacebookTokens(null, null, tokens, pages);

    console.log('✅ Facebook OAuth successful, connected page:', pages[0].name);

    return NextResponse.redirect(
      new URL('/connect-facebook?success=true', request.url)
    );

  } catch (err) {
    console.error('❌ Facebook OAuth error:', err);
    return NextResponse.redirect(
      new URL(`/connect-facebook?error=oauth_failed`, request.url)
    );
  }
}
