// app/api/integrations/jobber/lead/route.js
// Receives contact-form leads from client websites and creates them in the
// contractor's Jobber account. Called server-to-server — the site's secret
// key must never be shipped to a browser.
//
//   POST /api/integrations/jobber/lead
//   Authorization: Bearer <site key from scripts/jobber-site.mjs>
//   { name, phone, email?, address?, service?, message?, pageUrl? }

import { NextResponse } from 'next/server'
import { getSiteByKey, normalizeLead, sendLeadToJobber } from '@/lib/jobber-leads'

export async function POST(request) {
  const authHeader = request.headers.get('authorization') || ''
  const key = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  const site = await getSiteByKey(key)
  if (!site) {
    return NextResponse.json({ error: 'Invalid or missing site key' }, { status: 401 })
  }

  if (!site.jobber_account_id) {
    // 409 so the calling site knows to fall back to email; nothing is lost.
    return NextResponse.json(
      { error: 'This site is not connected to a Jobber account yet' },
      { status: 409 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { lead, errors } = normalizeLead(body)
  if (errors) {
    return NextResponse.json({ error: 'Invalid lead', fields: errors }, { status: 400 })
  }

  try {
    const result = await sendLeadToJobber(site, lead)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error(`Jobber lead push failed for site ${site.slug}:`, error)
    return NextResponse.json({ error: 'Could not create the lead in Jobber' }, { status: 502 })
  }
}
