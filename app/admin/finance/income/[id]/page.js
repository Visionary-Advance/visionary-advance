// app/admin/finance/income/[id]/page.js — Income Entry Detail
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, PAYMENT_METHODS } from '@/lib/finance'
import { format } from 'date-fns'
import IncomeForm from '@/Components/Admin/Finance/IncomeForm'

export default function IncomeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/finance/income/${id}/detail`)
      if (res.ok) {
        setData(await res.json())
      } else if (res.status === 404) {
        router.push('/admin/finance/income')
      }
    } catch (err) {
      console.error('Error fetching income detail:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/finance/income/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/finance/income')
      }
    } catch (err) {
      console.error('Error deleting income:', err)
    }
  }

  const handleSave = () => {
    setShowForm(false)
    fetchDetail()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#525252]">Entry not found</p>
        <Link href="/admin/finance/income" className="mt-4 inline-block text-sm text-emerald-400 hover:underline">
          Back to Income
        </Link>
      </div>
    )
  }

  const { entry, taxImpact, quarterInfo, clientHistory, settings } = data

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/finance/income"
          className="inline-flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Income
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {entry.client_id ? (
              <Link
                href={`/admin/crm/clients/${entry.client_id}`}
                className="inline-flex items-center gap-1.5 text-2xl font-semibold text-[#fafafa] hover:text-emerald-400 transition-colors"
              >
                {entry.client_name}
                <ExternalLinkIcon className="h-4 w-4 text-[#525252]" />
              </Link>
            ) : (
              <h1 className="text-2xl font-semibold text-[#fafafa]">{entry.client_name}</h1>
            )}
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              entry.type === 'recurring'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-[#171717] text-[#a1a1aa]'
            }`}>
              {entry.type}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column (main) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Entry Details Card */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-[#fafafa]">Entry Details</h2>
            <div className="mt-4">
              <p className="text-3xl font-bold text-green-400">{formatCurrency(entry.amount)}</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailField label="Date Paid" value={format(new Date(entry.date_paid + 'T00:00:00'), 'MMMM d, yyyy')} />
              <DetailField label="Payment Method" value={PAYMENT_METHODS[entry.payment_method]?.label || entry.payment_method} />
              <DetailField label="Type" value={entry.type === 'recurring' ? 'Recurring' : 'One-time'} />
              <DetailField label="Quarter" value={`Q${quarterInfo.quarter} ${quarterInfo.year}`} />
            </div>
            {entry.notes && (
              <div className="mt-4 rounded-lg bg-[#171717] p-3">
                <p className="text-xs font-medium text-[#525252] mb-1">Notes</p>
                <p className="text-sm text-[#a1a1aa]">{entry.notes}</p>
              </div>
            )}
          </div>

          {/* Tax Impact Card */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-[#fafafa]">Tax Impact</h2>
            <p className="mt-1 text-sm text-[#525252]">
              Estimated tax attributable to this {formatCurrency(entry.amount)} payment
            </p>
            <div className="mt-4 space-y-3">
              <TaxRow
                label="Self-Employment Tax"
                sublabel={`${settings.se_tax_rate}% of ${settings.se_tax_base}% base`}
                amount={taxImpact.selfEmploymentTax}
                color="text-amber-400"
                bgColor="bg-amber-500/10"
                borderColor="border-amber-500/20"
              />
              <TaxRow
                label="Federal Income Tax"
                sublabel={`${settings.federal_bracket}% bracket`}
                amount={taxImpact.federalTax}
                color="text-blue-400"
                bgColor="bg-blue-500/10"
                borderColor="border-blue-500/20"
              />
              <TaxRow
                label={`State Tax (${settings.state_name})`}
                sublabel={`${settings.state_rate}% rate`}
                amount={taxImpact.stateTax}
                color="text-purple-400"
                bgColor="bg-purple-500/10"
                borderColor="border-purple-500/20"
              />
              <div className="border-t border-[#262626] pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#fafafa]">Total Tax</span>
                <span className="text-lg font-bold text-red-400">{formatCurrency(taxImpact.totalTax)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#525252]">Net after tax</span>
                <span className="font-medium text-green-400">{formatCurrency(parseFloat(entry.amount) - taxImpact.totalTax)}</span>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-[#171717] p-3">
              <p className="text-xs text-[#525252]">
                Falls in <span className="text-[#a1a1aa] font-medium">Q{quarterInfo.quarter} {quarterInfo.year}</span>
                {' '}&middot; Deadline: <span className="text-[#a1a1aa] font-medium">{quarterInfo.deadlineLabel}</span>
                {' '}&middot; Status:{' '}
                <span className={`font-medium ${
                  quarterInfo.paymentStatus === 'paid' ? 'text-green-400' :
                  quarterInfo.paymentStatus === 'overdue' ? 'text-red-400' :
                  'text-amber-400'
                }`}>
                  {quarterInfo.paymentStatus.charAt(0).toUpperCase() + quarterInfo.paymentStatus.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right column (sidebar) */}
        <div className="space-y-6">
          {/* Client Summary Card */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-[#fafafa]">Client Summary</h2>
            <p className="mt-1 text-sm text-[#525252]">{entry.client_name}</p>
            <div className="mt-4 space-y-4">
              <SummaryRow label="Total Earned" value={formatCurrency(clientHistory.totalEarned)} valueClass="text-green-400 font-semibold" />
              <SummaryRow label="Payments" value={clientHistory.paymentCount} />
              <SummaryRow label="Average Payment" value={formatCurrency(clientHistory.averagePayment)} />
              <SummaryRow
                label="First Payment"
                value={clientHistory.firstPayment
                  ? format(new Date(clientHistory.firstPayment + 'T00:00:00'), 'MMM d, yyyy')
                  : 'N/A'}
              />
              <SummaryRow
                label="Last Payment"
                value={clientHistory.lastPayment
                  ? format(new Date(clientHistory.lastPayment + 'T00:00:00'), 'MMM d, yyyy')
                  : 'N/A'}
              />
            </div>
          </div>

          {/* Client Payment History */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-[#fafafa]">Payment History</h2>
            <p className="mt-1 text-sm text-[#525252]">All payments from {entry.client_name}</p>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
              {clientHistory.entries.map((payment) => (
                <Link
                  key={payment.id}
                  href={`/admin/finance/income/${payment.id}`}
                  className={`block rounded-lg p-3 transition-colors ${
                    payment.id === entry.id
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-[#171717] hover:bg-[#262626] border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-400">{formatCurrency(payment.amount)}</span>
                    <span className="text-xs text-[#525252]">
                      {PAYMENT_METHODS[payment.payment_method]?.label || payment.payment_method}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#a1a1aa]">
                    {format(new Date(payment.date_paid + 'T00:00:00'), 'MMM d, yyyy')}
                    {payment.id === entry.id && (
                      <span className="ml-2 text-emerald-400">&larr; Current</span>
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <IncomeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        entry={entry}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#fafafa]">Delete Income Entry</h3>
            <p className="mt-2 text-sm text-[#a1a1aa]">
              Delete this {formatCurrency(entry.amount)} payment from {entry.client_name}? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:bg-[#171717] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sub-components

function DetailField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#525252]">{label}</p>
      <p className="mt-0.5 text-sm text-[#fafafa]">{value}</p>
    </div>
  )
}

function TaxRow({ label, sublabel, amount, color, bgColor, borderColor }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border ${borderColor} ${bgColor} p-3`}>
      <div>
        <p className={`text-sm font-medium ${color}`}>{label}</p>
        <p className="text-xs text-[#525252]">{sublabel}</p>
      </div>
      <span className={`text-sm font-semibold ${color}`}>{formatCurrency(amount)}</span>
    </div>
  )
}

function SummaryRow({ label, value, valueClass = 'text-[#fafafa]' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#525252]">{label}</span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function ExternalLinkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}
