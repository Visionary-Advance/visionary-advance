'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import StatusBadge from '@/Components/Admin/DevOps/StatusBadge'
import SeverityBadge from '@/Components/Admin/DevOps/SeverityBadge'
import CheckHistoryTable from '@/Components/Admin/DevOps/CheckHistoryTable'
import { CompactTimeline } from '@/Components/Admin/DevOps/HealthTimeline'
import { HealthAPITemplateCompact } from '@/Components/Admin/DevOps/HealthAPITemplate'

export default function SiteDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const { loading: authLoading } = useAdminAuth()
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch site
  useEffect(() => {
    fetchSite()
  }, [id])

  async function fetchSite() {
    try {
      const res = await fetch(`/api/devops/sites/${id}`)
      if (res.ok) {
        const data = await res.json()
        setSite(data.site)
      } else if (res.status === 404) {
        router.push('/admin/devops/sites')
      }
    } catch (err) {
      console.error('Error fetching site:', err)
    } finally {
      setLoading(false)
    }
  }

  // Trigger manual check
  async function runCheck() {
    setChecking(true)
    try {
      const res = await fetch(`/api/devops/sites/${id}/check`, { method: 'POST' })
      if (res.ok) {
        await fetchSite() // Refresh data
      }
    } catch (err) {
      console.error('Error running check:', err)
    } finally {
      setChecking(false)
    }
  }

  // Delete site
  async function deleteSite() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/devops/sites/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/devops/sites')
      }
    } catch (err) {
      console.error('Error deleting site:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Site not found</p>
      </div>
    )
  }

  const status = site.latestCheck?.status || 'unknown'

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/devops/sites"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">{site.name}</h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-gray-400">{site.url}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runCheck}
            disabled={checking}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {checking ? (
              <>
                <span className="animate-spin">
                  <RefreshIcon className="w-4 h-4" />
                </span>
                Checking...
              </>
            ) : (
              <>
                <RefreshIcon className="w-4 h-4" />
                Check Now
              </>
            )}
          </button>
          <Link
            href={`/admin/devops/sites/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-[#171717] border border-[#262626] text-white rounded-lg hover:border-[#404040] transition-colors"
          >
            <EditIcon className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Status Timeline (Last 30 checks)</h2>
        <CompactTimeline checks={site.history} count={30} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Site Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Check */}
          {site.latestCheck && (
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Latest Check</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <StatusBadge status={site.latestCheck.status} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Response Time</p>
                  <p className="text-white font-mono">
                    {site.latestCheck.response_time_ms || 'N/A'}ms
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">HTTP Status</p>
                  <p className="text-white font-mono">
                    {site.latestCheck.http_status_code || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Checked At</p>
                  <p className="text-white text-sm">
                    {new Date(site.latestCheck.checked_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Extended health data */}
              {(site.latestCheck.database_status || site.latestCheck.memory_usage_mb || site.latestCheck.version) && (
                <div className="mt-4 pt-4 border-t border-[#262626] grid grid-cols-3 gap-4">
                  {site.latestCheck.database_status && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Database</p>
                      <p className="text-white">{site.latestCheck.database_status}</p>
                    </div>
                  )}
                  {site.latestCheck.memory_usage_mb && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Memory</p>
                      <p className="text-white font-mono">{site.latestCheck.memory_usage_mb}MB</p>
                    </div>
                  )}
                  {site.latestCheck.version && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Version</p>
                      <p className="text-white font-mono">v{site.latestCheck.version}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Last Incident Summary */}
          {site.lastIncident && (
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Last Incident</h2>
                {site.openIncidentCount > 0 && (
                  <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                    {site.openIncidentCount} open
                  </span>
                )}
              </div>
              <Link
                href={`/admin/devops/incidents/${site.lastIncident.id}`}
                className="block p-4 bg-[#171717] rounded-lg hover:bg-[#262626] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <SeverityBadge severity={site.lastIncident.severity} size="sm" />
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    site.lastIncident.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {site.lastIncident.status}
                  </span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {new Date(site.lastIncident.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-white font-medium">{site.lastIncident.title}</p>
                {site.lastIncident.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{site.lastIncident.description}</p>
                )}
                {site.lastIncident.resolved_at && (
                  <p className="text-green-400 text-xs mt-2">
                    Resolved: {new Date(site.lastIncident.resolved_at).toLocaleString()}
                  </p>
                )}
              </Link>
            </div>
          )}

          {/* Check History */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Check History</h2>
            <CheckHistoryTable checks={site.history?.slice(0, 20)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Site Info */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Site Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">URL</p>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 break-all"
                >
                  {site.url}
                </a>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Environment</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  site.environment === 'production' ? 'bg-red-500/10 text-red-400' :
                  site.environment === 'staging' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {site.environment || 'production'}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">SLA Target</p>
                <p className="text-white font-mono">{site.sla_target || 99.9}%</p>
              </div>
              {site.category && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Category</p>
                  <p className="text-white">{site.category}</p>
                </div>
              )}
              {site.owner_email && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Owner</p>
                  <p className="text-white">{site.owner_email}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-1">Check Interval</p>
                <p className="text-white">{site.check_interval_minutes || 5} minutes</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">SSL Check</p>
                <p className="text-white">{site.ssl_check_enabled ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Active</p>
                <p className="text-white">{site.is_active ? 'Yes' : 'No'}</p>
              </div>

              {/* Health URL */}
              <div className="pt-4 border-t border-[#262626]">
                <p className="text-gray-400 text-sm mb-1">Health Endpoint</p>
                {site.health_url ? (
                  <a
                    href={site.health_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 break-all text-sm"
                  >
                    {site.health_url}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">{site.url}/api/health (default)</p>
                )}
              </div>

              {/* External Monitor Link */}
              {site.monitor_link && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">External Monitor</p>
                  <a
                    href={site.monitor_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
                  >
                    <ExternalLinkIcon className="w-3 h-3" />
                    View Dashboard
                  </a>
                </div>
              )}

              {/* CRM Link */}
              {site.crm_lead_id && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">CRM Lead</p>
                  <Link
                    href={`/admin/crm/leads/${site.crm_lead_id}`}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
                  >
                    <UserIcon className="w-3 h-3" />
                    View Lead
                  </Link>
                </div>
              )}

              {/* Copy Health API Button */}
              <div className="pt-4 border-t border-[#262626]">
                <p className="text-gray-400 text-sm mb-2">API Template</p>
                <HealthAPITemplateCompact />
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Incidents</h2>
            {site.incidents?.length === 0 ? (
              <div className="text-center py-4">
                <CheckIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No incidents</p>
              </div>
            ) : (
              <div className="space-y-3">
                {site.incidents?.slice(0, 5).map((incident) => (
                  <Link
                    key={incident.id}
                    href={`/admin/devops/incidents/${incident.id}`}
                    className="block p-3 bg-[#171717] rounded-lg hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={incident.severity} size="sm" />
                      <span className={`text-xs ${
                        incident.status === 'resolved' ? 'text-green-400' : 'text-amber-400'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="text-white text-sm truncate">{incident.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#171717] border border-[#262626] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Site</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <strong className="text-white">{site.name}</strong>?
              This will also delete all health checks and incidents for this site.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteSite}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete Site'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function RefreshIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function EditIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ExternalLinkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}
