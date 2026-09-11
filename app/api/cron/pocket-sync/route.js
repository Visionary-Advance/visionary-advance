// app/api/cron/pocket-sync/route.js
// Re-checks Pocket tags every 15 minutes so recordings tagged after their
// summary finished still land on the right lead. Also picks up recordings
// whose webhook never made it.

import { NextResponse } from 'next/server'
import { resyncUnmatchedRecordings } from '@/lib/pocket'
import { verifyCronRequest } from '@/lib/admin-api-auth'

export async function GET(request) {
  // Fails closed if CRON_SECRET is unset, and compares in constant time.
  const auth = verifyCronRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const results = await resyncUnmatchedRecordings()

    console.log('Pocket sync completed:', results)

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Pocket sync cron error:', error)
    return NextResponse.json(
      { success: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
