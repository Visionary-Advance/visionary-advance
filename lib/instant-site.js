// lib/instant-site.js
// Server-only helpers for the /get-your-site ad page: Google Maps business
// search, and calls into the WaaS app that actually builds the preview site.
//
// The WaaS instant-preview API is server-to-server only, guarded by a shared
// secret (WAAS_INSTANT_SECRET here = INSTANT_PREVIEW_SECRET there). The
// browser only ever talks to this app's /api/instant-site/* routes.

import { sendDiscordNotification } from '@/lib/discord'

const WAAS_URL = (process.env.WAAS_URL || 'https://app.visionaryadvance.com').replace(/\/$/, '')

/** Call a WaaS instant-preview endpoint. Returns { ok, status, data }. */
export async function waas(path, { method = 'GET', body } = {}) {
  const secret = process.env.WAAS_INSTANT_SECRET
  if (!secret) {
    console.error('[instant-site] WAAS_INSTANT_SECRET is not set')
    return { ok: false, status: 503, data: { error: 'Not configured' } }
  }
  try {
    const res = await fetch(`${WAAS_URL}/api/public/instant-preview${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${secret}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    console.error('[instant-site] WaaS call failed:', err)
    return { ok: false, status: 502, data: { error: 'Could not reach the site builder' } }
  }
}

/** First hop of x-forwarded-for — the visitor, as Vercel saw them. */
export function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || null
}

// ── Google Maps business search ──────────────────────────────────────────────

const SEARCH_FIELDS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.shortFormattedAddress',
  'places.primaryTypeDisplayName',
  'places.rating',
  'places.userRatingCount',
  'places.nationalPhoneNumber',
  'places.photos',
  'places.businessStatus',
].join(',')

async function photoUrl(apiKey, photoName) {
  if (!photoName) return null
  try {
    // skipHttpRedirect returns a googleusercontent URL that carries no key, so
    // it's safe to hand to the browser.
    const res = await fetch(
      `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=640&skipHttpRedirect=true&key=${apiKey}`,
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.photoUri || null
  } catch {
    return null
  }
}

/**
 * Up to five Google Maps listings for "<business> in <city>, <state>".
 * Closed-for-good listings are dropped. Throws on API failure.
 */
export async function searchBusinesses({ name, city, state }) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY is not set')

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': SEARCH_FIELDS,
    },
    body: JSON.stringify({
      textQuery: `${name} in ${city}, ${state}`,
      pageSize: 5,
      regionCode: 'US',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Places search failed')

  const places = (data.places || []).filter((p) => p.businessStatus !== 'CLOSED_PERMANENTLY')
  return Promise.all(
    places.map(async (p) => ({
      placeId: p.id,
      name: p.displayName?.text || '',
      address: p.shortFormattedAddress || p.formattedAddress || '',
      category: p.primaryTypeDisplayName?.text || null,
      rating: p.rating ?? null,
      reviewCount: p.userRatingCount ?? null,
      phone: p.nationalPhoneNumber || null,
      photo: await photoUrl(apiKey, p.photos?.[0]?.name),
    })),
  )
}

// ── Operator pings ───────────────────────────────────────────────────────────

// Discord markdown and mention characters.
const DISCORD_SPECIAL = /[@*_`~|>#()[\]\\]/g

/** Visitor-supplied text, safe to drop into a Discord message. */
function plain(value, max = 80) {
  return String(value || '').replace(DISCORD_SPECIAL, '').replace(/\s+/g, ' ').trim().slice(0, max)
}

/**
 * Discord ping for the instant-site funnel. Mentions are disabled outright —
 * names here come from visitors, and "@everyone" is a valid business name.
 */
export async function notifyInstantSite(template, values = {}) {
  const content = template.replace(/\{(\w+)\}/g, (_, key) => plain(values[key]) || 'a lead')
  return sendDiscordNotification({ content, allowed_mentions: { parse: [] } })
}
