// app/api/crm/tasks/[id]/subtasks/route.js
// GET (list), POST (create) subtasks

import { NextResponse } from 'next/server'
import { getSubtasks, createSubtask, toggleSubtask, deleteSubtask } from '@/lib/tasks'

// GET /api/crm/tasks/[id]/subtasks - List subtasks
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const subtasks = await getSubtasks(id)
    return NextResponse.json({ subtasks })
  } catch (error) {
    console.error('Error fetching subtasks:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/crm/tasks/[id]/subtasks - Create a subtask
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const subtask = await createSubtask({
      task_id: id,
      title: body.title,
      sort_order: body.sort_order || 0,
    })

    return NextResponse.json({ success: true, subtask }, { status: 201 })
  } catch (error) {
    console.error('Error creating subtask:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/crm/tasks/[id]/subtasks - Toggle or update subtask
export async function PATCH(request, { params }) {
  try {
    const body = await request.json()

    if (!body.subtask_id) {
      return NextResponse.json({ error: 'subtask_id is required' }, { status: 400 })
    }

    if (body.action === 'toggle') {
      const subtask = await toggleSubtask(body.subtask_id)
      return NextResponse.json({ success: true, subtask })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating subtask:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/crm/tasks/[id]/subtasks - Delete a subtask
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const subtaskId = searchParams.get('subtask_id')

    if (!subtaskId) {
      return NextResponse.json({ error: 'subtask_id is required' }, { status: 400 })
    }

    await deleteSubtask(subtaskId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subtask:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
