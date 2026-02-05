// app/api/proposals/[token]/route.js
// Public proposal view endpoint (no auth required)

import { NextResponse } from 'next/server'
import { getProposalByToken, trackProposalView } from '@/lib/proposals'

// GET /api/proposals/[token] - Get public proposal by token
export async function GET(request, { params }) {
  try {
    const { token } = await params

    // Get the proposal
    const proposal = await getProposalByToken(token)

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (proposal.valid_until && new Date(proposal.valid_until) < new Date()) {
      proposal.is_expired = true
    }

    // Track the view (non-blocking)
    trackProposalView(token).catch(err => {
      console.error('Error tracking proposal view:', err)
    })

    // Return sanitized proposal data (remove sensitive fields)
    const publicProposal = {
      id: proposal.id,
      title: proposal.title,
      proposal_number: proposal.proposal_number,
      content_json: proposal.content_json,
      content_html: proposal.content_html,
      total_amount: proposal.total_amount,
      currency: proposal.currency,
      line_items: proposal.line_items,
      status: proposal.status,
      valid_until: proposal.valid_until,
      is_expired: proposal.is_expired,
      created_at: proposal.created_at,
      // Lead info (sanitized)
      lead: proposal.lead ? {
        company: proposal.lead.company,
      } : null,
    }

    return NextResponse.json({ proposal: publicProposal })
  } catch (error) {
    console.error('Error fetching public proposal:', error)

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
