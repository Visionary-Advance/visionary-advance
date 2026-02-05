// app/api/crm/projects/route.js
// List all projects (for kanban view and project list)

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

export async function GET(request) {
  try {
        const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const leadId = searchParams.get('lead_id')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 50
    const offset = parseInt(searchParams.get('offset')) || 0

    let query = supabase
      .from('crm_projects')
      .select(`
        *,
        lead:crm_leads(id, full_name, company, email)
      `)

    // Filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Ordering and pagination
    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: projects, error, count } = await query

    if (error) throw error

    // Get task and time summaries for each project
    const projectIds = projects.map(p => p.id)

    // Get task counts
    const { data: taskCounts } = await supabase
      .from('crm_project_tasks')
      .select('project_id, status')
      .in('project_id', projectIds)

    // Aggregate task counts per project
    const tasksByProject = {}
    for (const task of taskCounts || []) {
      if (!tasksByProject[task.project_id]) {
        tasksByProject[task.project_id] = { total: 0, completed: 0, overdue: 0 }
      }
      tasksByProject[task.project_id].total++
      if (task.status === 'completed') {
        tasksByProject[task.project_id].completed++
      }
    }

    // Get time summaries
    const { data: timeSummaries } = await supabase
      .from('crm_project_time_summary')
      .select('*')
      .in('project_id', projectIds)

    const timeByProject = {}
    for (const summary of timeSummaries || []) {
      timeByProject[summary.project_id] = summary
    }

    // Enrich projects with summaries
    const enrichedProjects = projects.map(project => ({
      ...project,
      taskSummary: tasksByProject[project.id] || { total: 0, completed: 0 },
      timeSummary: timeByProject[project.id] || { total_hours: 0, percent_used: null },
    }))

    // Group by status for kanban view
    const byStatus = {
      planning: [],
      active: [],
      on_hold: [],
      completed: [],
      cancelled: [],
    }

    for (const project of enrichedProjects) {
      if (byStatus[project.status]) {
        byStatus[project.status].push(project)
      }
    }

    return NextResponse.json({
      projects: enrichedProjects,
      byStatus,
      total: count,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
