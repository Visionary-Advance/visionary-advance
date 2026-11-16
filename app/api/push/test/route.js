// app/api/push/test/route.js
// Sends a test push to all subscribed admin devices. Useful for confirming the
// Web Push plumbing before relying on real event triggers. Safe to delete later.

import { NextResponse } from 'next/server'
import { sendPushToAll } from '@/lib/push'

export async function POST() {
  const result = await sendPushToAll({
    title: 'Visionary Advance',
    body: 'Test notification — push is working 🎉',
    url: '/admin',
    tag: 'test',
  })
  return NextResponse.json({ ok: true, ...result })
}
