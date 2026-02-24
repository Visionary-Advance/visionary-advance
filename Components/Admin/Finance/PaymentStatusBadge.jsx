'use client'

import { PAYMENT_STATUSES } from '@/lib/finance'

export default function PaymentStatusBadge({ status, size = 'md', showDot = true, showLabel = true }) {
  const config = PAYMENT_STATUSES[status] || PAYMENT_STATUSES.due

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span className={`${dotSizes[size]} rounded-full ${config.dotColor}`} />
      )}
      {showLabel && config.label}
    </span>
  )
}
