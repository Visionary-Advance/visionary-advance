'use client'

import { useState } from 'react'

export default function TimeEntryForm({ projectId, tasks = [], onSave, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    description: '',
    duration: '',
    entry_date: new Date().toISOString().split('T')[0],
    user_name: '',
    task_id: '',
    billable: true,
  })

  const parseDuration = (input) => {
    if (!input) return 0
    const str = input.toString().toLowerCase().trim()

    // Format: 1:30 (hours:minutes)
    if (str.includes(':')) {
      const [hours, minutes] = str.split(':').map(n => parseInt(n) || 0)
      return hours * 60 + minutes
    }

    // Format: 1h 30m or 1h30m
    const hourMatch = str.match(/(\d+(?:\.\d+)?)\s*h/)
    const minMatch = str.match(/(\d+)\s*m/)

    let totalMinutes = 0

    if (hourMatch) {
      totalMinutes += parseFloat(hourMatch[1]) * 60
    }

    if (minMatch) {
      totalMinutes += parseInt(minMatch[1])
    }

    // If no unit specified, assume hours if has decimal, minutes if integer
    if (!hourMatch && !minMatch) {
      const num = parseFloat(str)
      if (!isNaN(num)) {
        totalMinutes = str.includes('.') ? num * 60 : num * 60
      }
    }

    return Math.round(totalMinutes)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const durationMinutes = parseDuration(form.duration)
    if (durationMinutes <= 0) {
      alert('Please enter a valid duration (e.g., "1h 30m", "1.5h", "90m", "1:30")')
      return
    }

    if (!form.user_name.trim()) {
      alert('Please enter your name')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: form.description || null,
          duration_minutes: durationMinutes,
          entry_date: form.entry_date,
          user_name: form.user_name,
          task_id: form.task_id || null,
          billable: form.billable,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        onSave(data.entry)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to log time')
      }
    } catch (error) {
      console.error('Failed to log time:', error)
      alert('Failed to log time')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[#008070]/30 bg-[#171717] p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={form.duration}
          onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          placeholder="Duration (1h 30m) *"
          autoFocus
        />
        <input
          type="text"
          value={form.user_name}
          onChange={(e) => setForm(prev => ({ ...prev, user_name: e.target.value }))}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          placeholder="Your name *"
        />
      </div>

      <input
        type="text"
        value={form.description}
        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
        className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
        placeholder="What did you work on?"
      />

      <div className="grid grid-cols-3 gap-3">
        <input
          type="date"
          value={form.entry_date}
          onChange={(e) => setForm(prev => ({ ...prev, entry_date: e.target.value }))}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
        />
        {tasks.length > 0 && (
          <select
            value={form.task_id}
            onChange={(e) => setForm(prev => ({ ...prev, task_id: e.target.value }))}
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          >
            <option value="">No task</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
        )}
        <label className="flex items-center gap-2 text-sm text-[#a1a1aa]">
          <input
            type="checkbox"
            checked={form.billable}
            onChange={(e) => setForm(prev => ({ ...prev, billable: e.target.checked }))}
            className="rounded border-[#262626] bg-[#0a0a0a] text-[#008070] focus:ring-[#008070]"
          />
          Billable
        </label>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-[#71717a]">
          Formats: 1h 30m, 1.5h, 90m, 1:30
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#008070] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
          >
            {loading ? 'Logging...' : 'Log Time'}
          </button>
        </div>
      </div>
    </form>
  )
}
