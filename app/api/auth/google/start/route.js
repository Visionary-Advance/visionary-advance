// app/api/auth/google/start/route.js
// Initiates Google OAuth flow

import { NextResponse } from 'next/server';
import { generateOAuthUrl } from '@/lib/google-auth';

export async function GET(request) {
  try {
    // Validate required env vars
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID not configured');
      return NextResponse.redirect(
        new URL('/admin/crm/settings?google_error=config_missing', request.url)
      );
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
      console.error('GOOGLE_CLIENT_SECRET not configured');
      return NextResponse.redirect(
        new URL('/admin/crm/settings?google_error=config_missing', request.url)
      );
    }

    if (!process.env.GOOGLE_OAUTH_STATE_SECRET) {
      console.error('GOOGLE_OAUTH_STATE_SECRET not configured');
      return NextResponse.redirect(
        new URL('/admin/crm/settings?google_error=config_missing', request.url)
      );
    }

    // Get return URL from query params (optional)
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get('returnUrl') || '/admin/crm/settings';

    // Generate OAuth URL and redirect
    const authUrl = generateOAuthUrl(returnUrl);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error starting Google OAuth:', error);
    return NextResponse.redirect(
      new URL(`/admin/crm/settings?google_error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
