'use client'

// Finance building blocks on top of the shared admin kit (Components/Admin/ui).
// Charts follow the house rules: series differ by line style as well as color,
// legends sit with the chart, every chart has a table view for exact numbers.

import { useState } from 'react'
import {
  Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { ChartColumn, CircleCheck, Table2 } from 'lucide-react'
import { EXPENSE_CATEGORIES, PAYMENT_STATUSES, formatCurrency } from '@/lib/finance'
import { Badge, Button, EmptyState, SegmentedControl, cx, inputClass } from '@/Components/Admin/ui'

export const CHART = {
  income: '#2dd4bf', // adm-accent
  expenses: '#f87171', // adm-bad
  grid: '#27272a', // adm-border
  tick: '#8a8a93', // adm-subtle
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Whole dollars for tiles and charts; cents stay in ledgers.
export function fmtMoney(n, { cents = false } = {}) {
  if (cents) return formatCurrency(n)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

export function fmtMoneyCompact(n) {
  const v = Math.abs(n || 0)
  if (v >= 1000) return `${n < 0 ? '-' : ''}$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
  return `${n < 0 ? '-' : ''}$${Math.round(v)}`
}

export function yearOptions() {
  const now = new Date().getFullYear()
  const years = []
  for (let y = now + 1; y >= 2024; y--) years.push(y)
  return years
}

export function SelectInput({ value, onChange, children, label, className }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={cx(inputClass, 'h-10 w-auto cursor-pointer pr-8', className)}
    >
      {children}
    </select>
  )
}

export function YearSelect({ value, onChange, className }) {
  return (
    <SelectInput value={value} onChange={(v) => onChange(parseInt(v, 10))} label="Year" className={className}>
      {yearOptions().map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </SelectInput>
  )
}

// ---------------------------------------------------------------------------
// Status / category

const STATUS_TONE = { paid: 'good', due: 'warn', overdue: 'bad', overpaid: 'info' }

export function PaymentBadge({ status }) {
  return <Badge tone={STATUS_TONE[status] || 'neutral'}>{PAYMENT_STATUSES[status]?.label || status}</Badge>
}

export function CategoryTag({ category, className }) {
  const c = EXPENSE_CATEGORIES[category] || { label: category || 'Uncategorized', color: '#94a3b8' }
  return (
    <span className={cx('inline-flex min-w-0 items-center gap-1.5 text-xs text-adm-muted', className)}>
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
      <span className="truncate">{c.label}</span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Charts

function ChartTooltip({ active, payload, label }) {
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

function LegendItem({ color, dashed, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="18" height="8" aria-hidden>
        <line x1="1" y1="4" x2="17" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dashed ? '4 3' : undefined} />
      </svg>
      {children}
    </span>
  )
}

// Monthly income (solid, filled) vs expenses (dashed), with a table view.
export function CashflowChart({ data }) {
  const [view, setView] = useState('chart')
  const hasData = data?.some((m) => m.income || m.expenses)

  if (!hasData) {
    return <EmptyState icon={ChartColumn} title="No activity yet" description="Income and expenses you record show up here month by month." className="py-10" />
  }

  const totalIn = data.reduce((s, m) => s + (m.income || 0), 0)
  const totalOut = data.reduce((s, m) => s + (m.expenses || 0), 0)
  const best = data.reduce((b, m) => (m.income > (b?.income || 0) ? m : b), null)

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-adm-muted">
          <LegendItem color={CHART.income}>Income</LegendItem>
          <LegendItem color={CHART.expenses} dashed>Expenses</LegendItem>
        </div>
        <SegmentedControl
          size="sm"
          label="Display as"
          value={view}
          onChange={setView}
          options={[
            { value: 'chart', label: <><ChartColumn className="h-3.5 w-3.5" aria-hidden /> Chart</> },
            { value: 'table', label: <><Table2 className="h-3.5 w-3.5" aria-hidden /> Table</> },
          ]}
        />
      </div>

      {view === 'chart' ? (
        <div
          className="-ml-3 h-56 sm:ml-0 sm:h-72"
          role="img"
          aria-label={`Income ${fmtMoney(totalIn)} and expenses ${fmtMoney(totalOut)} this year${best ? `; best month ${best.label} at ${fmtMoney(best.income)}` : ''}.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.income} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={CHART.income} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={14} />
              <YAxis tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtMoneyCompact} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: CHART.grid }} />
              <Area type="monotone" dataKey="income" name="Income" stroke={CHART.income} strokeWidth={2} fill="url(#incomeFill)" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke={CHART.expenses} strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-adm-subtle">
                <th scope="col" className="py-2 text-left font-medium">Month</th>
                <th scope="col" className="py-2 text-right font-medium">Income</th>
                <th scope="col" className="py-2 text-right font-medium">Expenses</th>
                <th scope="col" className="py-2 text-right font-medium">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adm-border tabular-nums">
              {data.map((m) => {
                const net = (m.income || 0) - (m.expenses || 0)
                return (
                  <tr key={m.month}>
                    <td className="py-2 text-adm-muted">{m.label}</td>
                    <td className="py-2 text-right">{fmtMoney(m.income)}</td>
                    <td className="py-2 text-right">{fmtMoney(m.expenses)}</td>
                    <td className={cx('py-2 text-right', net < 0 ? 'text-adm-bad' : 'text-adm-text')}>{fmtMoney(net)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Horizontal bar list: label + amount + share, sorted, readable at any width.
export function BarList({ items, limit, valueFormat = fmtMoney, emptyText = 'Nothing yet' }) {
  const [expanded, setExpanded] = useState(false)
  if (!items?.length) return <p className="py-6 text-center text-sm text-adm-subtle">{emptyText}</p>

  const sorted = [...items].sort((a, b) => b.value - a.value)
  const total = sorted.reduce((s, i) => s + i.value, 0) || 1
  const max = sorted[0].value || 1
  const shown = limit && !expanded ? sorted.slice(0, limit) : sorted

  return (
    <div>
      <ul className="space-y-3">
        {shown.map((item) => (
          <li key={item.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                {item.color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden />}
                <span className="truncate text-adm-text">{item.label}</span>
                {item.sub && <span className="hidden shrink-0 text-xs text-adm-subtle sm:inline">{item.sub}</span>}
              </span>
              <span className="shrink-0 tabular-nums text-adm-text">
                {valueFormat(item.value)}
                <span className="ml-2 inline-block w-9 text-right text-xs text-adm-subtle">{Math.round((item.value / total) * 100)}%</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-adm-raised" aria-hidden>
              <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color || CHART.income }} />
            </div>
          </li>
        ))}
      </ul>
      {limit && sorted.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 cursor-pointer text-xs font-medium text-adm-accent hover:underline"
        >
          {expanded ? 'Show less' : `Show all ${sorted.length}`}
        </button>
      )}
    </div>
  )
}

export function categoryItems(byCategory) {
  return (byCategory || []).map((c) => ({
    key: c.key || c.label,
    label: c.label,
    sub: c.scheduleC || EXPENSE_CATEGORIES[c.key]?.scheduleC,
    value: c.total,
    color: c.color,
  }))
}

// ---------------------------------------------------------------------------
// Quarterly estimated tax

export function QuarterList({ quarterly, onMarkPaid }) {
  const [busy, setBusy] = useState(null)
  if (!quarterly?.length) return <p className="py-6 text-center text-sm text-adm-subtle">No quarters yet</p>

  async function mark(q) {
    setBusy(q.quarter)
    try { await onMarkPaid(q) } finally { setBusy(null) }
  }

  return (
    <ul className="divide-y divide-adm-border">
      {quarterly.map((q) => {
        const status = q.isOverdue && q.status === 'due' ? 'overdue' : q.status
        return (
          <li key={q.quarter} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
            <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-adm-border bg-adm-raised text-sm font-semibold">
                Q{q.quarter}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium tabular-nums">{fmtMoney(q.estimated)} <span className="font-normal text-adm-subtle">estimated</span></p>
                <p className="truncate text-xs text-adm-subtle">Due {q.deadline}{q.amount_paid > 0 && ` · ${fmtMoney(q.amount_paid)} paid`}</p>
              </div>
              <PaymentBadge status={status} />
            </div>
            {q.status === 'due' && onMarkPaid && (
              <Button size="sm" variant="secondary" icon={CircleCheck} loading={busy === q.quarter} onClick={() => mark(q)} className="w-full sm:w-auto">
                Mark paid
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// Label / value row for drawers and detail cards (wrap in a <dl>).
export function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-adm-subtle">{label}</dt>
      <dd className="min-w-0 text-right text-adm-text">{children}</dd>
    </div>
  )
}
