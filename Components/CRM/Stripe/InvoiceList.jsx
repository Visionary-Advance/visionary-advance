'use client'

import { useState, useEffect } from 'react'
import InvoiceCard from './InvoiceCard'

export default function InvoiceList({ leadId, limit = 5, showTotals = true }) {
  const [invoices, setInvoices] = useState([])
  const [totals, setTotals] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [leadId])

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/stripe`)
      if (!res.ok) throw new Error('Failed to fetch invoices')
      const data = await res.json()
      setInvoices(data.invoices || [])
      setTotals(data.totals || null)
      if (data.warning) {
        setError(data.warning)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/stripe/sync`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to sync')
      const data = await res.json()
      setInvoices(data.invoices || [])
      setTotals(data.totals || null)
    } catch (err) {
      alert(err.message)
    } finally {
      setSyncing(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error === 'Stripe is not configured') {
    return (
      <div className="py-4 text-center text-sm text-[#a1a1aa]">
        <StripeIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>Stripe integration not configured</p>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="py-4 text-center">
        <StripeIcon className="mx-auto h-8 w-8 mb-2 text-[#a1a1aa] opacity-50" />
        <p className="text-sm text-[#a1a1aa]">No invoices found</p>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="mt-2 text-sm text-[#008070] hover:underline disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sync from Stripe'}
        </button>
      </div>
    )
  }

  const displayInvoices = expanded ? invoices : invoices.slice(0, limit)

  return (
    <div className="space-y-4">
      {/* Totals */}
      {showTotals && totals && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[#171717] p-3">
            <div className="text-xs text-[#a1a1aa]">Total Invoiced</div>
            <div className="text-lg font-semibold text-[#fafafa]">
              {formatCurrency(totals.totalInvoiced)}
            </div>
          </div>
          <div className="rounded-lg bg-[#171717] p-3">
            <div className="text-xs text-[#a1a1aa]">Paid</div>
            <div className="text-lg font-semibold text-emerald-400">
              {formatCurrency(totals.totalPaid)}
            </div>
          </div>
          <div className="rounded-lg bg-[#171717] p-3">
            <div className="text-xs text-[#a1a1aa]">Outstanding</div>
            <div className={`text-lg font-semibold ${totals.outstanding > 0 ? 'text-amber-400' : 'text-[#fafafa]'}`}>
              {formatCurrency(totals.outstanding)}
            </div>
          </div>
        </div>
      )}

      {/* Invoice List */}
      <div className="divide-y divide-[#262626]">
        {displayInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} compact />
        ))}
      </div>

      {/* Show more / Sync button */}
      <div className="flex items-center justify-between pt-2">
        {invoices.length > limit && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-[#008070] hover:underline"
          >
            {expanded ? 'Show less' : `Show all ${invoices.length} invoices`}
          </button>
        )}
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-[#fafafa] disabled:opacity-50"
        >
          <RefreshIcon className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>
    </div>
  )
}

function StripeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
    </svg>
  )
}

function RefreshIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}
