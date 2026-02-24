// app/api/finance/income/route.js
// GET (list + filter), POST (create)

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getIncomeEntries, PAYMENT_METHODS } from '@/lib/finance'

// GET /api/finance/income
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')) : null
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')) : null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const client_id = searchParams.get('client_id')

    const result = await getIncomeEntries({ year, month, page, limit, search, client_id })

    return NextResponse.json({
      ...result,
      paymentMethods: Object.keys(PAYMENT_METHODS),
    })
  } catch (error) {
    console.error('Error fetching income:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/finance/income
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.client_name || !body.amount || !body.date_paid) {
      return NextResponse.json(
        { error: 'client_name, amount, and date_paid are required' },
        { status: 400 }
      )
    }

    if (parseFloat(body.amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('finance_income')
      .insert({
        client_name: body.client_name,
        client_id: body.client_id || null,
        amount: parseFloat(body.amount),
        date_paid: body.date_paid,
        payment_method: body.payment_method || 'other',
        type: body.type || 'one-time',
        notes: body.notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, entry: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating income:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
