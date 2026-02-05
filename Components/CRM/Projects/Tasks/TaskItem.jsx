'use client'

import { useState } from 'react'

const PRIORITY_COLORS = {
  low: 'bg-gray-500/10 text-gray-400',
  medium: 'bg-blue-500/10 text-blue-400',
  high: 'bg-amber-500/10 text-amber-400',
  urgent: 'bg-red-500/10 text-red-400',
}

export default function TaskItem({ task, projectId, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    assignee: task.assignee || '',
    due_date: task.due_date || '',
  })

  const isCompleted = task.status === 'completed'
  const isOverdue = task.due_date && !isCompleted && new Date(task.due_date) < new Date()

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      const newStatus = isCompleted ? 'pending' : 'completed'
      const res = await fetch(`/api/crm/projects/${projectId}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const data = await res.json()
        onUpdate(data.task)
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          priority: form.priority,
          assignee: form.assignee || null,
          due_date: form.due_date || null,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        onUpdate(data.task)
        setEditing(false)
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onDelete(task.id)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-[#262626] bg-[#171717] p-4 space-y-3">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          placeholder="Task title"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          placeholder="Description (optional)"
          rows={2}
        />
        <div className="grid grid-cols-3 gap-2">
          <select
            value={form.priority}
            onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value }))}
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <input
            type="text"
            value={form.assignee}
            onChange={(e) => setForm(prev => ({ ...prev, assignee: e.target.value }))}
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
            placeholder="Assignee"
          />
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm(prev => ({ ...prev, due_date: e.target.value }))}
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !form.title.trim()}
            className="rounded-lg bg-[#008070] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg border bg-[#171717] p-3 transition-colors ${
        isCompleted
          ? 'border-[#1a1a1a] opacity-60'
          : isOverdue
          ? 'border-red-500/30'
          : 'border-[#262626]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 transition-colors ${
            isCompleted
              ? 'bg-[#008070] border-[#008070]'
              : 'border-[#404040] hover:border-[#008070]'
          } ${loading ? 'opacity-50' : ''}`}
        >
          {isCompleted && (
            <svg className="h-full w-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div
              className={`text-sm cursor-pointer ${isCompleted ? 'line-through text-[#a1a1aa]' : 'text-[#fafafa]'}`}
              onClick={() => setExpanded(!expanded)}
            >
              {task.title}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.priority !== 'medium' && (
                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority}
                </span>
              )}
              {task.due_date && (
                <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-[#a1a1aa]'}`}>
                  {formatDate(task.due_date)}
                </span>
              )}
            </div>
          </div>

          {/* Expanded view */}
          {expanded && (
            <div className="mt-2 space-y-2">
              {task.description && (
                <p className="text-xs text-[#a1a1aa]">{task.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-[#71717a]">
                {task.assignee && (
                  <span>Assigned to: {task.assignee}</span>
                )}
                {task.completed_at && (
                  <span>Completed: {formatDate(task.completed_at)}</span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-[#a1a1aa] hover:text-[#008070]"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-xs text-[#a1a1aa] hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
