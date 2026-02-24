'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/finance'

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

export default function QuarterlyLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#525252]">
        No data to display
      </div>
    )
  }

  const chartData = data.map(d => ({
    name: `Q${d.quarter}`,
    estimated: d.estimated || 0,
    actual: parseFloat(d.amount_paid) || 0,
  }))

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis
            dataKey="name"
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
          <Legend
            wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="estimated"
            name="Estimated"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 5, fill: '#f59e0b' }}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Paid"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 5, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
