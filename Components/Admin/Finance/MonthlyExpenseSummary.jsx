'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency, EXPENSE_CATEGORIES } from '@/lib/finance'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#262626] bg-[#171717] px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-[#fafafa]">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="mt-1 text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

function MoMChange({ current, previous }) {
  if (!previous || previous === 0) {
    if (current > 0) return <span className="text-xs text-[#525252]">--</span>
    return null
  }
  const pct = ((current - previous) / previous) * 100
  const isUp = pct > 0
  const isZero = pct === 0
  if (isZero) return <span className="text-xs text-[#525252]">0%</span>
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-red-400' : 'text-green-400'}`}>
      {isUp ? '\u2191' : '\u2193'} {Math.abs(pct).toFixed(1)}%
    </span>
  )
}

export default function MonthlyExpenseSummary({ monthly, yearTotal }) {
  if (!monthly || monthly.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#525252]">
        No expense data to display
      </div>
    )
  }

  return (
    <div>
      {/* Year total stat */}
      <div className="mb-6 rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
        <p className="text-sm text-[#a1a1aa]">Year Total Expenses</p>
        <p className="text-2xl font-semibold text-red-400">{formatCurrency(yearTotal)}</p>
      </div>

      {/* Bar chart */}
      <div className="mb-8 rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#fafafa]">Monthly Expenses</h2>
        <p className="mt-1 text-sm text-[#525252]">Expense totals by month</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                axisLine={{ stroke: '#262626' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                axisLine={{ stroke: '#262626' }}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {monthly.map((m, i) => {
          const prev = i > 0 ? monthly[i - 1] : null
          const topCategories = (m.categoryBreakdown || []).slice(0, 3)

          return (
            <div
              key={m.month}
              className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium text-[#a1a1aa]">{m.label}</h3>
                <MoMChange current={m.expenses} previous={prev?.expenses} />
              </div>
              <p className="mt-1 text-xl font-semibold text-red-400">
                {formatCurrency(m.expenses)}
              </p>
              <p className="mt-0.5 text-xs text-[#525252]">
                {m.expenseCount || 0} {m.expenseCount === 1 ? 'entry' : 'entries'}
              </p>

              {/* Top categories */}
              {topCategories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {topCategories.map((cat) => (
                    <span
                      key={cat.key}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
