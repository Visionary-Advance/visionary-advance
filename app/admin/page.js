// app/admin/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import SettingsModal from '@/Components/Admin/SettingsModal'

export default function AdminDashboard() {
  const { user, signOut } = useAdminAuth()
  const [showSettings, setShowSettings] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch CRM stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/crm/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const tools = [
    {
      name: 'CRM',
      description: 'Manage leads, pipeline, and customer relationships',
      href: '/admin/crm',
      icon: CRMIcon,
      color: 'from-blue-500 to-cyan-500',
      stats: ['Leads', 'Pipeline', 'SEO Reports']
    },
    {
      name: 'DevOps',
      description: 'Monitor client website health, uptime, and incidents',
      href: '/admin/devops',
      icon: DevOpsIcon,
      color: 'from-purple-500 to-pink-500',
      stats: ['Sites', 'Health Checks', 'Incidents']
    },
    {
      name: 'SystemForge',
      description: 'AI-powered project scaffolding from reusable code modules',
      href: '/admin/system-forge',
      icon: ForgeIcon,
      color: 'from-[#008070] to-emerald-500',
      stats: ['Code Vault', 'Import', 'Projects']
    }
  ]

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Header */}
      <header className="border-b border-[#262626] bg-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#008070] to-emerald-600">
                <span className="text-sm font-bold text-white">VA</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#fafafa]">Admin Dashboard</h1>
                <p className="text-xs text-[#525252]">Visionary Advance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
              >
                Back to Site
              </Link>
              <div className="h-4 w-px bg-[#262626]" />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa] transition-colors"
                  title="Settings"
                >
                  <SettingsIcon className="h-4 w-4" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-xs font-medium text-[#fafafa]">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <button
                  onClick={signOut}
                  className="text-sm text-[#a1a1aa] hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#fafafa]">Welcome back</h2>
          <p className="mt-1 text-[#a1a1aa]">Select a tool to get started</p>
        </div>

        {/* Tool Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#0a0a0a] p-8 transition-all hover:border-[#404040] hover:shadow-2xl hover:shadow-[#008070]/5"
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

              {/* Icon */}
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} mb-6`}>
                <tool.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#fafafa] group-hover:text-white transition-colors">
                {tool.name}
              </h3>
              <p className="mt-2 text-[#a1a1aa]">
                {tool.description}
              </p>

              {/* Features */}
              <div className="mt-6 flex flex-wrap gap-2">
                {tool.stats.map((stat) => (
                  <span
                    key={stat}
                    className="inline-flex items-center rounded-full bg-[#171717] px-3 py-1 text-xs text-[#a1a1aa]"
                  >
                    {stat}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div className="absolute bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-[#525252] group-hover:bg-[#262626] group-hover:text-[#fafafa] transition-all">
                <ArrowIcon className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h3 className="text-sm font-medium text-[#a1a1aa]">Quick Stats</h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-5">
            <div>
              <p className="text-3xl font-semibold text-[#fafafa]">
                {statsLoading ? '—' : stats?.overview?.totalLeads || 0}
              </p>
              <p className="mt-1 text-sm text-[#525252]">Total Leads</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[#fafafa]">
                {statsLoading ? '—' : stats?.overview?.leadsThisWeek || 0}
              </p>
              <p className="mt-1 text-sm text-[#525252]">New This Week</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[#fafafa]">
                {statsLoading ? '—' : stats?.overview?.activePipeline || 0}
              </p>
              <p className="mt-1 text-sm text-[#525252]">In Pipeline</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[#10b981]">
                {statsLoading ? '—' : stats?.overview?.wonCount || 0}
              </p>
              <p className="mt-1 text-sm text-[#525252]">Won Deals</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[#fafafa]">
                {statsLoading ? '—' : `${stats?.overview?.conversionRate || 0}%`}
              </p>
              <p className="mt-1 text-sm text-[#525252]">Win Rate</p>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

// Icons
function CRMIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function ForgeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  )
}

function DevOpsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
    </svg>
  )
}

function ArrowIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  )
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
