'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import SeverityBadge from '@/Components/Admin/DevOps/SeverityBadge'
import StatusBadge from '@/Components/Admin/DevOps/StatusBadge'

const INCIDENT_STATUSES = ['open', 'investigating', 'identified', 'monitoring', 'resolved']

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  investigating: { label: 'Investigating', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  identified: { label: 'Identified', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  monitoring: { label: 'Monitoring', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  resolved: { label: 'Resolved', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
}

export default function IncidentDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAdminAuth()
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState('')

  // Fetch incident
  useEffect(() => {
    fetchIncident()
  }, [id])

  async function fetchIncident() {
    try {
      const res = await fetch(`/api/devops/incidents/${id}`)
      if (res.ok) {
        const data = await res.json()
        setIncident(data.incident)
        setResolutionNotes(data.incident.resolution_notes || '')
      } else if (res.status === 404) {
        router.push('/admin/devops/incidents')
      }
    } catch (err) {
      console.error('Error fetching incident:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update status
  async function updateStatus(newStatus) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/devops/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolution_notes: resolutionNotes || undefined,
          acknowledged_by: user?.email,
        }),
      })

      if (res.ok) {
        await fetchIncident()
      }
    } catch (err) {
      console.error('Error updating incident:', err)
    } finally {
      setUpdating(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Incident not found</p>
      </div>
    )
  }

  const site = incident.devops_sites
  const statusConfig = STATUS_CONFIG[incident.status] || STATUS_CONFIG.open

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleString()
  }

  const formatDuration = (startStr, endStr) => {
    if (!startStr) return 'N/A'
    const start = new Date(startStr)
    const end = endStr ? new Date(endStr) : new Date()
    const diffMs = end - start
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) return `${diffMins} minutes`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ${diffHours % 24}h`
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/devops/incidents"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <SeverityBadge severity={incident.severity} />
            <span className={`text-sm px-3 py-1 rounded-full border ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{incident.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-wrap">
              {incident.description || 'No description provided'}
            </p>
          </div>

          {/* Status Update */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Update Status</h2>

            {/* Status progression */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {INCIDENT_STATUSES.map((status, index) => {
                const config = STATUS_CONFIG[status]
                const isActive = incident.status === status
                const isPast = INCIDENT_STATUSES.indexOf(incident.status) > index

                return (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={updating || isActive}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? config.color + ' border'
                        : isPast
                        ? 'bg-[#262626] text-gray-400'
                        : 'bg-[#171717] text-gray-400 hover:bg-[#262626] hover:text-white'
                    }`}
                  >
                    {config.label}
                  </button>
                )
              })}
            </div>

            {/* Resolution notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resolution Notes
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about the resolution..."
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
              {resolutionNotes !== incident.resolution_notes && (
                <button
                  onClick={() => updateStatus(incident.status)}
                  disabled={updating}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Incident Details */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Site</p>
                {site ? (
                  <Link
                    href={`/admin/devops/sites/${site.id}`}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {site.name}
                  </Link>
                ) : (
                  <p className="text-white">Unknown</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Incident Type</p>
                <p className="text-white capitalize">{incident.incident_type?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Created</p>
                <p className="text-white">{formatTime(incident.created_at)}</p>
              </div>
              {incident.started_at && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Started</p>
                  <p className="text-white">{formatTime(incident.started_at)}</p>
                </div>
              )}
              {incident.resolved_at && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Resolved</p>
                  <p className="text-white">{formatTime(incident.resolved_at)}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-1">Duration</p>
                <p className="text-white font-mono">
                  {formatDuration(incident.started_at || incident.created_at, incident.resolved_at)}
                </p>
              </div>
              {incident.acknowledged_at && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Acknowledged</p>
                  <p className="text-white">
                    {formatTime(incident.acknowledged_at)}
                    {incident.acknowledged_by && (
                      <span className="text-gray-400"> by {incident.acknowledged_by}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Site Status */}
          {site && (
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Affected Site</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Environment</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    site.environment === 'production' ? 'bg-red-500/10 text-red-400' :
                    site.environment === 'staging' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {site.environment || 'production'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">URL</p>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-sm break-all"
                  >
                    {site.url}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}
