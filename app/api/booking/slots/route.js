import { NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/google-calendar'

// GET /api/booking/slots?date=2026-04-10
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid or missing date (expect YYYY-MM-DD)' }, { status: 400 })
  }

  // Don't allow past dates
  const today = new Date().toISOString().split('T')[0]
  if (date < today) {
    return NextResponse.json({ slots: [] })
  }

  try {
    const slots = await getAvailableSlots(date)
    return NextResponse.json({ slots })
  } catch (err) {
    console.error('[booking/slots]', err)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
