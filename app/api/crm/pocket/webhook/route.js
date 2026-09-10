// app/api/crm/pocket/webhook/route.js
// Pocket (HeyPocket) webhook handler.
// Register this URL in the Pocket app's integrations UI and store the signing
// secret it shows once as POCKET_WEBHOOK_SECRET.

import { NextResponse } from 'next/server'
import { verifyPocketSignature, handlePocketWebhook } from '@/lib/pocket'

export async function POST(request) {
  // Signature is over the raw bytes — read as text, never request.json().
  const body = await request.text()
  const signature = request.headers.get('x-heypocket-signature')
  const timestamp = request.headers.get('x-heypocket-timestamp')

  const { valid, reason } = verifyPocketSignature(body, signature, timestamp)

  if (!valid) {
    console.error('Pocket webhook rejected:', reason)
    const status = reason?.includes('not configured') ? 500 : 401
    return NextResponse.json({ error: reason }, { status })
  }

  let payload
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const result = await handlePocketWebhook(payload)
    return NextResponse.json({ received: true, ...result })
  } catch (error) {
    console.error('Pocket webhook handler failed:', error)
    // 500 so Pocket retries (at-least-once, 3 attempts with backoff).
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
