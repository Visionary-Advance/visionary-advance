// app/api/devops/claude/runs/[id]/route.js
// POST { action: 'cancel' | 'retry' }: stop an in-flight run, or retry the latest failed one.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { ChatError, runAction } from '@/lib/claude-chat'

export async function POST(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { id } = await params
    const { action } = await request.json().catch(() => ({}))
    return NextResponse.json(await runAction(id, action, auth.user))
  } catch (error) {
    console.error('Claude run action error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}
