import crypto from 'crypto';
import { NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  getJobberAccountInfo,
  storeJobberTokens
} from '@/lib/jobber';

// Set by /api/jobber/authorize
const STATE_COOKIE = 'jobber_oauth_state';

function stateMatches(expected, actual) {
  if (!expected || !actual) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function redirectTo(request, path) {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.delete({ name: STATE_COOKIE, path: '/api/jobber' });
  return response;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return redirectTo(request, `/connect-jobber?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }

  if (!stateMatches(request.cookies.get(STATE_COOKIE)?.value, searchParams.get('state'))) {
    return redirectTo(request, '/connect-jobber?error=state_mismatch');
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const accountInfo = await getJobberAccountInfo(tokens.access_token);
    await storeJobberTokens(accountInfo.id, accountInfo.name, tokens);

    return redirectTo(request, '/connect-jobber?success=true');

  } catch (err) {
    console.error('OAuth error:', err);
    return redirectTo(request, '/connect-jobber?error=oauth_failed');
  }
}
