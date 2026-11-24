// app/api/devops/claude/threads/[id]/messages/route.js
// POST { text }: your next message. Starts a plan-mode run (409 while one is in flight).

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { ChatError, postMessage } from '@/lib/claude-chat'

export async function POST(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { id } = await params
    const { text } = await request.json().catch(() => ({}))
    return NextResponse.json(await postMessage(id, text, auth.user), { status: 201 })
  } catch (error) {
    console.error('Claude chat message error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}
