'use client'

import { useState } from 'react'

export default function TaskForm({ projectId, onSave, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    due_date: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/tasks`, {
        method: 'POST',
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
        onSave(data.task)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create task')
      }
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[#008070]/30 bg-[#171717] p-4 space-y-3">
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
        className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
        placeholder="Task title *"
        autoFocus
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
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
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
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !form.title.trim()}
          className="rounded-lg bg-[#008070] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Add Task'}
        </button>
      </div>
    </form>
  )
}
