// app/api/crm/projects/[id]/route.js
// Individual project CRUD endpoints

import { NextResponse } from 'next/server'
import { getProjectWithDetails, updateProject, deleteProject } from '@/lib/projects'

// GET /api/crm/projects/[id] - Get project details
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const project = await getProjectWithDetails(id)

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)

    if (error.message?.includes('not found') || error.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH /api/crm/projects/[id] - Update project
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { actor_name = 'Admin', ...updateData } = body

    const project = await updateProject(id, updateData, actor_name)

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error updating project:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/crm/projects/[id] - Delete project
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const actorName = searchParams.get('actor_name') || 'Admin'

    await deleteProject(id, actorName)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    )
  }
}
