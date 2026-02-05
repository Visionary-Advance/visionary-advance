// app/api/devops/sites/route.js
// GET list, POST create sites

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

// GET /api/devops/sites - List all sites
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const environment = searchParams.get('environment')
    const category = searchParams.get('category')
    const isActive = searchParams.get('is_active')
    const search = searchParams.get('search')

    let query = supabase
      .from('devops_sites')
      .select(`
        *,
        devops_health_checks (
          id, status, response_time_ms, checked_at
        ),
        devops_incidents (
          id, status
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (environment) {
      query = query.eq('environment', environment)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true')
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    // Limit health checks to most recent
    query = query.order('checked_at', { foreignTable: 'devops_health_checks', ascending: false })
      .limit(1, { foreignTable: 'devops_health_checks' })

    const { data, error } = await query

    if (error) throw error

    // Transform to include latest check and open incident count at top level
    const sites = data.map(site => {
      const openIncidentCount = site.devops_incidents?.filter(i => i.status !== 'resolved').length || 0
      return {
        ...site,
        latestCheck: site.devops_health_checks?.[0] || null,
        openIncidentCount,
        devops_health_checks: undefined,
        devops_incidents: undefined,
      }
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/devops/sites - Create a new site
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      name,
      url,
      api_key,
      environment = 'production',
      category,
      owner_email,
      check_interval_minutes = 5,
      timeout_seconds = 30,
      is_active = true,
      ssl_check_enabled = true,
      health_url,
      monitor_link,
      sla_target = 99.9,
      crm_lead_id,
    } = body

    // Validate required fields
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Validate health_url if provided
    if (health_url) {
      try {
        new URL(health_url)
      } catch {
        return NextResponse.json(
          { error: 'Invalid health URL format' },
          { status: 400 }
        )
      }
    }

    // Validate monitor_link if provided
    if (monitor_link) {
      try {
        new URL(monitor_link)
      } catch {
        return NextResponse.json(
          { error: 'Invalid monitor link format' },
          { status: 400 }
        )
      }
    }

    // Check for duplicate URL
    const { data: existing } = await supabase
      .from('devops_sites')
      .select('id')
      .eq('url', url)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A site with this URL already exists' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('devops_sites')
      .insert({
        name,
        url,
        api_key,
        environment,
        category,
        owner_email,
        check_interval_minutes,
        timeout_seconds,
        is_active,
        ssl_check_enabled,
        health_url: health_url || null,
        monitor_link: monitor_link || null,
        sla_target: parseFloat(sla_target) || 99.9,
        crm_lead_id: crm_lead_id || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ site: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
