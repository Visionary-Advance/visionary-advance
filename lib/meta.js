// lib/meta.js
// Meta Conversions API (server-side events), paired with the browser Pixel.
//
// Each event is sent from both sides with the same event_id; Meta keeps one.
// The server copy survives ad blockers and iOS tracking limits, which is most
// of why ad-platform conversion counts drift low without it.

import { createHash } from 'node:crypto'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const API_VERSION = 'v21.0'

const sha256 = (v) => createHash('sha256').update(v).digest('hex')

function normPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  if (!digits) return null
  return digits.length === 10 ? `1${digits}` : digits
}

/**
 * Send one server event. Best-effort: never throws, never blocks the visitor
 * on Meta being slow — callers don't await the result for anything.
 */
export async function sendMetaEvent({
  eventName,
  eventId,
  sourceUrl,
  email,
  phone,
  firstName,
  lastName,
  city,
  state,
  ip,
  userAgent,
  fbp,
  fbc,
  customData,
}) {
  if (!PIXEL_ID || !TOKEN) return { skipped: true }

  // Meta requires PII hashed (lowercased, trimmed) — never sent in the clear.
  const userData = {
    ...(email ? { em: [sha256(email.trim().toLowerCase())] } : {}),
    ...(normPhone(phone) ? { ph: [sha256(normPhone(phone))] } : {}),
    ...(firstName ? { fn: [sha256(firstName.trim().toLowerCase())] } : {}),
    ...(lastName ? { ln: [sha256(lastName.trim().toLowerCase())] } : {}),
    ...(city ? { ct: [sha256(city.replace(/\s/g, '').toLowerCase())] } : {}),
    ...(state ? { st: [sha256(state.trim().toLowerCase())] } : {}),
    country: [sha256('us')],
    ...(ip ? { client_ip_address: ip } : {}),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: 'website',
            event_source_url: sourceUrl,
            user_data: userData,
            ...(customData ? { custom_data: customData } : {}),
          }],
          ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
        }),
      },
    )
    if (!res.ok) console.warn('[meta-capi]', eventName, res.status, await res.text())
    return { ok: res.ok }
  } catch (err) {
    console.warn('[meta-capi] send failed:', err)
    return { ok: false }
  }
}
