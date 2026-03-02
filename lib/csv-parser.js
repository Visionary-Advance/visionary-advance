// lib/csv-parser.js — CSV parsing & validation for finance import
import Papa from 'papaparse'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from './finance'

// ============================================
// CSV PARSING
// ============================================

export function parseCSV(text) {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  })
  return {
    headers: result.meta.fields || [],
    rows: result.data,
    errors: result.errors,
  }
}

// ============================================
// VALUE PARSERS
// ============================================

const MONTH_NAMES = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
}

export function parseDate(raw) {
  if (!raw || typeof raw !== 'string') return null
  const s = raw.trim()
  if (!s) return null

  // YYYY-MM-DD (ISO)
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (iso) {
    const d = new Date(+iso[1], +iso[2] - 1, +iso[3])
    if (!isNaN(d)) return formatDateISO(d)
  }

  // MM/DD/YYYY or M/D/YYYY
  const mdy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (mdy) {
    const d = new Date(+mdy[3], +mdy[1] - 1, +mdy[2])
    if (!isNaN(d)) return formatDateISO(d)
  }

  // M/D/YY
  const mdyShort = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/)
  if (mdyShort) {
    const yr = +mdyShort[3] + (+mdyShort[3] >= 70 ? 1900 : 2000)
    const d = new Date(yr, +mdyShort[1] - 1, +mdyShort[2])
    if (!isNaN(d)) return formatDateISO(d)
  }

  // "Jan 15, 2025" or "January 15, 2025" or "15 Jan 2025"
  const named = s.match(/^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/)
  if (named) {
    const monthIdx = MONTH_NAMES[named[1].toLowerCase()]
    if (monthIdx !== undefined) {
      const d = new Date(+named[3], monthIdx, +named[2])
      if (!isNaN(d)) return formatDateISO(d)
    }
  }

  // "15 Jan 2025"
  const dmy = s.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/)
  if (dmy) {
    const monthIdx = MONTH_NAMES[dmy[2].toLowerCase()]
    if (monthIdx !== undefined) {
      const d = new Date(+dmy[3], monthIdx, +dmy[1])
      if (!isNaN(d)) return formatDateISO(d)
    }
  }

  return null
}

function formatDateISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseAmount(raw) {
  if (raw === null || raw === undefined) return null
  const s = String(raw).trim()
  if (!s) return null

  // Handle accounting format: ($100.00) or (100)
  const accounting = s.match(/^\([\$]?([\d,]+\.?\d*)\)$/)
  if (accounting) {
    const num = parseFloat(accounting[1].replace(/,/g, ''))
    return isNaN(num) ? null : num
  }

  // Strip $ and commas, handle negative sign
  const cleaned = s.replace(/[\$,]/g, '').trim()
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : Math.abs(num)
}

// ============================================
// FUZZY MATCHING
// ============================================

function fuzzyMatch(input, candidates) {
  if (!input) return null
  const lower = input.toLowerCase().trim()

  // Exact key match
  if (candidates[lower]) return lower

  // Exact label match
  for (const [key, val] of Object.entries(candidates)) {
    const label = (val.label || val).toLowerCase()
    if (label === lower) return key
  }

  // Partial match — input contains key or key contains input
  for (const [key, val] of Object.entries(candidates)) {
    const label = (val.label || val).toLowerCase()
    const keyNorm = key.replace(/_/g, ' ')
    if (lower.includes(keyNorm) || keyNorm.includes(lower)) return key
    if (lower.includes(label) || label.includes(lower)) return key
  }

  // Word overlap — at least one significant word matches
  const inputWords = lower.split(/[\s&_\-]+/).filter(w => w.length > 2)
  for (const [key, val] of Object.entries(candidates)) {
    const label = (val.label || val).toLowerCase()
    const labelWords = label.split(/[\s&_\-]+/).filter(w => w.length > 2)
    const keyWords = key.split('_').filter(w => w.length > 2)
    const allWords = [...new Set([...labelWords, ...keyWords])]
    if (inputWords.some(iw => allWords.some(lw => lw.startsWith(iw) || iw.startsWith(lw)))) {
      return key
    }
  }

  return null
}

export function normalizePaymentMethod(raw) {
  if (!raw) return null
  return fuzzyMatch(raw, PAYMENT_METHODS)
}

export function normalizeExpenseCategory(raw) {
  if (!raw) return null
  return fuzzyMatch(raw, EXPENSE_CATEGORIES)
}

// ============================================
// AUTO COLUMN MAPPING
// ============================================

const COLUMN_ALIASES = {
  // Date fields
  date: ['date', 'transaction date', 'trans date', 'payment date', 'date paid', 'paid date', 'invoice date'],
  // Amount
  amount: ['amount', 'total', 'sum', 'price', 'cost', 'value', 'payment amount', 'net amount'],
  // Vendor/Client
  vendor: ['vendor', 'client', 'client name', 'customer', 'payee', 'paid to', 'from', 'company', 'merchant', 'source'],
  // Description
  description: ['description', 'desc', 'memo', 'detail', 'details', 'note', 'notes', 'item', 'service'],
  // Category
  category: ['category', 'type', 'expense type', 'expense category', 'class', 'group'],
  // Payment Method
  payment_method: ['payment method', 'method', 'payment type', 'pay method', 'payment', 'paid via', 'paid by'],
  // Receipt
  receipt: ['receipt', 'receipt url', 'receipt link', 'attachment', 'file', 'document'],
}

// Maps DB fields per type
const FIELD_MAP = {
  income: {
    date: 'date_paid',
    vendor: 'client_name',
    amount: 'amount',
    description: 'notes',
    payment_method: 'payment_method',
  },
  expenses: {
    date: 'date',
    vendor: 'description',
    amount: 'amount',
    category: 'category',
    description: 'notes',
    payment_method: '_payment_method_to_notes',
    receipt: 'receipt_url',
  },
}

export const REQUIRED_FIELDS = {
  income: ['date_paid', 'client_name', 'amount'],
  expenses: ['date', 'description', 'amount', 'category'],
}

export const TARGET_FIELDS = {
  income: {
    date_paid: 'Date Paid',
    client_name: 'Client Name',
    amount: 'Amount',
    payment_method: 'Payment Method',
    notes: 'Notes',
    _skip: '— Skip —',
  },
  expenses: {
    date: 'Date',
    description: 'Description',
    amount: 'Amount',
    category: 'Category',
    notes: 'Notes',
    receipt_url: 'Receipt URL',
    _skip: '— Skip —',
  },
}

export function autoMapColumns(headers, type) {
  const fieldMap = FIELD_MAP[type] || {}
  const mapping = {}

  for (const header of headers) {
    const headerLower = header.toLowerCase().trim()
    let mapped = '_skip'

    for (const [aliasKey, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (aliases.some(a => headerLower === a || headerLower.includes(a))) {
        const dbField = fieldMap[aliasKey]
        if (dbField) {
          mapped = dbField
          break
        }
      }
    }

    mapping[header] = mapped
  }

  return mapping
}

// ============================================
// ROW VALIDATION
// ============================================

export function validateRow(row, type) {
  const errors = []
  const data = {}

  if (type === 'income') {
    // Date
    const date = parseDate(row.date_paid)
    if (!date) {
      errors.push('Invalid or missing date')
    } else {
      data.date_paid = date
    }

    // Client name
    if (!row.client_name || !String(row.client_name).trim()) {
      errors.push('Missing client name')
    } else {
      data.client_name = String(row.client_name).trim()
    }

    // Amount
    const amount = parseAmount(row.amount)
    if (amount === null || amount <= 0) {
      errors.push('Invalid or missing amount')
    } else {
      data.amount = amount
    }

    // Payment method (optional)
    if (row.payment_method) {
      const pm = normalizePaymentMethod(row.payment_method)
      data.payment_method = pm || 'other'
    } else {
      data.payment_method = 'other'
    }

    // Notes (optional)
    if (row.notes && String(row.notes).trim()) {
      data.notes = String(row.notes).trim()
    }

    data.type = 'one-time'
  } else {
    // Expenses

    // Date
    const date = parseDate(row.date)
    if (!date) {
      errors.push('Invalid or missing date')
    } else {
      data.date = date
    }

    // Description
    if (!row.description || !String(row.description).trim()) {
      errors.push('Missing description')
    } else {
      data.description = String(row.description).trim()
    }

    // Amount
    const amount = parseAmount(row.amount)
    if (amount === null || amount <= 0) {
      errors.push('Invalid or missing amount')
    } else {
      data.amount = amount
    }

    // Category
    if (row.category) {
      const cat = normalizeExpenseCategory(row.category)
      if (!cat) {
        errors.push(`Unknown category: "${row.category}"`)
      } else {
        data.category = cat
      }
    } else {
      errors.push('Missing category')
    }

    // Notes (optional) — may include payment method appended
    const noteParts = []
    if (row.notes && String(row.notes).trim()) {
      noteParts.push(String(row.notes).trim())
    }
    if (row._payment_method_to_notes && String(row._payment_method_to_notes).trim()) {
      noteParts.push(`Payment: ${String(row._payment_method_to_notes).trim()}`)
    }
    if (noteParts.length > 0) {
      data.notes = noteParts.join(' | ')
    }

    // Receipt URL (optional)
    if (row.receipt_url && String(row.receipt_url).trim()) {
      const url = String(row.receipt_url).trim()
      if (url.startsWith('http://') || url.startsWith('https://')) {
        data.receipt_url = url
      }
    }

    data.is_recurring = false
  }

  return {
    valid: errors.length === 0,
    errors,
    data,
  }
}

// ============================================
// MAP RAW ROW USING COLUMN MAPPING
// ============================================

export function mapRow(rawRow, columnMapping) {
  const mapped = {}
  for (const [csvCol, dbField] of Object.entries(columnMapping)) {
    if (dbField === '_skip' || !rawRow[csvCol]) continue
    const value = String(rawRow[csvCol]).trim()
    if (!value) continue

    if (mapped[dbField]) {
      // Append if field already has a value (e.g. multiple cols → notes)
      mapped[dbField] = mapped[dbField] + ' | ' + value
    } else {
      mapped[dbField] = value
    }
  }
  return mapped
}
