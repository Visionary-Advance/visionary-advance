'use client'

// DevOps overview: what needs you first (PRs to approve, open incidents), then
// the health of every site.

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CircleCheck, GitPullRequest, Plus, RefreshCw, Server, Siren } from 'lucide-react'
import {
  Button, Card, CardHeader, EmptyState, PageHeader, PageLoader, Skeleton, StatTile, cx, focusRing, useToast,
} from '@/Components/Admin/ui'
import SiteCard from '@/Components/Admin/DevOps/SiteCard'
import SeverityBadge from '@/Components/Admin/DevOps/SeverityBadge'
import { devopsApi } from '@/Components/Admin/DevOps/api'
import { usePullToRefresh } from '@/Components/Admin/PullToRefresh'
import { timeAgo } from '@/Components/Admin/DevOps/format'

export default function DevOpsOverviewPage() {
  const notify = useToast()
  const [stats, setStats] = useState(null)
  const [sites, setSites] = useState(null)
  const [approvals, setApprovals] = useState(null)
  const [error, setError] = useState(null)
  const [checking, setChecking] = useState(false)

  const load = useCallback(async () => {
    try {
      const [s, list] = await Promise.all([
        devopsApi('/api/devops/stats'),
        devopsApi('/api/devops/sites?is_active=true'),
      ])
      setStats(s)
      setSites(list.sites || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
    // GitHub-backed, so it loads after the rest
    devopsApi('/api/devops/approvals')
      .then(data => setApprovals(data.items || []))
      .catch(() => setApprovals([]))
  }, [])

  useEffect(() => { load() }, [load])
  usePullToRefresh(load)

  async function runAllChecks() {
    setChecking(true)
    try {
      await devopsApi('/api/devops/check-all', { method: 'POST' })
      await load()
      notify('All sites checked', 'success')
    } catch (err) {
      notify(`Checks failed: ${err.message}`, 'error')
    } finally {
      setChecking(false)
    }
  }

  if (error && !stats) {
    return <EmptyState icon={Server} title="Couldn't load DevOps" description={error} action={<Button onClick={load}>Try again</Button>} />
  }
  if (!stats || !sites) return <PageLoader />

  const o = stats.overview || {}
  const incidents = stats.incidents || []
  const problemSites = [...sites].sort((a, b) => rank(a) - rank(b))

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Client site health, open incidents and PRs waiting for you."
        actions={
          <>
            <Button icon={RefreshCw} onClick={runAllChecks} loading={checking}>{checking ? 'Checking…' : 'Check all'}</Button>
            <Button variant="primary" icon={Plus} href="/admin/devops/sites/new">Add site</Button>
          </>
        }
      />

      <NeedsAttention approvals={approvals} incidents={incidents} />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Sites up" value={`${o.healthy || 0} / ${o.totalSites || 0}`} href="/admin/devops/sites" />
        <StatTile label="Degraded" value={o.degraded || 0} hint={o.degraded ? 'Slow or erroring' : null} />
        <StatTile label="Down" value={o.down || 0} />
        <StatTile label="Avg response" value={o.avgResponseTime ? `${o.avgResponseTime}ms` : '—'} hint="Latest checks" />
      </div>

      <Card>
        <CardHeader
          title="Sites"
          description="Last 30 checks for each site. Problems first."
          actions={<Button size="sm" variant="ghost" href="/admin/devops/sites">All sites</Button>}
        />
        {problemSites.length === 0 ? (
          <EmptyState
            icon={Server}
            title="No sites monitored yet"
            description="Add a site and DevOps checks it every 5 minutes."
            action={<Button variant="primary" icon={Plus} href="/admin/devops/sites/new">Add site</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {problemSites.map(site => <SiteCard key={site.id} site={site} />)}
          </div>
        )}
      </Card>
    </div>
  )
}

// Down first, then degraded, then sites with open incidents
function rank(site) {
  const order = { down: 0, degraded: 1, unknown: 3, healthy: 4 }
  return (order[site.current_status || site.latestCheck?.status] ?? 3) - (site.openIncidentCount > 0 ? 0.5 : 0)
}

function NeedsAttention({ approvals, incidents }) {
  const loadingApprovals = approvals === null
  const items = [
    ...(approvals || []).map(a => ({
      key: `pr-${a.task.id}`,
      href: `/admin/devops/approvals?task=${a.task.id}`,
      icon: GitPullRequest,
      iconClass: 'text-adm-accent',
      title: a.task.title,
      meta: `PR to approve · ${a.task.plan?.site?.display_name || a.repo}`,
    })),
    ...incidents.map(i => ({
      key: `inc-${i.id}`,
      href: `/admin/devops/incidents/${i.id}`,
      icon: Siren,
      iconClass: 'text-adm-bad',
      title: i.title,
      meta: `Incident · ${timeAgo(i.created_at)}`,
      badge: <SeverityBadge severity={i.severity} />,
    })),
  ]

  return (
    <Card className="mb-6">
      <CardHeader title="Needs attention" />
      {items.length === 0 && !loadingApprovals ? (
        <div className="flex items-center gap-3 px-5 py-4 text-sm text-adm-muted">
          <CircleCheck className="h-5 w-5 text-adm-good" aria-hidden />
          All clear. No PRs waiting and no open incidents.
        </div>
      ) : (
        <ul className="divide-y divide-adm-border">
          {items.map(item => (
            <li key={item.key}>
              <Link href={item.href} className={cx('flex min-h-[56px] items-center gap-3 px-5 py-3 hover:bg-adm-raised', focusRing)}>
                <item.icon className={cx('h-5 w-5 shrink-0', item.iconClass)} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-adm-text">{item.title}</span>
                  <span className="block truncate text-xs text-adm-subtle">{item.meta}</span>
                </span>
                {item.badge}
                <ChevronRight className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
              </Link>
            </li>
          ))}
          {loadingApprovals && (
            <li className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-48" />
            </li>
          )}
        </ul>
      )}
    </Card>
  )
}
