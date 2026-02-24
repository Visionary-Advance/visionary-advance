// app/api/finance/expenses/[id]/route.js
// GET, PATCH, DELETE single expense entry

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { EXPENSE_CATEGORIES } from '@/lib/finance'

// GET /api/finance/expenses/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('finance_expenses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Expense entry not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching expense entry:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/finance/expenses/:id
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const allowedFields = ['description', 'amount', 'date', 'category', 'receipt_url', 'is_recurring', 'notes']
    const updates = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = field === 'amount' ? parseFloat(body[field]) : body[field]
      }
    }

    if (updates.category && !EXPENSE_CATEGORIES[updates.category]) {
      return NextResponse.json({ error: `Invalid category: ${updates.category}` }, { status: 400 })
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('finance_expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, entry: data })
  } catch (error) {
    console.error('Error updating expense entry:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/finance/expenses/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('finance_expenses')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense entry:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
