'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import StatusBadge from '@/Components/Admin/DevOps/StatusBadge'
import SeverityBadge from '@/Components/Admin/DevOps/SeverityBadge'
import SiteCard from '@/Components/Admin/DevOps/SiteCard'

export default function DevOpsDashboardPage() {
  const { user, loading: authLoading } = useAdminAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  // Fetch stats
  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/devops/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  // Trigger manual check for all sites
  async function runAllChecks() {
    setChecking(true)
    try {
      const res = await fetch('/api/cron/devops-health', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'manual-trigger'}`,
        },
      })
      if (res.ok) {
        // Refresh stats after checks
        await fetchStats()
      }
    } catch (err) {
      console.error('Error running checks:', err)
    } finally {
      setChecking(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  const overview = stats?.overview || {}
  const sites = stats?.sites || []
  const incidents = stats?.incidents || []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">DevOps Dashboard</h1>
          <p className="text-gray-400">Monitor client website health</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runAllChecks}
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
                Check All
              </>
            )}
          </button>
          <Link
            href="/admin/devops/sites/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#171717] border border-[#262626] text-white rounded-lg hover:border-[#404040] transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Site
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Sites"
          value={overview.totalSites || 0}
          icon={<ServerIcon className="w-5 h-5" />}
        />
        <StatCard
          label="Healthy"
          value={overview.healthy || 0}
          icon={<CheckIcon className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Degraded"
          value={overview.degraded || 0}
          icon={<WarningIcon className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          label="Down"
          value={overview.down || 0}
          icon={<XIcon className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          label="Uptime (24h)"
          value={`${overview.uptimePercent || 100}%`}
          icon={<ChartIcon className="w-5 h-5" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Site Status Grid */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Site Status</h2>
              <Link
                href="/admin/devops/sites"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                View All
              </Link>
            </div>

            {sites.length === 0 ? (
              <div className="text-center py-12">
                <ServerIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No sites configured yet</p>
                <Link
                  href="/admin/devops/sites/new"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Add your first site
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sites.slice(0, 6).map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Open Incidents */}
        <div>
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Open Incidents</h2>
              <Link
                href="/admin/devops/incidents"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                View All
              </Link>
            </div>

            {incidents.length === 0 ? (
              <div className="text-center py-8">
                <CheckIcon className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-gray-400">No open incidents</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.slice(0, 5).map((incident) => (
                  <Link
                    key={incident.id}
                    href={`/admin/devops/incidents/${incident.id}`}
                    className="block p-3 bg-[#171717] rounded-lg border border-[#262626] hover:border-[#404040] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={incident.severity} size="sm" />
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(incident.created_at)}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {incident.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {incident.devops_sites?.name || 'Unknown site'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg Response Time</span>
                <span className="text-white font-mono">{overview.avgResponseTime || 0}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Open Incidents</span>
                <span className="text-white">{overview.openIncidents || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Sites Monitored</span>
                <span className="text-white">{overview.totalSites || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color = 'purple' }) {
  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    green: 'bg-green-500/20 text-green-400',
    amber: 'bg-amber-500/20 text-amber-400',
    red: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// Icons
function RefreshIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function WarningIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  )
}
