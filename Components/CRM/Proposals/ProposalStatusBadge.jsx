'use client'

const STATUS_CONFIG = {
  draft: { label: 'Draft', bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' },
  sent: { label: 'Sent', bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20' },
  viewed: { label: 'Viewed', bg: 'bg-violet-500/10', text: 'text-violet-400', ring: 'ring-violet-500/20' },
  accepted: { label: 'Accepted', bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  rejected: { label: 'Rejected', bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20' },
  expired: { label: 'Expired', bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' },
}

export default function ProposalStatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1 text-sm'
    : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${sizeClasses} ${config.bg} ${config.text} ${config.ring}`}
    >
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
