// app/admin/page.js
'use client'

import Link from 'next/link'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'

export default function AdminDashboard() {
  const { user, signOut } = useAdminAuth()

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

        {/* Quick Stats (placeholder for future) */}
        <div className="mt-12 rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h3 className="text-sm font-medium text-[#a1a1aa]">Quick Stats</h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-[#fafafa]">—</p>
              <p className="mt-1 text-sm text-[#525252]">Active Leads</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[#fafafa]">—</p>
              <p className="mt-1 text-sm text-[#525252]">Code Modules</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[#fafafa]">—</p>
              <p className="mt-1 text-sm text-[#525252]">Projects Generated</p>
            </div>
          </div>
        </div>
      </main>
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

function ArrowIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  )
}
