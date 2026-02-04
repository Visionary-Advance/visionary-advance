'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import SeverityBadge from '@/Components/Admin/DevOps/SeverityBadge'

const INCIDENT_STATUSES = {
  open: { label: 'Open', color: 'text-red-400' },
  investigating: { label: 'Investigating', color: 'text-orange-400' },
  identified: { label: 'Identified', color: 'text-amber-400' },
  monitoring: { label: 'Monitoring', color: 'text-blue-400' },
  resolved: { label: 'Resolved', color: 'text-green-400' },
}

export default function IncidentsPage() {
  const { loading: authLoading } = useAdminAuth()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [includeResolved, setIncludeResolved] = useState(false)

  // Fetch incidents
  useEffect(() => {
    fetchIncidents()
  }, [statusFilter, severityFilter, includeResolved])

  async function fetchIncidents() {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (severityFilter) params.set('severity', severityFilter)
      if (includeResolved) params.set('include_resolved', 'true')

      const res = await fetch(`/api/devops/incidents?${params}`)
      if (res.ok) {
        const data = await res.json()
        setIncidents(data.incidents || [])
      }
    } catch (err) {
      console.error('Error fetching incidents:', err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Incidents</h1>
          <p className="text-gray-400">Monitor and manage incidents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="identified">Identified</option>
          <option value="monitoring">Monitoring</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
          <option value="info">Info</option>
        </select>

        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeResolved}
            onChange={(e) => setIncludeResolved(e.target.checked)}
            className="w-4 h-4 rounded border-[#262626] bg-[#171717] text-purple-600 focus:ring-purple-500"
          />
          Include Resolved
        </label>
      </div>

      {/* Incidents List */}
      {incidents.length === 0 ? (
        <div className="text-center py-12 bg-[#0a0a0a] border border-[#262626] rounded-lg">
          <CheckIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-400">No incidents found</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg divide-y divide-[#262626]">
          {incidents.map((incident) => (
            <IncidentRow key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  )
}

function IncidentRow({ incident }) {
  const statusConfig = INCIDENT_STATUSES[incident.status] || INCIDENT_STATUSES.open
  const site = incident.devops_sites

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

    if (diffMins < 60) return `${diffMins}m`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ${diffHours % 24}h`
  }

  return (
    <Link
      href={`/admin/devops/incidents/${incident.id}`}
      className="block p-4 hover:bg-[#171717] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <SeverityBadge severity={incident.severity} size="sm" />
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className="text-gray-500 text-sm">
              {formatTime(incident.created_at)}
            </span>
          </div>
          <h3 className="text-white font-medium mb-1">{incident.title}</h3>
          <p className="text-gray-400 text-sm">
            {site?.name || 'Unknown site'} - {site?.url || ''}
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">Duration</div>
          <div className="text-white font-mono">
            {formatDuration(incident.started_at || incident.created_at, incident.resolved_at)}
          </div>
        </div>
      </div>
    </Link>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
