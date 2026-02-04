// app/api/cron/devops-health/route.js
// Automated health check endpoint - run every 5 minutes via cron job

import { NextResponse } from 'next/server'
import { checkAllSites } from '@/lib/devops'

export async function GET(request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting DevOps health check cron...')

    const results = await checkAllSites()

    console.log('DevOps health check completed:', results)

    return NextResponse.json({
      success: true,
      message: 'Health checks completed',
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('DevOps cron job error:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

// Also support POST for manual triggering
export async function POST(request) {
  return GET(request)
}
