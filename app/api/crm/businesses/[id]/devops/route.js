// app/api/crm/businesses/[id]/devops/route.js
// DevOps sites aggregated across all contacts in a business

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

// GET /api/crm/businesses/[id]/devops
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Get all contact IDs for this business
    const { data: contacts, error: contactsError } = await supabase
      .from('crm_leads')
      .select('id')
      .eq('business_id', id)

    if (contactsError) throw contactsError

    const contactIds = (contacts || []).map(c => c.id)

    if (contactIds.length === 0) {
      return NextResponse.json({ sites: [] })
    }

    // Get all DevOps sites linked to any contact in this business
    const { data: sites, error } = await supabase
      .from('devops_sites')
      .select(`
        id, name, url, environment, current_status, current_status_since, sla_target,
        devops_health_checks (
          id, status, response_time_ms, checked_at
        ),
        devops_incidents (
          id, status, severity, title, created_at
        )
      `)
      .in('crm_lead_id', contactIds)
      .order('checked_at', { foreignTable: 'devops_health_checks', ascending: false })
      .limit(1, { foreignTable: 'devops_health_checks' })
      .order('created_at', { foreignTable: 'devops_incidents', ascending: false })
      .limit(3, { foreignTable: 'devops_incidents' })

    if (error) throw error

    // Transform data (same logic as lead-level devops route)
    const transformedSites = (sites || []).map(site => {
      const openIncidents = site.devops_incidents?.filter(i => i.status !== 'resolved') || []
      return {
        id: site.id,
        name: site.name,
        url: site.url,
        environment: site.environment,
        status: site.current_status || site.devops_health_checks?.[0]?.status || 'unknown',
        statusSince: site.current_status_since,
        slaTarget: site.sla_target || 99.9,
        latestCheck: site.devops_health_checks?.[0] || null,
        openIncidentCount: openIncidents.length,
        recentIncidents: site.devops_incidents?.slice(0, 3) || [],
      }
    })

    return NextResponse.json({ sites: transformedSites })
  } catch (error) {
    console.error('Error fetching business DevOps sites:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
