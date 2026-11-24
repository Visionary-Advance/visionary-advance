// app/api/devops/claude/threads/[id]/route.js
// GET: the chat with every message and its latest run.
// PATCH { title?, status? }: rename, archive ('archived') or reopen ('open').

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { ChatError, getThread, updateThread } from '@/lib/claude-chat'

export async function GET(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { id } = await params
    return NextResponse.json(await getThread(id))
  } catch (error) {
    console.error('Claude chat load error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { id } = await params
    const { title, status } = await request.json().catch(() => ({}))
    return NextResponse.json({ thread: await updateThread(id, { title, status }) })
  } catch (error) {
    console.error('Claude chat update error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}
