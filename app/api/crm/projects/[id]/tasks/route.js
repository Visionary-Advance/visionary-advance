// app/api/crm/projects/[id]/tasks/route.js
import { NextResponse } from 'next/server'
import { createTask, getProjectTasks, reorderTasks } from '@/lib/project-tasks'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    const options = {}
    if (searchParams.get('status')) options.status = searchParams.get('status')
    if (searchParams.get('assignee')) options.assignee = searchParams.get('assignee')

    const tasks = await getProjectTasks(id, options)
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    const task = await createTask(id, body)
    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Reorder tasks
    if (body.taskIds && Array.isArray(body.taskIds)) {
      await reorderTasks(id, body.taskIds)
      const tasks = await getProjectTasks(id)
      return NextResponse.json({ tasks })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating tasks:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update tasks' },
      { status: 500 }
    )
  }
}
