// app/api/crm/projects/[id]/milestones/route.js
// Milestone management endpoints

import { NextResponse } from 'next/server'
import {
  updateMilestones,
  addMilestone,
  completeMilestone,
} from '@/lib/projects'

// PATCH /api/crm/projects/[id]/milestones - Update milestones
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { milestones, action, milestone, milestone_id, actor_name = 'Admin' } = body

    let project

    // Handle different actions
    if (action === 'add' && milestone) {
      // Add a single milestone
      project = await addMilestone(id, milestone, actor_name)
    } else if (action === 'complete' && milestone_id) {
      // Complete a milestone
      project = await completeMilestone(id, milestone_id, actor_name)
    } else if (milestones && Array.isArray(milestones)) {
      // Replace all milestones
      project = await updateMilestones(id, milestones, actor_name)
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Provide milestones array, or action with milestone/milestone_id' },
        { status: 400 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error updating milestones:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update milestones' },
      { status: 500 }
    )
  }
}
