// app/admin/crm/tasks/page.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const PRIORITY_COLORS = {
  low: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500' },
  medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500' },
  high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500' },
  urgent: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500' },
}

const TASK_TYPES = {
  general: { label: 'General', icon: ClipboardIcon },
  follow_up: { label: 'Follow Up', icon: RefreshIcon },
  call: { label: 'Call', icon: PhoneIcon },
  email: { label: 'Email', icon: EmailIcon },
  meeting: { label: 'Meeting', icon: CalendarIcon },
  review: { label: 'Review', icon: EyeIcon },
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [includeCompleted, setIncludeCompleted] = useState(false)

  // Linkable entities
  const [businesses, setBusinesses] = useState([])
  const [clients, setClients] = useState([])
  const [leads, setLeads] = useState([])

  // New task modal
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    task_type: 'general',
    due_date: '',
    link_type: 'none', // 'none', 'lead', 'client', 'business'
    lead_id: '',
    business_id: '',
  })
  const [creating, setCreating] = useState(false)

  // Fetch businesses, clients, leads for linking
  useEffect(() => {
    const fetchLinkables = async () => {
      try {
        const [bizRes, clientRes, leadRes] = await Promise.all([
          fetch('/api/crm/businesses'),
          fetch('/api/crm/leads?type=clients&limit=100'),
          fetch('/api/crm/leads?type=leads&limit=100'),
        ])

        if (bizRes.ok) {
          const data = await bizRes.json()
          setBusinesses(data.businesses || [])
        }
        if (clientRes.ok) {
          const data = await clientRes.json()
          setClients(data.leads || [])
        }
        if (leadRes.ok) {
          const data = await leadRes.json()
          setLeads(data.leads || [])
        }
      } catch (err) {
        console.error('Failed to fetch linkables:', err)
      }
    }

    fetchLinkables()
  }, [])

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (priorityFilter) params.append('priority', priorityFilter)
      if (typeFilter) params.append('task_type', typeFilter)
      if (includeCompleted) params.append('include_completed', 'true')

      const res = await fetch(`/api/crm/tasks?${params}`)
      if (!res.ok) throw new Error('Failed to fetch tasks')

      const data = await res.json()
      setTasks(data.tasks || [])

      // Fetch summary separately
      const summaryRes = await fetch('/api/crm/tasks?summary=true')
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData.summary)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter, typeFilter, includeCompleted])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleComplete = async (taskId) => {
    try {
      const res = await fetch(`/api/crm/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (err) {
      console.error('Failed to complete task:', err)
    }
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const res = await fetch(`/api/crm/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    setCreating(true)
    try {
      // Build the task payload based on link_type
      const payload = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        task_type: newTask.task_type,
        due_date: newTask.due_date || null,
      }

      // Set lead_id or business_id based on link_type
      if (newTask.link_type === 'lead' && newTask.lead_id) {
        payload.lead_id = newTask.lead_id
      } else if (newTask.link_type === 'client' && newTask.lead_id) {
        payload.lead_id = newTask.lead_id
      } else if (newTask.link_type === 'business' && newTask.business_id) {
        payload.business_id = newTask.business_id
      }

      const res = await fetch('/api/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create task')
      }

      setShowNewTask(false)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        task_type: 'general',
        due_date: '',
        link_type: 'none',
        lead_id: '',
        business_id: '',
      })
      fetchTasks()
    } catch (err) {
      console.error('Failed to create task:', err)
      alert(err.message || 'Failed to create task. Check the console for details.')
    } finally {
      setCreating(false)
    }
  }

  const getUrgencyLabel = (task) => {
    if (!task.due_date) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.due_date)
    dueDate.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

    if (task.status === 'completed') {
      return { label: 'Completed', color: 'text-emerald-400' }
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Tasks</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Manage your tasks and to-dos
          </p>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006b5d]"
        >
          <PlusIcon className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
            <div className={`text-2xl font-bold ${summary.overdue_count > 0 ? 'text-red-400' : 'text-[#fafafa]'}`}>
              {summary.overdue_count || 0}
            </div>
            <div className="text-xs text-[#71717a]">Overdue</div>
          </div>
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
            <div className={`text-2xl font-bold ${summary.due_today_count > 0 ? 'text-amber-400' : 'text-[#fafafa]'}`}>
              {summary.due_today_count || 0}
            </div>
            <div className="text-xs text-[#71717a]">Due Today</div>
          </div>
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
            <div className="text-2xl font-bold text-[#fafafa]">
              {summary.pending_count || 0}
            </div>
            <div className="text-xs text-[#71717a]">Pending</div>
          </div>
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
            <div className="text-2xl font-bold text-emerald-400">
              {summary.completed_count || 0}
            </div>
            <div className="text-xs text-[#71717a]">Completed</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
        >
          <option value="">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
        >
          <option value="">All types</option>
          <option value="general">General</option>
          <option value="follow_up">Follow Up</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="review">Review</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-[#a1a1aa]">
          <input
            type="checkbox"
            checked={includeCompleted}
            onChange={(e) => setIncludeCompleted(e.target.checked)}
            className="rounded border-[#262626] bg-[#0a0a0a] text-[#008070] focus:ring-[#008070]"
          />
          Show completed
        </label>
      </div>

      {/* Task List */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchTasks} className="text-sm text-[#008070] hover:underline">
              Try again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <p className="text-[#a1a1aa]">No tasks found</p>
            <button
              onClick={() => setShowNewTask(true)}
              className="text-sm text-[#008070] hover:underline"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#262626]">
            {tasks.map((task) => {
              const urgency = getUrgencyLabel(task)
              const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
              const TypeIcon = TASK_TYPES[task.task_type]?.icon || ClipboardIcon

              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 p-4 hover:bg-[#171717] transition-colors ${
                    task.status === 'completed' ? 'opacity-60' : ''
                  }`}
                  style={{ borderLeft: `3px solid ${task.priority === 'urgent' ? '#ef4444' : task.priority === 'high' ? '#f59e0b' : task.priority === 'medium' ? '#3b82f6' : '#6b7280'}` }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => task.status !== 'completed' && handleComplete(task.id)}
                    disabled={task.status === 'completed'}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                      task.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : 'border-[#3f3f46] hover:border-[#008070]'
                    }`}
                  >
                    {task.status === 'completed' && (
                      <CheckIcon className="w-3 h-3 text-emerald-400" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-[#71717a]" />
                        <Link
                          href={`/admin/crm/tasks/${task.id}`}
                          className={`font-medium hover:underline ${task.status === 'completed' ? 'text-[#71717a] line-through' : 'text-[#fafafa] hover:text-[#008070]'}`}
                        >
                          {task.title}
                        </Link>
                        <span className={`text-xs px-2 py-0.5 rounded ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {task.priority}
                        </span>
                        {task.is_auto_created && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                            Auto
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {urgency && (
                          <span className={`text-xs ${urgency.color}`}>
                            {urgency.label}
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-[#71717a] hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="mt-1 text-sm text-[#a1a1aa] line-clamp-1">{task.description}</p>
                    )}

                    <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-[#71717a]">
                      {task.lead_id && task.lead_name && (
                        <Link
                          href={task.lead_is_client ? `/admin/crm/clients/${task.lead_id}` : `/admin/crm/leads/${task.lead_id}`}
                          className="text-[#008070] hover:underline inline-flex items-center gap-1"
                        >
                          {task.lead_is_client && (
                            <span className="text-emerald-400">[Client]</span>
                          )}
                          {task.lead_company ? `${task.lead_name} @ ${task.lead_company}` : task.lead_name}
                        </Link>
                      )}
                      {task.business_id && task.business_name && (
                        <Link
                          href={`/admin/crm/businesses/${task.business_id}`}
                          className="text-[#008070] hover:underline inline-flex items-center gap-1"
                        >
                          <BuildingIcon className="w-3 h-3" />
                          {task.business_name}
                        </Link>
                      )}
                      {task.due_date && (
                        <span>Due: {formatDate(task.due_date)}</span>
                      )}
                      <span>Created: {formatDate(task.created_at)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-[#fafafa] mb-4">New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  placeholder="Task title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  placeholder="Task description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1">Type</label>
                  <select
                    value={newTask.task_type}
                    onChange={(e) => setNewTask(prev => ({ ...prev, task_type: e.target.value }))}
                    className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="review">Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                />
              </div>

              {/* Link to entity */}
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">Link to</label>
                <select
                  value={newTask.link_type}
                  onChange={(e) => setNewTask(prev => ({
                    ...prev,
                    link_type: e.target.value,
                    lead_id: '',
                    business_id: '',
                  }))}
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                >
                  <option value="none">None (Global Task)</option>
                  <option value="lead">Lead</option>
                  <option value="client">Client</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {/* Lead selection */}
              {newTask.link_type === 'lead' && (
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1">Select Lead</label>
                  <select
                    value={newTask.lead_id}
                    onChange={(e) => setNewTask(prev => ({ ...prev, lead_id: e.target.value }))}
                    className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  >
                    <option value="">Select a lead...</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>
                        {lead.full_name || lead.email} {lead.company ? `@ ${lead.company}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Client selection */}
              {newTask.link_type === 'client' && (
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1">Select Client</label>
                  <select
                    value={newTask.lead_id}
                    onChange={(e) => setNewTask(prev => ({ ...prev, lead_id: e.target.value }))}
                    className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  >
                    <option value="">Select a client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.full_name || client.email} {client.company ? `@ ${client.company}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Business selection */}
              {newTask.link_type === 'business' && (
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1">Select Business</label>
                  <select
                    value={newTask.business_id}
                    onChange={(e) => setNewTask(prev => ({ ...prev, business_id: e.target.value }))}
                    className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  >
                    <option value="">Select a business...</option>
                    {businesses.map(biz => (
                      <option key={biz.id} value={biz.id}>
                        {biz.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTask(false)}
                  className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTask.title.trim()}
                  className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}

function ClipboardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function RefreshIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function EmailIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function EyeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}
