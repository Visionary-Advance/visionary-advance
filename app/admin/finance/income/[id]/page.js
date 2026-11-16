// app/admin/finance/income/[id]/page.js — Income entry detail
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowDownLeft, ExternalLink, Pencil, Repeat, Trash2 } from 'lucide-react'
import { PAYMENT_METHODS } from '@/lib/finance'
import { invalidate, useCachedFetch } from '@/lib/useCachedFetch'
import {
  Badge, Button, Card, CardHeader, ConfirmButton, EmptyState, PageHeader, PageLoader, cx, useToast,
} from '@/Components/Admin/ui'
import { BarList, DetailRow, PaymentBadge, fmtMoney } from '@/Components/Admin/Finance/parts'
import IncomeForm from '@/Components/Admin/Finance/IncomeForm'

const dateOf = (d) => new Date(d + 'T00:00:00')
const methodLabel = (m) => PAYMENT_METHODS[m]?.label || m

export default function IncomeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const notify = useToast()
  const [showForm, setShowForm] = useState(false)
  const { data, loading, error } = useCachedFetch(`/api/finance/income/${id}/detail`, {
    onError: (err) => {
      if (err.status === 404) router.push('/admin/finance/income')
      else notify('Could not load this payment', 'error')
    },
  })
  const refresh = () => invalidate('/api/finance/')

  const handleDelete = async () => {
    const res = await fetch(`/api/finance/income/${id}`, { method: 'DELETE' })
    if (!res.ok) return notify("Couldn't delete this payment", 'error')
    notify('Payment deleted', 'success')
    invalidate('/api/finance/')
    router.push('/admin/finance/income')
  }

  if (loading && !error) return <PageLoader />

  if (!data) {
    return (
      <Card>
        <EmptyState
          icon={ArrowDownLeft}
          title="Payment not found"
          action={<Button href="/admin/finance/income">Back to income</Button>}
        />
      </Card>
    )
  }

  const { entry, taxImpact, quarterInfo, clientHistory, settings } = data
  const amount = parseFloat(entry.amount)
  const taxParts = [
    { key: 'se', label: 'Self-employment', sub: `${settings.se_tax_rate}% of ${settings.se_tax_base}%`, value: taxImpact.selfEmploymentTax || 0, color: '#fbbf24' },
    { key: 'fed', label: 'Federal', sub: `${settings.federal_bracket}% bracket`, value: taxImpact.federalTax || 0, color: '#60a5fa' },
    { key: 'state', label: settings.state_name || 'State', sub: `${settings.state_rate}%`, value: taxImpact.stateTax || 0, color: '#c084fc' },
  ]

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Finance', href: '/admin/finance' },
          { label: 'Income', href: '/admin/finance/income' },
          { label: entry.client_name },
        ]}
        title={fmtMoney(amount, { cents: true })}
        description={`From ${entry.client_name} on ${format(dateOf(entry.date_paid), 'MMMM d, yyyy')}`}
        meta={
          <>
            {entry.type === 'recurring' ? <Badge tone="info" icon={Repeat}>Recurring</Badge> : <Badge>One-time</Badge>}
            <span>{methodLabel(entry.payment_method)}</span>
            <span>Q{quarterInfo.quarter} {quarterInfo.year}</span>
          </>
        }
        actions={
          <>
            <Button icon={Pencil} onClick={() => setShowForm(true)}>Edit</Button>
            <ConfirmButton icon={Trash2} confirmLabel="Tap again to delete" onConfirm={handleDelete}>Delete</ConfirmButton>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Tax set-aside" description={`Estimated tax attributable to this payment`} />
            <div className="p-4 sm:p-5">
              <BarList items={taxParts} />
              <dl className="mt-5 divide-y divide-adm-border border-t border-adm-border text-sm">
                <DetailRow label="Total to set aside"><span className="font-semibold tabular-nums">{fmtMoney(taxImpact.totalTax, { cents: true })}</span></DetailRow>
                <DetailRow label="Yours after tax"><span className="tabular-nums text-adm-good">{fmtMoney(amount - taxImpact.totalTax, { cents: true })}</span></DetailRow>
                <DetailRow label={`Q${quarterInfo.quarter} payment`}>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-adm-muted">due {quarterInfo.deadlineLabel}</span>
                    <PaymentBadge status={quarterInfo.paymentStatus} />
                  </span>
                </DetailRow>
              </dl>
            </div>
          </Card>

          {entry.notes && (
            <Card>
              <CardHeader title="Notes" />
              <p className="whitespace-pre-wrap p-4 text-sm text-adm-muted sm:p-5">{entry.notes}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title={entry.client_name}
              description="All-time with this client"
              actions={entry.client_id && (
                <Button variant="ghost" size="sm" icon={ExternalLink} href={`/admin/crm/clients/${entry.client_id}`}>CRM</Button>
              )}
            />
            <dl className="divide-y divide-adm-border px-4 text-sm sm:px-5">
              <DetailRow label="Total earned"><span className="font-semibold tabular-nums">{fmtMoney(clientHistory.totalEarned)}</span></DetailRow>
              <DetailRow label="Payments">{clientHistory.paymentCount}</DetailRow>
              <DetailRow label="Average"><span className="tabular-nums">{fmtMoney(clientHistory.averagePayment)}</span></DetailRow>
              <DetailRow label="First">{clientHistory.firstPayment ? format(dateOf(clientHistory.firstPayment), 'MMM d, yyyy') : '—'}</DetailRow>
              <DetailRow label="Latest">{clientHistory.lastPayment ? format(dateOf(clientHistory.lastPayment), 'MMM d, yyyy') : '—'}</DetailRow>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Payment history" />
            <ul className="max-h-96 divide-y divide-adm-border overflow-y-auto">
              {clientHistory.entries.map((p) => {
                const current = p.id === entry.id
                return (
                  <li key={p.id}>
                    <Link
                      href={`/admin/finance/income/${p.id}`}
                      aria-current={current ? 'page' : undefined}
                      className={cx(
                        'flex min-h-12 items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors sm:px-5',
                        current ? 'bg-teal-500/5' : 'hover:bg-adm-raised'
                      )}
                    >
                      <span className="text-adm-muted">
                        {format(dateOf(p.date_paid), 'MMM d, yyyy')}
                        {current && <span className="ml-2 text-xs text-adm-accent">this one</span>}
                      </span>
                      <span className="font-medium tabular-nums text-adm-text">{fmtMoney(p.amount, { cents: true })}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>

      <IncomeForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={refresh} entry={entry} />
    </div>
  )
}
