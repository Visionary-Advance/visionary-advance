import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getSiteForInvite, OAUTH_COOKIE } from '@/lib/jobber-leads';

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

  // A connect link for a client website carries ?site=&invite=. Check it now
  // so a bad link fails before the contractor logs in to Jobber.
  const { searchParams } = new URL(request.url);
  const site = searchParams.get('site');
  const invite = searchParams.get('invite');

  if (site || invite) {
    const valid = await getSiteForInvite(site, invite);
    if (!valid) {
      return NextResponse.redirect(new URL('/connect-jobber?error=invalid_invite', request.url));
    }
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

  // The callback checks `state` against this cookie (CSRF), and picks the
  // site invite back up from it.
  response.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, site, invite }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/jobber',
    maxAge: 10 * 60,
  });

  return response;
}
