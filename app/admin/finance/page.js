// app/admin/finance/page.js — Overview
'use client'

import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { usePersistedState } from '@/lib/usePersistedState'
import { invalidate, useCachedFetch } from '@/lib/useCachedFetch'
import {
  Alert, Button, Card, CardHeader, PageHeader, Skeleton, StatTile, useToast,
} from '@/Components/Admin/ui'
import {
  BarList, CashflowChart, QuarterList, YearSelect, categoryItems, fmtMoney,
} from '@/Components/Admin/Finance/parts'

export default function FinanceOverview() {
  const notify = useToast()
  const [year, setYear] = usePersistedState('year', new Date().getFullYear())
  const { data: stats, loading } = useCachedFetch(`/api/finance/stats?year=${year}`, {
    onError: () => notify('Could not load finance data', 'error'),
  })

  const handleMarkPaid = async (payment) => {
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
    if (!res.ok) return notify(`Couldn't mark Q${payment.quarter} as paid`, 'error')
    notify(`Q${payment.quarter} marked as paid`, 'success')
    invalidate('/api/finance/')
  }

  const o = stats?.overview
  const s = stats?.settings
  const monthly = stats?.monthly || []
  const spark = useMemo(() => ({
    income: monthly.map((m) => m.income),
    expenses: monthly.map((m) => m.expenses),
    net: monthly.map((m) => (m.income || 0) - (m.expenses || 0)),
  }), [monthly])
  const margin = o?.ytdIncome ? Math.round((o.netProfit / o.ytdIncome) * 100) : null
  const clients = (stats?.byClient || []).map((c) => ({ key: c.name, label: c.name, value: c.total }))

  return (
    <div>
      <PageHeader
        title="Finance"
        description={`Year to date for ${year}`}
        actions={<YearSelect value={year} onChange={setYear} />}
      />

      {stats?.upcomingDeadlines?.length > 0 && (
        <Alert tone="warn" title="Estimated tax due soon" className="mb-6">
          {stats.upcomingDeadlines.map((d) => (
            <p key={d.quarter}>Q{d.quarter}: {fmtMoney(d.amountDue)} due {d.deadline}</p>
          ))}
        </Alert>
      )}

      <section aria-label="Year to date" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile loading={loading} label="Income" value={fmtMoney(o?.ytdIncome)} spark={spark.income} hint="year to date" href="/admin/finance/income" />
        <StatTile loading={loading} label="Expenses" value={fmtMoney(o?.ytdExpenses)} spark={spark.expenses} hint="year to date" href="/admin/finance/expenses" />
        <StatTile loading={loading} label="Net profit" value={fmtMoney(o?.netProfit)} spark={spark.net} hint={margin !== null ? `${margin}% margin` : undefined} />
        <StatTile
          loading={loading}
          label="Estimated tax"
          value={fmtMoney(o?.estimatedTax)}
          hint={s ? `${s.federal_bracket}% fed + ${s.state_rate}% state + SE` : undefined}
          href="/admin/finance/tax"
        />
      </section>

      <Card className="mt-6">
        <CardHeader title="Cash flow" description={`Monthly income and expenses, ${year}`} />
        <div className="p-4 sm:p-5">
          {loading ? <Skeleton className="h-56 w-full sm:h-72" /> : <CashflowChart data={monthly} />}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Estimated tax payments"
            description="Quarterly federal + state estimates"
            actions={<Button variant="ghost" size="sm" href="/admin/finance/tax" icon={ArrowRight}>Details</Button>}
          />
          <div className="p-4 sm:p-5">
            {loading ? <Skeleton className="h-40 w-full" /> : <QuarterList quarterly={stats?.quarterly} onMarkPaid={handleMarkPaid} />}
          </div>
        </Card>

        <Card>
          <CardHeader title="Revenue by client" description={`${year}, highest first`} />
          <div className="p-4 sm:p-5">
            {loading ? <Skeleton className="h-40 w-full" /> : <BarList items={clients} limit={6} emptyText="No income recorded yet" />}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Spending by category"
            description="Schedule C categories"
            actions={<Button variant="ghost" size="sm" href="/admin/finance/expenses" icon={ArrowRight}>Expenses</Button>}
          />
          <div className="p-4 sm:p-5">
            {loading ? <Skeleton className="h-40 w-full" /> : <BarList items={categoryItems(stats?.byCategory)} limit={6} emptyText="No expenses recorded yet" />}
          </div>
        </Card>
      </div>
    </div>
  )
}
