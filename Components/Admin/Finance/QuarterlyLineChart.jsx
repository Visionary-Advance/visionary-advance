'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART, fmtMoney, fmtMoneyCompact } from './parts'

const ESTIMATED = '#fbbf24' // adm-warn
const PAID = '#2dd4bf' // adm-accent

function QuarterTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-adm-border bg-adm-raised px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-adm-text">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 tabular-nums text-adm-muted">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} aria-hidden />
          {p.name}: <span className="ml-auto pl-3 text-adm-text">{fmtMoney(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function QuarterlyLineChart({ data }) {
  if (!data?.length) {
    return <p className="py-10 text-center text-sm text-adm-subtle">No quarters to show yet</p>
  }

  const chartData = data.map((d) => ({
    name: `Q${d.quarter}`,
    estimated: d.estimated || 0,
    paid: parseFloat(d.amount_paid) || 0,
  }))

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-adm-muted">
        <span className="inline-flex items-center gap-1.5">
          <svg width="18" height="8" aria-hidden><line x1="1" y1="4" x2="17" y2="4" stroke={ESTIMATED} strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" /></svg>
          Estimated
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="18" height="8" aria-hidden><line x1="1" y1="4" x2="17" y2="4" stroke={PAID} strokeWidth="2.5" strokeLinecap="round" /></svg>
          Paid
        </span>
      </div>
      <div className="-ml-3 h-56 sm:ml-0" role="img" aria-label="Estimated tax compared with amounts paid, per quarter.">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtMoneyCompact} />
            <Tooltip content={<QuarterTooltip />} cursor={{ stroke: CHART.grid }} />
            <Line type="monotone" dataKey="estimated" name="Estimated" stroke={ESTIMATED} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5, fill: ESTIMATED, strokeWidth: 0 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="paid" name="Paid" stroke={PAID} strokeWidth={2} dot={{ r: 4, fill: PAID, strokeWidth: 0 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
