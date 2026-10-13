import { NextResponse } from 'next/server'
import { alertInstantSiteUnlocked, clientIp, waas } from '@/lib/instant-site'
import { sendMetaEvent } from '@/lib/meta'

// Step 5: the code we sent them → the site. A correct code means a real,
// reachable contact, which is the conversion the ads should optimise for.
export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const token = String(body.token || '')
  const pin = String(body.pin || '').replace(/\D/g, '')
  if (!/^[a-f0-9]{64}$/.test(token) || pin.length !== 5) {
    return NextResponse.json({ error: 'Enter the 5-digit code.' }, { status: 400 })
  }

  const result = await waas('/verify', { method: 'POST', body: { token, pin } })
  if (!result.ok) return NextResponse.json(result.data, { status: result.status })

  const meta = body.meta || {}
  sendMetaEvent({
    eventName: 'CompleteRegistration',
    eventId: body.eventId,
    sourceUrl: meta.landingUrl,
    email: body.email,
    phone: body.phone,
    ip: clientIp(request),
    userAgent: request.headers.get('user-agent'),
    fbp: meta.fbp,
    fbc: meta.fbc,
    customData: { content_name: 'instant_site_unlocked' },
  })

  // Once per preview (WaaS claims it), with WaaS's business name rather than
  // the one the page sent.
  if (result.data.firstUnlock) {
    await alertInstantSiteUnlocked({
      businessName: result.data.businessName,
      name: body.name,
      previewUrl: result.data.previewUrl,
    })
  }

  return NextResponse.json(result.data)
}
