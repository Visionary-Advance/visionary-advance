'use client'

import StatusBadge from './StatusBadge'

export default function CheckHistoryTable({ checks, loading = false }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-[#262626] rounded" />
        ))}
      </div>
    )
  }

  if (!checks || checks.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-8">
        No health checks recorded yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-[#262626]">
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Time</th>
            <th className="pb-3 font-medium">Response</th>
            <th className="pb-3 font-medium">HTTP</th>
            <th className="pb-3 font-medium">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262626]">
          {checks.map((check) => (
            <CheckRow key={check.id} check={check} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CheckRow({ check }) {
  const {
    status,
    checked_at,
    response_time_ms,
    http_status_code,
    database_status,
    memory_usage_mb,
    version,
    error_message,
  } = check

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  // Build details string
  const details = []
  if (database_status) details.push(`DB: ${database_status}`)
  if (memory_usage_mb) details.push(`Mem: ${memory_usage_mb}MB`)
  if (version) details.push(`v${version}`)
  if (error_message) details.push(error_message)

  return (
    <tr className="text-sm">
      <td className="py-3">
        <StatusBadge status={status} size="sm" />
      </td>
      <td className="py-3 text-gray-300">
        {formatTime(checked_at)}
      </td>
      <td className="py-3">
        <span className={`font-mono ${getResponseTimeColor(response_time_ms)}`}>
          {response_time_ms ? `${response_time_ms}ms` : 'N/A'}
        </span>
      </td>
      <td className="py-3">
        <span className={`font-mono ${getHttpStatusColor(http_status_code)}`}>
          {http_status_code || 'N/A'}
        </span>
      </td>
      <td className="py-3 text-gray-400 max-w-xs truncate">
        {details.join(' | ') || '-'}
      </td>
    </tr>
  )
}

function getResponseTimeColor(ms) {
  if (!ms) return 'text-gray-500'
  if (ms < 500) return 'text-green-400'
  if (ms < 1500) return 'text-amber-400'
  return 'text-red-400'
}

function getHttpStatusColor(code) {
  if (!code) return 'text-gray-500'
  if (code >= 200 && code < 300) return 'text-green-400'
  if (code >= 300 && code < 400) return 'text-blue-400'
  if (code >= 400 && code < 500) return 'text-amber-400'
  return 'text-red-400'
}
