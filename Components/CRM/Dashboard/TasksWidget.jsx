'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const PRIORITY_COLORS = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
}

const TASK_TYPE_ICONS = {
  general: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  follow_up: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  call: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  email: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  meeting: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  review: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
}

export default function TasksWidget() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/crm/tasks?upcoming=true&limit=5')
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (taskId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setCompleting(taskId)

    try {
      const res = await fetch(`/api/crm/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })

      if (res.ok) {
        // Refresh the task list
        await fetchTasks()
      }
    } catch (error) {
      console.error('Failed to complete task:', error)
    } finally {
      setCompleting(null)
    }
  }

  const getUrgencyLabel = (task) => {
    if (!task.due_date) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.due_date)
    dueDate.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { label: `${Math.abs(diffDays)}d overdue`, color: 'text-red-400' }
    }
    if (diffDays === 0) {
      return { label: 'Today', color: 'text-amber-400' }
    }
    if (diffDays === 1) {
      return { label: 'Tomorrow', color: 'text-[#a1a1aa]' }
    }
    return { label: `${diffDays} days`, color: 'text-[#71717a]' }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 animate-pulse">
        <div className="h-4 w-24 bg-[#262626] rounded mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="h-16 bg-[#262626] rounded" />
          <div className="h-16 bg-[#262626] rounded" />
          <div className="h-16 bg-[#262626] rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-14 bg-[#262626] rounded" />
          <div className="h-14 bg-[#262626] rounded" />
          <div className="h-14 bg-[#262626] rounded" />
        </div>
      </div>
    )
  }

  const summary = data?.summary || {}
  const tasks = data?.tasks || []

  return (
    <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
      <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        My Tasks
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-[#171717]">
          <div className={`text-xl font-bold ${summary.overdue_count > 0 ? 'text-red-400' : 'text-[#fafafa]'}`}>
            {summary.overdue_count || 0}
          </div>
          <div className="text-xs text-[#71717a]">Overdue</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#171717]">
          <div className={`text-xl font-bold ${summary.due_today_count > 0 ? 'text-amber-400' : 'text-[#fafafa]'}`}>
            {summary.due_today_count || 0}
          </div>
          <div className="text-xs text-[#71717a]">Today</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#171717]">
          <div className="text-xl font-bold text-[#fafafa]">
            {summary.pending_count || 0}
          </div>
          <div className="text-xs text-[#71717a]">Pending</div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task) => {
            const urgency = getUrgencyLabel(task)
            return (
              <div
                key={task.id}
                className="group rounded-lg bg-[#171717] p-3 hover:bg-[#1a1a1a] transition-colors"
                style={{ borderLeft: `3px solid ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}` }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => handleComplete(task.id, e)}
                    disabled={completing === task.id}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                      completing === task.id
                        ? 'border-[#008070] bg-[#008070]/20'
                        : 'border-[#3f3f46] hover:border-[#008070] group-hover:border-[#52525b]'
                    }`}
                  >
                    {completing === task.id && (
                      <svg className="w-3 h-3 text-[#008070] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[#71717a]">
                          {TASK_TYPE_ICONS[task.task_type] || TASK_TYPE_ICONS.general}
                        </span>
                        <Link
                          href={`/admin/crm/tasks/${task.id}`}
                          className="text-sm text-[#fafafa] truncate hover:text-[#008070] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {task.title}
                        </Link>
                      </div>
                      {urgency && (
                        <span className={`text-xs whitespace-nowrap ${urgency.color}`}>
                          {urgency.label}
                        </span>
                      )}
                    </div>
                    {(task.lead_id && task.lead_name) || (task.business_id && task.business_name) ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.lead_id && task.lead_name && (
                          <Link
                            href={task.lead_is_client ? `/admin/crm/clients/${task.lead_id}` : `/admin/crm/leads/${task.lead_id}`}
                            className="text-xs text-[#008070] hover:underline inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {task.lead_is_client && <span className="text-emerald-400">[Client]</span>}
                            {task.lead_company ? `${task.lead_name} @ ${task.lead_company}` : task.lead_name}
                          </Link>
                        )}
                        {task.business_id && task.business_name && (
                          <Link
                            href={`/admin/crm/businesses/${task.business_id}`}
                            className="text-xs text-[#008070] hover:underline inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {task.business_name}
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-[#71717a] mb-3">No upcoming tasks</p>
          <Link
            href="/admin/crm/tasks"
            className="inline-flex items-center gap-1.5 text-sm text-[#008070] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create a task
          </Link>
        </div>
      )}

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-[#262626] flex items-center justify-between">
        <Link
          href="/admin/crm/tasks"
          className="text-sm text-[#008070] hover:underline"
        >
          View all tasks →
        </Link>
        <Link
          href="/admin/crm/tasks"
          className="inline-flex items-center gap-1 text-sm text-[#71717a] hover:text-[#008070]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </Link>
      </div>
    </div>
  )
}
