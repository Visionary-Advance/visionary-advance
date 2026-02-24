// app/api/finance/settings/route.js
// GET (read settings), PATCH (update settings)

import { NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/finance'

// GET /api/finance/settings
export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching finance settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/finance/settings
export async function PATCH(request) {
  try {
    const body = await request.json()

    const allowedFields = ['federal_bracket', 'state_rate', 'state_name', 'se_tax_rate', 'se_tax_base', 'tax_year']
    const updates = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const settings = await updateSettings(updates)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating finance settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
