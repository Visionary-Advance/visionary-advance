// app/api/crm/pipeline/route.js
// GET pipeline stage counts and stats

import { NextResponse } from 'next/server'
import { getPipelineStats, STAGES } from '@/lib/crm'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

// GET /api/crm/pipeline - Get pipeline statistics
export async function GET(request) {
  try {
    const stats = await getPipelineStats()

    // Get leads grouped by stage for kanban view
    const { data: leads, error } = await supabase
      .from('crm_leads')
      .select('id, email, full_name, company, phone, score, stage, source, created_at, last_activity_at')
      .not('status', 'in', '("archived","unqualified")')
      .order('score', { ascending: false })

    if (error) throw error

    // Group leads by stage
    const leadsByStage = {}
    for (const stage of Object.keys(STAGES)) {
      leadsByStage[stage] = leads.filter(l => l.stage === stage)
    }

    // Calculate totals
    const totalLeads = leads.length
    const totalValue = leads.reduce((sum, l) => sum + (l.score || 0), 0)
    const avgScore = totalLeads > 0 ? Math.round(totalValue / totalLeads) : 0

    // Active deals (not in won/lost)
    const activeLeads = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost')

    return NextResponse.json({
      stats,
      leadsByStage,
      summary: {
        totalLeads,
        activeLeads: activeLeads.length,
        avgScore,
        won: stats.won?.count || 0,
        lost: stats.lost?.count || 0,
      },
      stages: STAGES,
    })
  } catch (error) {
    console.error('Error fetching pipeline:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
