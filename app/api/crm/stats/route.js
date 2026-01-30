// app/api/crm/stats/route.js
// GET dashboard metrics and statistics

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { STAGES, SOURCES } from '@/lib/crm'

// GET /api/crm/stats - Get dashboard statistics
export async function GET(request) {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get all non-archived leads
    const { data: allLeads, error: leadsError } = await supabase
      .from('crm_leads')
      .select('id, stage, source, score, status, created_at, stage_changed_at')
      .neq('status', 'archived')

    if (leadsError) throw leadsError

    // Calculate metrics
    const totalLeads = allLeads.length
    const leadsThisWeek = allLeads.filter(l => new Date(l.created_at) > oneWeekAgo).length
    const leadsThisMonth = allLeads.filter(l => new Date(l.created_at) > oneMonthAgo).length
    const leadsToday = allLeads.filter(l => new Date(l.created_at) > today).length

    // Stage breakdown
    const byStage = {}
    for (const stage of Object.keys(STAGES)) {
      byStage[stage] = allLeads.filter(l => l.stage === stage).length
    }

    // Source breakdown
    const bySource = {}
    for (const source of Object.keys(SOURCES)) {
      bySource[source] = allLeads.filter(l => l.source === source).length
    }

    // Score distribution
    const scoreRanges = {
      'high': allLeads.filter(l => l.score >= 70).length,
      'medium': allLeads.filter(l => l.score >= 40 && l.score < 70).length,
      'low': allLeads.filter(l => l.score < 40).length,
    }

    // Average score
    const avgScore = totalLeads > 0
      ? Math.round(allLeads.reduce((sum, l) => sum + (l.score || 0), 0) / totalLeads)
      : 0

    // Conversion rate (won / total non-active)
    const wonCount = byStage.won || 0
    const lostCount = byStage.lost || 0
    const closedCount = wonCount + lostCount
    const conversionRate = closedCount > 0
      ? Math.round((wonCount / closedCount) * 100)
      : 0

    // Active pipeline (not won/lost)
    const activePipeline = totalLeads - wonCount - lostCount

    // Get recent activities
    const { data: recentActivities } = await supabase
      .from('crm_activities')
      .select(`
        id, type, title, created_at,
        lead_id
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get leads needing attention (no activity in 7 days, not won/lost)
    const { data: staleLeads } = await supabase
      .from('crm_leads')
      .select('id, email, full_name, company, stage, score, last_activity_at')
      .not('stage', 'in', '("won","lost")')
      .neq('status', 'archived')
      .lt('last_activity_at', oneWeekAgo.toISOString())
      .order('last_activity_at', { ascending: true })
      .limit(5)

    return NextResponse.json({
      overview: {
        totalLeads,
        activePipeline,
        leadsToday,
        leadsThisWeek,
        leadsThisMonth,
        avgScore,
        conversionRate,
        wonCount,
        lostCount,
      },
      breakdown: {
        byStage,
        bySource,
        scoreRanges,
      },
      recentActivities: recentActivities || [],
      staleLeads: staleLeads || [],
      stages: STAGES,
      sources: SOURCES,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
