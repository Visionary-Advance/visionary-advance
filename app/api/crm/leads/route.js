// app/api/crm/leads/route.js
// GET (list + filter), POST (create)

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { createOrUpdateLead, STAGES, SOURCES } from '@/lib/crm'
import { getUTMFromRequest } from '@/lib/utm'

// GET /api/crm/leads - List leads with filtering and pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Filters
    const stage = searchParams.get('stage')
    const source = searchParams.get('source')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const minScore = searchParams.get('minScore')
    const maxScore = searchParams.get('maxScore')
    const type = searchParams.get('type') // 'leads', 'clients', or 'all'

    // Build query
    let query = supabase
      .from('crm_leads')
      .select('*', { count: 'exact' })

    // Filter by type (leads vs clients)
    if (type === 'clients') {
      query = query.eq('is_client', true)
    } else if (type === 'leads' || !type) {
      // Default: show only leads (non-clients)
      query = query.or('is_client.is.null,is_client.eq.false')
    }
    // type === 'all' shows both

    // Apply filters
    if (stage) {
      const stages = stage.split(',')
      query = query.in('stage', stages)
    }

    if (source) {
      const sources = source.split(',')
      query = query.in('source', sources)
    }

    if (status) {
      const statuses = status.split(',')
      query = query.in('status', statuses)
    } else {
      // By default, exclude archived leads
      query = query.neq('status', 'archived')
    }

    if (minScore) {
      query = query.gte('score', parseInt(minScore))
    }

    if (maxScore) {
      query = query.lte('score', parseInt(maxScore))
    }

    if (search) {
      const searchPattern = `%${search}%`
      query = query.or(`email.ilike.${searchPattern},full_name.ilike.${searchPattern},company.ilike.${searchPattern},phone.ilike.${searchPattern}`)
    }

    // Apply sorting
    const validSortFields = ['created_at', 'updated_at', 'score', 'stage_changed_at', 'last_activity_at', 'client_since']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    query = query.order(sortField, { ascending: sortOrder === 'asc', nullsFirst: false })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: leads, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      filters: {
        stages: Object.keys(STAGES),
        sources: Object.keys(SOURCES),
        statuses: ['new', 'contacted', 'qualified', 'unqualified', 'archived'],
      },
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/crm/leads - Create a new lead
export async function POST(request) {
  try {
    const body = await request.json()
    const utmParams = getUTMFromRequest(request)

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!body.source) {
      return NextResponse.json(
        { error: 'Source is required' },
        { status: 400 }
      )
    }

    // Validate source
    if (!SOURCES[body.source]) {
      return NextResponse.json(
        { error: `Invalid source: ${body.source}. Valid sources: ${Object.keys(SOURCES).join(', ')}` },
        { status: 400 }
      )
    }

    // Merge UTM params from request with body
    const leadData = {
      ...body,
      utm_source: body.utm_source || utmParams.utm_source,
      utm_medium: body.utm_medium || utmParams.utm_medium,
      utm_campaign: body.utm_campaign || utmParams.utm_campaign,
      utm_term: body.utm_term || utmParams.utm_term,
      utm_content: body.utm_content || utmParams.utm_content,
      referrer: body.referrer || utmParams.referrer,
      source_url: body.source_url || utmParams.source_url,
    }

    const { lead, isNew } = await createOrUpdateLead(leadData)

    return NextResponse.json({
      success: true,
      lead,
      isNew,
    }, { status: isNew ? 201 : 200 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
