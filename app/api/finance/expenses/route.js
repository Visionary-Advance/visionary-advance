// app/api/finance/expenses/route.js
// GET (list + filter), POST (create)

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getExpenseEntries, EXPENSE_CATEGORIES } from '@/lib/finance'

// GET /api/finance/expenses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')) : null
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')) : null
    const category = searchParams.get('category') || null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await getExpenseEntries({ year, month, category, page, limit })

    return NextResponse.json({
      ...result,
      categories: Object.keys(EXPENSE_CATEGORIES),
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/finance/expenses
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.description || !body.amount || !body.date || !body.category) {
      return NextResponse.json(
        { error: 'description, amount, date, and category are required' },
        { status: 400 }
      )
    }

    if (parseFloat(body.amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    if (!EXPENSE_CATEGORIES[body.category]) {
      return NextResponse.json(
        { error: `Invalid category: ${body.category}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('finance_expenses')
      .insert({
        description: body.description,
        amount: parseFloat(body.amount),
        date: body.date,
        category: body.category,
        receipt_url: body.receipt_url || null,
        is_recurring: body.is_recurring || false,
        notes: body.notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, entry: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
