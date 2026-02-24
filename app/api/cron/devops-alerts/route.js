// app/api/cron/devops-alerts/route.js
// 1-minute cron to send follow-up Slack alerts for ongoing downtime incidents

import { NextResponse } from 'next/server'
import { processAlertQueue } from '@/lib/devops'

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
