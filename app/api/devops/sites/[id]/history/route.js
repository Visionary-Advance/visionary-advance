// app/api/devops/sites/[id]/history/route.js
// GET - Get health check history for a site

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

// GET /api/devops/sites/[id]/history - Get health check history
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const status = searchParams.get('status')
    const since = searchParams.get('since') // ISO date string

    let query = supabase
      .from('devops_health_checks')
      .select('*', { count: 'exact' })
      .eq('site_id', id)
      .order('checked_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (since) {
      query = query.gte('checked_at', since)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    // Calculate stats for the period
    const stats = {
      total: count,
      healthy: data.filter(c => c.status === 'healthy').length,
      degraded: data.filter(c => c.status === 'degraded').length,
      down: data.filter(c => c.status === 'down').length,
      avgResponseTime: data.length > 0
        ? Math.round(data.reduce((sum, c) => sum + (c.response_time_ms || 0), 0) / data.length)
        : 0,
    }

    return NextResponse.json({
      history: data,
      stats,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
