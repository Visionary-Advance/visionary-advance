// app/admin/finance/tax/page.js — Tax Estimator
'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/finance'
import QuarterlyCard from '@/Components/Admin/Finance/QuarterlyCard'
import QuarterlyLineChart from '@/Components/Admin/Finance/QuarterlyLineChart'

export default function TaxEstimatorPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/finance/stats?year=${year}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Error fetching tax data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchStats()
  }, [year])

  const handleMarkPaid = async (payment) => {
    try {
      const res = await fetch('/api/finance/quarterly', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quarter: payment.quarter,
          year,
          amount_paid: payment.estimated,
          amount_due: payment.estimated,
          date_paid: new Date().toISOString().split('T')[0],
          status: 'paid',
        }),
      })
      if (res.ok) fetchStats()
    } catch (err) {
      console.error('Error marking payment:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  const tax = stats?.taxBreakdown
  const settings = stats?.settings

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Tax Estimator</h1>
          <p className="mt-1 text-[#a1a1aa]">Estimated quarterly tax payments for self-employment</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
        >
          {[2024, 2025, 2026, 2027].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Tax Breakdown Card */}
      <div className="mb-8 rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#fafafa]">Tax Breakdown</h2>
        <p className="mt-1 text-sm text-[#525252]">
          Based on {settings?.federal_bracket}% federal + {settings?.state_rate}% {settings?.state_name} + {settings?.se_tax_rate}% SE tax
        </p>

        <div className="mt-6 space-y-4">
          {/* Net Profit */}
          <div className="flex items-center justify-between rounded-lg bg-[#171717] px-4 py-3">
            <span className="text-sm text-[#a1a1aa]">Net Profit (Income - Expenses)</span>
            <span className="text-lg font-semibold text-teal-400">
              {formatCurrency(stats?.overview?.netProfit)}
            </span>
          </div>

          <div className="border-t border-[#262626]" />

          {/* SE Tax */}
          <div className="flex items-center justify-between px-4 py-2">
            <div>
              <span className="text-sm text-[#a1a1aa]">Self-Employment Tax</span>
              <p className="text-xs text-[#525252]">{settings?.se_tax_base}% of net x {settings?.se_tax_rate}%</p>
            </div>
            <span className="text-sm font-semibold text-amber-400">
              {formatCurrency(tax?.selfEmploymentTax)}
            </span>
          </div>

          {/* Federal Tax */}
          <div className="flex items-center justify-between px-4 py-2">
            <div>
              <span className="text-sm text-[#a1a1aa]">Federal Income Tax</span>
              <p className="text-xs text-[#525252]">{settings?.federal_bracket}% bracket</p>
            </div>
            <span className="text-sm font-semibold text-blue-400">
              {formatCurrency(tax?.federalTax)}
            </span>
          </div>

          {/* State Tax */}
          <div className="flex items-center justify-between px-4 py-2">
            <div>
              <span className="text-sm text-[#a1a1aa]">{settings?.state_name} State Tax</span>
              <p className="text-xs text-[#525252]">{settings?.state_rate}% rate</p>
            </div>
            <span className="text-sm font-semibold text-purple-400">
              {formatCurrency(tax?.stateTax)}
            </span>
          </div>

          <div className="border-t border-[#262626]" />

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-amber-500/10 px-4 py-3">
            <span className="text-sm font-semibold text-amber-400">Total Estimated Tax</span>
            <span className="text-lg font-bold text-amber-400">
              {formatCurrency(tax?.totalEstimated)}
            </span>
          </div>

          {/* Quarterly Amount */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-[#a1a1aa]">Quarterly Payment</span>
            <span className="text-sm font-semibold text-[#fafafa]">
              {formatCurrency(tax?.quarterlyAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Quarterly Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#fafafa]">Quarterly Payments</h2>
        <p className="mt-1 text-sm text-[#525252]">Track your estimated tax payments</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats?.quarterly?.map((q) => (
            <QuarterlyCard key={q.quarter} payment={q} onMarkPaid={handleMarkPaid} />
          ))}
        </div>
      </div>

      {/* Quarterly Line Chart */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#fafafa]">Estimated vs Actual</h2>
        <p className="mt-1 text-sm text-[#525252]">Quarterly payment comparison</p>
        <div className="mt-4">
          <QuarterlyLineChart data={stats?.quarterly} />
        </div>
      </div>
    </div>
  )
}
