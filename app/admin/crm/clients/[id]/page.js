// app/admin/crm/clients/[id]/page.js
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PinButton from '@/Components/CRM/Shared/PinButton'

const ACTIVITY_TYPES = [
  { key: 'note', label: 'Note', icon: 'note' },
  { key: 'call', label: 'Call', icon: 'call' },
  { key: 'email_sent', label: 'Email', icon: 'email' },
  { key: 'meeting', label: 'Meeting', icon: 'meeting' },
  { key: 'visit', label: 'Visit', icon: 'visit' },
  { key: 'task', label: 'Task', icon: 'task' },
]

export default function ClientDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [client, setClient] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [activityType, setActivityType] = useState('note')
  const [addingNote, setAddingNote] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    fetchClient()
  }, [id])

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/crm/leads/${id}`)
      if (!res.ok) throw new Error('Failed to fetch client')

      const data = await res.json()

      // Redirect to leads page if not a client
      if (!data.is_client && data.stage !== 'won') {
        router.replace(`/admin/crm/leads/${id}`)
        return
      }

      setClient(data)
      setActivities(data.activities || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setAddingNote(true)
    try {
      const typeConfig = ACTIVITY_TYPES.find(t => t.key === activityType)
      const title = `${typeConfig?.label || 'Note'} logged`

      const res = await fetch(`/api/crm/leads/${id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activityType,
          title,
          description: newNote,
        }),
      })

      if (!res.ok) throw new Error('Failed to add activity')

      setNewNote('')
      setActivityType('note')
      fetchClient()
    } catch (err) {
      alert(err.message)
    } finally {
      setAddingNote(false)
    }
  }

  const handlePinToggle = () => {
    fetchClient()
  }

  const handleSaveEdit = async () => {
    setSavingEdit(true)
    try {
      const payload = { ...editData }

      const firstName = payload.first_name ?? client.first_name ?? ''
      const lastName = payload.last_name ?? client.last_name ?? ''
      if (payload.first_name !== undefined || payload.last_name !== undefined) {
        payload.full_name = `${firstName} ${lastName}`.trim() || null
      }

      const res = await fetch(`/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to update')

      const data = await res.json()
      setClient(prev => ({ ...prev, ...data.lead }))
      setEditing(false)
      setEditData({})
    } catch (err) {
      alert(err.message)
    } finally {
      setSavingEdit(false)
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
      case 'meeting':
        return <MeetingIcon className="h-4 w-4" />
      case 'visit':
        return <VisitIcon className="h-4 w-4" />
      case 'task':
        return <TaskIcon className="h-4 w-4" />
      case 'hubspot_sync':
        return <SyncIcon className="h-4 w-4" />
      default:
        return <SystemIcon className="h-4 w-4" />
    }
  }

  const pinnedActivities = activities.filter(a => a.is_pinned)
  const regularActivities = activities.filter(a => !a.is_pinned)
  const pinnableTypes = ['note', 'email_sent', 'email_received', 'call', 'meeting', 'visit', 'task']

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || 'Client not found'}</p>
        <Link href="/admin/crm/clients" className="text-[#008070] hover:underline">
          Back to clients
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
            href="/admin/crm/clients"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to clients
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-[#fafafa]">
              {client.full_name || client.email}
            </h1>
          </div>
          {client.company && (
            <p className="mt-1 text-lg text-[#a1a1aa]">{client.company}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Client
          </span>
          {editing ? (
            <>
              <button
                onClick={() => { setEditing(false); setEditData({}) }}
                className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
              >
                {savingEdit ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => { setEditData({}); setEditing(true) }}
              className="rounded-lg border border-[#262626] bg-[#171717] px-4 py-2 text-sm text-[#fafafa] hover:bg-[#262626]"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact Info */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Contact Info
            </h2>
            <dl className="space-y-4">
              {editing ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">First Name</dt>
                      <input
                        type="text"
                        value={editData.first_name ?? client.first_name ?? ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                      />
                    </div>
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Last Name</dt>
                      <input
                        type="text"
                        value={editData.last_name ?? client.last_name ?? ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Email</dt>
                    <input
                      type="email"
                      value={editData.email ?? client.email ?? ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                    />
                  </div>
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Phone</dt>
                    <input
                      type="tel"
                      value={editData.phone ?? client.phone ?? ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                    />
                  </div>
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Website</dt>
                    <input
                      type="url"
                      value={editData.website ?? client.website ?? ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                      className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="text-xs text-[#a1a1aa]">Email</dt>
                    <dd className="mt-1">
                      <a href={`mailto:${client.email}`} className="text-[#008070] hover:underline">
                        {client.email}
                      </a>
                    </dd>
                  </div>
                  {client.phone && (
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Phone</dt>
                      <dd className="mt-1">
                        <a href={`tel:${client.phone}`} className="text-[#fafafa] hover:text-[#008070]">
                          {client.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {client.website && (
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Website</dt>
                      <dd className="mt-1">
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#008070] hover:underline"
                        >
                          {client.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </>
              )}
            </dl>
          </div>

          {/* Business Info */}
          {(editing || client.company || client.business_type || client.project_type || client.budget_range || client.timeline) && (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Business Info
              </h2>
              <dl className="space-y-4">
                {editing ? (
                  <>
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Company</dt>
                      <input
                        type="text"
                        value={editData.company ?? client.company ?? ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                      />
                    </div>
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Business Type</dt>
                      <input
                        type="text"
                        value={editData.business_type ?? client.business_type ?? ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, business_type: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                      />
                    </div>
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Project Type</dt>
                      <input
                        type="text"
                        value={editData.project_type ?? client.project_type ?? ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, project_type: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                      />
                    </div>
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Budget Range</dt>
                      <input
                        type="text"
                        value={editData.budget_range ?? client.budget_range ?? ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, budget_range: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                      />
                    </div>
                    <div>
                      <dt className="text-xs text-[#a1a1aa]">Timeline</dt>
                      <input
                        type="text"
                        value={editData.timeline ?? client.timeline ?? ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {client.company && (
                      <div>
                        <dt className="text-xs text-[#a1a1aa]">Company</dt>
                        <dd className="mt-1">
                          {client.website ? (
                            <a
                              href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#008070] hover:underline inline-flex items-center gap-1"
                            >
                              {client.company}
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-[#fafafa]">{client.company}</span>
                          )}
                        </dd>
                      </div>
                    )}
                    {client.business_type && (
                      <div>
                        <dt className="text-xs text-[#a1a1aa]">Business Type</dt>
                        <dd className="mt-1 text-[#fafafa]">{client.business_type}</dd>
                      </div>
                    )}
                    {client.project_type && (
                      <div>
                        <dt className="text-xs text-[#a1a1aa]">Project Type</dt>
                        <dd className="mt-1 text-[#fafafa]">{client.project_type}</dd>
                      </div>
                    )}
                    {client.budget_range && (
                      <div>
                        <dt className="text-xs text-[#a1a1aa]">Budget Range</dt>
                        <dd className="mt-1 text-[#fafafa]">{client.budget_range}</dd>
                      </div>
                    )}
                    {client.timeline && (
                      <div>
                        <dt className="text-xs text-[#a1a1aa]">Timeline</dt>
                        <dd className="mt-1 text-[#fafafa]">{client.timeline}</dd>
                      </div>
                    )}
                  </>
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
                <dt className="text-xs text-[#a1a1aa]">Lead Created</dt>
                <dd className="mt-1 text-sm text-[#fafafa]">{formatDate(client.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Client Since</dt>
                <dd className="mt-1 text-sm text-emerald-400">{formatDate(client.client_since)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Last Activity</dt>
                <dd className="mt-1 text-sm text-[#fafafa]">{formatDate(client.last_activity_at)}</dd>
              </div>
              {client.hubspot_contact_id && (
                <div>
                  <dt className="text-xs text-[#a1a1aa]">HubSpot Contact</dt>
                  <dd className="mt-1 text-sm text-[#008070]">{client.hubspot_contact_id}</dd>
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

            {/* Add Activity Form */}
            <form onSubmit={addNote} className="mb-6">
              {/* Activity Type Selector */}
              <div className="flex flex-wrap gap-2 mb-3">
                {ACTIVITY_TYPES.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setActivityType(type.key)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      activityType === type.key
                        ? 'bg-[#008070] text-white'
                        : 'bg-[#171717] text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa]'
                    }`}
                  >
                    <ActivityTypeIcon type={type.key} className="h-3.5 w-3.5" />
                    {type.label}
                  </button>
                ))}
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={`Add a ${ACTIVITY_TYPES.find(t => t.key === activityType)?.label.toLowerCase() || 'note'}...`}
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
                    `Add ${ACTIVITY_TYPES.find(t => t.key === activityType)?.label || 'Note'}`
                  )}
                </button>
              </div>
            </form>

            {/* Pinned Activities */}
            {pinnedActivities.length > 0 && (
              <div className="mb-6 space-y-4">
                <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  <PinFilledIcon className="h-3.5 w-3.5 text-[#008070]" />
                  Pinned
                </h3>
                {pinnedActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 rounded-lg bg-[#008070]/5 p-3 border border-[#008070]/20">
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <time className="text-xs text-[#a1a1aa]">
                            {formatDate(activity.created_at)}
                          </time>
                          {pinnableTypes.includes(activity.type) && (
                            <PinButton
                              activityId={activity.id}
                              isPinned={activity.is_pinned}
                              onToggle={handlePinToggle}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activity List */}
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-center text-sm text-[#a1a1aa]">No activity yet</p>
              ) : (
                regularActivities.map((activity) => (
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <time className="text-xs text-[#a1a1aa]">
                            {formatDate(activity.created_at)}
                          </time>
                          {pinnableTypes.includes(activity.type) && (
                            <PinButton
                              activityId={activity.id}
                              isPinned={activity.is_pinned}
                              onToggle={handlePinToggle}
                            />
                          )}
                        </div>
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

function PinFilledIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 4a1 1 0 0 1 .117 1.993L16 6v4.293l1.854 1.854a.5.5 0 0 1 .146.353V14a.5.5 0 0 1-.5.5H13v5.5a.5.5 0 0 1-.41.492L12.5 20.5a.5.5 0 0 1-.492-.41L12 20v-5.5H6.5a.5.5 0 0 1-.492-.41L6 14v-1.5a.5.5 0 0 1 .146-.354L8 10.293V6a1 1 0 0 1-.117-1.993L8 4h8z"/>
    </svg>
  )
}

function MeetingIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  )
}

function VisitIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function TaskIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ActivityTypeIcon({ type, className }) {
  switch (type) {
    case 'note':
      return <NoteIcon className={className} />
    case 'call':
      return <PhoneIcon className={className} />
    case 'email_sent':
      return <EmailIcon className={className} />
    case 'meeting':
      return <MeetingIcon className={className} />
    case 'visit':
      return <VisitIcon className={className} />
    case 'task':
      return <TaskIcon className={className} />
    default:
      return <NoteIcon className={className} />
  }
}

