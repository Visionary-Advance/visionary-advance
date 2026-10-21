// app/api/cron/resend-counts/route.js
// Snapshots per-site daily email counts from Resend before its ~30-day history
// rolls off. Runs ahead of the 9:00 SEO report cron so reports see fresh counts.

import { NextResponse } from 'next/server'
import { syncEmailCounts } from '@/lib/resend-stats'
import { verifyCronRequest } from '@/lib/admin-api-auth'

export async function GET(request) {
  // Fails closed if CRON_SECRET is unset, and compares in constant time.
  const auth = verifyCronRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const results = await syncEmailCounts()

    console.log('Resend count sync completed:', results)

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Resend count sync cron error:', error)
    return NextResponse.json(
      { success: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
