// app/api/devops/claude/threads/route.js
// GET: open chats (?archived=1 for archived; ?count=1 for how many wait on you).
// POST { text }: start a new chat; Claude starts on the first message right away.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { ChatError, countWaiting, createThread, listThreads } from '@/lib/claude-chat'

export async function GET(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const params = new URL(request.url).searchParams
    if (params.get('count')) return NextResponse.json({ count: await countWaiting() })
    const threads = await listThreads({ status: params.get('archived') ? 'archived' : 'open' })
    return NextResponse.json({ threads })
  } catch (error) {
    console.error('Claude chat list error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { text } = await request.json().catch(() => ({}))
    const thread = await createThread({ text, user: auth.user })
    return NextResponse.json({ thread }, { status: 201 })
  } catch (error) {
    console.error('Claude chat create error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}
