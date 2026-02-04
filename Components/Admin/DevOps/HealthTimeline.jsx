'use client'

import StatusBadge from './StatusBadge'

export default function HealthTimeline({ checks, limit = 50 }) {
  if (!checks || checks.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-8">
        No health checks recorded yet
      </div>
    )
  }

  // Group checks by date
  const groupedChecks = checks.slice(0, limit).reduce((groups, check) => {
    const date = new Date(check.checked_at).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(check)
    return groups
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedChecks).map(([date, dateChecks]) => (
        <div key={date}>
          <h4 className="text-gray-400 text-sm font-medium mb-3">{date}</h4>
          <div className="flex flex-wrap gap-1">
            {dateChecks.map((check) => (
              <TimelineBlock key={check.id} check={check} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TimelineBlock({ check }) {
  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-amber-500',
    down: 'bg-red-500',
    unknown: 'bg-gray-500',
  }

  const time = new Date(check.checked_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`group relative w-3 h-8 rounded-sm cursor-pointer ${statusColors[check.status] || statusColors.unknown} opacity-80 hover:opacity-100 transition-opacity`}
      title={`${check.status} at ${time}`}
    >
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
        <div className="bg-[#262626] border border-[#404040] rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={check.status} size="sm" />
          </div>
          <div className="text-gray-400">
            {time}
          </div>
          {check.response_time_ms && (
            <div className="text-gray-400">
              {check.response_time_ms}ms
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Compact timeline for dashboard
export function CompactTimeline({ checks, count = 30 }) {
  const recentChecks = checks?.slice(0, count) || []

  if (recentChecks.length === 0) {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-6 rounded-sm bg-gray-700"
          />
        ))}
      </div>
    )
  }

  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-amber-500',
    down: 'bg-red-500',
    unknown: 'bg-gray-500',
  }

  // Pad with empty blocks if needed
  const paddedChecks = [
    ...Array.from({ length: Math.max(0, count - recentChecks.length) }),
    ...recentChecks,
  ]

  return (
    <div className="flex gap-0.5">
      {paddedChecks.map((check, i) => (
        <div
          key={check?.id || `empty-${i}`}
          className={`w-2 h-6 rounded-sm ${check ? statusColors[check.status] || statusColors.unknown : 'bg-gray-700'}`}
          title={check ? `${check.status} - ${new Date(check.checked_at).toLocaleString()}` : 'No data'}
        />
      ))}
    </div>
  )
}
