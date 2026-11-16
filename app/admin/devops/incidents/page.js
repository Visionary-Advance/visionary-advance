'use client'

// Incidents across all sites. Open ones by default.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CircleCheck, Siren } from 'lucide-react'
import { usePersistedState } from '@/lib/usePersistedState'
import { Button, Card, EmptyState, PageHeader, PageLoader, SegmentedControl, cx, focusRing, inputClass } from '@/Components/Admin/ui'
import SeverityBadge, { IncidentStatusBadge, SEVERITY } from '@/Components/Admin/DevOps/SeverityBadge'
import { devopsApi } from '@/Components/Admin/DevOps/api'
import { duration, fmtDateTime } from '@/Components/Admin/DevOps/format'

const VIEWS = {
  open: '',
  resolved: 'status=resolved',
  all: 'include_resolved=true',
}

export default function IncidentsPage() {
  const [view, setView] = usePersistedState('view', 'open')
  const [severity, setSeverity] = usePersistedState('severity', '')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    const params = [VIEWS[view] ?? '', severity && `severity=${severity}`, `limit=${limit}`].filter(Boolean).join('&')
    setError(null)
    devopsApi(`/api/devops/incidents?${params}`)
      .then(setData)
      .catch(err => setError(err.message))
  }, [view, severity, limit])

  const incidents = data?.incidents || []

  return (
    <div>
      <PageHeader title="Incidents" description="Downtime, slowdowns and SSL warnings across every site." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SegmentedControl
          label="Show"
          value={view}
          onChange={v => { setView(v); setLimit(50) }}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'resolved', label: 'Resolved' },
            { value: 'all', label: 'All' },
          ]}
        />
        <select value={severity} onChange={e => setSeverity(e.target.value)} aria-label="Severity" className={cx(inputClass, 'w-auto')}>
          <option value="">Any severity</option>
          {Object.entries(SEVERITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {data?.pagination?.total !== undefined && (
          <span className="text-sm text-adm-subtle">{data.pagination.total} total</span>
        )}
      </div>

      {error ? (
        <EmptyState icon={Siren} title="Couldn't load incidents" description={error} />
      ) : !data ? (
        <PageLoader />
      ) : incidents.length === 0 ? (
        <Card>
          <EmptyState
            icon={view === 'open' ? CircleCheck : Siren}
            title={view === 'open' ? 'No open incidents' : 'No incidents'}
            description={view === 'open' ? 'Every site is behaving.' : 'Nothing matches these filters.'}
          />
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-adm-border">
            {incidents.map(incident => (
              <li key={incident.id}>
                <Link
                  href={`/admin/devops/incidents/${incident.id}`}
                  className={cx('flex items-center gap-3 px-4 py-3 hover:bg-adm-raised sm:px-5', focusRing)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex flex-wrap items-center gap-1.5">
                      <SeverityBadge severity={incident.severity} />
                      <IncidentStatusBadge status={incident.status} />
                    </span>
                    <span className="block truncate text-sm font-medium text-adm-text">{incident.title}</span>
                    <span className="block truncate text-xs text-adm-subtle">
                      {incident.devops_sites?.name || 'Unknown site'} · {fmtDateTime(incident.created_at)}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-xs text-adm-subtle">Duration</span>
                    <span className="block text-sm tabular-nums text-adm-text">
                      {duration(incident.started_at || incident.created_at, incident.resolved_at)}
                    </span>
                  </span>
                  <ChevronRight className="hidden h-4 w-4 shrink-0 text-adm-subtle sm:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          {data.pagination?.hasMore && (
            <div className="border-t border-adm-border p-3 text-center">
              <Button size="sm" variant="ghost" onClick={() => setLimit(l => l + 50)}>Show more</Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
