'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProjectWidgets() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/crm/dashboard?widgets=overdue,upcoming,at_risk,active_projects,stats')
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 animate-pulse">
            <div className="h-4 w-24 bg-[#262626] rounded mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-[#262626] rounded" />
              <div className="h-10 bg-[#262626] rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Project Stats */}
      {data?.stats && (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4">
            Project Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#008070]">{data.stats.active}</div>
              <div className="text-xs text-[#a1a1aa]">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fafafa]">{data.stats.planning}</div>
              <div className="text-xs text-[#a1a1aa]">Planning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{data.stats.completed}</div>
              <div className="text-xs text-[#a1a1aa]">Completed</div>
            </div>
          </div>
          {data.stats.hoursThisWeek > 0 && (
            <div className="mt-4 pt-4 border-t border-[#262626] text-center">
              <div className="text-lg font-semibold text-[#fafafa]">{data.stats.hoursThisWeek}h</div>
              <div className="text-xs text-[#a1a1aa]">logged this week</div>
            </div>
          )}
          <div className="mt-4">
            <Link
              href="/admin/crm/projects"
              className="text-sm text-[#008070] hover:underline"
            >
              View all projects →
            </Link>
          </div>
        </div>
      )}

      {/* Overdue Items */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Overdue Items
        </h3>
        {data?.overdue?.length > 0 ? (
          <div className="space-y-2">
            {data.overdue.slice(0, 5).map((item, i) => (
              <Link
                key={`${item.item_type}-${item.item_id}-${i}`}
                href={`/admin/crm/projects/${item.project_id}`}
                className="block rounded-lg bg-[#171717] p-3 hover:bg-[#1a1a1a] transition-colors border-l-2 border-red-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-[#fafafa]">{item.item_name}</span>
                    <div className="text-xs text-[#71717a] mt-0.5">
                      {item.project_name} · {item.item_type}
                    </div>
                  </div>
                  <span className="text-xs text-red-400">
                    {item.days_overdue}d overdue
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-[#71717a]">
            No overdue items
          </div>
        )}
      </div>

      {/* Upcoming Deadlines */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Upcoming (14 days)
        </h3>
        {data?.upcoming?.length > 0 ? (
          <div className="space-y-2">
            {data.upcoming.slice(0, 5).map((item, i) => (
              <Link
                key={`${item.item_type}-${item.item_id}-${i}`}
                href={`/admin/crm/projects/${item.project_id}`}
                className="block rounded-lg bg-[#171717] p-3 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-[#fafafa]">{item.item_name}</span>
                    <div className="text-xs text-[#71717a] mt-0.5">
                      {item.project_name} · {item.item_type}
                    </div>
                  </div>
                  <span className={`text-xs ${item.days_until <= 3 ? 'text-amber-400' : 'text-[#a1a1aa]'}`}>
                    {item.days_until === 0 ? 'Today' : item.days_until === 1 ? 'Tomorrow' : `${item.days_until} days`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-[#71717a]">
            No upcoming deadlines
          </div>
        )}
      </div>

      {/* Projects at Risk */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          Projects at Risk
        </h3>
        {data?.atRisk?.length > 0 ? (
          <div className="space-y-2">
            {data.atRisk.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/admin/crm/projects/${project.id}`}
                className="block rounded-lg bg-[#171717] p-3 hover:bg-[#1a1a1a] transition-colors border-l-2 border-orange-500"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm text-[#fafafa]">{project.name}</span>
                  <RiskBadge reason={project.risk_reason} />
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-[#71717a]">
                  {project.hours_percent_used && (
                    <span>{project.hours_percent_used}% hours used</span>
                  )}
                  {project.budget_percent_used && (
                    <span>{project.budget_percent_used}% budget used</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-[#71717a]">
            No projects at risk
          </div>
        )}
      </div>

      {/* Active Projects */}
      {data?.activeProjects?.length > 0 && (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 lg:col-span-2">
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4">
            Active Projects
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.activeProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/crm/projects/${project.id}`}
                className="rounded-lg bg-[#171717] p-4 hover:bg-[#1a1a1a] transition-colors border border-[#262626]"
              >
                <div className="font-medium text-[#fafafa] mb-1">{project.name}</div>
                <div className="text-xs text-[#71717a] mb-3">
                  {project.lead?.company || project.lead?.full_name}
                </div>
                {project.timeSummary && project.estimated_hours && (
                  <div>
                    <div className="flex justify-between text-xs text-[#71717a] mb-1">
                      <span>Time</span>
                      <span>{project.timeSummary.total_hours || 0}h / {project.estimated_hours}h</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#262626] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (project.timeSummary.percent_used || 0) > 90 ? 'bg-red-500' :
                          (project.timeSummary.percent_used || 0) > 70 ? 'bg-amber-500' :
                          'bg-[#008070]'
                        }`}
                        style={{ width: `${Math.min(project.timeSummary.percent_used || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RiskBadge({ reason }) {
  const configs = {
    overdue: { label: 'Overdue', bg: 'bg-red-500/10', text: 'text-red-400' },
    over_hours: { label: 'Over Hours', bg: 'bg-orange-500/10', text: 'text-orange-400' },
    over_budget: { label: 'Over Budget', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    many_overdue_tasks: { label: 'Tasks Overdue', bg: 'bg-red-500/10', text: 'text-red-400' },
  }

  const config = configs[reason] || { label: 'At Risk', bg: 'bg-orange-500/10', text: 'text-orange-400' }

  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
