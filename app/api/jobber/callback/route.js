import crypto from 'crypto';
import { NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  getJobberAccountInfo,
  storeJobberTokens
} from '@/lib/jobber';
import { getSiteForInvite, linkSiteToJobberAccount, OAUTH_COOKIE } from '@/lib/jobber-leads';

function readOAuthCookie(request) {
  try {
    return JSON.parse(request.cookies.get(OAUTH_COOKIE)?.value || 'null');
  } catch {
    return null;
  }
}

function stateMatches(expected, actual) {
  if (!expected || !actual) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function redirectTo(request, path) {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.delete({ name: OAUTH_COOKIE, path: '/api/jobber' });
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

  const saved = readOAuthCookie(request);
  if (!stateMatches(saved?.state, searchParams.get('state'))) {
    return redirectTo(request, '/connect-jobber?error=state_mismatch');
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const accountInfo = await getJobberAccountInfo(tokens.access_token);
    await storeJobberTokens(accountInfo.id, accountInfo.name, tokens);

    // Connect link for a client website: point that site's leads at this
    // account. Re-checked here because the invite is single-use.
    if (saved.site) {
      const site = await getSiteForInvite(saved.site, saved.invite);
      if (!site) {
        return redirectTo(request, '/connect-jobber?error=invalid_invite');
      }
      await linkSiteToJobberAccount(site.id, accountInfo.id);
    }

    return redirectTo(request, '/connect-jobber?success=true');

  } catch (err) {
    console.error('OAuth error:', err);
    return redirectTo(request, '/connect-jobber?error=oauth_failed');
  }
}
