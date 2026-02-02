// app/api/auth/google/status/route.js
// Check Google OAuth connection status

import { NextResponse } from 'next/server';
import { getGoogleConnectionStatus } from '@/lib/google-auth';

export async function GET(request) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase not configured');
      return NextResponse.json({ connected: false });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400 }
      );
    }

    const status = await getGoogleConnectionStatus(email);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking Google connection status:', error);
    // Return not connected instead of error to avoid breaking the UI
    return NextResponse.json({ connected: false });
  }
}
