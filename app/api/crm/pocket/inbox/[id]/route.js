// app/api/crm/pocket/inbox/[id]/route.js
// PATCH  - assign an inbox recording to a lead
// DELETE - dismiss it

import { NextResponse } from 'next/server'
import { assignRecordingToLead, dismissRecording } from '@/lib/pocket'
import { requireAdmin } from '@/lib/admin-api-auth'

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { id } = await params
    const { lead_id } = await request.json()

    if (!lead_id) {
      return NextResponse.json({ error: 'lead_id is required' }, { status: 400 })
    }

    const result = await assignRecordingToLead(id, lead_id)

    return NextResponse.json({
      recording: result.record,
      activity_id: result.activity_id,
      tasks_created: result.task_ids.length,
    })
  } catch (error) {
    console.error('Failed to assign Pocket recording:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to assign recording' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { id } = await params
    const recording = await dismissRecording(id)
    return NextResponse.json({ recording })
  } catch (error) {
    console.error('Failed to dismiss Pocket recording:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to dismiss recording' },
      { status: 500 }
    )
  }
}
