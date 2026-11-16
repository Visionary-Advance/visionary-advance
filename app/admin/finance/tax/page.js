// app/admin/finance/tax/page.js — Tax estimator
'use client'

import { Settings } from 'lucide-react'
import { usePersistedState } from '@/lib/usePersistedState'
import { invalidate, useCachedFetch } from '@/lib/useCachedFetch'
import { Button, Card, CardHeader, PageHeader, Skeleton, StatTile, useToast } from '@/Components/Admin/ui'
import { BarList, QuarterList, YearSelect, fmtMoney } from '@/Components/Admin/Finance/parts'
import QuarterlyLineChart from '@/Components/Admin/Finance/QuarterlyLineChart'

export default function TaxEstimatorPage() {
  const notify = useToast()
  const [year, setYear] = usePersistedState('year', new Date().getFullYear())
  const { data: stats, loading } = useCachedFetch(`/api/finance/stats?year=${year}`, {
    onError: () => notify('Could not load tax data', 'error'),
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

  const tax = stats?.taxBreakdown
  const s = stats?.settings
  const net = stats?.overview?.netProfit || 0
  const effective = net > 0 && tax ? Math.round((tax.totalEstimated / net) * 1000) / 10 : null
  const paid = (stats?.quarterly || []).reduce((sum, q) => sum + (parseFloat(q.amount_paid) || 0), 0)

  const parts = tax
    ? [
        { key: 'se', label: 'Self-employment tax', sub: `${s?.se_tax_base}% of net × ${s?.se_tax_rate}%`, value: tax.selfEmploymentTax || 0, color: '#fbbf24' },
        { key: 'fed', label: 'Federal income tax', sub: `${s?.federal_bracket}% bracket`, value: tax.federalTax || 0, color: '#60a5fa' },
        { key: 'state', label: `${s?.state_name || 'State'} income tax`, sub: `${s?.state_rate}% rate`, value: tax.stateTax || 0, color: '#c084fc' },
      ]
    : []

  return (
    <div>
      <PageHeader
        title="Tax estimator"
        description="Self-employment estimates from your recorded income and expenses"
        actions={
          <>
            <Button variant="ghost" icon={Settings} href="/admin/finance/settings">Rates</Button>
            <YearSelect value={year} onChange={setYear} />
          </>
        }
      />

      <section aria-label="Tax summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile loading={loading} label="Net profit" value={fmtMoney(net)} hint="income − expenses" />
        <StatTile loading={loading} label="Estimated tax" value={fmtMoney(tax?.totalEstimated)} hint={effective !== null ? `${effective}% effective` : undefined} />
        <StatTile loading={loading} label="Per quarter" value={fmtMoney(tax?.quarterlyAmount)} hint="estimated payment" />
        <StatTile loading={loading} label="Paid so far" value={fmtMoney(paid)} hint={tax?.totalEstimated ? `${fmtMoney(Math.max(0, tax.totalEstimated - paid))} left` : undefined} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Where the estimate comes from" description={`Based on ${fmtMoney(net)} net profit`} />
          <div className="p-4 sm:p-5">
            {loading ? <Skeleton className="h-36 w-full" /> : <BarList items={parts} emptyText="No profit yet, so no tax" />}
          </div>
        </Card>

        <Card>
          <CardHeader title="Quarterly payments" description="IRS Form 1040-ES due dates" />
          <div className="p-4 sm:p-5">
            {loading ? <Skeleton className="h-40 w-full" /> : <QuarterList quarterly={stats?.quarterly} onMarkPaid={handleMarkPaid} />}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Estimated vs paid" description="Per quarter" />
          <div className="p-4 sm:p-5">
            {loading ? <Skeleton className="h-56 w-full" /> : <QuarterlyLineChart data={stats?.quarterly} />}
          </div>
        </Card>
      </div>
    </div>
  )
}
