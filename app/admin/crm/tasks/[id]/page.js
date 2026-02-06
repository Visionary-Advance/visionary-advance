// app/admin/crm/tasks/[id]/page.js
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PRIORITY_COLORS = {
  low: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-l-gray-500' },
  medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-l-blue-500' },
  high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-l-amber-500' },
  urgent: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-l-red-500' },
}

const TASK_TYPE_LABELS = {
  general: 'General',
  follow_up: 'Follow Up',
  call: 'Call',
  email: 'Email',
  meeting: 'Meeting',
  review: 'Review',
}

export default function TaskDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [task, setTask] = useState(null)
  const [subtasks, setSubtasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // New subtask
  const [newSubtask, setNewSubtask] = useState('')
  const [addingSubtask, setAddingSubtask] = useState(false)

  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchTask()
    fetchSubtasks()
  }, [id])

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/crm/tasks/${id}`)
      if (!res.ok) throw new Error('Task not found')
      const data = await res.json()
      setTask(data.task)
      setEditForm(data.task)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubtasks = async () => {
    try {
      const res = await fetch(`/api/crm/tasks/${id}/subtasks`)
      if (res.ok) {
        const data = await res.json()
        setSubtasks(data.subtasks || [])
      }
    } catch (err) {
      console.error('Failed to fetch subtasks:', err)
    }
  }

  const handleComplete = async () => {
    try {
      const res = await fetch(`/api/crm/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })
      if (res.ok) {
        fetchTask()
      }
    } catch (err) {
      console.error('Failed to complete task:', err)
    }
  }

  const handleReopen = async () => {
    try {
      const res = await fetch(`/api/crm/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }),
      })
      if (res.ok) {
        fetchTask()
      }
    } catch (err) {
      console.error('Failed to reopen task:', err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const res = await fetch(`/api/crm/tasks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/crm/tasks')
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/crm/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          priority: editForm.priority,
          task_type: editForm.task_type,
          due_date: editForm.due_date || null,
        }),
      })
      if (res.ok) {
        setIsEditing(false)
        fetchTask()
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (!newSubtask.trim()) return

    setAddingSubtask(true)
    try {
      const res = await fetch(`/api/crm/tasks/${id}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSubtask }),
      })
      if (res.ok) {
        setNewSubtask('')
        fetchSubtasks()
      }
    } catch (err) {
      console.error('Failed to add subtask:', err)
    } finally {
      setAddingSubtask(false)
    }
  }

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const res = await fetch(`/api/crm/tasks/${id}/subtasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtask_id: subtaskId, action: 'toggle' }),
      })
      if (res.ok) {
        fetchSubtasks()
      }
    } catch (err) {
      console.error('Failed to toggle subtask:', err)
    }
  }

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      const res = await fetch(`/api/crm/tasks/${id}/subtasks?subtask_id=${subtaskId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchSubtasks()
      }
    } catch (err) {
      console.error('Failed to delete subtask:', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getUrgencyLabel = () => {
    if (!task?.due_date) return null
    if (task.status === 'completed') return { label: 'Completed', color: 'text-emerald-400' }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.due_date)
    dueDate.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: `${Math.abs(diffDays)} days overdue`, color: 'text-red-400' }
    if (diffDays === 0) return { label: 'Due today', color: 'text-amber-400' }
    if (diffDays === 1) return { label: 'Due tomorrow', color: 'text-[#a1a1aa]' }
    return { label: `Due in ${diffDays} days`, color: 'text-[#71717a]' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || 'Task not found'}</p>
        <Link href="/admin/crm/tasks" className="text-[#008070] hover:underline">
          Back to tasks
        </Link>
      </div>
    )
  }

  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
  const urgency = getUrgencyLabel()
  const completedSubtasks = subtasks.filter(s => s.is_completed).length

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/admin/crm/tasks"
        className="inline-flex items-center gap-1 text-sm text-[#71717a] hover:text-[#fafafa] mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to tasks
      </Link>

      {/* Main card */}
      <div className={`rounded-xl border border-[#262626] bg-[#0a0a0a] overflow-hidden border-l-4 ${priorityStyle.border}`}>
        {/* Header */}
        <div className="p-6 border-b border-[#262626]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xl font-semibold bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-[#fafafa] focus:border-[#008070] focus:outline-none"
                />
              ) : (
                <h1 className={`text-xl font-semibold ${task.status === 'completed' ? 'text-[#71717a] line-through' : 'text-[#fafafa]'}`}>
                  {task.title}
                </h1>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className={`text-xs px-2 py-1 rounded ${priorityStyle.bg} ${priorityStyle.text}`}>
                  {task.priority}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-[#171717] text-[#a1a1aa]">
                  {TASK_TYPE_LABELS[task.task_type] || task.task_type}
                </span>
                {task.is_auto_created && (
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400">
                    Auto-created
                  </span>
                )}
                {task.status === 'completed' && (
                  <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">
                    Completed
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-sm text-[#71717a] hover:text-[#fafafa]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 text-sm bg-[#008070] text-white rounded-lg hover:bg-[#006b5d]"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-[#71717a] hover:text-[#fafafa] hover:bg-[#171717] rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-[#71717a] hover:text-red-400 hover:bg-[#171717] rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Due date and links */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {task.due_date && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[#a1a1aa]">{formatDate(task.due_date)}</span>
                {urgency && (
                  <span className={`${urgency.color}`}>({urgency.label})</span>
                )}
              </div>
            )}

            {task.lead_id && task.lead_name && (
              <Link
                href={task.lead_is_client ? `/admin/crm/clients/${task.lead_id}` : `/admin/crm/leads/${task.lead_id}`}
                className="flex items-center gap-2 text-[#008070] hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {task.lead_is_client && <span className="text-emerald-400">[Client]</span>}
                {task.lead_name}
              </Link>
            )}

            {task.business_id && task.business_name && (
              <Link
                href={`/admin/crm/businesses/${task.business_id}`}
                className="flex items-center gap-2 text-[#008070] hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {task.business_name}
              </Link>
            )}
          </div>

          {/* Description */}
          {isEditing ? (
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Description</label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-[#fafafa] focus:border-[#008070] focus:outline-none"
                placeholder="Add a description..."
              />
            </div>
          ) : task.description ? (
            <div>
              <h3 className="text-sm font-medium text-[#a1a1aa] mb-2">Description</h3>
              <p className="text-[#fafafa] whitespace-pre-wrap">{task.description}</p>
            </div>
          ) : null}

          {/* Edit form extras */}
          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-[#fafafa] focus:border-[#008070] focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Due Date</label>
                <input
                  type="date"
                  value={editForm.due_date || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-[#fafafa] focus:border-[#008070] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#a1a1aa]">
                Subtasks
                {subtasks.length > 0 && (
                  <span className="ml-2 text-[#71717a]">
                    ({completedSubtasks}/{subtasks.length})
                  </span>
                )}
              </h3>
            </div>

            {/* Subtask list */}
            {subtasks.length > 0 && (
              <div className="space-y-2 mb-4">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#171717] group"
                  >
                    <button
                      onClick={() => handleToggleSubtask(subtask.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                        subtask.is_completed
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-[#3f3f46] hover:border-[#008070]'
                      }`}
                    >
                      {subtask.is_completed && (
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-grow text-sm ${subtask.is_completed ? 'text-[#71717a] line-through' : 'text-[#fafafa]'}`}>
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#71717a] hover:text-red-400 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-grow bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-sm text-[#fafafa] placeholder-[#71717a] focus:border-[#008070] focus:outline-none"
              />
              <button
                type="submit"
                disabled={addingSubtask || !newSubtask.trim()}
                className="px-4 py-2 text-sm bg-[#171717] border border-[#262626] text-[#a1a1aa] rounded-lg hover:bg-[#262626] hover:text-[#fafafa] disabled:opacity-50"
              >
                {addingSubtask ? '...' : 'Add'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#262626] bg-[#0a0a0a]">
          {task.status === 'completed' ? (
            <button
              onClick={handleReopen}
              className="w-full py-2.5 text-sm font-medium text-[#008070] border border-[#008070] rounded-lg hover:bg-[#008070]/10"
            >
              Reopen Task
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full py-2.5 text-sm font-medium text-white bg-[#008070] rounded-lg hover:bg-[#006b5d]"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
