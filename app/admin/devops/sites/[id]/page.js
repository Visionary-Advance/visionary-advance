'use client'

// One monitored site: status and uptime up top, then the latest check, incidents,
// check history, and the site's settings.

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Pencil, RefreshCw, Server, Trash2, User } from 'lucide-react'
import {
  Badge, Button, Card, CardHeader, ConfirmButton, EmptyState, PageHeader, PageLoader, StatTile, cx, focusRing, useToast,
} from '@/Components/Admin/ui'
import StatusBadge, { checkStatus } from '@/Components/Admin/DevOps/StatusBadge'
import SeverityBadge, { IncidentStatusBadge } from '@/Components/Admin/DevOps/SeverityBadge'
import CheckHistoryTable from '@/Components/Admin/DevOps/CheckHistoryTable'
import { CompactTimeline } from '@/Components/Admin/DevOps/HealthTimeline'
import { HealthAPITemplateCompact } from '@/Components/Admin/DevOps/HealthAPITemplate'
import { devopsApi } from '@/Components/Admin/DevOps/api'
import { ENVIRONMENT, duration, fmtDateTime, hostOf, timeAgo } from '@/Components/Admin/DevOps/format'

export default function SiteDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const notify = useToast()
  const [site, setSite] = useState(null)
  const [error, setError] = useState(null)
  const [checking, setChecking] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await devopsApi(`/api/devops/sites/${id}`)
      setSite(data.site)
    } catch (err) {
      if (err.status === 404) router.push('/admin/devops/sites')
      else setError(err.message)
    }
  }, [id, router])

  useEffect(() => { load() }, [load])

  async function runCheck() {
    setChecking(true)
    try {
      const data = await devopsApi(`/api/devops/sites/${id}/check`, { method: 'POST' })
      if (data.success === false) {
        notify(data.reason || 'Check skipped', 'info')
        return
      }
      await load()
      notify(`Check done: ${checkStatus(data.healthCheck) === 'blocked' ? 'blocked by a firewall' : data.healthCheck?.status || 'complete'}`, 'success')
    } catch (err) {
      notify(`Check failed: ${err.message}`, 'error')
    } finally {
      setChecking(false)
    }
  }

  async function deleteSite() {
    try {
      await devopsApi(`/api/devops/sites/${id}`, { method: 'DELETE' })
      notify(`${site.name} deleted`, 'success')
      router.push('/admin/devops/sites')
    } catch (err) {
      notify(`Delete failed: ${err.message}`, 'error')
    }
  }

  if (error) return <EmptyState icon={Server} title="Couldn't load this site" description={error} action={<Button onClick={load}>Try again</Button>} />
  if (!site) return <PageLoader />

  const latest = site.latestCheck
  const status = checkStatus(latest) === 'blocked' ? 'blocked' : site.current_status || checkStatus(latest)
  const history = site.history || []
  const known = history.filter(c => c.status !== 'unknown')
  const uptime = known.length ? (known.filter(c => c.status === 'healthy').length / known.length) * 100 : null
  const times = history.map(c => c.response_time_ms).filter(Boolean)
  const avgMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Sites', href: '/admin/devops/sites' }, { label: site.name }]}
        title={site.name}
        meta={
          <>
            <StatusBadge status={status} />
            <a href={site.url} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 rounded hover:text-adm-text', focusRing)}>
              {hostOf(site.url)} <ExternalLink className="h-3.5 w-3.5" aria-hidden /><span className="sr-only">(opens in new tab)</span>
            </a>
            <span>Checked {timeAgo(latest?.checked_at)}</span>
            {!site.is_active && <Badge>Paused</Badge>}
          </>
        }
        actions={
          <>
            <Button variant="primary" icon={RefreshCw} onClick={runCheck} loading={checking}>{checking ? 'Checking…' : 'Check now'}</Button>
            <Button icon={Pencil} href={`/admin/devops/sites/${id}/edit`}>Edit</Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label={`Uptime (last ${known.length} checks)`} value={uptime === null ? '—' : `${uptime.toFixed(uptime === 100 ? 0 : 1)}%`} hint={`Target ${site.sla_target || 99.9}%`} />
        <StatTile label="Avg response" value={avgMs ? `${avgMs}ms` : '—'} />
        <StatTile label="Open incidents" value={site.openIncidentCount || 0} />
        <StatTile label="Last check" value={latest?.http_status_code || '—'} hint={latest?.response_time_ms ? `${latest.response_time_ms}ms` : null} />
      </div>

      <Card className="mb-6 p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <h2 className="font-semibold text-adm-text">Last 50 checks</h2>
          <span className="text-xs text-adm-subtle">Oldest → newest</span>
        </div>
        <CompactTimeline checks={history} count={50} height="h-8" />
        {status === 'blocked' && (
          <p className="mt-3 text-xs text-adm-muted">
            The last check was turned away by a firewall (HTTP {latest?.http_status_code}) before reaching the site. Blocked checks don't open incidents.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {latest && (latest.database_status || latest.memory_usage_mb || latest.version || latest.error_message) && (
            <Card>
              <CardHeader title="Latest check" description={fmtDateTime(latest.checked_at)} />
              <dl className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
                {latest.database_status && <Fact label="Database" value={latest.database_status} />}
                {latest.memory_usage_mb && <Fact label="Memory" value={`${latest.memory_usage_mb}MB`} />}
                {latest.version && <Fact label="Version" value={`v${latest.version}`} />}
                {latest.error_message && <Fact label="Error" value={latest.error_message} className="col-span-2" />}
              </dl>
            </Card>
          )}

          <Card>
            <CardHeader title="Incidents" description={site.openIncidentCount ? `${site.openIncidentCount} open` : 'None open'} />
            {site.incidents?.length ? (
              <ul className="divide-y divide-adm-border">
                {site.incidents.slice(0, 8).map(incident => (
                  <li key={incident.id}>
                    <Link href={`/admin/devops/incidents/${incident.id}`} className={cx('flex items-center gap-3 px-5 py-3 hover:bg-adm-raised', focusRing)}>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-adm-text">{incident.title}</span>
                        <span className="block text-xs text-adm-subtle">
                          {fmtDateTime(incident.created_at)} · {duration(incident.started_at || incident.created_at, incident.resolved_at)}
                        </span>
                      </span>
                      <SeverityBadge severity={incident.severity} />
                      <IncidentStatusBadge status={incident.status} className="hidden sm:inline-flex" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-sm text-adm-muted">No incidents recorded.</p>
            )}
          </Card>

          <Card>
            <CardHeader title="Check history" description="Most recent 20" />
            <CheckHistoryTable checks={history.slice(0, 20)} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Settings" actions={<Button size="sm" variant="ghost" icon={Pencil} href={`/admin/devops/sites/${id}/edit`}>Edit</Button>} />
            <dl className="space-y-4 p-5">
              <Fact label="Environment" value={<Badge tone={ENVIRONMENT[site.environment]?.tone}>{ENVIRONMENT[site.environment]?.label || 'Production'}</Badge>} />
              <Fact label="Health endpoint" value={<span className="break-all">{site.health_url || `${site.url.replace(/\/$/, '')}/api/health`}</span>} />
              <Fact label="Checks" value={`Every ${site.check_interval_minutes || 5} min · ${site.timeout_seconds || 30}s timeout`} />
              <Fact label="SSL check" value={site.ssl_check_enabled ? 'On' : 'Off'} />
              {site.category && <Fact label="Category" value={site.category} />}
              {site.owner_email && <Fact label="Owner" value={site.owner_email} />}
              {site.monitor_link && (
                <Fact label="External monitor" value={
                  <a href={site.monitor_link} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 rounded text-adm-accent hover:underline', focusRing)}>
                    Open dashboard <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                } />
              )}
              {site.crm_lead_id && (
                <Fact label="CRM" value={
                  <Link href={`/admin/crm/leads/${site.crm_lead_id}`} className={cx('inline-flex items-center gap-1 rounded text-adm-accent hover:underline', focusRing)}>
                    <User className="h-3.5 w-3.5" aria-hidden /> View lead
                  </Link>
                } />
              )}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Health API template" description="Drop this endpoint into the client's site." />
            <div className="p-5"><HealthAPITemplateCompact /></div>
          </Card>

          <Card>
            <CardHeader title="Danger zone" />
            <div className="space-y-3 p-5">
              <p className="text-sm text-adm-muted">Deleting removes this site with all its checks and incidents.</p>
              <ConfirmButton icon={Trash2} onConfirm={deleteSite} confirmLabel="Tap again to delete">Delete site</ConfirmButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Fact({ label, value, className }) {
  return (
    <div className={cx('min-w-0', className)}>
      <dt className="text-xs text-adm-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm text-adm-text">{value}</dd>
    </div>
  )
}
