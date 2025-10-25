import { NextResponse } from 'next/server';

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

  const state = Math.random().toString(36).substring(7);
  authUrl.searchParams.append('state', state);

  console.log('🔐 Redirecting to Jobber OAuth:', authUrl.toString());

  return NextResponse.redirect(authUrl.toString());
}