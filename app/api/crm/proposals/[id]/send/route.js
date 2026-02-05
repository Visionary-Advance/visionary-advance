// app/api/crm/proposals/[id]/send/route.js
// Send proposal via email

import { NextResponse } from 'next/server'
import { sendProposalEmail } from '@/lib/proposals'

// POST /api/crm/proposals/[id]/send - Send proposal email
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { email, custom_message, actor_name = 'Admin' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const result = await sendProposalEmail(id, email, custom_message, actor_name)

    return NextResponse.json({
      success: true,
      proposalUrl: result.proposalUrl,
    })
  } catch (error) {
    console.error('Error sending proposal:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send proposal' },
      { status: 500 }
    )
  }
}
