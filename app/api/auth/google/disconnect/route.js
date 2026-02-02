// app/api/auth/google/disconnect/route.js
// Disconnects/revokes Google OAuth

import { NextResponse } from 'next/server';
import { revokeGoogleAuth } from '@/lib/google-auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await revokeGoogleAuth(email);

    return NextResponse.json({
      success: true,
      message: 'Google account disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting Google account:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to disconnect Google account' },
      { status: 500 }
    );
  }
}
