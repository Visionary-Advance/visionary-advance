// app/api/proposals/[token]/respond/route.js
// Public endpoint for accepting/rejecting proposals

import { NextResponse } from 'next/server'
import { respondToProposal } from '@/lib/proposals'

// POST /api/proposals/[token]/respond - Accept or reject proposal
export async function POST(request, { params }) {
  try {
    const { token } = await params
    const body = await request.json()

    const { response, client_name } = body

    if (!response || !['accepted', 'rejected'].includes(response)) {
      return NextResponse.json(
        { error: 'Response must be "accepted" or "rejected"' },
        { status: 400 }
      )
    }

    const proposal = await respondToProposal(token, response, client_name)

    return NextResponse.json({
      success: true,
      status: proposal.status,
      responded_at: proposal.responded_at,
    })
  } catch (error) {
    console.error('Error responding to proposal:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    if (error.message?.includes('already been responded')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error.message?.includes('expired')) {
      return NextResponse.json(
        { error: 'This proposal has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process response' },
      { status: 500 }
    )
  }
}
