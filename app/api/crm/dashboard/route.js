// app/api/crm/dashboard/route.js
// Dashboard widgets data

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

export async function GET(request) {
  try {
        const { searchParams } = new URL(request.url)

    const widgets = searchParams.get('widgets')?.split(',') || [
      'overdue',
      'upcoming',
      'at_risk',
      'active_projects',
      'recent_time',
    ]

    const result = {}

    // Overdue items (milestones and tasks)
    if (widgets.includes('overdue')) {
      const { data: overdue, error } = await supabase
        .from('crm_overdue_items')
        .select('*')
        .order('days_overdue', { ascending: false })
        .limit(10)

      if (error) console.error('Overdue query error:', error)
      result.overdue = overdue || []
    }

    // Upcoming deadlines (next 14 days)
    if (widgets.includes('upcoming')) {
      const { data: upcoming, error } = await supabase
        .from('crm_upcoming_deadlines')
        .select('*')
        .order('due_date', { ascending: true })
        .limit(10)

      if (error) console.error('Upcoming query error:', error)
      result.upcoming = upcoming || []
    }

    // Projects at risk
    if (widgets.includes('at_risk')) {
      const { data: atRisk, error } = await supabase
        .from('crm_projects_at_risk')
        .select('*')
        .limit(10)

      if (error) console.error('At risk query error:', error)
      result.atRisk = atRisk || []
    }

    // Active projects summary
    if (widgets.includes('active_projects')) {
      const { data: projects, error } = await supabase
        .from('crm_projects')
        .select(`
          id,
          name,
          status,
          lead_id,
          budget,
          estimated_hours,
          target_end_date,
          lead:crm_leads(full_name, company)
        `)
        .in('status', ['active', 'planning'])
        .order('updated_at', { ascending: false })
        .limit(5)

      if (error) console.error('Active projects error:', error)

      // Enrich with time data
      if (projects?.length > 0) {
        const { data: timeSummaries } = await supabase
          .from('crm_project_time_summary')
          .select('*')
          .in('project_id', projects.map(p => p.id))

        const timeByProject = {}
        for (const t of timeSummaries || []) {
          timeByProject[t.project_id] = t
        }

        result.activeProjects = projects.map(p => ({
          ...p,
          timeSummary: timeByProject[p.id],
        }))
      } else {
        result.activeProjects = []
      }
    }

    // Recent time entries
    if (widgets.includes('recent_time')) {
      const { data: recentTime, error } = await supabase
        .from('crm_time_entries')
        .select(`
          *,
          project:crm_projects(id, name),
          task:crm_project_tasks(id, title)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) console.error('Recent time error:', error)
      result.recentTime = recentTime || []
    }

    // Project stats
    if (widgets.includes('stats')) {
      const { data: statusCounts } = await supabase
        .from('crm_projects')
        .select('status')

      const stats = {
        total: statusCounts?.length || 0,
        planning: 0,
        active: 0,
        on_hold: 0,
        completed: 0,
        cancelled: 0,
      }

      for (const p of statusCounts || []) {
        if (stats[p.status] !== undefined) {
          stats[p.status]++
        }
      }

      // Total hours this week
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekStartStr = weekStart.toISOString().split('T')[0]

      const { data: weekTime } = await supabase
        .from('crm_time_entries')
        .select('duration_minutes')
        .gte('entry_date', weekStartStr)

      stats.hoursThisWeek = Math.round(
        (weekTime?.reduce((sum, t) => sum + t.duration_minutes, 0) || 0) / 60 * 10
      ) / 10

      result.stats = stats
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
