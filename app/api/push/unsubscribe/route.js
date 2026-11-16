// app/api/push/unsubscribe/route.js
// Removes a browser's Web Push subscription when the user disables notifications.

import { NextResponse } from 'next/server'
import { supabaseCRM } from '@/lib/supabase-crm'
import { requireAdmin } from '@/lib/admin-api-auth'

export async function POST(request) {
  const admin = await requireAdmin(request)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })

  try {
    const body = await request.json()
    const endpoint = body?.endpoint || body?.subscription?.endpoint

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 })
    }

    const { error } = await supabaseCRM
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)

    if (error) {
      console.error('[push/unsubscribe] db error:', error.message)
      return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[push/unsubscribe] error:', err?.message || err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
