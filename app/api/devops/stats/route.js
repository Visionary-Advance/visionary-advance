// app/api/devops/stats/route.js
// GET dashboard statistics

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { getDevOpsStats } from '@/lib/devops'

// GET /api/devops/stats - Get DevOps dashboard stats
export async function GET(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const stats = await getDevOpsStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching DevOps stats:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
