'use client'

import { formatCurrency } from '@/lib/finance'

export default function DeadlineAlert({ deadlines }) {
  if (!deadlines || deadlines.length === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
          <AlertIcon className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-amber-400">Upcoming Tax Deadlines</h3>
          <div className="mt-2 space-y-1">
            {deadlines.map((d) => (
              <p key={d.quarter} className="text-sm text-amber-300/80">
                Q{d.quarter} estimated payment of {formatCurrency(d.amountDue)} due {d.deadline}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}
