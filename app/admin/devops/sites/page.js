'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import StatusBadge from '@/Components/Admin/DevOps/StatusBadge'
import SiteCard from '@/Components/Admin/DevOps/SiteCard'

export default function SitesListPage() {
  const { loading: authLoading } = useAdminAuth()
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [envFilter, setEnvFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  // Fetch sites
  useEffect(() => {
    fetchSites()
  }, [envFilter])

  async function fetchSites() {
    try {
      const params = new URLSearchParams()
      if (envFilter) params.set('environment', envFilter)

      const res = await fetch(`/api/devops/sites?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSites(data.sites || [])
      }
    } catch (err) {
      console.error('Error fetching sites:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter sites by search and status
  const filteredSites = sites.filter((site) => {
    const matchesSearch = !searchTerm ||
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter ||
      site.latestCheck?.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Count by status
  const statusCounts = sites.reduce(
    (acc, site) => {
      const status = site.latestCheck?.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { healthy: 0, degraded: 0, down: 0, unknown: 0 }
  )

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
          <h1 className="text-2xl font-bold text-white">Sites</h1>
          <p className="text-gray-400">Manage monitored websites</p>
        </div>
        <Link
          href="/admin/devops/sites/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Site
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <StatusTab
          label="All"
          count={sites.length}
          active={!statusFilter}
          onClick={() => setStatusFilter('')}
        />
        <StatusTab
          label="Healthy"
          count={statusCounts.healthy}
          active={statusFilter === 'healthy'}
          onClick={() => setStatusFilter('healthy')}
          color="green"
        />
        <StatusTab
          label="Degraded"
          count={statusCounts.degraded}
          active={statusFilter === 'degraded'}
          onClick={() => setStatusFilter('degraded')}
          color="amber"
        />
        <StatusTab
          label="Down"
          count={statusCounts.down}
          active={statusFilter === 'down'}
          onClick={() => setStatusFilter('down')}
          color="red"
        />
        <StatusTab
          label="Unknown"
          count={statusCounts.unknown}
          active={statusFilter === 'unknown'}
          onClick={() => setStatusFilter('unknown')}
          color="gray"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={envFilter}
          onChange={(e) => setEnvFilter(e.target.value)}
          className="px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">All Environments</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="development">Development</option>
        </select>
        <div className="flex items-center gap-1 bg-[#171717] border border-[#262626] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#262626] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <GridIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded ${viewMode === 'table' ? 'bg-[#262626] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sites */}
      {filteredSites.length === 0 ? (
        <div className="text-center py-12 bg-[#0a0a0a] border border-[#262626] rounded-lg">
          <ServerIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            {sites.length === 0 ? 'No sites configured yet' : 'No sites match your filters'}
          </p>
          {sites.length === 0 && (
            <Link
              href="/admin/devops/sites/new"
              className="text-purple-400 hover:text-purple-300"
            >
              Add your first site
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-[#262626]">
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">URL</th>
                <th className="p-4 font-medium">Environment</th>
                <th className="p-4 font-medium">Response</th>
                <th className="p-4 font-medium">Last Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredSites.map((site) => (
                <SiteTableRow key={site.id} site={site} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatusTab({ label, count, active, onClick, color }) {
  const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2'
  const activeClasses = 'bg-[#262626] text-white'
  const inactiveClasses = 'text-gray-400 hover:bg-[#171717] hover:text-white'

  const dotColors = {
    green: 'bg-green-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    gray: 'bg-gray-400',
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      {color && <span className={`w-2 h-2 rounded-full ${dotColors[color]}`} />}
      {label}
      <span className="text-gray-500">({count})</span>
    </button>
  )
}

function SiteTableRow({ site }) {
  const status = site.latestCheck?.status || 'unknown'
  const responseTime = site.latestCheck?.response_time_ms
  const lastChecked = site.latestCheck?.checked_at

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  const getDomain = (urlStr) => {
    try {
      return new URL(urlStr).hostname
    } catch {
      return urlStr
    }
  }

  return (
    <tr className="hover:bg-[#171717] transition-colors">
      <td className="p-4">
        <StatusBadge status={status} size="sm" />
      </td>
      <td className="p-4">
        <Link href={`/admin/devops/sites/${site.id}`} className="text-white font-medium hover:text-purple-400">
          {site.name}
        </Link>
      </td>
      <td className="p-4 text-gray-400 text-sm">
        {getDomain(site.url)}
      </td>
      <td className="p-4">
        <span className={`text-xs px-2 py-1 rounded ${
          site.environment === 'production' ? 'bg-red-500/10 text-red-400' :
          site.environment === 'staging' ? 'bg-amber-500/10 text-amber-400' :
          'bg-blue-500/10 text-blue-400'
        }`}>
          {site.environment || 'production'}
        </span>
      </td>
      <td className="p-4 font-mono text-sm text-gray-300">
        {responseTime ? `${responseTime}ms` : 'N/A'}
      </td>
      <td className="p-4 text-gray-400 text-sm">
        {formatTime(lastChecked)}
      </td>
    </tr>
  )
}

// Icons
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function GridIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function TableIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function ServerIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
    </svg>
  )
}
