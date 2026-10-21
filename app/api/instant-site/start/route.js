import { NextResponse } from 'next/server'
import { requireRecaptcha } from '@/lib/recaptcha'
import { createOrUpdateLead } from '@/lib/crm'
import { alertInstantSiteLead, clientIp, waas } from '@/lib/instant-site'
import { sendMetaEvent } from '@/lib/meta'
import { SMS_CONSENT_TEXT } from '@/lib/instant-site-copy'
import { claimTrialSpot } from '@/lib/trial'

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
  // Template ids are slugs (createTemplate enforces it); anything else is junk.
  const templateId = String(body.templateId || '').trim()
  const validTemplateId = /^[a-z0-9][a-z0-9-]{0,63}$/.test(templateId)
  const styleName = String(body.styleName || '').trim().slice(0, 40) || null
  // The kind of work they picked on their card; WaaS checks it against its list.
  const industryRaw = typeof body.industry === 'string' ? body.industry : ''
  const industry = /^[a-z_]{1,30}$/.test(industryRaw) ? industryRaw : null
  // Every kind of work they picked, for the alert only.
  const kinds = (Array.isArray(body.kinds) ? body.kinds : [])
    .filter((k) => typeof k === 'string' && /^[a-z_]{1,30}$/.test(k))
    .slice(0, 12)
  const phoneDigits = phone.replace(/\D/g, '')

  if (!name || !EMAIL_RE.test(email) || phoneDigits.length < 10 || !placeId || !validTemplateId) {
    return NextResponse.json({ error: 'Please fill in your name, email and mobile number.' }, { status: 400 })
  }

  const meta = body.meta || {}
  const [firstName, ...rest] = name.split(/\s+/)
  const ip = clientIp(request)
  const userAgent = request.headers.get('user-agent')

  // From /free-trial: take a spot (or join the waitlist) before anything else,
  // so the banner's count moves the moment the form is submitted.
  const fromTrial = body.offer === 'trial'
  const trial = fromTrial
    ? (await claimTrialSpot({ email, name, phone, businessName: business.name, placeId })) || 'unrecorded'
    : null

  try {
    await createOrUpdateLead({
      email,
      first_name: firstName || null,
      last_name: rest.join(' ') || null,
      full_name: name,
      phone,
      company: business.name || null,
      source: 'instant_site',
      conversion_page: fromTrial ? '/free-trial' : '/get-your-site',
      source_url: meta.landingUrl || null,
      utm_source: meta.utm_source || null,
      utm_medium: meta.utm_medium || null,
      utm_campaign: meta.utm_campaign || null,
      utm_term: meta.utm_term || null,
      utm_content: meta.utm_content || null,
      referrer: meta.referrer || null,
      business_type: business.category || null,
      tags: ['instant-site', ...(trial === 'waitlist' ? ['trial-waitlist'] : trial ? ['free-trial'] : [])],
      form_data: {
        trial_status: trial,
        google_place_id: placeId,
        template_id: templateId,
        style: styleName,
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
    // This form sends its own Telegram alert below, once the build's fate is known.
    }, { notify: false })
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
      templateId,
      industry,
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

  // Their chosen style was switched off between picking and submitting: send
  // them back to choose again rather than hand-building a design they didn't pick.
  if (result.status === 400 && result.data?.reason === 'template') {
    return NextResponse.json({ error: result.data.error, reason: 'template' }, { status: 409 })
  }

  const alert = (build, verifiedBusiness) => alertInstantSiteLead({
    business: verifiedBusiness ?? { name: business.name },
    verified: Boolean(verifiedBusiness),
    name, email, phone,
    city: body.city, state: body.state,
    style: styleName, kinds, placeId,
    utmCampaign: meta.utm_campaign,
    build,
    trial,
  })

  if (!result.ok) {
    // Over a limit or broken: they're in the CRM, so it's a hand-build, not a
    // lost lead. Tell them that rather than showing an error.
    console.error('[instant-site/start] build not started:', result.status, result.data)
    const reason = result.data?.reason === 'phone' || result.data?.reason === 'ip' ? 'daily build limit reached'
      : result.data?.reason === 'daily_cap' ? 'site-wide daily cap reached'
      : result.data?.reason === 'disabled' ? 'instant previews switched off'
      : `builder answered ${result.status}`
    await alert(reason)
    return NextResponse.json({ handoff: true, trial }, { status: 200 })
  }

  // A reused build (same person, same business and style, asking again) was
  // already alerted when it started.
  if (!result.data.reused) await alert('started', result.data.business)
  return NextResponse.json({ token: result.data.token, trial })
}
