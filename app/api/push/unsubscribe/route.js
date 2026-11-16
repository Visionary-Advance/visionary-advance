// app/api/push/unsubscribe/route.js
// Removes a browser's Web Push subscription when the user disables notifications.

import { NextResponse } from 'next/server'
import { supabaseCRM } from '@/lib/supabase-crm'

export async function POST(request) {
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
