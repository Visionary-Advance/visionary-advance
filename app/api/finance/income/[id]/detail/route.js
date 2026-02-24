// app/api/finance/income/[id]/detail/route.js
// GET — Enriched income entry with tax impact, client history, quarter info

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import {
  calculateEstimatedTax,
  getSettings,
  QUARTERLY_DEADLINES,
  PAYMENT_METHODS,
} from '@/lib/finance'

function getQuarterForDate(dateStr) {
  const month = parseInt(dateStr.split('-')[1])
  if (month <= 3) return 1
  if (month <= 6) return 2
  if (month <= 9) return 3
  return 4
}

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Fetch entry and settings in parallel
    const [entryResult, settings] = await Promise.all([
      supabase.from('finance_income').select('*').eq('id', id).single(),
      getSettings(),
    ])

    if (entryResult.error) {
      if (entryResult.error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Income entry not found' }, { status: 404 })
      }
      throw entryResult.error
    }

    const entry = entryResult.data
    const amount = parseFloat(entry.amount)

    // Tax impact for this single payment
    const taxImpact = calculateEstimatedTax(amount, settings)

    // Quarter info
    const quarter = getQuarterForDate(entry.date_paid)
    const year = parseInt(entry.date_paid.split('-')[0])
    const deadline = QUARTERLY_DEADLINES[quarter]
    const deadlineYear = quarter === 4 ? year + 1 : year
    const deadlineDate = `${deadlineYear}-${String(deadline.month).padStart(2, '0')}-${String(deadline.day).padStart(2, '0')}`

    // Fetch quarterly payment status for this quarter
    const { data: quarterlyPayment } = await supabase
      .from('finance_quarterly_payments')
      .select('*')
      .eq('quarter', quarter)
      .eq('year', year)
      .single()

    // Client history — all entries from the same client (prefer client_id over client_name)
    let clientQuery = supabase
      .from('finance_income')
      .select('*')
      .order('date_paid', { ascending: false })

    if (entry.client_id) {
      clientQuery = clientQuery.eq('client_id', entry.client_id)
    } else {
      clientQuery = clientQuery.eq('client_name', entry.client_name)
    }

    const { data: clientEntries, error: clientError } = await clientQuery

    if (clientError) throw clientError

    const clientTotalEarned = clientEntries.reduce((sum, e) => sum + parseFloat(e.amount), 0)
    const clientPaymentCount = clientEntries.length
    const clientFirstPayment = clientEntries[clientEntries.length - 1]?.date_paid || null
    const clientLastPayment = clientEntries[0]?.date_paid || null
    const clientAveragePayment = clientPaymentCount > 0 ? clientTotalEarned / clientPaymentCount : 0

    return NextResponse.json({
      entry,
      taxImpact: {
        selfEmploymentTax: taxImpact.selfEmploymentTax,
        federalTax: taxImpact.federalTax,
        stateTax: taxImpact.stateTax,
        totalTax: taxImpact.totalEstimated,
      },
      quarterInfo: {
        quarter,
        year,
        deadlineLabel: deadline.label,
        deadlineDate,
        paymentStatus: quarterlyPayment?.status || 'due',
      },
      clientHistory: {
        totalEarned: Math.round(clientTotalEarned * 100) / 100,
        paymentCount: clientPaymentCount,
        firstPayment: clientFirstPayment,
        lastPayment: clientLastPayment,
        averagePayment: Math.round(clientAveragePayment * 100) / 100,
        entries: clientEntries,
      },
      settings,
    })
  } catch (error) {
    console.error('Error fetching income detail:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
