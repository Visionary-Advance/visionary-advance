// app/api/crm/tasks/[id]/route.js
// GET, PATCH, DELETE for individual tasks

import { NextResponse } from 'next/server'
import {
  getTask,
  updateTask,
  deleteTask,
  completeTask,
  TASK_TYPES,
  PRIORITIES,
  TASK_STATUSES,
} from '@/lib/tasks'

// GET /api/crm/tasks/[id] - Get a single task
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const task = await getTask(id)

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/crm/tasks/[id] - Update a task
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check for quick complete action
    if (body.action === 'complete') {
      const task = await completeTask(id, body.completed_by)
      return NextResponse.json({ success: true, task })
    }

    // Validate task_type if provided
    if (body.task_type && !TASK_TYPES[body.task_type]) {
      return NextResponse.json(
        { error: `Invalid task_type: ${body.task_type}. Valid types: ${Object.keys(TASK_TYPES).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate priority if provided
    if (body.priority && !PRIORITIES[body.priority]) {
      return NextResponse.json(
        { error: `Invalid priority: ${body.priority}. Valid priorities: ${Object.keys(PRIORITIES).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (body.status && !TASK_STATUSES[body.status]) {
      return NextResponse.json(
        { error: `Invalid status: ${body.status}. Valid statuses: ${Object.keys(TASK_STATUSES).join(', ')}` },
        { status: 400 }
      )
    }

    // Remove action from updates if present
    const { action, ...updates } = body

    const task = await updateTask(id, updates)

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/crm/tasks/[id] - Delete a task
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await deleteTask(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
