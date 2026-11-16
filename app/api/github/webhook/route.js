// app/api/github/webhook/route.js
// GitHub organisation webhook (Visionary-Advance). Records Ship PRs that were merged
// or closed on GitHub directly, so their SEO tasks don't sit at "PR open".
//
// Setup: org Settings → Webhooks → Payload URL https://visionaryadvance.com/api/github/webhook,
// content type application/json, secret = GITHUB_WEBHOOK_SECRET, events: Pull requests.
// The signature is an HMAC of the raw body, so this reads request.text(), never .json().
// Fails closed when the secret is unset.

import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/github'
import { applyPullRequestClosed } from '@/lib/devops-approvals'

export async function POST(request) {
  const raw = await request.text()
  if (!verifyWebhookSignature(raw, request.headers.get('x-hub-signature-256'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = request.headers.get('x-github-event')
  if (event === 'ping') return NextResponse.json({ ok: true })
  if (event !== 'pull_request') return NextResponse.json({ ok: true, ignored: event })

  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (payload.action !== 'closed') return NextResponse.json({ ok: true, ignored: payload.action })

  try {
    const result = await applyPullRequestClosed(payload.pull_request)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('GitHub webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
