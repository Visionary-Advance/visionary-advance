import { NextResponse } from 'next/server'
import { getRawEvents, getAvailableSlots } from '@/lib/google-calendar'

// GET /api/booking/test — debug endpoint to verify calendar auth + config
export async function GET() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || '(not set)'

  // Try fetching slots for the next 3 weekdays so we can see if freebusy works
  const results = {}
  const today = new Date()
  let checked = 0
  for (let offset = 1; checked < 3 && offset < 10; offset++) {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue // skip weekends
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    try {
      const slots = await getAvailableSlots(dateStr)
      results[dateStr] = { ok: true, slotCount: slots.length, firstSlot: slots[0] ?? null }
    } catch (err) {
      results[dateStr] = { ok: false, error: err.message }
    }
    checked++
  }

  // Also fetch raw events for reference
  let events = null
  let eventsError = null
  try {
    events = await getRawEvents(5)
  } catch (err) {
    eventsError = err.message
  }

  return NextResponse.json({
    calendarId,
    slotProbe: results,
    events: events ?? { error: eventsError },
  })
}
