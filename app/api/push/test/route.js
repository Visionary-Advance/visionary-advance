// app/api/push/test/route.js
// Sends a test push to all subscribed admin devices. Useful for confirming the
// Web Push plumbing before relying on real event triggers. Admins only.
// Call with `Authorization: Bearer <admin access token>`.

import { NextResponse } from 'next/server'
import { sendPushToAll } from '@/lib/push'
import { requireAdmin } from '@/lib/admin-api-auth'

export async function POST(request) {
  const admin = await requireAdmin(request)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const result = await sendPushToAll({
    title: 'Visionary Advance',
    body: 'Test notification — push is working 🎉',
    url: '/admin',
    tag: 'test',
  })
  return NextResponse.json({ ok: true, ...result })
}
