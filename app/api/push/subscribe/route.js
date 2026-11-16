// app/api/push/subscribe/route.js
// Stores a browser's Web Push subscription so the admin PWA can receive pushes.

import { NextResponse } from 'next/server'
import { supabaseCRM } from '@/lib/supabase-crm'

export async function POST(request) {
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
