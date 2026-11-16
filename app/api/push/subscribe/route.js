// app/api/push/subscribe/route.js
// Stores a browser's Web Push subscription so the admin PWA can receive pushes.

import { NextResponse } from 'next/server'
import { supabaseCRM } from '@/lib/supabase-crm'
import { requireAdmin } from '@/lib/admin-api-auth'

export async function POST(request) {
  // Only signed-in admins may register a device: pushes carry lead details.
  const admin = await requireAdmin(request)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })

  try {
    const body = await request.json()
    const sub = body?.subscription || body

    const endpoint = sub?.endpoint
    const p256dh = sub?.keys?.p256dh
    const auth = sub?.keys?.auth

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || null

    const { error } = await supabaseCRM
      .from('push_subscriptions')
      .upsert(
        { endpoint, p256dh, auth, user_agent: userAgent },
        { onConflict: 'endpoint' }
      )

    if (error) {
      console.error('[push/subscribe] db error:', error.message)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[push/subscribe] error:', err?.message || err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
