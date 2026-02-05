// app/api/crm/leads/[id]/devops/route.js
// GET DevOps sites linked to a CRM lead

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Get all DevOps sites linked to this CRM lead
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
      .eq('crm_lead_id', id)
      .order('checked_at', { foreignTable: 'devops_health_checks', ascending: false })
      .limit(1, { foreignTable: 'devops_health_checks' })
      .order('created_at', { foreignTable: 'devops_incidents', ascending: false })
      .limit(3, { foreignTable: 'devops_incidents' })

    if (error) throw error

    // Transform data
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
    console.error('Error fetching DevOps sites for lead:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
