// app/api/devops/incidents/route.js
// GET list, POST create incidents

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { createIncident } from '@/lib/devops'

// GET /api/devops/incidents - List incidents
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    const siteId = searchParams.get('site_id')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const includeResolved = searchParams.get('include_resolved') === 'true'

    let query = supabase
      .from('devops_incidents')
      .select(`
        *,
        devops_sites (
          id, name, url, environment
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // By default, exclude resolved unless explicitly requested
    if (!includeResolved && !status) {
      query = query.neq('status', 'resolved')
    }

    if (status) {
      query = query.eq('status', status)
    }
    if (severity) {
      query = query.eq('severity', severity)
    }
    if (siteId) {
      query = query.eq('site_id', siteId)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      incidents: data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/devops/incidents - Create a new incident
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      site_id,
      title,
      description,
      severity = 'minor',
      incident_type = 'downtime',
    } = body

    if (!site_id || !title) {
      return NextResponse.json(
        { error: 'site_id and title are required' },
        { status: 400 }
      )
    }

    const incident = await createIncident({
      site_id,
      title,
      description,
      severity,
      incident_type,
    })

    if (incident.duplicate) {
      return NextResponse.json({
        incident,
        message: 'Similar incident already exists',
      })
    }

    return NextResponse.json({ incident }, { status: 201 })
  } catch (error) {
    console.error('Error creating incident:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
