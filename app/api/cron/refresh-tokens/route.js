// app/api/cron/refresh-tokens/route.js
// Automated token refresh endpoint - run daily via cron job

import { NextResponse } from 'next/server';
import { refreshExpiringTokens } from '@/lib/square-auth';

export async function GET(request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting scheduled token refresh...');

    // Refresh all expiring tokens
    const results = await refreshExpiringTokens();

    return NextResponse.json({
      success: true,
      message: 'Token refresh completed',
      results: {
        total: results.total,
        successful: results.successful,
        failed: results.failed
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron job error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support POST for manual triggering
export async function POST(request) {
  return GET(request);
}