// app/api/cron/devops-alerts/route.js
// 1-minute cron to send follow-up Slack alerts for ongoing downtime incidents

import { NextResponse } from 'next/server'
import { verifyCronRequest } from '@/lib/admin-api-auth'
import { processAlertQueue } from '@/lib/devops'

export async function GET(request) {
  try {
    const auth = verifyCronRequest(request)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const results = await processAlertQueue()

    // Only log when there's actual work done
    if (results.processed > 0) {
      console.log('DevOps alert queue processed:', results)
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('DevOps alerts cron error:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function POST(request) {
  return GET(request)
}
