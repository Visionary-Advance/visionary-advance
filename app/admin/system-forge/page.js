// app/admin/system-forge/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SystemForgeOverview() {
  const [stats, setStats] = useState(null)
  const [recentModules, setRecentModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [statsRes, modulesRes] = await Promise.all([
        fetch('/api/system-forge/modules?stats=true'),
        fetch('/api/system-forge/modules?limit=5')
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats)
      }

      if (modulesRes.ok) {
        const data = await modulesRes.json()
        setRecentModules(data.modules || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Modules', value: stats?.total || 0, icon: CubeIcon, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Modules', value: stats?.modules || 0, icon: BoxIcon, color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Components', value: stats?.components || 0, icon: ComponentIcon, color: 'bg-green-500/10 text-green-400' },
    { label: 'Snippets', value: stats?.snippets || 0, icon: CodeIcon, color: 'bg-amber-500/10 text-amber-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#fafafa]">SystemForge</h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          AI-powered project scaffolding from reusable code modules
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-[#a1a1aa]">{stat.label}</p>
                <p className="text-2xl font-semibold text-[#fafafa]">
                  {loading ? '—' : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/system-forge/vault"
          className="group rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 transition-colors hover:border-[#008070]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#008070]/10 text-[#008070] group-hover:bg-[#008070] group-hover:text-white transition-colors">
              <PlusIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-[#fafafa]">Add Module</p>
              <p className="text-sm text-[#a1a1aa]">Create a new code module</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/system-forge/import"
          className="group rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 transition-colors hover:border-[#008070]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#008070]/10 text-[#008070] group-hover:bg-[#008070] group-hover:text-white transition-colors">
              <ImportIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-[#fafafa]">Import Repository</p>
              <p className="text-sm text-[#a1a1aa]">Import from GitHub or local</p>
            </div>
          </div>
        </Link>

        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#262626] text-[#525252]">
              <RocketIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-[#525252]">New Project</p>
              <p className="text-sm text-[#525252]">Coming in Phase 2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Modules */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]">
        <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
          <h2 className="font-medium text-[#fafafa]">Recent Modules</h2>
          <Link
            href="/admin/system-forge/vault"
            className="text-sm text-[#008070] hover:text-[#00a08c]"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-[#262626]">
          {loading ? (
            <div className="px-6 py-8 text-center text-[#a1a1aa]">
              Loading...
            </div>
          ) : recentModules.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-[#a1a1aa]">No modules yet</p>
              <p className="mt-1 text-sm text-[#525252]">
                Create your first module or import from GitHub
              </p>
            </div>
          ) : (
            recentModules.map((module) => (
              <Link
                key={module.id}
                href={`/admin/system-forge/vault/${module.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#171717] transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#171717]">
                  <TypeIcon type={module.type} className="h-5 w-5 text-[#a1a1aa]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#fafafa] truncate">{module.name}</p>
                  <p className="text-sm text-[#a1a1aa] truncate">
                    {module.description || 'No description'}
                  </p>
                </div>
                <TypeBadge type={module.type} />
                <span className="text-sm text-[#525252]">
                  {module.file_count || 0} files
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TypeBadge({ type }) {
  const config = {
    module: { color: 'bg-purple-500/10 text-purple-400 ring-purple-500/20', label: 'Module' },
    component: { color: 'bg-green-500/10 text-green-400 ring-green-500/20', label: 'Component' },
    snippet: { color: 'bg-amber-500/10 text-amber-400 ring-amber-500/20', label: 'Snippet' },
  }
  const { color, label } = config[type] || config.module
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${color}`}>
      {label}
    </span>
  )
}

function TypeIcon({ type, className }) {
  if (type === 'component') return <ComponentIcon className={className} />
  if (type === 'snippet') return <CodeIcon className={className} />
  return <BoxIcon className={className} />
}

// Icons
function CubeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  )
}

function BoxIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

function ComponentIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
    </svg>
  )
}

function CodeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function ImportIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}

function RocketIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  )
}
