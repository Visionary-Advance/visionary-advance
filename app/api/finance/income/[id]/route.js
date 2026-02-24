// app/api/finance/income/[id]/route.js
// GET, PATCH, DELETE single income entry

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

// GET /api/finance/income/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('finance_income')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Income entry not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching income entry:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/finance/income/:id
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const allowedFields = ['client_name', 'client_id', 'amount', 'date_paid', 'payment_method', 'type', 'notes']
    const updates = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = field === 'amount' ? parseFloat(body[field]) : body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('finance_income')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, entry: data })
  } catch (error) {
    console.error('Error updating income entry:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/finance/income/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('finance_income')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting income entry:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
