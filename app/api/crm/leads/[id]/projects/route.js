// app/api/crm/leads/[id]/projects/route.js
// Project endpoints for a specific lead

import { NextResponse } from 'next/server'
import { getLeadProjects, createProject } from '@/lib/projects'

// GET /api/crm/leads/[id]/projects - List projects for a lead
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const projects = await getLeadProjects(id)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/crm/leads/[id]/projects - Create a new project
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      name,
      description,
      status,
      budget,
      start_date,
      target_end_date,
      milestones,
      devops_site_ids,
      tags,
      actor_name = 'Admin',
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    const project = await createProject(id, {
      name,
      description,
      status,
      budget,
      start_date,
      target_end_date,
      milestones,
      devops_site_ids,
      tags,
    }, actor_name)

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    )
  }
}
