'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/finance'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value, payload: entry } = payload[0]
  return (
    <div className="rounded-lg border border-[#262626] bg-[#171717] px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-[#fafafa]">{name}</p>
      <p className="mt-1 text-sm text-[#a1a1aa]">{formatCurrency(value)}</p>
      {entry.scheduleC && (
        <p className="mt-0.5 text-xs text-[#525252]">{entry.scheduleC}</p>
      )}
    </div>
  )
}

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#525252]">
        No expense data
      </div>
    )
  }

  const chartData = data.map(d => ({
    name: d.label,
    value: d.total,
    color: d.color,
    scheduleC: d.scheduleC,
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            stroke="#0a0a0a"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
