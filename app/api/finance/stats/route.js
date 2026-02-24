// app/api/finance/stats/route.js
// GET — Dashboard aggregations

import { NextResponse } from 'next/server'
import {
  getFinanceSummary,
  getQuarterlyPayments,
  getSettings,
  calculateEstimatedTax,
  getCurrentQuarter,
  isDeadlineApproaching,
  QUARTERLY_DEADLINES,
} from '@/lib/finance'

// GET /api/finance/stats
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    // Fetch all data in parallel
    const [summary, quarterlyPayments, settings] = await Promise.all([
      getFinanceSummary(year),
      getQuarterlyPayments(year),
      getSettings(),
    ])

    // Calculate estimated tax
    const taxEstimate = calculateEstimatedTax(summary.netProfit, settings)

    // Check for approaching deadlines
    const { quarter: currentQuarter } = getCurrentQuarter()
    const upcomingDeadlines = []
    for (let q = 1; q <= 4; q++) {
      if (isDeadlineApproaching(q, year, 30)) {
        const payment = quarterlyPayments.find(p => p.quarter === q)
        if (payment && payment.status === 'due') {
          upcomingDeadlines.push({
            quarter: q,
            deadline: QUARTERLY_DEADLINES[q].label,
            amountDue: taxEstimate.quarterlyAmount,
          })
        }
      }
    }

    // Map quarterly payments with estimated amounts
    const quarterlyWithEstimates = quarterlyPayments.map(p => ({
      ...p,
      estimated: taxEstimate.quarterlyAmount,
      deadline: QUARTERLY_DEADLINES[p.quarter]?.label || '',
      isOverdue: p.status === 'due' && new Date() > new Date(
        p.quarter === 4 ? year + 1 : year,
        (QUARTERLY_DEADLINES[p.quarter]?.month || 1) - 1,
        QUARTERLY_DEADLINES[p.quarter]?.day || 15
      ),
    }))

    return NextResponse.json({
      year,
      overview: {
        ytdIncome: summary.ytdIncome,
        ytdExpenses: summary.ytdExpenses,
        netProfit: summary.netProfit,
        estimatedTax: taxEstimate.totalEstimated,
      },
      taxBreakdown: taxEstimate,
      monthly: summary.monthly,
      quarterly: quarterlyWithEstimates,
      byClient: summary.byClient,
      byCategory: summary.byCategory,
      upcomingDeadlines,
      settings,
      currentQuarter,
    })
  } catch (error) {
    console.error('Error fetching finance stats:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
