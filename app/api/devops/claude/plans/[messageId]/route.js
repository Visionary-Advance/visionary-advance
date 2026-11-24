// app/api/devops/claude/plans/[messageId]/route.js
// POST { action: 'approve' | 'dismiss' }. Approve starts an execute run pinned to this
// exact plan; Claude commits to a branch and opens a PR that waits in Approvals.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { ChatError, resolvePlan } from '@/lib/claude-chat'

export async function POST(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { messageId } = await params
    const { action } = await request.json().catch(() => ({}))
    return NextResponse.json(await resolvePlan(messageId, action, auth.user))
  } catch (error) {
    console.error('Claude plan action error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}
