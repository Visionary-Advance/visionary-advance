// app/api/crm/activities/[id]/pin/route.js
// Toggle pin status on activities

import { NextResponse } from 'next/server'
import { toggleActivityPin } from '@/lib/crm'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { is_pinned, actor_name = 'Admin' } = body

    if (typeof is_pinned !== 'boolean') {
      return NextResponse.json(
        { error: 'is_pinned must be a boolean' },
        { status: 400 }
      )
    }

    const activity = await toggleActivityPin(id, is_pinned, actor_name)

    return NextResponse.json({ activity })
  } catch (error) {
    console.error('Error toggling pin:', error)

    // Handle specific errors
    if (error.message.includes('Maximum of 5')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error.message.includes('Only notes and emails')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to toggle pin status' },
      { status: 500 }
    )
  }
}
