// app/api/cron/devops-health/route.js
// Automated health check endpoint - run every 5 minutes via cron job

import { NextResponse } from 'next/server'
import { verifyCronRequest } from '@/lib/admin-api-auth'
import { checkAllSites } from '@/lib/devops'

export async function GET(request) {
  try {
    const auth = verifyCronRequest(request)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
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
