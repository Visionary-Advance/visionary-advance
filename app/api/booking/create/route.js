import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createBookingEvent } from '@/lib/google-calendar'
import { createOrUpdateLead } from '@/lib/crm'
import { requireRecaptcha } from '@/lib/recaptcha'

const resend = new Resend(process.env.RESEND_API_KEY)

// ── ICS generator ─────────────────────────────────────────────────────────────
// RFC 5545 — lines must end with CRLF, lines > 75 chars must be folded
function buildIcsFile({ name, email, startIso, endIso, meetLink, uid }) {
  const fmt = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace('.000', '')
  const dtstamp = fmt(new Date().toISOString())
  const dtstart = fmt(startIso)
  const dtend   = fmt(endIso)
  const location = meetLink || 'Google Meet'
  const description = meetLink
    ? `Join Google Meet: ${meetLink}`
    : 'Discovery Call with Visionary Advance'

  // fold lines longer than 75 chars (RFC 5545 §3.1)
  const fold = (line) => {
    const chunks = []
    while (line.length > 75) {
      chunks.push(line.slice(0, 75))
      line = ' ' + line.slice(75)
    }
    chunks.push(line)
    return chunks.join('\r\n')
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Visionary Advance//Discovery Call//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}@visionaryadvance.com`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    fold(`SUMMARY:Discovery Call — ${name}`),
    fold(`DESCRIPTION:${description}`),
    fold(`LOCATION:${location}`),
    `ORGANIZER;CN=Visionary Advance:mailto:info@visionaryadvance.com`,
    fold(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${name}:mailto:${email}`),
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Discovery Call in 1 hour',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT10M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Discovery Call starting soon',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join('\r\n')
}

// POST /api/booking/create
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, message, slotIso, meetingType = 'meet', recaptchaToken } = body

    // Basic validation
    if (!name || !email || !slotIso) {
      return NextResponse.json({ error: 'name, email, and slotIso are required' }, { status: 400 })
    }

    // reCAPTCHA
    const recaptchaError = await requireRecaptcha({ recaptchaToken }, 'booking')
    if (recaptchaError) {
      return NextResponse.json({ error: recaptchaError.error }, { status: recaptchaError.status })
    }

    // 1. Create Google Calendar event + Meet link
    const booking = await createBookingEvent({ name, email, message, slotIso, meetingType })

    // 2. CRM lead (non-blocking)
    const [firstName, ...rest] = name.trim().split(' ')
    createOrUpdateLead({
      firstName,
      lastName: rest.join(' ') || '',
      email,
      phone: '',
      company: '',
      message: message || '',
      source: 'contact_form',
      projectType: 'Discovery Call',
    }).catch((err) => console.error('[booking/create] CRM error:', err))

    // 3. Confirmation email to client
    const startDate = new Date(booking.start)
    const formattedDate = startDate.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      timeZone: 'America/Los_Angeles',
    })
    const formattedTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'America/Los_Angeles',
    })

    if (process.env.RESEND_API_KEY) {
      // Notify Brandon
      const adminEmailResult = await resend.emails.send({
        from: 'Brandon Crites <noreply@mail.visionaryadvance.com>',
        to: 'brandon@visionaryadvance.com',
        subject: `New booking: ${name} — ${formattedDate} at ${formattedTime}`,
        html: buildAdminEmail({ name, email, formattedDate, formattedTime, meetLink: booking.meetLink, meetingType, message }),
      })
      console.log('[booking/create] admin email result:', JSON.stringify(adminEmailResult))
    }

    return NextResponse.json({
      success: true,
      booking: {
        start:    booking.start,
        end:      booking.end,
        meetLink: booking.meetLink,
        htmlLink: booking.htmlLink,
        formattedDate,
        formattedTime,
      },
    })
  } catch (err) {
    console.error('[booking/create]', err)
    return NextResponse.json({ error: 'Failed to create booking. Please try again.' }, { status: 500 })
  }
}

// ── Email templates ───────────────────────────────────────────────────────────

// ── Shared email card layout ──────────────────────────────────────────────────
function buildEmailCard({ headline, intro, formattedDate, formattedTime, meetLink, meetingType, extraRows = '', cta = '', footer = '' }) {
  const isInPerson = meetingType === 'in-person'
  const meetBadge = isInPerson
    ? `<span style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;font-size:13px;font-weight:600;padding:4px 12px;border-radius:999px;">📍 In-Person</span>`
    : `<span style="display:inline-block;background:#ecfdf5;border:1px solid #6ee7b7;color:#065f46;font-size:13px;font-weight:600;padding:4px 12px;border-radius:999px;">🎥 Google Meet</span>`

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
      <div style="background:#008070;padding:32px;border-radius:12px 12px 0 0">
        <h1 style="color:white;margin:0;font-size:24px">${headline}</h1>
      </div>
      <div style="background:#f9f9f9;padding:32px;border-radius:0 0 12px 12px;border:1px solid #eee">
        ${intro}
        <div style="margin:4px 0 20px">${meetBadge}</div>
        <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px">
          <p style="margin:0 0 10px"><strong>📅 Date:</strong> ${formattedDate}</p>
          <p style="margin:0 0 10px"><strong>🕐 Time:</strong> ${formattedTime} Pacific</p>
          ${isInPerson
            ? `<p style="margin:0"><strong>📍 Format:</strong> In-Person — location details to follow</p>`
            : (meetLink ? `<p style="margin:0"><strong>🎥 Meet link:</strong> <a href="${meetLink}" style="color:#008070">${meetLink}</a></p>` : '')
          }
          ${extraRows}
        </div>
        ${cta}
        ${footer}
      </div>
    </div>
  `
}

function buildClientEmail({ name, formattedDate, formattedTime, meetLink, meetingType, message }) {
  const isInPerson = meetingType === 'in-person'
  return buildEmailCard({
    headline: 'Discovery Call Confirmed',
    intro: `<p style="margin-top:0">Hi ${name},</p><p>Your discovery call with Visionary Advance is confirmed. Here are the details:</p>`,
    formattedDate,
    formattedTime,
    meetLink,
    meetingType,
    extraRows: message ? `<p style="margin:10px 0 0;border-top:1px solid #f3f4f6;padding-top:10px"><strong>Your note:</strong> ${message}</p>` : '',
    cta: !isInPerson && meetLink
      ? `<a href="${meetLink}" style="display:inline-block;background:#008070;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-bottom:20px">Join Google Meet</a>`
      : '',
    footer: `<p style="color:#6b7280;font-size:14px;margin-top:16px">We'll use this call to understand your business and what you're looking to build — no sales pressure, just a straightforward conversation.</p><p style="color:#6b7280;font-size:14px">— Brandon, Visionary Advance<br/>info@visionaryadvance.com · 541-321-0468</p>`,
  })
}

function buildAdminEmail({ name, email, formattedDate, formattedTime, meetLink, meetingType, message }) {
  return buildEmailCard({
    headline: 'New Booking Received',
    intro: `<p style="margin-top:0">You have a new discovery call booked.</p>`,
    formattedDate,
    formattedTime,
    meetLink,
    meetingType,
    extraRows: `
      <p style="margin:10px 0 0;border-top:1px solid #f3f4f6;padding-top:10px"><strong>👤 Client:</strong> ${name}</p>
      <p style="margin:6px 0 0"><strong>✉️ Email:</strong> <a href="mailto:${email}" style="color:#008070">${email}</a></p>
      ${message ? `<p style="margin:6px 0 0"><strong>💬 Note:</strong> ${message}</p>` : ''}
    `,
    cta: '',
    footer: '',
  })
}
