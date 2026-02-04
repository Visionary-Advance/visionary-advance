'use client'

// Severity badge component for incident severity display

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
  major: {
    label: 'Major',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
  },
  minor: {
    label: 'Minor',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  info: {
    label: 'Info',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
}

export default function SeverityBadge({ severity, size = 'md', variant = 'filled' }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  if (variant === 'outline') {
    return (
      <span
        className={`inline-flex items-center rounded-full font-medium border ${config.borderColor} ${config.textColor} ${sizeClasses[size]}`}
      >
        {config.label}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  )
}
