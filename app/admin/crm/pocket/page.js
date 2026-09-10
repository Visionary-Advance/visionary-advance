// app/admin/crm/pocket/page.js
// Pocket recording inbox — assign recordings that no tag resolved to a lead.
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getCRMAuthClient } from '@/lib/supabase-crm-client'

// Admin sessions live in localStorage, not cookies, so the access token has to
// be attached explicitly for the server to see it.
async function authFetch(url, options = {}) {
  const { data } = await getCRMAuthClient().auth.getSession()
  const token = data?.session?.access_token

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

const STATUS_TABS = [
  { value: 'unmatched', label: 'Inbox' },
  { value: 'matched', label: 'Linked' },
  { value: 'dismissed', label: 'Dismissed' },
]

function formatDuration(seconds) {
  if (!seconds) return null
  const mins = Math.round(seconds / 60)
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function formatDate(value) {
  if (!value) return 'Unknown date'
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function PocketInboxPage() {
  const [recordings, setRecordings] = useState([])
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('unmatched')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [selectedLead, setSelectedLead] = useState({})
  const [busyId, setBusyId] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  const fetchRecordings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authFetch(`/api/crm/pocket/inbox?status=${status}`)
      if (!res.ok) throw new Error('Failed to load recordings')
      const data = await res.json()
      setRecordings(data.recordings || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchRecordings()
  }, [fetchRecordings])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/crm/leads?limit=200')
        if (res.ok) {
          const data = await res.json()
          setLeads(data.leads || [])
        }
      } catch (err) {
        console.error('Failed to fetch leads:', err)
      }
    }
    fetchLeads()
  }, [])

  const handleResync = async () => {
    setSyncing(true)
    setError(null)
    setSyncResult(null)
    try {
      const res = await authFetch('/api/crm/pocket/inbox', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Resync failed')
      setSyncResult(data.results)
      await fetchRecordings()
    } catch (err) {
      setError(err.message)
    } finally {
      setSyncing(false)
    }
  }

  const handleAssign = async (recordingId) => {
    const leadId = selectedLead[recordingId]
    if (!leadId) return

    setBusyId(recordingId)
    try {
      const res = await authFetch(`/api/crm/pocket/inbox/${recordingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to assign')
      }
      await fetchRecordings()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const handleDismiss = async (recordingId) => {
    setBusyId(recordingId)
    try {
      const res = await authFetch(`/api/crm/pocket/inbox/${recordingId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to dismiss')
      await fetchRecordings()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Pocket Recordings</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Recordings tagged with a lead&apos;s email link themselves. Anything else waits here.
          </p>
        </div>
        <button
          onClick={handleResync}
          disabled={syncing}
          className="shrink-0 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-[#a1a1aa] transition-colors hover:text-[#fafafa] disabled:opacity-40"
        >
          {syncing ? 'Checking…' : 'Re-check tags'}
        </button>
      </div>

      {syncResult && (
        <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-[#a1a1aa]">
          Checked {syncResult.checked}, linked {syncResult.attached}
          {syncResult.discovered > 0 && `, found ${syncResult.discovered} new`}.
        </div>
      )}

      {/* Status tabs */}
      <div className="flex items-center gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? 'bg-[#008070] text-white'
                : 'border border-[#262626] bg-[#0a0a0a] text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-[#71717a]">Loading…</div>
      ) : recordings.length === 0 ? (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-8 text-center">
          <p className="text-sm text-[#71717a]">No recordings here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recordings.map((rec) => {
            const isOpen = expanded === rec.id
            const duration = formatDuration(rec.duration_seconds)
            const items = rec.action_items || []

            return (
              <div
                key={rec.id}
                className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#fafafa]">
                      {rec.summary_title || rec.title || 'Untitled recording'}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#71717a]">
                      <span>{formatDate(rec.recorded_at)}</span>
                      {duration && <span>{duration}</span>}
                      {items.length > 0 && (
                        <span>{items.length} action item{items.length === 1 ? '' : 's'}</span>
                      )}
                      {rec.lead && (
                        <Link
                          href={`/admin/crm/leads/${rec.lead.id}`}
                          className="text-[#008070] hover:underline"
                        >
                          {rec.lead.full_name || rec.lead.email}
                        </Link>
                      )}
                    </div>
                    {rec.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rec.tags.map((tag, i) => (
                          <span
                            key={tag.id || i}
                            className="rounded-md border border-[#262626] px-2 py-0.5 text-[11px] text-[#a1a1aa]"
                          >
                            {typeof tag === 'string' ? tag : tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setExpanded(isOpen ? null : rec.id)}
                    className="shrink-0 rounded-lg border border-[#262626] px-3 py-1.5 text-xs text-[#a1a1aa] transition-colors hover:text-[#fafafa]"
                  >
                    {isOpen ? 'Hide' : 'Summary'}
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-4 space-y-3 border-t border-[#262626] pt-4">
                    {rec.summary_markdown ? (
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#a1a1aa]">
                        {rec.summary_markdown}
                      </pre>
                    ) : (
                      <p className="text-sm text-[#71717a]">No summary text.</p>
                    )}
                    {items.length > 0 && (
                      <ul className="space-y-1 text-sm text-[#a1a1aa]">
                        {items.map((item, i) => (
                          <li key={i}>
                            • {item.title}
                            {item.due_date && (
                              <span className="text-[#71717a]"> — due {item.due_date}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {rec.status === 'unmatched' && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#262626] pt-4">
                    <select
                      value={selectedLead[rec.id] || ''}
                      onChange={(e) =>
                        setSelectedLead({ ...selectedLead, [rec.id]: e.target.value })
                      }
                      className="min-w-0 flex-1 rounded-lg border border-[#262626] bg-[#000000] px-3 py-2 text-sm text-[#fafafa]"
                    >
                      <option value="">Link to a lead…</option>
                      {leads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.full_name || lead.email}
                          {lead.company ? ` · ${lead.company}` : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssign(rec.id)}
                      disabled={!selectedLead[rec.id] || busyId === rec.id}
                      className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:opacity-40"
                    >
                      {busyId === rec.id ? 'Linking…' : 'Link'}
                    </button>
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      disabled={busyId === rec.id}
                      className="rounded-lg border border-[#262626] px-4 py-2 text-sm text-[#a1a1aa] transition-colors hover:text-[#fafafa] disabled:opacity-40"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
