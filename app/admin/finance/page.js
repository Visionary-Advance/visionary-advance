// app/admin/finance/page.js — Dashboard
'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/finance'
import FinanceStatCard from '@/Components/Admin/Finance/FinanceStatCard'
import DeadlineAlert from '@/Components/Admin/Finance/DeadlineAlert'
import MonthlyChart from '@/Components/Admin/Finance/MonthlyChart'
import QuarterlyCard from '@/Components/Admin/Finance/QuarterlyCard'

export default function FinanceDashboard() {
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
      console.error('Error fetching finance stats:', err)
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Finance Dashboard</h1>
          <p className="mt-1 text-[#a1a1aa]">Track income, expenses, and tax estimates</p>
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

      {/* Deadline Alert */}
      <DeadlineAlert deadlines={stats?.upcomingDeadlines} />

      {/* Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FinanceStatCard
          label="YTD Income"
          value={formatCurrency(stats?.overview?.ytdIncome)}
          icon={IncomeStatIcon}
          color="text-green-400"
        />
        <FinanceStatCard
          label="YTD Expenses"
          value={formatCurrency(stats?.overview?.ytdExpenses)}
          icon={ExpenseStatIcon}
          color="text-red-400"
        />
        <FinanceStatCard
          label="Net Profit"
          value={formatCurrency(stats?.overview?.netProfit)}
          icon={ProfitStatIcon}
          color="text-teal-400"
        />
        <FinanceStatCard
          label="Estimated Tax"
          value={formatCurrency(stats?.overview?.estimatedTax)}
          icon={TaxStatIcon}
          color="text-amber-400"
          subtext={`${stats?.settings?.federal_bracket}% federal + ${stats?.settings?.state_rate}% ${stats?.settings?.state_name}`}
        />
      </div>

      {/* Monthly Chart */}
      <div className="mt-8 rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#fafafa]">Monthly Income vs Expenses</h2>
        <p className="mt-1 text-sm text-[#525252]">{year} monthly breakdown</p>
        <div className="mt-4">
          <MonthlyChart data={stats?.monthly} />
        </div>
      </div>

      {/* Two-column: Quarterly + By Client */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Quarterly Tax Status */}
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold text-[#fafafa]">Quarterly Tax Payments</h2>
          <p className="mt-1 text-sm text-[#525252]">Estimated quarterly payment status</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {stats?.quarterly?.map((q) => (
              <QuarterlyCard key={q.quarter} payment={q} onMarkPaid={handleMarkPaid} />
            ))}
          </div>
        </div>

        {/* Revenue by Client */}
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold text-[#fafafa]">Revenue by Client</h2>
          <p className="mt-1 text-sm text-[#525252]">{year} client breakdown</p>
          <div className="mt-4 space-y-3">
            {stats?.byClient?.length > 0 ? (
              stats.byClient.map((client, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-[#171717] px-4 py-3">
                  <span className="text-sm font-medium text-[#fafafa]">{client.name}</span>
                  <span className="text-sm font-semibold text-green-400">{formatCurrency(client.total)}</span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-[#525252]">No income recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat card icons
function IncomeStatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ExpenseStatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  )
}

function ProfitStatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  )
}

function TaxStatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}
