/**
 * Google Calendar API helper
 *
 * Required env vars:
 *   CALENDAR_GOOGLE_CLIENT_ID
 *   CALENDAR_GOOGLE_CLIENT_SECRET
 *   CALENDAR_GOOGLE_REFRESH_TOKEN
 *   GOOGLE_CALENDAR_ID  — full calendar ID, e.g. abc123@group.calendar.google.com
 */

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const CALENDAR_BASE  = 'https://www.googleapis.com/calendar/v3'

const WORK_START_HOUR = 9    // 9 am Pacific
const WORK_END_HOUR   = 17   // 5 pm Pacific
const SLOT_MINUTES    = 30
const TIMEZONE        = 'America/Los_Angeles'
const BUFFER_HOURS    = 2    // don't show slots within the next 2 hours

// ── Token cache ───────────────────────────────────────────────────────────────
let cachedToken    = null
let tokenExpiresAt = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.CALENDAR_GOOGLE_CLIENT_ID,
      client_secret: process.env.CALENDAR_GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.CALENDAR_GOOGLE_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  })

  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error(`Token refresh failed: ${data.error} — ${data.error_description}`)
  }

  cachedToken    = data.access_token
  tokenExpiresAt = Date.now() + data.expires_in * 1000
  return cachedToken
}

// ── Authenticated fetch ───────────────────────────────────────────────────────
async function calendarFetch(path, options = {}) {
  const token = await getAccessToken()
  const res = await fetch(`${CALENDAR_BASE}${path}`, {
    ...options,
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Calendar API ${res.status}: ${JSON.stringify(data?.error ?? data)}`)
  }
  return data
}

// ── Timezone helper ───────────────────────────────────────────────────────────
/**
 * Convert a local date + hour + minute in America/Los_Angeles to a UTC Date.
 * Handles DST automatically by probing the offset at noon on that day.
 */
function toPacificDate(dateStr, hour, minute) {
  // Probe at noon UTC on that date — safe from day-boundary DST edge cases
  const noon = new Date(dateStr + 'T12:00:00Z')

  // Extract "GMT-7" or "GMT-8" from Intl
  const tzStr = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(noon)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-7'

  const match = tzStr.match(/GMT([+-])(\d+)/)
  const sign  = match?.[1] === '+' ? 1 : -1
  const offsetHours = match ? sign * parseInt(match[2]) : -7

  // UTC = local − offset  (offset is negative for west-of-UTC zones)
  // e.g. 9 am PDT (offset -7) → 9 − (−7) = 16:00 UTC
  const utcHour = hour - offsetHours

  // Date.UTC handles hour overflow/underflow correctly
  return new Date(Date.UTC(
    parseInt(dateStr.slice(0, 4)),
    parseInt(dateStr.slice(5, 7)) - 1,
    parseInt(dateStr.slice(8, 10)),
    utcHour,
    minute,
    0,
  ))
}

// ── Get available slots for a given date (YYYY-MM-DD) ────────────────────────
export async function getAvailableSlots(dateStr) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID env var is not set')

  // Skip weekends
  const dow = new Date(dateStr + 'T12:00:00Z').getDay()
  if (dow === 0 || dow === 6) return []

  const dayStart = toPacificDate(dateStr, WORK_START_HOUR, 0)
  const dayEnd   = toPacificDate(dateStr, WORK_END_HOUR,   0)

  // Query freebusy
  const fb = await calendarFetch('/freeBusy', {
    method: 'POST',
    body: JSON.stringify({
      timeMin:  dayStart.toISOString(),
      timeMax:  dayEnd.toISOString(),
      timeZone: TIMEZONE,
      items:    [{ id: calendarId }],
    }),
  })

  // Debug: log the raw freebusy response so errors are visible in the terminal
  console.log('[google-calendar] freebusy keys:', Object.keys(fb.calendars ?? {}))

  // Bug fix: freebusy response is keyed by the actual calendar ID —
  // use the first key in the response instead of assuming it matches.
  const calData = fb.calendars?.[calendarId]
    ?? Object.values(fb.calendars ?? {})[0]
    ?? { busy: [] }

  if (calData.errors?.length) {
    console.error('[google-calendar] freebusy calData errors:', calData.errors)
    throw new Error(`Calendar freebusy error: ${JSON.stringify(calData.errors)}`)
  }

  console.log('[google-calendar]', dateStr, 'busy periods:', calData.busy?.length ?? 0)

  const busy = (calData.busy ?? []).map((b) => ({
    start: new Date(b.start),
    end:   new Date(b.end),
  }))

  // Earliest bookable time = now + buffer
  const earliest = new Date(Date.now() + BUFFER_HOURS * 60 * 60 * 1000)

  const slots = []
  let cursor = new Date(dayStart)

  while (cursor < dayEnd) {
    const slotEnd = new Date(cursor.getTime() + SLOT_MINUTES * 60_000)
    if (slotEnd > dayEnd) break

    const tooSoon  = cursor < earliest
    const blocked  = busy.some((b) => cursor < b.end && slotEnd > b.start)

    if (!tooSoon && !blocked) {
      slots.push({
        iso:   cursor.toISOString(),
        label: formatSlotLabel(cursor),
      })
    }

    cursor = slotEnd
  }

  return slots
}

// ── Create a calendar event ───────────────────────────────────────────────────
export async function createBookingEvent({ name, email, message, slotIso, meetingType = 'meet' }) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID env var is not set')

  const start = new Date(slotIso)
  const end   = new Date(start.getTime() + SLOT_MINUTES * 60_000)

  const event = {
    summary: `Discovery Call — ${name}`,
    description: [
      message ? `Project details:\n${message}` : null,
      `Client email: ${email}`,
    ].filter(Boolean).join('\n\n'),
    start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
    end:   { dateTime: end.toISOString(),   timeZone: TIMEZONE },
    attendees: [{ email }],
    ...(meetingType === 'meet' ? {
      conferenceData: {
        createRequest: {
          requestId:             `va-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    } : {}),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  }

  const qs = new URLSearchParams({ sendUpdates: 'all', ...(meetingType === 'meet' ? { conferenceDataVersion: '1' } : {}) })
  const created = await calendarFetch(
    `/calendars/${encodeURIComponent(calendarId)}/events?${qs}`,
    { method: 'POST', body: JSON.stringify(event) },
  )

  const meetLink = created.conferenceData?.entryPoints?.find(
    (e) => e.entryPointType === 'video',
  )?.uri ?? null

  // Bug fix: handle both dateTime and date response formats
  const startStr = created.start?.dateTime ?? created.start?.date ?? start.toISOString()
  const endStr   = created.end?.dateTime   ?? created.end?.date   ?? end.toISOString()

  return {
    eventId:  created.id,
    meetLink,
    start:    startStr,
    end:      endStr,
    htmlLink: created.htmlLink,
  }
}

// ── Fetch raw events (used by /api/booking/test) ──────────────────────────────
export async function getRawEvents(maxResults = 10) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID env var is not set')

  const now = new Date().toISOString()
  return calendarFetch(
    `/calendars/${encodeURIComponent(calendarId)}/events?` +
    new URLSearchParams({
      timeMin:    now,
      maxResults: String(maxResults),
      singleEvents: 'true',
      orderBy:    'startTime',
    }),
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatSlotLabel(date) {
  return date.toLocaleTimeString('en-US', {
    timeZone: TIMEZONE,
    hour:     'numeric',
    minute:   '2-digit',
    hour12:   true,
  })
}
