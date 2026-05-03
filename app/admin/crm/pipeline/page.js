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

  // Won modal state
  const [wonModal, setWonModal] = useState(null) // { leadId, leadName }

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

  const moveToStage = async (leadId, newStage, lead = null) => {
    // Intercept moves to 'won' - show modal first
    if (newStage === 'won') {
      setWonModal({
        leadId,
        leadName: lead?.full_name || lead?.email || 'This lead',
      })
      return
    }

    setUpdatingLead(leadId)
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })

      if (!res.ok) throw new Error('Failed to update stage')

      fetchPipeline()
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingLead(null)
    }
  }

  const handleWonConfirm = async ({ leadId, businessOption, businessName, businessWebsite, existingBusinessId }) => {
    setUpdatingLead(leadId)
    setWonModal(null)
    try {
      // 1. Move lead to won (auto-converts to client)
      const stageRes = await fetch(`/api/crm/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: 'won' }),
      })
      if (!stageRes.ok) throw new Error('Failed to update stage')

      // 2. Handle business linking
      if (businessOption === 'new' && businessName.trim()) {
        // Create new business
        const bizRes = await fetch('/api/crm/businesses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: businessName.trim(), website: businessWebsite.trim() || undefined }),
        })
        if (!bizRes.ok) throw new Error('Failed to create business')
        const bizData = await bizRes.json()

        // Link client to new business
        await fetch(`/api/crm/businesses/${bizData.business.id}/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId }),
        })
      } else if (businessOption === 'existing' && existingBusinessId) {
        // Link client to existing business
        await fetch(`/api/crm/businesses/${existingBusinessId}/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId }),
        })
      }

      fetchPipeline()
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
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null)
    }
  }

  const handleDrop = (e, targetStage) => {
    e.preventDefault()
    setDragOverStage(null)

    if (draggedLead && draggedLead.currentStage !== targetStage) {
      moveToStage(draggedLead.id, targetStage, draggedLead)
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
                      {isDropTarget ? 'Drop here' : stage.key === 'won' ? 'No clients yet' : 'No leads'}
                    </p>
                  ) : (
                    leads.map((lead) => (
                      <PipelineCard
                        key={lead.id}
                        lead={lead}
                        currentStage={stage.key}
                        stages={STAGES}
                        onMove={(leadId, newStage) => moveToStage(leadId, newStage, lead)}
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

      {/* Won Modal */}
      {wonModal && (
        <WonModal
          leadName={wonModal.leadName}
          onConfirm={(opts) => handleWonConfirm({ leadId: wonModal.leadId, ...opts })}
          onCancel={() => setWonModal(null)}
        />
      )}
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

  const isWonClient = lead.is_client === true
  const clientHref = lead.business_id
    ? `/admin/crm/businesses/${lead.business_id}`
    : `/admin/crm/clients/${lead.id}`

  const handleMenuOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: Math.min(rect.right - 192, window.innerWidth - 200),
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
      draggable={!isWonClient}
      onDragStart={!isWonClient ? (e) => onDragStart(e, lead, currentStage) : undefined}
      onDragEnd={!isWonClient ? onDragEnd : undefined}
      className={`group relative rounded-lg border bg-[#171717] p-3 transition-all ${
        isWonClient
          ? 'border-emerald-500/30 cursor-default'
          : 'border-[#262626] hover:border-[#404040] cursor-grab active:cursor-grabbing'
      } ${isUpdating ? 'opacity-50 pointer-events-none' : ''} ${isDragging ? 'opacity-50 ring-2 ring-[#008070]' : ''}`}
    >
      {/* Won client indicator strip */}
      {isWonClient && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-emerald-500/60" />
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-2">
        <Link href={isWonClient ? clientHref : `/admin/crm/leads/${lead.id}`} className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-[#fafafa] hover:text-[#008070]">
            {lead.full_name || lead.email}
          </p>
          {isWonClient && lead.business ? (
            <p className="truncate text-xs text-emerald-400/80">{lead.business.name}</p>
          ) : lead.company ? (
            <p className="truncate text-xs text-[#a1a1aa]">{lead.company}</p>
          ) : null}
        </Link>
        {isWonClient ? (
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
            Client
          </span>
        ) : (
          <ScoreBadge score={lead.score || 0} size="sm" />
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-3 flex items-center justify-between">
        {isWonClient ? (
          <Link
            href={clientHref}
            className="text-xs text-[#a1a1aa] hover:text-[#008070] transition-colors"
          >
            {lead.business ? 'View business →' : 'View client →'}
          </Link>
        ) : (
          <SourceBadge source={lead.source} />
        )}
        <span className="text-xs text-[#a1a1aa]">{formatTime(lead.created_at)}</span>
      </div>

      {/* Move Menu Button - only for non-won leads */}
      {!isWonClient && (
        <button
          ref={buttonRef}
          onClick={handleMenuOpen}
          className="absolute -right-1 -top-1 hidden rounded-lg bg-[#262626] p-1.5 text-[#a1a1aa] shadow-lg hover:bg-[#404040] hover:text-[#fafafa] group-hover:block"
        >
          <DotsIcon className="h-4 w-4" />
        </button>
      )}

      {/* Move Menu */}
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

function WonModal({ leadName, onConfirm, onCancel }) {
  const [mode, setMode] = useState('new') // 'new' | 'existing' | 'skip'
  const [businessName, setBusinessName] = useState('')
  const [businessWebsite, setBusinessWebsite] = useState('')
  const [businessSearch, setBusinessSearch] = useState('')
  const [businesses, setBusinesses] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (mode !== 'existing') return
    if (!businessSearch.trim()) {
      setBusinesses([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/crm/businesses?search=${encodeURIComponent(businessSearch)}&limit=10`)
        const data = await res.json()
        setBusinesses(data.businesses || [])
      } catch {
        setBusinesses([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [businessSearch, mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (mode === 'new' && !businessName.trim()) {
      // If they switched to new but left name empty, treat as skip
    }

    setSubmitting(true)
    onConfirm({
      businessOption: mode,
      businessName,
      businessWebsite,
      existingBusinessId: selectedBusiness?.id || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#262626] bg-[#0a0a0a] shadow-2xl">
        {/* Header */}
        <div className="border-b border-[#262626] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#fafafa]">Deal Won!</h2>
              <p className="text-sm text-[#a1a1aa]">{leadName} has been converted to a client</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-[#a1a1aa]">Link this client to a business file:</p>

          {/* Mode selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'new', label: 'New Business' },
              { key: 'existing', label: 'Existing' },
              { key: 'skip', label: 'Skip' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  mode === key
                    ? 'border-[#008070] bg-[#008070]/10 text-[#00a090]'
                    : 'border-[#262626] text-[#a1a1aa] hover:border-[#404040] hover:text-[#fafafa]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* New Business fields */}
          {mode === 'new' && (
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#4a4a4a] outline-none focus:border-[#008070] focus:ring-1 focus:ring-[#008070]/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">Website</label>
                <input
                  type="text"
                  value={businessWebsite}
                  onChange={(e) => setBusinessWebsite(e.target.value)}
                  placeholder="https://acmecorp.com"
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#4a4a4a] outline-none focus:border-[#008070] focus:ring-1 focus:ring-[#008070]/30"
                />
              </div>
            </div>
          )}

          {/* Existing Business search */}
          {mode === 'existing' && (
            <div className="space-y-2">
              <input
                autoFocus
                type="text"
                value={businessSearch}
                onChange={(e) => {
                  setBusinessSearch(e.target.value)
                  setSelectedBusiness(null)
                }}
                placeholder="Search businesses..."
                className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#4a4a4a] outline-none focus:border-[#008070] focus:ring-1 focus:ring-[#008070]/30"
              />

              {selectedBusiness && (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                  <span className="text-sm text-emerald-400">{selectedBusiness.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedBusiness(null)}
                    className="text-[#a1a1aa] hover:text-[#fafafa]"
                  >
                    ×
                  </button>
                </div>
              )}

              {!selectedBusiness && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-[#262626] bg-[#0a0a0a]">
                  {searching ? (
                    <p className="py-4 text-center text-xs text-[#a1a1aa]">Searching...</p>
                  ) : businesses.length === 0 && businessSearch ? (
                    <p className="py-4 text-center text-xs text-[#a1a1aa]">No businesses found</p>
                  ) : businesses.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#a1a1aa]">Type to search</p>
                  ) : (
                    businesses.map((biz) => (
                      <button
                        key={biz.id}
                        type="button"
                        onClick={() => setSelectedBusiness(biz)}
                        className="w-full px-3 py-2.5 text-left text-sm text-[#fafafa] hover:bg-[#171717] transition-colors"
                      >
                        <span className="font-medium">{biz.name}</span>
                        {biz.website && (
                          <span className="ml-2 text-xs text-[#a1a1aa]">{biz.website}</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {mode === 'skip' && (
            <p className="rounded-lg border border-[#262626] bg-[#171717] px-3 py-3 text-sm text-[#a1a1aa]">
              The client will be added without a business link. You can link them later from the Businesses page.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-[#fafafa] transition-colors hover:bg-[#171717]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (mode === 'new' && !businessName.trim()) || (mode === 'existing' && !selectedBusiness)}
              className="flex-1 rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006a5e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Converting...' : mode === 'skip' ? 'Convert to Client' : 'Convert & Link'}
            </button>
          </div>
          {mode === 'new' && !businessName.trim() && (
            <p className="text-center text-xs text-[#a1a1aa]">
              Enter a business name or choose "Skip"
            </p>
          )}
        </form>
      </div>
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

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
