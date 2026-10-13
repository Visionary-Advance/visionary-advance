import { NextResponse } from 'next/server'
import { requireRecaptcha } from '@/lib/recaptcha'
import { createOrUpdateLead } from '@/lib/crm'
import { sendMetaEvent } from '@/lib/meta'
import { alertInstantSiteManual, clientIp } from '@/lib/instant-site'
import { SMS_CONSENT_TEXT } from '@/lib/instant-site-copy'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// "My business isn't on Google." There's no listing to build from, so this is
// a lead for a hand-built site, saved to the CRM, with its own Telegram alert.
export async function POST(request) {
  const body = await request.json().catch(() => ({}))

  const recaptchaError = await requireRecaptcha(body, 'instant_manual')
  if (recaptchaError) {
    return NextResponse.json({ error: recaptchaError.error }, { status: recaptchaError.status })
  }

  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200)
  const phone = String(body.phone || '').trim().slice(0, 30)
  const businessName = String(body.businessName || '').trim().slice(0, 120)
  if (!name || !EMAIL_RE.test(email) || phone.replace(/\D/g, '').length < 10 || !businessName) {
    return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 })
  }

  const meta = body.meta || {}
  const [firstName, ...rest] = name.split(/\s+/)
  const ip = clientIp(request)

  try {
    await createOrUpdateLead({
      email,
      first_name: firstName || null,
      last_name: rest.join(' ') || null,
      full_name: name,
      phone,
      company: businessName,
      source: 'instant_site',
      conversion_page: '/get-your-site',
      source_url: meta.landingUrl || null,
      utm_source: meta.utm_source || null,
      utm_medium: meta.utm_medium || null,
      utm_campaign: meta.utm_campaign || null,
      utm_term: meta.utm_term || null,
      utm_content: meta.utm_content || null,
      referrer: meta.referrer || null,
      business_type: String(body.industry || '').slice(0, 60) || null,
      tags: ['instant-site', 'not-on-google'],
      form_data: {
        business_name: businessName,
        city: body.city || null,
        state: body.state || null,
        not_on_google: true,
        fbclid: meta.fbclid || null,
        sms_consent: { text: SMS_CONSENT_TEXT, at: new Date().toISOString(), ip },
      },
    }, { notify: false })
  } catch (err) {
    console.error('[instant-site/manual] CRM save failed:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  await alertInstantSiteManual({
    businessName, name, email, phone,
    city: body.city, state: body.state,
    industry: String(body.industry || '').slice(0, 60) || null,
  })

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
    userAgent: request.headers.get('user-agent'),
    fbp: meta.fbp,
    fbc: meta.fbc,
    customData: { content_name: 'instant_site_manual' },
  })

  return NextResponse.json({ ok: true })
}
