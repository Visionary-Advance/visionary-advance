import { NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  getFacebookPages,
  storeFacebookTokens,
  subscribePageWebhooks
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

  // Reject callbacks that didn't start from our authorize route (CSRF)
  const state = searchParams.get('state');
  if (!state || state !== request.cookies.get('fb_oauth_state')?.value) {
    console.error('❌ Facebook OAuth state mismatch');
    return NextResponse.redirect(
      new URL('/connect-facebook?error=oauth_failed', request.url)
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

    // Store a page token for every page the user picked
    await storeFacebookTokens(null, null, tokens, pages);

    // Comment-to-DM automations need each page's comment webhooks. A failure
    // here (e.g. pages_manage_metadata declined) shouldn't fail the connection.
    const subscriptions = await Promise.allSettled(pages.map(subscribePageWebhooks));
    subscriptions.forEach((result, i) => {
      if (result.status === 'rejected') {
        console.error('⚠️ Webhook subscription failed for', pages[i].name, result.reason);
      }
    });

    console.log('✅ Facebook OAuth successful, connected pages:', pages.map((p) => p.name).join(', '));

    const response = NextResponse.redirect(
      new URL('/connect-facebook?success=true', request.url)
    );
    response.cookies.delete({ name: 'fb_oauth_state', path: '/api/facebook' });
    return response;

  } catch (err) {
    console.error('❌ Facebook OAuth error:', err);
    return NextResponse.redirect(
      new URL(`/connect-facebook?error=oauth_failed`, request.url)
    );
  }
}
