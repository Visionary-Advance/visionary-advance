'use client'

// Every monitored site: filter by status, search, and switch between cards and a table.

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { LayoutGrid, List, Plus, Search, Server } from 'lucide-react'
import { usePersistedState } from '@/lib/usePersistedState'
import {
  Badge, Button, Card, EmptyState, PageHeader, PageLoader, SearchInput, SegmentedControl, Table, Td, Th,
  cx, focusRing, inputClass, useSort,
} from '@/Components/Admin/ui'
import SiteCard from '@/Components/Admin/DevOps/SiteCard'
import StatusBadge, { checkStatus } from '@/Components/Admin/DevOps/StatusBadge'
import { CompactTimeline } from '@/Components/Admin/DevOps/HealthTimeline'
import { devopsApi } from '@/Components/Admin/DevOps/api'
import { ENVIRONMENT, hostOf, timeAgo } from '@/Components/Admin/DevOps/format'

function siteStatus(site) {
  return checkStatus(site.latestCheck) === 'blocked' ? 'blocked' : site.current_status || checkStatus(site.latestCheck)
}

export default function SitesPage() {
  const [sites, setSites] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = usePersistedState('search', '')
  const [status, setStatus] = usePersistedState('status', 'all')
  const [env, setEnv] = usePersistedState('env', '')
  const [view, setView] = usePersistedState('view', 'cards')

  useEffect(() => {
    devopsApi('/api/devops/sites')
      .then(data => setSites(data.sites || []))
      .catch(err => setError(err.message))
  }, [])

  const counts = useMemo(() => {
    const c = { all: sites?.length || 0, healthy: 0, degraded: 0, down: 0, other: 0 }
    for (const s of sites || []) {
      const st = siteStatus(s)
      if (st in c) c[st]++
      else c.other++
    }
    return c
  }, [sites])

  const filtered = useMemo(() => (sites || []).filter(site => {
    const q = search.trim().toLowerCase()
    if (q && !site.name.toLowerCase().includes(q) && !site.url.toLowerCase().includes(q)) return false
    if (env && site.environment !== env) return false
    const st = siteStatus(site)
    if (status === 'other') return !['healthy', 'degraded', 'down'].includes(st)
    return status === 'all' || st === status
  }), [sites, search, env, status])

  const [sorted, thProps] = useSort(filtered, { key: null, dir: 'asc' }, {
    status: s => ({ down: 0, degraded: 1, blocked: 2, unknown: 3, healthy: 4 }[siteStatus(s)] ?? 3),
    response: s => s.latestCheck?.response_time_ms ?? null,
    checked: s => (s.latestCheck?.checked_at ? new Date(s.latestCheck.checked_at).getTime() : null),
  })

  if (error) return <EmptyState icon={Server} title="Couldn't load sites" description={error} />
  if (!sites) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Sites"
        description={`${sites.length} monitored site${sites.length === 1 ? '' : 's'}`}
        actions={<Button variant="primary" icon={Plus} href="/admin/devops/sites/new">Add site</Button>}
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <SegmentedControl
            label="Filter by status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All', count: counts.all },
              { value: 'healthy', label: 'Healthy', count: counts.healthy },
              { value: 'degraded', label: 'Degraded', count: counts.degraded },
              { value: 'down', label: 'Down', count: counts.down },
              ...(counts.other ? [{ value: 'other', label: 'Other', count: counts.other }] : []),
            ]}
          />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search sites" icon={Search} className="flex-1 lg:max-w-xs" />
          <select value={env} onChange={e => setEnv(e.target.value)} aria-label="Environment" className={cx(inputClass, 'w-auto')}>
            <option value="">All environments</option>
            {Object.entries(ENVIRONMENT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <SegmentedControl
            label="View"
            value={view}
            onChange={setView}
            className="hidden md:inline-flex"
            options={[
              { value: 'cards', label: <><LayoutGrid className="h-4 w-4" aria-hidden /><span className="sr-only">Cards</span></> },
              { value: 'table', label: <><List className="h-4 w-4" aria-hidden /><span className="sr-only">Table</span></> },
            ]}
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState
            icon={Server}
            title={sites.length === 0 ? 'No sites yet' : 'No sites match'}
            description={sites.length === 0 ? 'Add a site and DevOps checks it every 5 minutes.' : 'Try a different filter or search.'}
            action={sites.length === 0 && <Button variant="primary" icon={Plus} href="/admin/devops/sites/new">Add site</Button>}
          />
        </Card>
      ) : view === 'table' ? (
        <>
          <Card className="hidden md:block">
            <Table>
              <thead>
                <tr>
                  <Th {...thProps('status', 'asc')}>Status</Th>
                  <Th>Site</Th>
                  <Th className="hidden lg:table-cell">Last 30 checks</Th>
                  <Th>Environment</Th>
                  <Th align="right" {...thProps('response', 'desc')}>Response</Th>
                  <Th align="right" {...thProps('checked', 'desc')}>Checked</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border">
                {sorted.map(site => (
                  <tr key={site.id} className="hover:bg-adm-raised">
                    <Td><StatusBadge status={siteStatus(site)} /></Td>
                    <Td>
                      <Link href={`/admin/devops/sites/${site.id}`} className={cx('rounded font-medium text-adm-text hover:text-adm-accent', focusRing)}>
                        {site.name}
                      </Link>
                      <span className="block text-xs text-adm-subtle">{hostOf(site.url)}</span>
                    </Td>
                    <Td className="hidden w-48 lg:table-cell"><CompactTimeline checks={site.history} height="h-4" /></Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        <Badge tone={ENVIRONMENT[site.environment]?.tone}>{ENVIRONMENT[site.environment]?.label || 'Production'}</Badge>
                        {site.openIncidentCount > 0 && <Badge tone="bad">{site.openIncidentCount} open</Badge>}
                        {!site.is_active && <Badge>Paused</Badge>}
                      </div>
                    </Td>
                    <Td align="right" numeric className="text-adm-muted">{site.latestCheck?.response_time_ms ? `${site.latestCheck.response_time_ms}ms` : '—'}</Td>
                    <Td align="right" className="whitespace-nowrap text-adm-subtle">{timeAgo(site.latestCheck?.checked_at)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          {/* Phones always get cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {sorted.map(site => <SiteCard key={site.id} site={site} />)}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map(site => <SiteCard key={site.id} site={site} />)}
        </div>
      )}
    </div>
  )
}
