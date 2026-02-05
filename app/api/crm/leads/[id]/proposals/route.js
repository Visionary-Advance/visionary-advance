// app/api/crm/leads/[id]/proposals/route.js
// Proposal endpoints for a specific lead

import { NextResponse } from 'next/server'
import { getLeadProposals, createProposal } from '@/lib/proposals'

// GET /api/crm/leads/[id]/proposals - List proposals for a lead
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const proposals = await getLeadProposals(id)

    return NextResponse.json({ proposals })
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

// POST /api/crm/leads/[id]/proposals - Create a new proposal
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      title,
      project_id,
      content_json,
      content_html,
      total_amount,
      currency,
      line_items,
      valid_until,
      actor_name = 'Admin',
    } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Proposal title is required' },
        { status: 400 }
      )
    }

    const proposal = await createProposal(id, {
      title,
      project_id,
      content_json,
      content_html,
      total_amount,
      currency,
      line_items,
      valid_until,
    }, actor_name)

    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create proposal' },
      { status: 500 }
    )
  }
}
