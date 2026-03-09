// lib/finance.js
// Business logic for Finance / Tax Dashboard module

import { supabaseCRM as supabase } from './supabase-crm'
import { format, parseISO } from 'date-fns'

// ============================================
// CONSTANTS
// ============================================

export const EXPENSE_CATEGORIES = {
  advertising: { label: 'Advertising & Marketing', color: '#3b82f6', scheduleC: 'Line 8' },
  car_and_truck: { label: 'Car & Truck Expenses', color: '#8b5cf6', scheduleC: 'Line 9' },
  commissions: { label: 'Commissions & Fees', color: '#06b6d4', scheduleC: 'Line 10' },
  contract_labor: { label: 'Contract Labor', color: '#f59e0b', scheduleC: 'Line 11' },
  depletion: { label: 'Depletion', color: '#64748b', scheduleC: 'Line 12' },
  depreciation: { label: 'Depreciation', color: '#78716c', scheduleC: 'Line 13' },
  employee_benefits: { label: 'Employee Benefits', color: '#14b8a6', scheduleC: 'Line 14' },
  insurance: { label: 'Insurance (non-health)', color: '#a855f7', scheduleC: 'Line 15' },
  interest_mortgage: { label: 'Interest (Mortgage)', color: '#ec4899', scheduleC: 'Line 16a' },
  interest_other: { label: 'Interest (Other)', color: '#f43f5e', scheduleC: 'Line 16b' },
  legal_professional: { label: 'Legal & Professional', color: '#0ea5e9', scheduleC: 'Line 17' },
  office_expense: { label: 'Office Expense', color: '#10b981', scheduleC: 'Line 18' },
  pension_profit_sharing: { label: 'Pension & Profit-Sharing', color: '#6366f1', scheduleC: 'Line 19' },
  rent_lease_vehicles: { label: 'Rent/Lease (Vehicles)', color: '#d946ef', scheduleC: 'Line 20a' },
  rent_lease_property: { label: 'Rent/Lease (Property)', color: '#e879f9', scheduleC: 'Line 20b' },
  repairs_maintenance: { label: 'Repairs & Maintenance', color: '#f97316', scheduleC: 'Line 21' },
  supplies: { label: 'Supplies', color: '#84cc16', scheduleC: 'Line 22' },
  taxes_licenses: { label: 'Taxes & Licenses', color: '#ef4444', scheduleC: 'Line 23' },
  travel: { label: 'Travel', color: '#22d3ee', scheduleC: 'Line 24a' },
  meals: { label: 'Meals (50%)', color: '#fb923c', scheduleC: 'Line 24b' },
  utilities: { label: 'Utilities', color: '#facc15', scheduleC: 'Line 25' },
  wages: { label: 'Wages', color: '#2dd4bf', scheduleC: 'Line 26' },
  other_expenses: { label: 'Other Expenses', color: '#94a3b8', scheduleC: 'Line 27' },
}

export const PAYMENT_METHODS = {
  check: { label: 'Check' },
  cash: { label: 'Cash' },
  bank_transfer: { label: 'Bank Transfer' },
  paypal: { label: 'PayPal' },
  venmo: { label: 'Venmo' },
  zelle: { label: 'Zelle' },
  stripe: { label: 'Stripe' },
  square: { label: 'Square' },
  other: { label: 'Other' },
}

export const PAYMENT_STATUSES = {
  due: { label: 'Due', bgColor: 'bg-amber-500/20', textColor: 'text-amber-400', dotColor: 'bg-amber-400' },
  paid: { label: 'Paid', bgColor: 'bg-green-500/20', textColor: 'text-green-400', dotColor: 'bg-green-400' },
  overpaid: { label: 'Overpaid', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400', dotColor: 'bg-blue-400' },
  overdue: { label: 'Overdue', bgColor: 'bg-red-500/20', textColor: 'text-red-400', dotColor: 'bg-red-400' },
}

export const QUARTERLY_DEADLINES = {
  1: { month: 4, day: 15, label: 'April 15' },
  2: { month: 6, day: 15, label: 'June 15' },
  3: { month: 9, day: 15, label: 'September 15' },
  4: { month: 1, day: 15, label: 'January 15 (next year)' },
}

export const DEFAULT_TAX_RATES = {
  federal_bracket: 22,
  state_rate: 9,
  state_name: 'Oregon',
  se_tax_rate: 15.3,
  se_tax_base: 92.35,
}

// ============================================
// PURE FUNCTIONS (no DB)
// ============================================

export function calculateEstimatedTax(netProfit, settings = DEFAULT_TAX_RATES) {
  if (netProfit <= 0) {
    return { selfEmploymentTax: 0, federalTax: 0, stateTax: 0, totalEstimated: 0, quarterlyAmount: 0 }
  }

  const seBase = netProfit * (settings.se_tax_base / 100)
  const selfEmploymentTax = seBase * (settings.se_tax_rate / 100)
  const seDeduction = selfEmploymentTax / 2
  const adjustedIncome = netProfit - seDeduction
  const federalTax = adjustedIncome * (settings.federal_bracket / 100)
  const stateTax = adjustedIncome * (settings.state_rate / 100)
  const totalEstimated = selfEmploymentTax + federalTax + stateTax
  const quarterlyAmount = totalEstimated / 4

  return {
    selfEmploymentTax: Math.round(selfEmploymentTax * 100) / 100,
    federalTax: Math.round(federalTax * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    totalEstimated: Math.round(totalEstimated * 100) / 100,
    quarterlyAmount: Math.round(quarterlyAmount * 100) / 100,
  }
}

export function getQuarterlyDeadline(quarter, year) {
  const deadline = QUARTERLY_DEADLINES[quarter]
  if (!deadline) return null
  const deadlineYear = quarter === 4 ? year + 1 : year
  return new Date(deadlineYear, deadline.month - 1, deadline.day)
}

export function getCurrentQuarter() {
  const now = new Date()
  const month = now.getMonth() + 1
  let quarter
  if (month <= 3) quarter = 1
  else if (month <= 6) quarter = 2
  else if (month <= 9) quarter = 3
  else quarter = 4
  return { quarter, year: now.getFullYear() }
}

export function isDeadlineApproaching(quarter, year, daysThreshold = 30) {
  const deadline = getQuarterlyDeadline(quarter, year)
  if (!deadline) return false
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays > 0 && diffDays <= daysThreshold
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

// ============================================
// ASYNC FUNCTIONS (Supabase)
// ============================================

export async function getFinanceSummary(year) {
  try {
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    // Fetch income
    const { data: income, error: incomeError } = await supabase
      .from('finance_income')
      .select('*')
      .gte('date_paid', startDate)
      .lte('date_paid', endDate)
      .order('date_paid', { ascending: true })

    if (incomeError) throw incomeError

    // Fetch expenses
    const { data: expenses, error: expenseError } = await supabase
      .from('finance_expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (expenseError) throw expenseError

    // Calculate YTD totals
    const ytdIncome = income.reduce((sum, i) => sum + parseFloat(i.amount), 0)
    const ytdExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
    const netProfit = ytdIncome - ytdExpenses

    // Monthly breakdown
    const monthly = []
    for (let m = 1; m <= 12; m++) {
      const monthStr = String(m).padStart(2, '0')
      const monthIncome = income
        .filter(i => i.date_paid.startsWith(`${year}-${monthStr}`))
        .reduce((sum, i) => sum + parseFloat(i.amount), 0)
      const monthExpenseEntries = expenses.filter(e => e.date.startsWith(`${year}-${monthStr}`))
      const monthExpenses = monthExpenseEntries.reduce((sum, e) => sum + parseFloat(e.amount), 0)

      // Category breakdown for this month
      const monthCatMap = {}
      monthExpenseEntries.forEach(e => {
        monthCatMap[e.category] = (monthCatMap[e.category] || 0) + parseFloat(e.amount)
      })
      const categoryBreakdown = Object.entries(monthCatMap)
        .map(([key, total]) => ({
          key,
          label: EXPENSE_CATEGORIES[key]?.label || key,
          color: EXPENSE_CATEGORIES[key]?.color || '#94a3b8',
          total: Math.round(total * 100) / 100,
        }))
        .sort((a, b) => b.total - a.total)

      monthly.push({
        month: m,
        label: format(new Date(year, m - 1, 1), 'MMM'),
        income: Math.round(monthIncome * 100) / 100,
        expenses: Math.round(monthExpenses * 100) / 100,
        expenseCount: monthExpenseEntries.length,
        categoryBreakdown,
      })
    }

    // By client
    const byClient = {}
    income.forEach(i => {
      byClient[i.client_name] = (byClient[i.client_name] || 0) + parseFloat(i.amount)
    })
    const byClientArr = Object.entries(byClient)
      .map(([name, total]) => ({ name, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total)

    // By category
    const byCategory = {}
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount)
    })
    const byCategoryArr = Object.entries(byCategory)
      .map(([key, total]) => ({
        key,
        label: EXPENSE_CATEGORIES[key]?.label || key,
        color: EXPENSE_CATEGORIES[key]?.color || '#94a3b8',
        scheduleC: EXPENSE_CATEGORIES[key]?.scheduleC || '',
        total: Math.round(total * 100) / 100,
      }))
      .sort((a, b) => b.total - a.total)

    // Quarterly breakdown
    const quarterly = []
    for (let q = 1; q <= 4; q++) {
      const qStartMonth = (q - 1) * 3 + 1
      const qEndMonth = q * 3
      const qIncome = income
        .filter(i => {
          const m = parseInt(i.date_paid.split('-')[1])
          return m >= qStartMonth && m <= qEndMonth
        })
        .reduce((sum, i) => sum + parseFloat(i.amount), 0)
      const qExpenses = expenses
        .filter(e => {
          const m = parseInt(e.date.split('-')[1])
          return m >= qStartMonth && m <= qEndMonth
        })
        .reduce((sum, e) => sum + parseFloat(e.amount), 0)
      quarterly.push({
        quarter: q,
        income: Math.round(qIncome * 100) / 100,
        expenses: Math.round(qExpenses * 100) / 100,
        net: Math.round((qIncome - qExpenses) * 100) / 100,
      })
    }

    return {
      ytdIncome: Math.round(ytdIncome * 100) / 100,
      ytdExpenses: Math.round(ytdExpenses * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      monthly,
      quarterly,
      byClient: byClientArr,
      byCategory: byCategoryArr,
    }
  } catch (error) {
    console.error('Error fetching finance summary:', error)
    throw error
  }
}

export async function getIncomeEntries({ year, month, page = 1, limit = 20, search, client_id } = {}) {
  try {
    let query = supabase
      .from('finance_income')
      .select('*', { count: 'exact' })

    if (year) {
      query = query.gte('date_paid', `${year}-01-01`).lte('date_paid', `${year}-12-31`)
    }

    if (month) {
      const monthStr = String(month).padStart(2, '0')
      query = query.gte('date_paid', `${year}-${monthStr}-01`).lte('date_paid', `${year}-${monthStr}-31`)
    }

    if (search) {
      query = query.ilike('client_name', `%${search}%`)
    }

    if (client_id) {
      query = query.eq('client_id', client_id)
    }

    const offset = (page - 1) * limit
    query = query.order('date_paid', { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return {
      entries: data,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    }
  } catch (error) {
    console.error('Error fetching income entries:', error)
    throw error
  }
}

export async function getExpenseEntries({ year, month, category, page = 1, limit = 20 } = {}) {
  try {
    let query = supabase
      .from('finance_expenses')
      .select('*', { count: 'exact' })

    if (year) {
      query = query.gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
    }

    if (month) {
      const monthStr = String(month).padStart(2, '0')
      query = query.gte('date', `${year}-${monthStr}-01`).lte('date', `${year}-${monthStr}-31`)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const offset = (page - 1) * limit
    query = query.order('date', { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return {
      entries: data,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    }
  } catch (error) {
    console.error('Error fetching expense entries:', error)
    throw error
  }
}

export async function getQuarterlyPayments(year) {
  try {
    // Auto-create missing quarter rows
    for (let q = 1; q <= 4; q++) {
      const { data: existing } = await supabase
        .from('finance_quarterly_payments')
        .select('id')
        .eq('quarter', q)
        .eq('year', year)
        .single()

      if (!existing) {
        await supabase.from('finance_quarterly_payments').insert({
          quarter: q,
          year,
          amount_due: 0,
          amount_paid: 0,
          status: 'due',
        })
      }
    }

    const { data, error } = await supabase
      .from('finance_quarterly_payments')
      .select('*')
      .eq('year', year)
      .order('quarter', { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching quarterly payments:', error)
    throw error
  }
}

export async function getSettings() {
  try {
    const { data, error } = await supabase
      .from('finance_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code === 'PGRST116') {
      // No settings row, insert defaults
      const { data: newData, error: insertError } = await supabase
        .from('finance_settings')
        .insert(DEFAULT_TAX_RATES)
        .select()
        .single()
      if (insertError) throw insertError
      return newData
    }

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw error
  }
}

export async function updateSettings(settingsData) {
  try {
    const existing = await getSettings()
    const { data, error } = await supabase
      .from('finance_settings')
      .update(settingsData)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}

export async function uploadReceipt(file, expenseId) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${expenseId}-${Date.now()}.${fileExt}`
    const filePath = `receipts/${fileName}`

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filePath, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath)

    // Update expense with receipt URL
    await supabase
      .from('finance_expenses')
      .update({ receipt_url: urlData.publicUrl })
      .eq('id', expenseId)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading receipt:', error)
    throw error
  }
}
