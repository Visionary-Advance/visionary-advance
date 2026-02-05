'use client'

import { useState } from 'react'

export default function TimeEntryList({ entries, projectId, onUpdate, onDelete }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-[#a1a1aa]">
        No time logged yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map(entry => (
        <TimeEntryItem
          key={entry.id}
          entry={entry}
          projectId={projectId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

function TimeEntryItem({ entry, projectId, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    description: entry.description || '',
    duration_minutes: entry.duration_minutes,
    billable: entry.billable,
  })

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/time/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        const data = await res.json()
        onUpdate(data.entry)
        setEditing(false)
      }
    } catch (error) {
      console.error('Failed to update entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this time entry?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/time/${entry.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onDelete(entry.id)
      }
    } catch (error) {
      console.error('Failed to delete entry:', error)
    } finally {
      setLoading(false)
    }
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-[#262626] bg-[#171717] p-3 space-y-2">
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full rounded border border-[#262626] bg-[#0a0a0a] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
          placeholder="Description"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={form.duration_minutes}
              onChange={(e) => setForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
              className="w-20 rounded border border-[#262626] bg-[#0a0a0a] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
              placeholder="Minutes"
            />
            <label className="flex items-center gap-1 text-xs text-[#a1a1aa]">
              <input
                type="checkbox"
                checked={form.billable}
                onChange={(e) => setForm(prev => ({ ...prev, billable: e.target.checked }))}
                className="rounded border-[#262626]"
              />
              Billable
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-[#a1a1aa] hover:text-[#fafafa]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="text-xs text-[#008070] hover:text-[#006b5d]"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg border border-[#262626] bg-[#171717] p-3 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-medium text-[#008070] flex-shrink-0">
            {formatDuration(entry.duration_minutes)}
          </span>
          <span className="text-sm text-[#fafafa] truncate">
            {entry.description || <span className="text-[#71717a]">(no description)</span>}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!entry.billable && (
            <span className="text-xs text-[#71717a]">Non-billable</span>
          )}
          <span className="text-xs text-[#a1a1aa]">
            {formatDate(entry.entry_date)}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 pt-2 border-t border-[#262626]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-[#71717a]">
              <span>By: {entry.user_name}</span>
              {entry.task && (
                <span>Task: {entry.task.title}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true) }}
                className="text-[#a1a1aa] hover:text-[#008070]"
              >
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete() }}
                className="text-[#a1a1aa] hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
