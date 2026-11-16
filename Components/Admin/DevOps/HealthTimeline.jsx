'use client'

// Uptime strip: one bar per check, oldest on the left, stretched to the container width.

import { STATUS, checkStatus } from './StatusBadge'
import { cx } from '@/Components/Admin/ui'

export function CompactTimeline({ checks, count = 30, className, height = 'h-6' }) {
  // API history is newest first
  const recent = (checks || []).slice(0, count).reverse()
  const padded = [...Array.from({ length: Math.max(0, count - recent.length) }), ...recent]

  return (
    <div className={cx('flex gap-[2px]', className)} role="img" aria-label={timelineLabel(recent)}>
      {padded.map((check, i) => {
        const status = check ? checkStatus(check) : null
        return (
          <span
            key={check?.id || `empty-${i}`}
            className={cx('min-w-[2px] flex-1 rounded-[2px]', height, status ? STATUS[status]?.bar || STATUS.unknown.bar : 'bg-adm-raised')}
            title={check ? `${STATUS[status]?.label || status} · ${new Date(check.checked_at).toLocaleString()}${check.response_time_ms ? ` · ${check.response_time_ms}ms` : ''}` : 'No data'}
          />
        )
      })}
    </div>
  )
}

function timelineLabel(checks) {
  if (!checks.length) return 'No checks yet'
  const healthy = checks.filter(c => c.status === 'healthy').length
  return `${healthy} of the last ${checks.length} checks healthy`
}

export default CompactTimeline
