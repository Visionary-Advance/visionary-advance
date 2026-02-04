'use client'

// Status badge component for health status display

const STATUS_CONFIG = {
  healthy: {
    label: 'Healthy',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    dotColor: 'bg-green-400',
  },
  degraded: {
    label: 'Degraded',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
  },
  down: {
    label: 'Down',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    dotColor: 'bg-red-400',
  },
  unknown: {
    label: 'Unknown',
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    dotColor: 'bg-gray-400',
  },
}

export default function StatusBadge({ status, size = 'md', showDot = true, showLabel = true }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown

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
        <span className={`${dotSizes[size]} rounded-full ${config.dotColor} animate-pulse`} />
      )}
      {showLabel && config.label}
    </span>
  )
}
