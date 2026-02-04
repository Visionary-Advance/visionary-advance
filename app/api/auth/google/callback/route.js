// app/api/auth/google/callback/route.js
// Handles Google OAuth callback

import { NextResponse } from 'next/server';
import {
  verifyState,
  exchangeCodeForTokens,
  getGoogleUserInfo,
  storeGoogleAuth
} from '@/lib/google-auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Default return URL
  let returnUrl = '/admin';

  try {
    // Handle OAuth errors from Google
    if (error) {
      console.error('Google OAuth error:', error);
      const errorDescription = searchParams.get('error_description') || error;
      return NextResponse.redirect(
        new URL(`${returnUrl}?google_error=${encodeURIComponent(errorDescription)}`, request.url)
      );
    }

    // Validate required params
    if (!code || !state) {
      return NextResponse.redirect(
        new URL(`${returnUrl}?google_error=missing_params`, request.url)
      );
    }

    // Verify state parameter (CSRF protection)
    let stateData;
    try {
      stateData = verifyState(state);
      returnUrl = stateData.returnUrl || returnUrl;

      // Check state timestamp (expire after 10 minutes)
      const stateAge = Date.now() - stateData.timestamp;
      if (stateAge > 10 * 60 * 1000) {
        return NextResponse.redirect(
          new URL(`${returnUrl}?google_error=state_expired`, request.url)
        );
      }
    } catch (stateError) {
      console.error('State verification failed:', stateError);
      return NextResponse.redirect(
        new URL(`${returnUrl}?google_error=invalid_state`, request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refreshToken) {
      console.warn('No refresh token received - user may need to re-authorize');
    }

    // Get user info
    const userInfo = await getGoogleUserInfo(tokens.accessToken);

    if (!userInfo.email) {
      return NextResponse.redirect(
        new URL(`${returnUrl}?google_error=no_email`, request.url)
      );
    }

    // Store tokens in database (link to admin email if provided)
    await storeGoogleAuth({
      adminEmail: stateData.adminEmail, // Admin user's email for lookup
      googleEmail: userInfo.email,       // Google account email for display
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      scopes: tokens.scope
    });

    console.log(`Google OAuth successful for admin: ${stateData.adminEmail || userInfo.email} (Google: ${userInfo.email})`);

    // Redirect back with success
    return NextResponse.redirect(
      new URL(`${returnUrl}?google_success=true&google_email=${encodeURIComponent(userInfo.email)}`, request.url)
    );
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`${returnUrl}?google_error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
