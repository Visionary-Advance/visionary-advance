// app/api/crm/time/[id]/route.js
import { NextResponse } from 'next/server'
import { updateTimeEntry, deleteTimeEntry } from '@/lib/time-tracking'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const entry = await updateTimeEntry(id, body)
    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error updating time entry:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update time entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await deleteTimeEntry(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting time entry:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete time entry' },
      { status: 500 }
    )
  }
}
