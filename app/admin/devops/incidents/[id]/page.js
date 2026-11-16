'use client'

// One incident: move it through open → resolved, keep notes, see the affected site.

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, CircleCheck, ExternalLink, Siren } from 'lucide-react'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import { Button, Card, CardHeader, EmptyState, Field, PageHeader, PageLoader, cx, focusRing, inputClass, useToast } from '@/Components/Admin/ui'
import SeverityBadge, { INCIDENT_STATUS, INCIDENT_STATUS_ORDER, IncidentStatusBadge } from '@/Components/Admin/DevOps/SeverityBadge'
import { devopsApi } from '@/Components/Admin/DevOps/api'
import { duration, fmtDateTime, hostOf } from '@/Components/Admin/DevOps/format'

export default function IncidentDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const notify = useToast()
  const { user } = useAdminAuth()
  const [incident, setIncident] = useState(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(null)

  const load = useCallback(async () => {
    try {
      const data = await devopsApi(`/api/devops/incidents/${id}`)
      setIncident(data.incident)
      setNotes(data.incident.resolution_notes || '')
    } catch (err) {
      if (err.status === 404) router.push('/admin/devops/incidents')
      else setError(err.message)
    }
  }, [id, router])

  useEffect(() => { load() }, [load])

  async function update(status, label) {
    setBusy(status)
    try {
      await devopsApi(`/api/devops/incidents/${id}`, {
        method: 'PATCH',
        body: { status, resolution_notes: notes || undefined, acknowledged_by: user?.email },
      })
      await load()
      notify(label || `Marked ${INCIDENT_STATUS[status]?.label.toLowerCase()}`, 'success')
    } catch (err) {
      notify(`Update failed: ${err.message}`, 'error')
    } finally {
      setBusy(null)
    }
  }

  if (error) return <EmptyState icon={Siren} title="Couldn't load this incident" description={error} />
  if (!incident) return <PageLoader />

  const site = incident.devops_sites
  const resolved = incident.status === 'resolved'
  const notesChanged = notes !== (incident.resolution_notes || '')

  return (
    <div className="max-w-5xl">
      <PageHeader
        breadcrumbs={[{ label: 'Incidents', href: '/admin/devops/incidents' }, { label: site?.name || 'Incident' }]}
        title={incident.title}
        meta={
          <>
            <SeverityBadge severity={incident.severity} />
            <IncidentStatusBadge status={incident.status} />
            <span>{duration(incident.started_at || incident.created_at, incident.resolved_at)}{resolved ? '' : ' so far'}</span>
          </>
        }
        actions={!resolved && (
          <Button variant="primary" icon={CircleCheck} loading={busy === 'resolved'} onClick={() => update('resolved', 'Incident resolved')}>
            Resolve
          </Button>
        )}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="What happened" />
            <p className="whitespace-pre-wrap p-5 text-sm text-adm-muted">{incident.description || 'No description.'}</p>
          </Card>

          <Card>
            <CardHeader title="Status" description="Tap a step to move the incident there." />
            <div className="p-5">
              <ol className="scrollbar-hide -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {INCIDENT_STATUS_ORDER.map((status, i) => {
                  const current = incident.status === status
                  const past = INCIDENT_STATUS_ORDER.indexOf(incident.status) > i
                  const s = INCIDENT_STATUS[status]
                  return (
                    <li key={status} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => update(status)}
                        disabled={current || !!busy}
                        aria-current={current ? 'step' : undefined}
                        className={cx(
                          'flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors cursor-pointer disabled:cursor-default',
                          current ? 'border-teal-500/30 bg-teal-500/10 text-adm-accent'
                            : past ? 'border-adm-border bg-adm-raised text-adm-subtle'
                            : 'border-adm-border bg-adm-surface text-adm-muted hover:bg-adm-raised hover:text-adm-text',
                          focusRing
                        )}
                      >
                        {past ? <Check className="h-4 w-4" aria-hidden /> : <s.icon className="h-4 w-4" aria-hidden />}
                        {s.label}
                      </button>
                    </li>
                  )
                })}
              </ol>

              <Field label="Notes" htmlFor="incident-notes" className="mt-5" hint="Saved with the next status change, or on its own.">
                <textarea
                  id="incident-notes"
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="What caused it and what fixed it"
                  className={cx(inputClass, 'resize-y')}
                />
              </Field>
              {notesChanged && (
                <Button className="mt-3" size="sm" loading={busy === incident.status} onClick={() => update(incident.status, 'Notes saved')}>
                  Save notes
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Details" />
            <dl className="space-y-4 p-5 text-sm">
              <Fact label="Type" value={<span className="capitalize">{incident.incident_type?.replace(/_/g, ' ')}</span>} />
              <Fact label="Opened" value={fmtDateTime(incident.created_at)} />
              {incident.acknowledged_at && (
                <Fact label="Acknowledged" value={`${fmtDateTime(incident.acknowledged_at)}${incident.acknowledged_by ? ` by ${incident.acknowledged_by}` : ''}`} />
              )}
              {incident.resolved_at && <Fact label="Resolved" value={fmtDateTime(incident.resolved_at)} />}
            </dl>
          </Card>

          {site && (
            <Card>
              <CardHeader title="Affected site" />
              <div className="space-y-2 p-5 text-sm">
                <Link href={`/admin/devops/sites/${site.id}`} className={cx('block rounded font-medium text-adm-text hover:text-adm-accent', focusRing)}>
                  {site.name}
                </Link>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 rounded text-adm-muted hover:text-adm-text', focusRing)}>
                  {hostOf(site.url)} <ExternalLink className="h-3.5 w-3.5" aria-hidden /><span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-adm-subtle">{label}</dt>
      <dd className="mt-0.5 text-adm-text">{value}</dd>
    </div>
  )
}
