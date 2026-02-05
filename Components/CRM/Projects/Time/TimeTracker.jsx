'use client'

import { useState, useEffect } from 'react'
import TimeEntryForm from './TimeEntryForm'
import TimeEntryList from './TimeEntryList'

export default function TimeTracker({ projectId, estimatedHours, onUpdate }) {
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTimeData()
  }, [projectId])

  const fetchTimeData = async () => {
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/time?summary=true`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries || [])
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Failed to fetch time data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEntryCreated = (newEntry) => {
    setEntries(prev => [newEntry, ...prev])
    setShowForm(false)
    fetchTimeData() // Refresh summary
    onUpdate?.()
  }

  const handleEntryUpdated = (updatedEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e))
    fetchTimeData() // Refresh summary
    onUpdate?.()
  }

  const handleEntryDeleted = (entryId) => {
    setEntries(prev => prev.filter(e => e.id !== entryId))
    fetchTimeData() // Refresh summary
    onUpdate?.()
  }

  const formatHours = (hours) => {
    if (!hours && hours !== 0) return '-'
    return `${hours}h`
  }

  const percentUsed = summary?.percent_used
  const isOverBudget = percentUsed && percentUsed > 100
  const isNearBudget = percentUsed && percentUsed > 80 && percentUsed <= 100

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
          Time Tracking
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-[#008070] px-3 py-1 text-xs font-medium text-white hover:bg-[#006b5d]"
        >
          + Log Time
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-[#171717] p-3 border border-[#262626]">
          <div className="text-xs text-[#a1a1aa]">Logged</div>
          <div className="text-xl font-semibold text-[#fafafa]">
            {formatHours(summary?.total_hours || 0)}
          </div>
        </div>
        <div className="rounded-lg bg-[#171717] p-3 border border-[#262626]">
          <div className="text-xs text-[#a1a1aa]">Billable</div>
          <div className="text-xl font-semibold text-[#008070]">
            {formatHours(summary?.billable_hours || 0)}
          </div>
        </div>
        <div className="rounded-lg bg-[#171717] p-3 border border-[#262626]">
          <div className="text-xs text-[#a1a1aa]">Estimated</div>
          <div className="text-xl font-semibold text-[#fafafa]">
            {formatHours(estimatedHours || summary?.estimated_hours)}
          </div>
        </div>
      </div>

      {/* Progress bar (if estimated hours set) */}
      {(estimatedHours || summary?.estimated_hours) && (
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#a1a1aa]">Budget Usage</span>
            <span className={
              isOverBudget ? 'text-red-400' :
              isNearBudget ? 'text-amber-400' :
              'text-[#a1a1aa]'
            }>
              {percentUsed ? `${percentUsed}%` : '0%'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#262626] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-red-500' :
                isNearBudget ? 'bg-amber-500' :
                'bg-[#008070]'
              }`}
              style={{ width: `${Math.min(percentUsed || 0, 100)}%` }}
            />
          </div>
          {isOverBudget && (
            <p className="text-xs text-red-400 mt-1">
              Over budget by {formatHours(summary?.total_hours - (estimatedHours || summary?.estimated_hours))}
            </p>
          )}
        </div>
      )}

      {/* Time Entry Form */}
      {showForm && (
        <TimeEntryForm
          projectId={projectId}
          onSave={handleEntryCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Time Entries List */}
      <TimeEntryList
        entries={entries.slice(0, 10)}
        projectId={projectId}
        onUpdate={handleEntryUpdated}
        onDelete={handleEntryDeleted}
      />

      {entries.length > 10 && (
        <div className="text-center">
          <button className="text-xs text-[#008070] hover:underline">
            View all {entries.length} entries
          </button>
        </div>
      )}
    </div>
  )
}
