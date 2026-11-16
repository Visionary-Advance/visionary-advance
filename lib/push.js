// lib/push.js
// Server-side Web Push helper. Sends notifications to every subscribed admin
// device and prunes expired subscriptions. All failures are swallowed/logged so
// a push problem can never break the request that triggered it (lead creation,
// bookings, incidents, etc.).

import * as webpush from 'web-push'
import { supabaseCRM } from '@/lib/supabase-crm'

let configured = false

function ensureConfigured() {
  if (configured) return true

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT || 'mailto:brandon@visionaryadvance.com'

  if (!publicKey || !privateKey) {
    console.warn('[push] VAPID keys not configured — skipping push notifications')
    return false
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
  return true
}

/**
 * Send a push notification to all subscribed admin devices.
 * @param {{ title: string, body?: string, url?: string, tag?: string }} notification
 * @returns {Promise<{ sent: number, failed: number, removed: number }>}
 */
export async function sendPushToAll({ title, body = '', url = '/admin', tag } = {}) {
  const result = { sent: 0, failed: 0, removed: 0 }

  try {
    if (!ensureConfigured()) return result

    const { data: subs, error } = await supabaseCRM
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')

    if (error) {
      console.error('[push] failed to load subscriptions:', error.message)
      return result
    }
    if (!subs || subs.length === 0) return result

    const payload = JSON.stringify({ title, body, url, tag })
    const expiredIds = []

    await Promise.all(
      subs.map(async (sub) => {
        const subscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        }
        try {
          await webpush.sendNotification(subscription, payload)
          result.sent += 1
        } catch (err) {
          result.failed += 1
          // 404/410 = subscription no longer valid — remove it.
          if (err.statusCode === 404 || err.statusCode === 410) {
            expiredIds.push(sub.id)
          } else {
            console.error('[push] send error:', err.statusCode, err.body || err.message)
          }
        }
      })
    )

    if (expiredIds.length > 0) {
      const { error: delError } = await supabaseCRM
        .from('push_subscriptions')
        .delete()
        .in('id', expiredIds)
      if (delError) {
        console.error('[push] failed to prune expired subscriptions:', delError.message)
      } else {
        result.removed = expiredIds.length
      }
    }
  } catch (err) {
    console.error('[push] unexpected error:', err?.message || err)
  }

  return result
}
