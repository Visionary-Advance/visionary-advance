'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader, Delta, Skeleton, cx } from '@/Components/Admin/ui'
import { CHART, fmtMoney, fmtMoneyCompact } from './parts'

function MonthTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-adm-border bg-adm-raised px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-adm-text">{label}</p>
      <p className="mt-0.5 tabular-nums text-adm-muted">{fmtMoney(payload[0].value)}</p>
    </div>
  )
}

export default function MonthlyExpenseSummary({ monthly, loading, year, yearSelect }) {
  const months = monthly || []
  const total = months.reduce((s, m) => s + (m.expenses || 0), 0)
  const active = months.filter((m) => m.expenses > 0)
  const avg = active.length ? total / active.length : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Monthly spending"
          description={`${year} · ${fmtMoney(total)} total · ${fmtMoney(avg)} average month`}
          actions={<span className="sm:hidden">{yearSelect}</span>}
        />
        <div className="p-4 sm:p-5">
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <div className="-ml-3 h-56 sm:ml-0 sm:h-64" role="img" aria-label={`Monthly expenses for ${year}, ${fmtMoney(total)} in total.`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={months} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={10} />
                  <YAxis tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtMoneyCompact} />
                  <Tooltip content={<MonthTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar dataKey="expenses" name="Expenses" fill={CHART.expenses} fillOpacity={0.85} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {months.map((m, i) => {
          const prev = i > 0 ? months[i - 1].expenses : null
          const change = prev ? ((m.expenses - prev) / prev) * 100 : null
          const top = (m.categoryBreakdown || [])[0]
          return (
            <li key={m.month} className={cx('rounded-xl border border-adm-border bg-adm-surface p-3.5 sm:p-4', !m.expenses && 'opacity-60')}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-adm-muted">{m.label}</p>
                {/* Spending going up is bad, so the arrow colors are inverted */}
                {m.expenses > 0 && <Delta value={change} inverted label="vs previous month" />}
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-adm-text sm:text-xl">{fmtMoney(m.expenses)}</p>
              <p className="mt-0.5 truncate text-xs text-adm-subtle">
                {m.expenseCount || 0} {m.expenseCount === 1 ? 'entry' : 'entries'}
                {top && ` · mostly ${top.label}`}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
