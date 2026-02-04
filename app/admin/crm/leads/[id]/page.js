// app/admin/crm/leads/[id]/page.js
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ScoreBadge from '@/Components/CRM/Shared/ScoreBadge'
import StageBadge, { STAGE_CONFIG } from '@/Components/CRM/Shared/StageBadge'
import SourceBadge from '@/Components/CRM/Shared/SourceBadge'

const STAGES = [
  'contact',
  'plan_audit_meeting',
  'discovery_call',
  'proposal',
  'offer',
  'negotiating',
  'won',
  'lost',
]

export default function LeadDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [lead, setLead] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStage, setUpdatingStage] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [savingHosting, setSavingHosting] = useState(false)

  useEffect(() => {
    fetchLead()
  }, [id])

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/crm/leads/${id}`)
      if (!res.ok) throw new Error('Failed to fetch lead')

      const data = await res.json()
      setLead(data)
      setActivities(data.activities || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStage = async (newStage) => {
    setUpdatingStage(true)
    try {
      const res = await fetch(`/api/crm/leads/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })

      if (!res.ok) throw new Error('Failed to update stage')

      const data = await res.json()
      setLead(data.lead)
      fetchLead() // Refresh to get updated activities
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingStage(false)
    }
  }

  const addNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setAddingNote(true)
    try {
      const res = await fetch(`/api/crm/leads/${id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'note',
          title: 'Note added',
          description: newNote,
        }),
      })

      if (!res.ok) throw new Error('Failed to add note')

      setNewNote('')
      fetchLead() // Refresh activities
    } catch (err) {
      alert(err.message)
    } finally {
      setAddingNote(false)
    }
  }

  const updateHostingInfo = async (updates) => {
    setSavingHosting(true)
    try {
      const res = await fetch(`/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!res.ok) throw new Error('Failed to update hosting info')

      const data = await res.json()
      setLead(data.lead)
    } catch (err) {
      alert(err.message)
    } finally {
      setSavingHosting(false)
    }
  }

  const toggleHasWebsite = () => {
    const newValue = !lead.has_website
    updateHostingInfo({
      has_website: newValue,
      // Clear dates if turning off
      ...(newValue ? {} : { hosting_start_date: null, hosting_expiry_date: null })
    })
  }

  const updateHostingDate = (field, value) => {
    updateHostingInfo({ [field]: value || null })
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getHostingStatus = () => {
    if (!lead?.hosting_expiry_date) return null
    const expiry = new Date(lead.hosting_expiry_date)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return { label: 'Expired', color: 'text-red-400 bg-red-500/10 ring-red-500/20' }
    } else if (daysUntilExpiry <= 30) {
      return { label: `Expires in ${daysUntilExpiry}d`, color: 'text-amber-400 bg-amber-500/10 ring-amber-500/20' }
    } else {
      return { label: 'Active', color: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20' }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'note':
        return <NoteIcon className="h-4 w-4" />
      case 'stage_change':
        return <StageIcon className="h-4 w-4" />
      case 'form_submission':
        return <FormIcon className="h-4 w-4" />
      case 'email_sent':
      case 'email_received':
        return <EmailIcon className="h-4 w-4" />
      case 'call':
        return <PhoneIcon className="h-4 w-4" />
      case 'hubspot_sync':
        return <SyncIcon className="h-4 w-4" />
      default:
        return <SystemIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || 'Lead not found'}</p>
        <Link href="/admin/crm/leads" className="text-[#008070] hover:underline">
          Back to leads
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/crm/leads"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to leads
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-[#fafafa]">
              {lead.full_name || lead.email}
            </h1>
            <ScoreBadge score={lead.score || 0} size="lg" />
          </div>
          {lead.company && (
            <p className="mt-1 text-lg text-[#a1a1aa]">{lead.company}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SourceBadge source={lead.source} />
          <StageBadge stage={lead.stage} />
        </div>
      </div>

      {/* Stage Pipeline */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
          Pipeline Stage
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STAGES.map((stage, index) => {
            const isCurrent = lead.stage === stage
            const isPast = STAGES.indexOf(lead.stage) > index
            const config = STAGE_CONFIG[stage]

            return (
              <button
                key={stage}
                onClick={() => !isCurrent && updateStage(stage)}
                disabled={updatingStage || isCurrent}
                className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[#008070] text-white'
                    : isPast
                    ? 'bg-[#171717] text-[#fafafa] hover:bg-[#262626]'
                    : 'bg-[#0a0a0a] text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa]'
                } border border-[#262626] disabled:cursor-not-allowed`}
              >
                {config?.label || stage}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lead Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact Info */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Contact Info
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-[#a1a1aa]">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${lead.email}`} className="text-[#008070] hover:underline">
                    {lead.email}
                  </a>
                </dd>
              </div>
              {lead.phone && (
                <div>
                  <dt className="text-xs text-[#a1a1aa]">Phone</dt>
                  <dd className="mt-1">
                    <a href={`tel:${lead.phone}`} className="text-[#fafafa] hover:text-[#008070]">
                      {lead.phone}
                    </a>
                  </dd>
                </div>
              )}
              {lead.website && (
                <div>
                  <dt className="text-xs text-[#a1a1aa]">Website</dt>
                  <dd className="mt-1">
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#008070] hover:underline"
                    >
                      {lead.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Hosting Info */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Hosting
              </h2>
              {lead.has_website && getHostingStatus() && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getHostingStatus().color}`}>
                  {getHostingStatus().label}
                </span>
              )}
            </div>

            {/* Has Website Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-[#262626]">
              <div>
                <p className="text-sm text-[#fafafa]">Has Website</p>
                <p className="text-xs text-[#a1a1aa]">Client has a site hosted with us</p>
              </div>
              <button
                onClick={toggleHasWebsite}
                disabled={savingHosting}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  lead.has_website ? 'bg-[#008070]' : 'bg-[#262626]'
                } ${savingHosting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    lead.has_website ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Hosting Dates - Only show when has_website is true */}
            {lead.has_website && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs text-[#a1a1aa]">Start Date</label>
                  <input
                    type="date"
                    value={lead.hosting_start_date ? lead.hosting_start_date.split('T')[0] : ''}
                    onChange={(e) => updateHostingDate('hosting_start_date', e.target.value)}
                    disabled={savingHosting}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa]">Expiry Date</label>
                  <input
                    type="date"
                    value={lead.hosting_expiry_date ? lead.hosting_expiry_date.split('T')[0] : ''}
                    onChange={(e) => updateHostingDate('hosting_expiry_date', e.target.value)}
                    disabled={savingHosting}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070] disabled:opacity-50"
                  />
                </div>

                {/* Quick Info */}
                {lead.hosting_start_date && lead.hosting_expiry_date && (
                  <div className="rounded-lg bg-[#171717] p-3 text-xs text-[#a1a1aa]">
                    <p>Started: {formatDateShort(lead.hosting_start_date)}</p>
                    <p>Expires: {formatDateShort(lead.hosting_expiry_date)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Business Info */}
          {(lead.business_type || lead.project_type || lead.budget_range || lead.timeline) && (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Business Info
              </h2>
              <dl className="space-y-4">
                {lead.business_type && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Business Type</dt>
                    <dd className="mt-1 text-[#fafafa]">{lead.business_type}</dd>
                  </div>
                )}
                {lead.project_type && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Project Type</dt>
                    <dd className="mt-1 text-[#fafafa]">{lead.project_type}</dd>
                  </div>
                )}
                {lead.budget_range && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Budget Range</dt>
                    <dd className="mt-1 text-[#fafafa]">{lead.budget_range}</dd>
                  </div>
                )}
                {lead.timeline && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Timeline</dt>
                    <dd className="mt-1 text-[#fafafa]">{lead.timeline}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Audit Scores */}
          {lead.audit_scores && (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Audit Scores
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(lead.audit_scores).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-[#fafafa]">{value}</div>
                    <div className="text-xs capitalize text-[#a1a1aa]">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UTM Data */}
          {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Attribution
              </h2>
              <dl className="space-y-3">
                {lead.utm_source && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Source</dt>
                    <dd className="mt-1 text-sm text-[#fafafa]">{lead.utm_source}</dd>
                  </div>
                )}
                {lead.utm_medium && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Medium</dt>
                    <dd className="mt-1 text-sm text-[#fafafa]">{lead.utm_medium}</dd>
                  </div>
                )}
                {lead.utm_campaign && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Campaign</dt>
                    <dd className="mt-1 text-sm text-[#fafafa]">{lead.utm_campaign}</dd>
                  </div>
                )}
                {lead.conversion_page && (
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Conversion Page</dt>
                    <dd className="mt-1 text-sm text-[#fafafa]">{lead.conversion_page}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Metadata */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Metadata
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-[#a1a1aa]">Created</dt>
                <dd className="mt-1 text-sm text-[#fafafa]">{formatDate(lead.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Last Activity</dt>
                <dd className="mt-1 text-sm text-[#fafafa]">{formatDate(lead.last_activity_at)}</dd>
              </div>
              {lead.hubspot_contact_id && (
                <div>
                  <dt className="text-xs text-[#a1a1aa]">HubSpot Contact</dt>
                  <dd className="mt-1 text-sm text-[#008070]">{lead.hubspot_contact_id}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Activity
            </h2>

            {/* Add Note Form */}
            <form onSubmit={addNote} className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full rounded-lg border border-[#262626] bg-[#171717] p-3 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim() || addingNote}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingNote ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Adding...
                    </>
                  ) : (
                    'Add Note'
                  )}
                </button>
              </div>
            </form>

            {/* Activity List */}
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-center text-sm text-[#a1a1aa]">No activity yet</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#171717] text-[#a1a1aa]">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#fafafa]">{activity.title}</p>
                          {activity.description && (
                            <p className="mt-1 text-sm text-[#a1a1aa] whitespace-pre-wrap">
                              {activity.description}
                            </p>
                          )}
                        </div>
                        <time className="flex-shrink-0 text-xs text-[#a1a1aa]">
                          {formatDate(activity.created_at)}
                        </time>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function NoteIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function StageIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  )
}

function FormIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  )
}

function EmailIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function SyncIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}

function SystemIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
