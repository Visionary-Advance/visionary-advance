'use client'

import { EXPENSE_CATEGORIES } from '@/lib/finance'

export default function CategoryBadge({ category, size = 'md' }) {
  const config = EXPENSE_CATEGORIES[category] || { label: category, color: '#94a3b8', scheduleC: '' }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  )
}
