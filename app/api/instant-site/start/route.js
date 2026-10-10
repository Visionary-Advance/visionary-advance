import { NextResponse } from 'next/server'
import { requireRecaptcha } from '@/lib/recaptcha'
import { createOrUpdateLead } from '@/lib/crm'
import { clientIp, waas } from '@/lib/instant-site'
import { sendMetaEvent } from '@/lib/meta'
import { SMS_CONSENT_TEXT } from '@/lib/instant-site-copy'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Step 3: contact details in, build started.
//
// The lead is saved to the CRM FIRST — before the build, before anything that
// can fail — so a contact that reaches this route is never lost, even if the
// build is over its daily cap or breaks outright.
export async function POST(request) {
  const body = await request.json().catch(() => ({}))

  const recaptchaError = await requireRecaptcha(body, 'instant_start')
  if (recaptchaError) {
    return NextResponse.json({ error: recaptchaError.error }, { status: recaptchaError.status })
  }

  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200)
  const phone = String(body.phone || '').trim().slice(0, 30)
  const business = body.business || {}
  const placeId = String(business.placeId || '').trim()
  const phoneDigits = phone.replace(/\D/g, '')

  if (!name || !EMAIL_RE.test(email) || phoneDigits.length < 10 || !placeId) {
    return NextResponse.json({ error: 'Please fill in your name, email and mobile number.' }, { status: 400 })
  }

  const meta = body.meta || {}
  const [firstName, ...rest] = name.split(/\s+/)
  const ip = clientIp(request)
  const userAgent = request.headers.get('user-agent')

  try {
    await createOrUpdateLead({
      email,
      first_name: firstName || null,
      last_name: rest.join(' ') || null,
      full_name: name,
      phone,
      company: business.name || null,
      source: 'instant_site',
      conversion_page: '/get-your-site',
      source_url: meta.landingUrl || null,
      utm_source: meta.utm_source || null,
      utm_medium: meta.utm_medium || null,
      utm_campaign: meta.utm_campaign || null,
      utm_term: meta.utm_term || null,
      utm_content: meta.utm_content || null,
      referrer: meta.referrer || null,
      business_type: business.category || null,
      tags: ['instant-site'],
      form_data: {
        google_place_id: placeId,
        business_name: business.name || null,
        business_address: business.address || null,
        business_phone: business.phone || null,
        google_rating: business.rating ?? null,
        google_reviews: business.reviewCount ?? null,
        city: body.city || null,
        state: body.state || null,
        fbclid: meta.fbclid || null,
        sms_consent: { text: SMS_CONSENT_TEXT, at: new Date().toISOString(), ip },
      },
    })
  } catch (err) {
    // Don't block the build on the CRM — the preview row in WaaS also holds
    // their contact details, so the lead still exists there.
    console.error('[instant-site/start] CRM save failed:', err)
  }

  // Lead event, server side. Same event_id as the browser Pixel call.
  sendMetaEvent({
    eventName: 'Lead',
    eventId: body.eventId,
    sourceUrl: meta.landingUrl,
    email,
    phone,
    firstName,
    lastName: rest.join(' '),
    city: body.city,
    state: body.state,
    ip,
    userAgent,
    fbp: meta.fbp,
    fbc: meta.fbc,
    customData: { content_name: 'instant_site' },
  })

  const result = await waas('', {
    method: 'POST',
    body: {
      placeId,
      name,
      email,
      phone,
      clientIp: ip,
      leadMeta: {
        utm_source: meta.utm_source || null,
        utm_medium: meta.utm_medium || null,
        utm_campaign: meta.utm_campaign || null,
        utm_content: meta.utm_content || null,
        fbclid: meta.fbclid || null,
        landing_url: meta.landingUrl || null,
      },
    },
  })

  if (!result.ok) {
    // Over a limit or broken: they're in the CRM, so it's a hand-build, not a
    // lost lead. Tell them that rather than showing an error.
    console.error('[instant-site/start] build not started:', result.status, result.data)
    return NextResponse.json({ handoff: true }, { status: 200 })
  }

  return NextResponse.json({ token: result.data.token })
}
