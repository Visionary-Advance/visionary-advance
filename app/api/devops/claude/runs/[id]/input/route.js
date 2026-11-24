// app/api/devops/claude/runs/[id]/input/route.js
// The packet for one chat run (transcript, repo, branch, approved plan), fetched by the
// claude-chat-run GitHub Action. 409 once the run is cancelled or finished, which is how
// a cancelled run stops before it pushes. Authenticated with the runner shared secret.

import { NextResponse } from 'next/server'
import { verifyRunnerSecret } from '@/lib/seo-runner-auth'
import { ChatError, getRunInput } from '@/lib/claude-chat'

export async function GET(request, { params }) {
  if (!verifyRunnerSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    return NextResponse.json(await getRunInput(id))
  } catch (error) {
    console.error('Claude run input error:', error)
    return NextResponse.json({ error: error.message }, { status: error instanceof ChatError ? error.status : 500 })
  }
}
