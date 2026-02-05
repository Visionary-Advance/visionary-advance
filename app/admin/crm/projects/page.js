// app/admin/crm/projects/page.js
// Project Kanban Board

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATUS_CONFIG = {
  planning: { label: 'Planning', color: 'bg-gray-500' },
  active: { label: 'Active', color: 'bg-blue-500' },
  on_hold: { label: 'On Hold', color: 'bg-amber-500' },
  completed: { label: 'Completed', color: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
}

const STATUS_ORDER = ['planning', 'active', 'on_hold', 'completed', 'cancelled']

export default function ProjectsKanbanPage() {
  const [projects, setProjects] = useState({ byStatus: {} })
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('kanban') // kanban or list
  const [search, setSearch] = useState('')
  const [draggedProject, setDraggedProject] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/crm/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e, project) => {
    setDraggedProject(project)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    if (!draggedProject || draggedProject.status === newStatus) {
      setDraggedProject(null)
      return
    }

    // Optimistically update UI
    const oldStatus = draggedProject.status
    setProjects(prev => {
      const newByStatus = { ...prev.byStatus }
      newByStatus[oldStatus] = newByStatus[oldStatus].filter(p => p.id !== draggedProject.id)
      newByStatus[newStatus] = [...(newByStatus[newStatus] || []), { ...draggedProject, status: newStatus }]
      return { ...prev, byStatus: newByStatus }
    })

    // Update on server
    try {
      const res = await fetch(`/api/crm/projects/${draggedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        // Revert on failure
        fetchProjects()
      }
    } catch (error) {
      console.error('Failed to update project status:', error)
      fetchProjects()
    }

    setDraggedProject(null)
  }

  const filteredByStatus = Object.entries(projects.byStatus || {}).reduce((acc, [status, items]) => {
    acc[status] = items.filter(p =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.lead?.company?.toLowerCase().includes(search.toLowerCase())
    )
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Projects</h1>
          <p className="text-sm text-[#a1a1aa]">
            {projects.projects?.length || 0} total projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-[#262626] bg-[#171717] px-4 py-2 text-sm text-[#fafafa] placeholder-[#71717a] focus:border-[#008070] focus:outline-none w-64"
          />
          <div className="flex rounded-lg border border-[#262626] overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-2 text-sm ${view === 'kanban' ? 'bg-[#008070] text-white' : 'bg-[#171717] text-[#a1a1aa] hover:text-[#fafafa]'}`}
            >
              <KanbanIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-[#008070] text-white' : 'bg-[#171717] text-[#a1a1aa] hover:text-[#fafafa]'}`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_ORDER.map(status => (
            <div
              key={status}
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].color}`} />
                <span className="text-sm font-medium text-[#fafafa]">
                  {STATUS_CONFIG[status].label}
                </span>
                <span className="text-xs text-[#71717a]">
                  {filteredByStatus[status]?.length || 0}
                </span>
              </div>

              {/* Column Content */}
              <div className="space-y-2 min-h-[200px] rounded-lg bg-[#0a0a0a] p-2 border border-[#1a1a1a]">
                {(filteredByStatus[status] || []).map(project => (
                  <ProjectKanbanCard
                    key={project.id}
                    project={project}
                    onDragStart={handleDragStart}
                  />
                ))}
                {(filteredByStatus[status] || []).length === 0 && (
                  <div className="text-center py-8 text-xs text-[#71717a]">
                    No projects
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-[#262626] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#171717]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {(projects.projects || [])
                .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
                .map(project => (
                <tr key={project.id} className="hover:bg-[#171717]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/crm/projects/${project.id}`} className="text-sm font-medium text-[#fafafa] hover:text-[#008070]">
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">
                    {project.lead?.company || project.lead?.full_name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[project.status]?.color}/10 text-${STATUS_CONFIG[project.status]?.color.replace('bg-', '')}-400`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[project.status]?.color}`} />
                      {STATUS_CONFIG[project.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#262626] overflow-hidden">
                        <div
                          className="h-full bg-[#008070] rounded-full"
                          style={{ width: `${project.taskSummary?.total > 0 ? (project.taskSummary.completed / project.taskSummary.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#71717a]">
                        {project.taskSummary?.completed || 0}/{project.taskSummary?.total || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">
                    {project.timeSummary?.total_hours ? `${project.timeSummary.total_hours}h` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">
                    {project.budget ? `$${project.budget.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ProjectKanbanCard({ project, onDragStart }) {
  const taskProgress = project.taskSummary?.total > 0
    ? Math.round((project.taskSummary.completed / project.taskSummary.total) * 100)
    : 0

  const formatCurrency = (amount) => {
    if (!amount) return null
    return `$${amount.toLocaleString()}`
  }

  return (
    <Link
      href={`/admin/crm/projects/${project.id}`}
      draggable
      onDragStart={(e) => onDragStart(e, project)}
      className="block rounded-lg border border-[#262626] bg-[#171717] p-3 hover:border-[#008070]/50 transition-colors cursor-grab active:cursor-grabbing"
    >
      <div className="font-medium text-sm text-[#fafafa] mb-1">{project.name}</div>
      {project.lead && (
        <div className="text-xs text-[#a1a1aa] mb-2">
          {project.lead.company || project.lead.full_name}
        </div>
      )}

      {/* Progress */}
      {project.taskSummary?.total > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-[#71717a] mb-1">
            <span>Tasks</span>
            <span>{project.taskSummary.completed}/{project.taskSummary.total}</span>
          </div>
          <div className="h-1 rounded-full bg-[#262626] overflow-hidden">
            <div
              className="h-full bg-[#008070] rounded-full transition-all"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs">
        {project.timeSummary?.total_hours > 0 && (
          <span className="text-[#71717a]">{project.timeSummary.total_hours}h logged</span>
        )}
        {formatCurrency(project.budget) && (
          <span className="text-[#008070]">{formatCurrency(project.budget)}</span>
        )}
      </div>
    </Link>
  )
}

function KanbanIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  )
}

function ListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  )
}
