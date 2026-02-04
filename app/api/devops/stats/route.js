// app/api/devops/stats/route.js
// GET dashboard statistics

import { NextResponse } from 'next/server'
import { getDevOpsStats } from '@/lib/devops'

// GET /api/devops/stats - Get DevOps dashboard stats
export async function GET() {
  try {
    const stats = await getDevOpsStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching DevOps stats:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
