import crypto from 'crypto';
import { NextResponse } from 'next/server';

// Holds the OAuth state between this route and the callback (CSRF check).
const STATE_COOKIE = 'jobber_oauth_state';

export async function GET(request) {
  const clientId = process.env.JOBBER_CLIENT_ID;
  const redirectUri = process.env.JOBBER_REDIRECT_URI;

  // Validate environment variables
  if (!clientId) {
    console.error('❌ JOBBER_CLIENT_ID is not set in environment variables');
    return NextResponse.json(
      { error: 'Jobber is not configured. Missing JOBBER_CLIENT_ID.' },
      { status: 500 }
    );
  }

  if (!redirectUri) {
    console.error('❌ JOBBER_REDIRECT_URI is not set in environment variables');
    return NextResponse.json(
      { error: 'Jobber is not configured. Missing JOBBER_REDIRECT_URI.' },
      { status: 500 }
    );
  }

  const authUrl = new URL('https://api.getjobber.com/api/oauth/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');

  // Add required scopes for client and request management
  // Note: Jobber scopes use plural forms (clients, requests)
  const scopes = 'clients:read clients:write requests:read requests:write';
  authUrl.searchParams.append('scope', scopes);

  const state = crypto.randomBytes(24).toString('base64url');
  authUrl.searchParams.append('state', state);

  const response = NextResponse.redirect(authUrl.toString());

  // The callback rejects the login unless Jobber hands back this same state.
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/jobber',
    maxAge: 10 * 60,
  });

  return response;
}
