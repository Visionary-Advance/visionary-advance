// app/api/devops/claude/runs/callback/route.js
// Status reports from the claude-chat-run GitHub Action: running (stage), completed
// (plan mode: Claude's reply; execute mode: the PR) or failed.
// Authenticated with the runner shared secret.

import { NextResponse } from 'next/server'
import { verifyRunnerSecret } from '@/lib/seo-runner-auth'
import { applyRunCallback, ChatError } from '@/lib/claude-chat'

export async function POST(request) {
  if (!verifyRunnerSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const run = await applyRunCallback(payload)
    return NextResponse.json({ ok: true, run_id: run.id, status: run.status, ignored: Boolean(run.ignored) })
  } catch (error) {
    console.error('Claude run callback error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}
