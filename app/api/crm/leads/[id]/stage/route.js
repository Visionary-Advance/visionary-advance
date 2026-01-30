// app/api/crm/leads/[id]/stage/route.js
// PATCH for stage transitions

import { NextResponse } from 'next/server'
import { updateLeadStage, STAGES } from '@/lib/crm'

// PATCH /api/crm/leads/[id]/stage - Transition lead to new stage
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required field
    if (!body.stage) {
      return NextResponse.json(
        { error: 'Stage is required' },
        { status: 400 }
      )
    }

    // Validate stage
    if (!STAGES[body.stage]) {
      return NextResponse.json(
        { error: `Invalid stage: ${body.stage}. Valid stages: ${Object.keys(STAGES).join(', ')}` },
        { status: 400 }
      )
    }

    // Update stage
    const lead = await updateLeadStage(
      id,
      body.stage,
      body.actor_name || 'User'
    )

    return NextResponse.json({
      success: true,
      lead,
      stage_config: STAGES[body.stage],
    })
  } catch (error) {
    console.error('Error updating stage:', error)

    // Handle specific error messages
    if (error.message === 'Lead not found') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
