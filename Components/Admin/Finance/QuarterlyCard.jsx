'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/finance'
import PaymentStatusBadge from './PaymentStatusBadge'

export default function QuarterlyCard({ payment, onMarkPaid }) {
  const [loading, setLoading] = useState(false)

  const handleMarkPaid = async () => {
    setLoading(true)
    try {
      await onMarkPaid(payment)
    } finally {
      setLoading(false)
    }
  }

  const status = payment.isOverdue && payment.status === 'due' ? 'overdue' : payment.status

  return (
    <div className={`rounded-xl border p-5 ${
      status === 'overdue'
        ? 'border-red-500/30 bg-red-500/5'
        : 'border-[#262626] bg-[#0a0a0a]'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#fafafa]">Q{payment.quarter}</h3>
        <PaymentStatusBadge status={status} />
      </div>

      <p className="mt-1 text-sm text-[#525252]">Deadline: {payment.deadline}</p>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#a1a1aa]">Estimated</span>
          <span className="text-[#fafafa]">{formatCurrency(payment.estimated)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a1a1aa]">Amount Due</span>
          <span className="text-[#fafafa]">{formatCurrency(payment.amount_due)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a1a1aa]">Amount Paid</span>
          <span className={payment.amount_paid > 0 ? 'text-green-400' : 'text-[#525252]'}>
            {formatCurrency(payment.amount_paid)}
          </span>
        </div>
      </div>

      {payment.status === 'due' && (
        <button
          onClick={handleMarkPaid}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Mark as Paid'}
        </button>
      )}
    </div>
  )
}
