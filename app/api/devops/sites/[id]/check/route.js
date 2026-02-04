// app/api/devops/sites/[id]/check/route.js
// POST - Trigger a manual health check

import { NextResponse } from 'next/server'
import { performHealthCheck } from '@/lib/devops'

// POST /api/devops/sites/[id]/check - Trigger health check
export async function POST(request, { params }) {
  try {
    const { id } = await params

    const result = await performHealthCheck(id)

    if (result.skipped) {
      return NextResponse.json({
        success: false,
        reason: result.reason,
      })
    }

    return NextResponse.json({
      success: true,
      site: result.site,
      healthCheck: result.healthCheck,
      statusChanged: result.statusChanged,
      previousStatus: result.previousStatus,
    })
  } catch (error) {
    console.error('Error performing health check:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
