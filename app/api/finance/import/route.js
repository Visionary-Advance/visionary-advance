// app/api/finance/import/route.js — Bulk CSV import for income/expenses
import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/lib/finance'

const BATCH_SIZE = 500

// POST /api/finance/import
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, rows } = body

    if (!type || !['income', 'expenses'].includes(type)) {
      return NextResponse.json({ error: 'type must be "income" or "expenses"' }, { status: 400 })
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'rows array is required and must not be empty' }, { status: 400 })
    }

    const table = type === 'income' ? 'finance_income' : 'finance_expenses'
    const imported = []
    const failed = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const validation = type === 'income' ? validateIncomeRow(row) : validateExpenseRow(row)

      if (!validation.valid) {
        failed.push({ index: i, row, errors: validation.errors })
      } else {
        imported.push(validation.data)
      }
    }

    // Batch insert valid rows
    let insertedCount = 0
    const insertErrors = []

    for (let i = 0; i < imported.length; i += BATCH_SIZE) {
      const batch = imported.slice(i, i + BATCH_SIZE)
      const { data, error } = await supabase
        .from(table)
        .insert(batch)
        .select()

      if (error) {
        insertErrors.push({ batch: Math.floor(i / BATCH_SIZE), error: error.message })
      } else {
        insertedCount += data.length
      }
    }

    return NextResponse.json({
      imported: insertedCount,
      failed: failed.length + insertErrors.length,
      errors: [
        ...failed.map(f => ({ index: f.index, errors: f.errors })),
        ...insertErrors.map(e => ({ batch: e.batch, errors: [e.error] })),
      ],
    })
  } catch (error) {
    console.error('Error importing finance data:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function validateIncomeRow(row) {
  const errors = []
  const data = {}

  // date_paid — required, must be YYYY-MM-DD
  if (!row.date_paid || !/^\d{4}-\d{2}-\d{2}$/.test(row.date_paid)) {
    errors.push('Invalid date format (expected YYYY-MM-DD)')
  } else {
    data.date_paid = row.date_paid
  }

  // client_name — required
  if (!row.client_name || !String(row.client_name).trim()) {
    errors.push('Missing client name')
  } else {
    data.client_name = String(row.client_name).trim()
  }

  // amount — required, > 0
  const amount = parseFloat(row.amount)
  if (isNaN(amount) || amount <= 0) {
    errors.push('Amount must be a positive number')
  } else {
    data.amount = amount
  }

  // payment_method — optional, validate key
  if (row.payment_method && PAYMENT_METHODS[row.payment_method]) {
    data.payment_method = row.payment_method
  } else {
    data.payment_method = 'other'
  }

  // type
  data.type = row.type || 'one-time'

  // notes — optional
  if (row.notes) {
    data.notes = String(row.notes).trim() || null
  }

  // client_id — optional
  if (row.client_id) {
    data.client_id = row.client_id
  }

  return { valid: errors.length === 0, errors, data }
}

function validateExpenseRow(row) {
  const errors = []
  const data = {}

  // date — required
  if (!row.date || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
    errors.push('Invalid date format (expected YYYY-MM-DD)')
  } else {
    data.date = row.date
  }

  // description — required
  if (!row.description || !String(row.description).trim()) {
    errors.push('Missing description')
  } else {
    data.description = String(row.description).trim()
  }

  // amount — required, > 0
  const amount = parseFloat(row.amount)
  if (isNaN(amount) || amount <= 0) {
    errors.push('Amount must be a positive number')
  } else {
    data.amount = amount
  }

  // category — required, must be valid
  if (!row.category || !EXPENSE_CATEGORIES[row.category]) {
    errors.push(`Invalid category: "${row.category || ''}"`)
  } else {
    data.category = row.category
  }

  // receipt_url — optional
  if (row.receipt_url) {
    data.receipt_url = String(row.receipt_url).trim()
  }

  // is_recurring
  data.is_recurring = row.is_recurring || false

  // notes — optional
  if (row.notes) {
    data.notes = String(row.notes).trim() || null
  }

  return { valid: errors.length === 0, errors, data }
}
