import { NextResponse } from 'next/server';
import { 
  exchangeCodeForTokens, 
  getJobberAccountInfo, 
  storeJobberTokens 
} from '@/lib/jobber';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.redirect(
      new URL(`/connect-jobber?error=${error}`, request.url)
    );
  }
  
  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }
  
  try {
    const tokens = await exchangeCodeForTokens(code);
    const accountInfo = await getJobberAccountInfo(tokens.access_token);
    await storeJobberTokens(accountInfo.id, accountInfo.name, tokens);
    
    return NextResponse.redirect(
      new URL('/connect-jobber?success=true', request.url)
    );
    
  } catch (err) {
    console.error('OAuth error:', err);
    return NextResponse.redirect(
      new URL(`/connect-jobber?error=oauth_failed`, request.url)
    );
  }
}