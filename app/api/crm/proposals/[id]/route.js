// app/api/crm/proposals/[id]/route.js
// Individual proposal CRUD endpoints

import { NextResponse } from 'next/server'
import { getProposal, updateProposal, deleteProposal } from '@/lib/proposals'

// GET /api/crm/proposals/[id] - Get proposal details
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const proposal = await getProposal(id)

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error('Error fetching proposal:', error)

    if (error.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    )
  }
}

// PATCH /api/crm/proposals/[id] - Update proposal
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { actor_name = 'Admin', ...updateData } = body

    const proposal = await updateProposal(id, updateData, actor_name)

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error('Error updating proposal:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    if (error.message?.includes('Cannot edit')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update proposal' },
      { status: 500 }
    )
  }
}

// DELETE /api/crm/proposals/[id] - Delete proposal
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const actorName = searchParams.get('actor_name') || 'Admin'

    await deleteProposal(id, actorName)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting proposal:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    if (error.message?.includes('Cannot delete')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to delete proposal' },
      { status: 500 }
    )
  }
}
