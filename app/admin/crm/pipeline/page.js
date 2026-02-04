// app/admin/crm/pipeline/page.js
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ScoreBadge from '@/Components/CRM/Shared/ScoreBadge'
import SourceBadge from '@/Components/CRM/Shared/SourceBadge'

// Custom scrollbar styles for the kanban board
const scrollbarStyles = `
  .kanban-scroll::-webkit-scrollbar {
    height: 8px;
    background: transparent;
  }
  .kanban-scroll::-webkit-scrollbar-track {
    background: #171717;
    border-radius: 4px;
  }
  .kanban-scroll::-webkit-scrollbar-thumb {
    background: #262626;
    border-radius: 4px;
  }
  .kanban-scroll::-webkit-scrollbar-thumb:hover {
    background: #404040;
  }
  .column-scroll::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  .column-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .column-scroll::-webkit-scrollbar-thumb {
    background: #262626;
    border-radius: 3px;
  }
  .column-scroll::-webkit-scrollbar-thumb:hover {
    background: #404040;
  }
`

const STAGES = [
  { key: 'contact', label: 'Contact', color: '#6b7280' },
  { key: 'plan_audit_meeting', label: 'Plan Audit Meeting', color: '#8b5cf6' },
  { key: 'discovery_call', label: 'Discovery Call', color: '#3b82f6' },
  { key: 'proposal', label: 'Proposal', color: '#f59e0b' },
  { key: 'offer', label: 'Offer', color: '#ec4899' },
  { key: 'negotiating', label: 'Negotiating', color: '#f97316' },
  { key: 'won', label: 'Won', color: '#10b981' },
  { key: 'lost', label: 'Lost', color: '#ef4444' },
]

export default function PipelinePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingLead, setUpdatingLead] = useState(null)
  const [draggedLead, setDraggedLead] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)

  useEffect(() => {
    fetchPipeline()
  }, [])

  const fetchPipeline = async () => {
    try {
      const res = await fetch('/api/crm/pipeline')
      if (!res.ok) throw new Error('Failed to fetch pipeline')

      const result = await res.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const moveToStage = async (leadId, newStage) => {
    setUpdatingLead(leadId)
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })

      if (!res.ok) throw new Error('Failed to update stage')

      fetchPipeline() // Refresh data
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingLead(null)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, lead, currentStage) => {
    setDraggedLead({ ...lead, currentStage })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', lead.id)
    // Add a slight delay to show the drag ghost
    setTimeout(() => {
      e.target.style.opacity = '0.5'
    }, 0)
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedLead(null)
    setDragOverStage(null)
  }

  const handleDragOver = (e, stageKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverStage !== stageKey) {
      setDragOverStage(stageKey)
    }
  }

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null)
    }
  }

  const handleDrop = (e, targetStage) => {
    e.preventDefault()
    setDragOverStage(null)

    if (draggedLead && draggedLead.currentStage !== targetStage) {
      moveToStage(draggedLead.id, targetStage)
    }
    setDraggedLead(null)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchPipeline} className="text-[#008070] hover:underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Inject custom scrollbar styles */}
      <style>{scrollbarStyles}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Pipeline</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Drag and drop leads between stages to update their status
          </p>
        </div>
        <Link
          href="/admin/crm/leads"
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-[#fafafa] transition-colors hover:bg-[#171717]"
        >
          View as List
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard label="Total Leads" value={data?.summary?.totalLeads || 0} />
        <SummaryCard label="New This Week" value={data?.summary?.newThisWeek || 0} />
        <SummaryCard label="In Pipeline" value={data?.summary?.activeLeads || 0} />
        <SummaryCard label="Won" value={data?.summary?.won || 0} color="#10b981" />
        <SummaryCard label="Win Rate" value={data?.summary?.winRate || 0} suffix="%" />
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 kanban-scroll">
        <div className="inline-flex gap-4 min-w-full">
          {STAGES.map((stage) => {
            const leads = data?.leadsByStage?.[stage.key] || []
            const count = leads.length
            const isDropTarget = dragOverStage === stage.key && draggedLead?.currentStage !== stage.key

            return (
              <div
                key={stage.key}
                className={`flex w-72 flex-shrink-0 flex-col rounded-xl border bg-[#0a0a0a] transition-all duration-200 ${
                  isDropTarget
                    ? 'border-[#008070] ring-2 ring-[#008070]/30 bg-[#008070]/5'
                    : 'border-[#262626]'
                }`}
                onDragOver={(e) => handleDragOver(e, stage.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.key)}
              >
                {/* Column Header */}
                <div
                  className="flex items-center justify-between rounded-t-xl border-b border-[#262626] px-4 py-3"
                  style={{ borderTopColor: stage.color, borderTopWidth: 3 }}
                >
                  <h3 className="text-sm font-medium text-[#fafafa]">{stage.label}</h3>
                  <span className="rounded-full bg-[#171717] px-2 py-0.5 text-xs text-[#a1a1aa]">
                    {count}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto p-3 column-scroll" style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '100px' }}>
                  {leads.length === 0 ? (
                    <p className={`py-8 text-center text-xs ${isDropTarget ? 'text-[#008070]' : 'text-[#a1a1aa]'}`}>
                      {isDropTarget ? 'Drop here' : 'No leads'}
                    </p>
                  ) : (
                    leads.map((lead) => (
                      <PipelineCard
                        key={lead.id}
                        lead={lead}
                        currentStage={stage.key}
                        stages={STAGES}
                        onMove={moveToStage}
                        isUpdating={updatingLead === lead.id}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedLead?.id === lead.id}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, suffix = '', color }) {
  return (
    <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">{label}</p>
      <p className="mt-2 text-2xl font-semibold" style={{ color: color || '#fafafa' }}>
        {value}
        {suffix && <span className="text-lg text-[#a1a1aa]">{suffix}</span>}
      </p>
    </div>
  )
}

function PipelineCard({ lead, currentStage, stages, onMove, isUpdating, onDragStart, onDragEnd, isDragging }) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)

  const handleMenuOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: Math.min(rect.right - 192, window.innerWidth - 200), // 192 = menu width (w-48)
      })
    }
    setShowMenu(!showMenu)
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead, currentStage)}
      onDragEnd={onDragEnd}
      className={`group relative rounded-lg border border-[#262626] bg-[#171717] p-3 transition-all hover:border-[#404040] cursor-grab active:cursor-grabbing ${
        isUpdating ? 'opacity-50 pointer-events-none' : ''
      } ${isDragging ? 'opacity-50 ring-2 ring-[#008070]' : ''}`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2">
        <Link href={`/admin/crm/leads/${lead.id}`} className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-[#fafafa] hover:text-[#008070]">
            {lead.full_name || lead.email}
          </p>
          {lead.company && (
            <p className="truncate text-xs text-[#a1a1aa]">{lead.company}</p>
          )}
        </Link>
        <ScoreBadge score={lead.score || 0} size="sm" />
      </div>

      {/* Card Footer */}
      <div className="mt-3 flex items-center justify-between">
        <SourceBadge source={lead.source} />
        <span className="text-xs text-[#a1a1aa]">{formatTime(lead.created_at)}</span>
      </div>

      {/* Move Menu Button */}
      <button
        ref={buttonRef}
        onClick={handleMenuOpen}
        className="absolute -right-1 -top-1 hidden rounded-lg bg-[#262626] p-1.5 text-[#a1a1aa] shadow-lg hover:bg-[#404040] hover:text-[#fafafa] group-hover:block"
      >
        <DotsIcon className="h-4 w-4" />
      </button>

      {/* Move Menu - Fixed position to avoid overflow clipping */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="fixed z-50 w-48 rounded-lg border border-[#262626] bg-[#171717] py-1 shadow-xl"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
              Move to
            </p>
            {stages.map((stage) => (
              <button
                key={stage.key}
                onClick={() => {
                  if (stage.key !== currentStage) {
                    onMove(lead.id, stage.key)
                  }
                  setShowMenu(false)
                }}
                disabled={stage.key === currentStage}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  stage.key === currentStage
                    ? 'cursor-not-allowed bg-[#262626] text-[#a1a1aa]'
                    : 'text-[#fafafa] hover:bg-[#262626]'
                }`}
              >
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                {stage.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DotsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  )
}
