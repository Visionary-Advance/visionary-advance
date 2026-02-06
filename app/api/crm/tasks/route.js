// app/api/crm/tasks/route.js
// GET (list + summary), POST (create)

import { NextResponse } from 'next/server'
import {
  getTasks,
  getTaskSummary,
  getUpcomingTasks,
  createTask,
  TASK_TYPES,
  PRIORITIES,
  TASK_STATUSES,
} from '@/lib/tasks'

// GET /api/crm/tasks - List tasks with filtering or get summary
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Check if requesting summary only
    const summaryOnly = searchParams.get('summary') === 'true'
    const upcomingOnly = searchParams.get('upcoming') === 'true'

    if (summaryOnly) {
      const summary = await getTaskSummary()
      return NextResponse.json({ summary })
    }

    if (upcomingOnly) {
      const limit = parseInt(searchParams.get('limit') || '5')
      const tasks = await getUpcomingTasks(limit)
      const summary = await getTaskSummary()
      return NextResponse.json({ tasks, summary })
    }

    // Full task list with filtering
    const filters = {
      lead_id: searchParams.get('lead_id'),
      business_id: searchParams.get('business_id'),
      status: searchParams.get('status'),
      priority: searchParams.get('priority'),
      task_type: searchParams.get('task_type'),
      assignee: searchParams.get('assignee'),
      due_date_from: searchParams.get('due_date_from'),
      due_date_to: searchParams.get('due_date_to'),
      include_completed: searchParams.get('include_completed') === 'true',
      sort_by: searchParams.get('sort_by') || 'due_date',
      sort_order: searchParams.get('sort_order') || 'asc',
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    const result = await getTasks(filters)

    return NextResponse.json({
      ...result,
      filters: {
        task_types: Object.keys(TASK_TYPES),
        priorities: Object.keys(PRIORITIES),
        statuses: Object.keys(TASK_STATUSES),
      },
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/crm/tasks - Create a new task
export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
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

    const task = await createTask(body)

    return NextResponse.json({
      success: true,
      task,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
