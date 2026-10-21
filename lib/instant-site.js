// lib/instant-site.js
// Server-only helpers for the /get-your-site ad page: Google Maps business
// search, and calls into the WaaS app that actually builds the preview site.
//
// The WaaS instant-preview API is server-to-server only, guarded by a shared
// secret (WAAS_INSTANT_SECRET here = INSTANT_PREVIEW_SECRET there). The
// browser only ever talks to this app's /api/instant-site/* routes.

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
  'places.types',
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
      // Google's category ids — WaaS maps these to an industry for the style step.
      types: Array.isArray(p.types) ? p.types.slice(0, 20) : [],
      rating: p.rating ?? null,
      reviewCount: p.userRatingCount ?? null,
      phone: p.nationalPhoneNumber || null,
      photo: await photoUrl(apiKey, p.photos?.[0]?.name),
    })),
  )
}

// ── Operator alerts (Telegram, via n8n) ──────────────────────────────────────
//
// The ad page's own alerts, on the same n8n webhook as every other lead alert
// (N8N_WEBHOOK_URL -> Telegram, lib/n8n.js), same payload shape: an `event`
// to branch on, the fields, and a ready-to-send `text`. The form's lead is
// saved without the generic "New lead" alert (createOrUpdateLead notify:false)
// because these say more: the listing, the style, and how the build went.

// Line breaks, control and invisible characters (built from char codes so no
// literal line separator ever sits in this file).
const INVISIBLE = new RegExp(
  '[' +
    String.fromCharCode(0) + '-' + String.fromCharCode(31) +
    String.fromCharCode(127) +
    String.fromCharCode(0x2028) + String.fromCharCode(0x2029) +
    String.fromCharCode(0x200b) + '-' + String.fromCharCode(0x200f) +
    String.fromCharCode(0x2060) + String.fromCharCode(0xfeff) +
  ']+',
  'g',
)
// Markdown and mention characters, in case the Telegram node parses Markdown.
const FORMATTING = /[@*_`~|<>#()[\]\\]/g

/**
 * Visitor-supplied text, safe for a Telegram message: one line, no
 * formatting, so a business name can't fake extra lines or links.
 */
function plain(value, max = 80) {
  return String(value ?? '')
    .replace(INVISIBLE, ' ')
    .replace(FORMATTING, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, max)
}

/** An email keeps only address characters (john_doe@ survives). */
function plainEmail(value) {
  return String(value ?? '').replace(/[^A-Za-z0-9._%+@-]/g, '').slice(0, 254)
}

/** A phone keeps its digits and punctuation, nothing else. */
function plainPhone(value) {
  return String(value ?? '').replace(/[^0-9+() -]/g, '').replace(/ {2,}/g, ' ').trim().slice(0, 40)
}

/** "real_estate" -> "Real estate", for the kinds of work. */
function kindLabel(value) {
  const v = /^[a-z_]{1,30}$/.test(String(value ?? '')) ? String(value) : ''
  return v ? v[0].toUpperCase() + v.slice(1).replace(/_/g, ' ') : ''
}

function mapsLink(placeId) {
  return /^[A-Za-z0-9_-]{10,300}$/.test(String(placeId ?? ''))
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : null
}

/** Where a /free-trial signup landed: 'trial', 'waitlist', or 'unrecorded' (the spot couldn't be saved). */
function trialLine(trial) {
  if (trial === 'trial') return '🎟️ Took a free-trial spot (free until Jan 1)'
  if (trial === 'waitlist') return '🕒 Free-trial waitlist: the spots are full'
  if (trial === 'unrecorded') return '⚠️ From the free-trial page, but the spot wasn\'t recorded. Check trial_signups.'
  return null
}

async function sendAlert(event, lines, fields = {}) {
  const url = process.env.N8N_WEBHOOK_URL
  if (!url) return
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        ...fields,
        text: lines.filter(Boolean).join('\n'),
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) console.error(`[instant-site] n8n answered ${res.status}`)
  } catch (err) {
    console.error('[instant-site] n8n alert failed:', err)
  }
}

/**
 * Someone finished the ad-page form. `build` says what happened next:
 * 'started' (WaaS is building it), or a reason it needs a hand-build.
 *
 * `business` should be WaaS's copy, which it fetched from Google by place id
 * (`verified: true`). Only when the build never started is it the page's own
 * copy, which came from the visitor's browser and is labelled unverified.
 */
export function alertInstantSiteLead({ business = {}, verified = false, name, email, phone, city, state, style, kinds = [], placeId, utmCampaign, build, trial = null }) {
  const where = [plain(city, 40), plain(state, 4)].filter(Boolean).join(', ')
  const rating = Number.isFinite(Number(business.rating)) && business.rating != null
    ? `⭐ ${Number(business.rating).toFixed(1)} (${Math.max(0, Math.floor(Number(business.reviewCount) || 0))} reviews)`
    : null
  const kindsText = kinds.map(kindLabel).filter(Boolean).join(', ')
  const maps = mapsLink(placeId)
  // A campaign name comes from the page's URL: a plain slug or nothing.
  const campaign = /^[A-Za-z0-9_-]{1,60}$/.test(String(utmCampaign ?? '')) ? utmCampaign : null
  return sendAlert('instant_site_lead', [
    `🆕 Ad-page lead: ${plain(business.name)}${verified ? '' : ' (unverified name)'}${where ? ` (${where})` : ''}`,
    trialLine(trial),
    rating,
    `👤 ${plain(name)}`,
    `📞 ${plainPhone(phone)}`,
    `✉️ ${plainEmail(email)}`,
    style ? `🎨 Style: ${plain(style, 40)}` : null,
    kindsText ? `🧰 ${kindsText}` : null,
    maps ? `📍 ${maps}` : null,
    campaign ? `📣 ${campaign}` : null,
    build === 'started' ? '⏳ Building their site now. You\'ll get another alert when it\'s ready.' : `⚠️ Build didn't start (${plain(build, 60)}). Build it by hand from the pipeline.`,
  ], {
    name: plain(name),
    email: plainEmail(email),
    phone: plainPhone(phone),
    company: plain(business.name),
    city: plain(city, 40) || null,
    state: plain(state, 4) || null,
    style: style ? plain(style, 40) : null,
    kinds: kinds.map(kindLabel).filter(Boolean),
    google_maps: maps,
    build_started: build === 'started',
    trial,
  })
}

/** "My business isn't on Google": a hand-built site. */
export function alertInstantSiteManual({ businessName, name, email, phone, city, state, industry, trial = null }) {
  const where = [plain(city, 40), plain(state, 4)].filter(Boolean).join(', ')
  return sendAlert('instant_site_manual', [
    `📝 Ad-page lead, not on Google: ${plain(businessName)}${where ? ` (${where})` : ''}`,
    trialLine(trial),
    industry ? `🏷️ ${plain(industry, 60)}` : null,
    `👤 ${plain(name)}`,
    `📞 ${plainPhone(phone)}`,
    `✉️ ${plainEmail(email)}`,
    'Build their preview by hand and send it to them.',
  ], {
    name: plain(name),
    email: plainEmail(email),
    phone: plainPhone(phone),
    company: plain(businessName),
    trial,
  })
}

/** The build finished and the code went out (once per build: the page stops polling). */
export function alertInstantSiteReady({ businessName }) {
  return sendAlert('instant_site_ready', [
    `✅ Site built for ${plain(businessName)}. Their code is on the way by text/email.`,
  ], { company: plain(businessName) })
}

/** The build failed (once per build). */
export function alertInstantSiteFailed({ businessName }) {
  return sendAlert('instant_site_failed', [
    `⚠️ Instant site build failed for ${plain(businessName)}. They're in the CRM (source: instant_site). Build it by hand from the pipeline.`,
  ], { company: plain(businessName) })
}

/** They entered the code and are looking at their site right now. */
export function alertInstantSiteUnlocked({ businessName, name, previewUrl }) {
  const url = /^https:\/\/[^\s"<>]+$/.test(String(previewUrl ?? '')) ? previewUrl : null
  return sendAlert('instant_site_unlocked', [
    `🔥 ${plain(businessName)} just unlocked their site (${plain(name)}). Hot lead: they're looking at it right now.`,
    url ? `🌐 ${url}` : null,
  ], { company: plain(businessName), name: plain(name), preview_url: url })
}
