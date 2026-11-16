'use client'

import Link from 'next/link'
import { cx, focusRing } from '@/Components/Admin/ui'
import StatusBadge, { checkStatus } from './StatusBadge'
import { CompactTimeline } from './HealthTimeline'
import { hostOf, timeAgo } from './format'

// One monitored site: status, last 30 checks, response time.
export default function SiteCard({ site }) {
  const status = checkStatus(site.latestCheck) === 'blocked' ? 'blocked' : site.current_status || checkStatus(site.latestCheck)
  const ms = site.latestCheck?.response_time_ms

  return (
    <Link
      href={`/admin/devops/sites/${site.id}`}
      className={cx('block rounded-xl border border-adm-border bg-adm-surface p-4 transition-colors hover:border-adm-border-strong', focusRing)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-adm-text">{site.name}</p>
          <p className="truncate text-sm text-adm-subtle">{hostOf(site.url)}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      {site.history && <CompactTimeline checks={site.history} count={30} className="mt-3" height="h-5" />}
      <div className="mt-3 flex items-center justify-between text-xs text-adm-subtle">
        <span className="tabular-nums">{ms ? `${ms}ms` : '—'}</span>
        <span>
          {site.openIncidentCount > 0 && <span className="mr-2 font-medium text-adm-bad">{site.openIncidentCount} open</span>}
          {timeAgo(site.latestCheck?.checked_at)}
        </span>
      </div>
    </Link>
  )
}
