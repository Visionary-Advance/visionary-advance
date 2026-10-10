import { NextResponse } from 'next/server'
import { requireRecaptcha } from '@/lib/recaptcha'
import { searchBusinesses } from '@/lib/instant-site'

// Step 1 of /get-your-site: find the business on Google Maps.
// reCAPTCHA-gated — every search bills our Places key.
export async function POST(request) {
  const body = await request.json().catch(() => ({}))

  const recaptchaError = await requireRecaptcha(body, 'instant_search')
  if (recaptchaError) {
    return NextResponse.json({ error: recaptchaError.error }, { status: recaptchaError.status })
  }

  const name = String(body.name || '').trim().slice(0, 120)
  const city = String(body.city || '').trim().slice(0, 80)
  const state = String(body.state || '').trim().slice(0, 40)
  if (!name || !city || !state) {
    return NextResponse.json({ error: 'Business name, city and state are required.' }, { status: 400 })
  }

  try {
    const results = await searchBusinesses({ name, city, state })
    return NextResponse.json({ results })
  } catch (err) {
    console.error('[instant-site/search]', err)
    return NextResponse.json({ error: "Search isn't working right now. Try again in a moment." }, { status: 502 })
  }
}
