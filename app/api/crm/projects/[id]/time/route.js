// app/api/crm/projects/[id]/time/route.js
import { NextResponse } from 'next/server'
import {
  createTimeEntry,
  getProjectTimeEntries,
  getProjectTimeSummary,
  getTimeByTask,
  getTimeByUser,
} from '@/lib/time-tracking'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    const options = {}
    if (searchParams.get('startDate')) options.startDate = searchParams.get('startDate')
    if (searchParams.get('endDate')) options.endDate = searchParams.get('endDate')
    if (searchParams.get('taskId')) options.taskId = searchParams.get('taskId')
    if (searchParams.get('userName')) options.userName = searchParams.get('userName')
    if (searchParams.get('limit')) options.limit = parseInt(searchParams.get('limit'))
    if (searchParams.get('billable') !== null) {
      options.billable = searchParams.get('billable') === 'true'
    }

    const includeSummary = searchParams.get('summary') !== 'false'
    const includeByTask = searchParams.get('byTask') === 'true'
    const includeByUser = searchParams.get('byUser') === 'true'

    const [entries, summary, byTask, byUser] = await Promise.all([
      getProjectTimeEntries(id, options),
      includeSummary ? getProjectTimeSummary(id) : null,
      includeByTask ? getTimeByTask(id) : null,
      includeByUser ? getTimeByUser(id) : null,
    ])

    return NextResponse.json({
      entries,
      summary,
      byTask,
      byUser,
    })
  } catch (error) {
    console.error('Error fetching time entries:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch time entries' },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.duration_minutes || body.duration_minutes <= 0) {
      return NextResponse.json(
        { error: 'Duration is required and must be positive' },
        { status: 400 }
      )
    }

    if (!body.user_name?.trim()) {
      return NextResponse.json(
        { error: 'User name is required' },
        { status: 400 }
      )
    }

    const entry = await createTimeEntry(id, body)
    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error('Error creating time entry:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create time entry' },
      { status: 500 }
    )
  }
}
