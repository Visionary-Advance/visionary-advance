'use client'

import Link from 'next/link'
import StatusBadge from './StatusBadge'

// Environment badge colors
const ENV_COLORS = {
  production: 'bg-red-500/10 text-red-400',
  staging: 'bg-amber-500/10 text-amber-400',
  development: 'bg-blue-500/10 text-blue-400',
}

export default function SiteCard({ site, compact = false }) {
  const { id, name, url, environment, category, latestCheck } = site
  const status = latestCheck?.status || 'unknown'
  const responseTime = latestCheck?.response_time_ms
  const lastChecked = latestCheck?.checked_at

  // Format last checked time
  const formatLastChecked = (dateStr) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  // Get domain from URL
  const getDomain = (urlStr) => {
    try {
      return new URL(urlStr).hostname
    } catch {
      return urlStr
    }
  }

  if (compact) {
    return (
      <Link
        href={`/admin/devops/sites/${id}`}
        className="flex items-center justify-between p-3 bg-[#171717] rounded-lg border border-[#262626] hover:border-[#404040] transition-colors"
      >
        <div className="flex items-center gap-3">
          <StatusBadge status={status} size="sm" showLabel={false} />
          <div>
            <div className="text-white font-medium text-sm">{name}</div>
            <div className="text-gray-500 text-xs">{getDomain(url)}</div>
          </div>
        </div>
        {responseTime && (
          <div className="text-gray-400 text-xs">{responseTime}ms</div>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={`/admin/devops/sites/${id}`}
      className="block p-4 bg-[#171717] rounded-lg border border-[#262626] hover:border-[#404040] transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          {environment && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${ENV_COLORS[environment] || ENV_COLORS.production}`}>
              {environment}
            </span>
          )}
        </div>
        {category && (
          <span className="text-xs text-gray-500 bg-[#262626] px-2 py-0.5 rounded">
            {category}
          </span>
        )}
      </div>

      <h3 className="text-white font-semibold mb-1">{name}</h3>
      <p className="text-gray-400 text-sm truncate mb-3">{getDomain(url)}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {responseTime ? `${responseTime}ms` : 'N/A'}
        </span>
        <span>
          {formatLastChecked(lastChecked)}
        </span>
      </div>
    </Link>
  )
}
