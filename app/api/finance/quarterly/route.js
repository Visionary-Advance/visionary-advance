// app/api/finance/quarterly/route.js
// GET (list quarterly payments), PATCH (update payment)

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getQuarterlyPayments } from '@/lib/finance'

// GET /api/finance/quarterly
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    const payments = await getQuarterlyPayments(year)

    return NextResponse.json({ payments, year })
  } catch (error) {
    console.error('Error fetching quarterly payments:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/finance/quarterly
export async function PATCH(request) {
  try {
    const body = await request.json()

    if (!body.quarter || !body.year) {
      return NextResponse.json(
        { error: 'quarter and year are required' },
        { status: 400 }
      )
    }

    const updates = {}
    if (body.amount_due !== undefined) updates.amount_due = parseFloat(body.amount_due)
    if (body.amount_paid !== undefined) updates.amount_paid = parseFloat(body.amount_paid)
    if (body.date_paid !== undefined) updates.date_paid = body.date_paid
    if (body.status !== undefined) updates.status = body.status

    // Auto-set status based on amounts
    if (updates.amount_paid !== undefined && updates.amount_due !== undefined) {
      if (updates.amount_paid >= updates.amount_due && updates.amount_due > 0) {
        updates.status = updates.amount_paid > updates.amount_due ? 'overpaid' : 'paid'
      }
    } else if (updates.amount_paid !== undefined) {
      // Fetch current amount_due
      const { data: current } = await supabase
        .from('finance_quarterly_payments')
        .select('amount_due')
        .eq('quarter', body.quarter)
        .eq('year', body.year)
        .single()

      if (current) {
        const due = parseFloat(current.amount_due)
        if (updates.amount_paid >= due && due > 0) {
          updates.status = updates.amount_paid > due ? 'overpaid' : 'paid'
        }
      }
    }

    const { data, error } = await supabase
      .from('finance_quarterly_payments')
      .update(updates)
      .eq('quarter', body.quarter)
      .eq('year', body.year)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, payment: data })
  } catch (error) {
    console.error('Error updating quarterly payment:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
