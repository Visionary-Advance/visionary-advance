'use client'

import { useState } from 'react'

export default function MilestoneTimeline({ projectId, milestones = [], onUpdate }) {
  const [newMilestone, setNewMilestone] = useState({ name: '', due_date: '' })
  const [adding, setAdding] = useState(false)
  const [completing, setCompleting] = useState(null)

  const handleAddMilestone = async () => {
    if (!newMilestone.name.trim()) return

    setAdding(true)
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          milestone: {
            name: newMilestone.name.trim(),
            due_date: newMilestone.due_date || null,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to add milestone')

      const data = await res.json()
      if (onUpdate) onUpdate(data.project)
      setNewMilestone({ name: '', due_date: '' })
    } catch (err) {
      alert(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleComplete = async (milestoneId) => {
    setCompleting(milestoneId)
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          milestone_id: milestoneId,
        }),
      })

      if (!res.ok) throw new Error('Failed to complete milestone')

      const data = await res.json()
      if (onUpdate) onUpdate(data.project)
    } catch (err) {
      alert(err.message)
    } finally {
      setCompleting(null)
    }
  }

  const formatDate = (date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const isOverdue = (milestone) => {
    if (!milestone.due_date || milestone.status === 'completed') return false
    return new Date(milestone.due_date) < new Date()
  }

  // Sort: incomplete first (by due date), then completed (by completed_at)
  const sortedMilestones = [...milestones].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1
    if (a.status !== 'completed' && b.status === 'completed') return -1
    if (a.status === 'completed') {
      return new Date(b.completed_at) - new Date(a.completed_at)
    }
    if (!a.due_date) return 1
    if (!b.due_date) return -1
    return new Date(a.due_date) - new Date(b.due_date)
  })

  return (
    <div className="space-y-4">
      {/* Timeline */}
      {sortedMilestones.length > 0 ? (
        <div className="space-y-3">
          {sortedMilestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`flex items-start gap-3 ${
                milestone.status === 'completed' ? 'opacity-60' : ''
              }`}
            >
              {/* Status indicator */}
              <button
                onClick={() => milestone.status !== 'completed' && handleComplete(milestone.id)}
                disabled={milestone.status === 'completed' || completing === milestone.id}
                className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  milestone.status === 'completed'
                    ? 'border-[#008070] bg-[#008070]'
                    : isOverdue(milestone)
                    ? 'border-red-400 hover:bg-red-400/20'
                    : 'border-[#a1a1aa] hover:border-[#008070] hover:bg-[#008070]/20'
                } ${completing === milestone.id ? 'opacity-50' : ''}`}
              >
                {milestone.status === 'completed' && (
                  <CheckIcon className="h-3 w-3 text-white" />
                )}
                {completing === milestone.id && (
                  <div className="h-3 w-3 animate-spin rounded-full border border-[#a1a1aa] border-t-transparent" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm ${
                      milestone.status === 'completed'
                        ? 'line-through text-[#a1a1aa]'
                        : 'text-[#fafafa]'
                    }`}
                  >
                    {milestone.name}
                  </span>
                  {milestone.due_date && (
                    <span
                      className={`flex-shrink-0 text-xs ${
                        isOverdue(milestone)
                          ? 'text-red-400'
                          : 'text-[#a1a1aa]'
                      }`}
                    >
                      {isOverdue(milestone) && <span className="mr-1">Overdue:</span>}
                      {formatDate(milestone.due_date)}
                    </span>
                  )}
                </div>
                {milestone.completed_at && (
                  <span className="text-xs text-[#a1a1aa]">
                    Completed {formatDate(milestone.completed_at)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#a1a1aa] text-center py-4">No milestones yet</p>
      )}

      {/* Add milestone form */}
      <div className="flex items-end gap-2 pt-2 border-t border-[#262626]">
        <div className="flex-1">
          <input
            type="text"
            value={newMilestone.name}
            onChange={(e) => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Add milestone..."
            className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none"
          />
        </div>
        <input
          type="date"
          value={newMilestone.due_date}
          onChange={(e) => setNewMilestone(prev => ({ ...prev, due_date: e.target.value }))}
          className="rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
        />
        <button
          onClick={handleAddMilestone}
          disabled={!newMilestone.name.trim() || adding}
          className="rounded-lg bg-[#008070] px-3 py-2 text-sm text-white hover:bg-[#006b5d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? '...' : 'Add'}
        </button>
      </div>
    </div>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
