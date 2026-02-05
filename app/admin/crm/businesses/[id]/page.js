'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BusinessDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState({})
  const [showAddContactModal, setShowAddContactModal] = useState(false)
  const [availableLeads, setAvailableLeads] = useState([])
  const [searchLeads, setSearchLeads] = useState('')
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState([])

  useEffect(() => {
    fetchBusiness()
  }, [id])

  const fetchBusiness = async () => {
    try {
      const res = await fetch(`/api/crm/businesses/${id}`)
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setBusiness(data.business)
      setSelectedRecipients(data.business.default_report_recipients || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/crm/businesses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setBusiness(prev => ({ ...prev, ...data.business }))
      setEditing(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this business? All contacts will be unlinked.')) return

    try {
      const res = await fetch(`/api/crm/businesses/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      router.push('/admin/crm/businesses')
    } catch (err) {
      alert(err.message)
    }
  }

  const searchAvailableLeads = async (query) => {
    setLoadingLeads(true)
    try {
      const params = new URLSearchParams({ search: query, limit: '20' })
      const res = await fetch(`/api/crm/leads?${params}`)
      const data = await res.json()

      // Filter out leads already in this business
      const currentContactIds = business.contacts.map(c => c.id)
      setAvailableLeads((data.leads || []).filter(l => !currentContactIds.includes(l.id)))
    } catch (err) {
      console.error('Error searching leads:', err)
    } finally {
      setLoadingLeads(false)
    }
  }

  useEffect(() => {
    if (showAddContactModal && searchLeads) {
      const debounce = setTimeout(() => searchAvailableLeads(searchLeads), 300)
      return () => clearTimeout(debounce)
    }
  }, [searchLeads, showAddContactModal])

  const handleAddContact = async (leadId) => {
    try {
      const res = await fetch(`/api/crm/businesses/${id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Refresh business data
      fetchBusiness()
      setShowAddContactModal(false)
      setSearchLeads('')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleRemoveContact = async (leadId) => {
    if (!confirm('Remove this contact from the business?')) return

    try {
      const res = await fetch(`/api/crm/businesses/${id}/contacts?leadId=${leadId}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setBusiness(prev => ({
        ...prev,
        contacts: prev.contacts.filter(c => c.id !== leadId)
      }))
    } catch (err) {
      alert(err.message)
    }
  }

  const toggleRecipient = (email) => {
    setSelectedRecipients(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    )
  }

  const saveRecipients = async () => {
    try {
      const res = await fetch(`/api/crm/businesses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ default_report_recipients: selectedRecipients }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setBusiness(prev => ({ ...prev, default_report_recipients: selectedRecipients }))
      alert('Report recipients saved!')
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || 'Business not found'}</p>
        <Link href="/admin/crm/businesses" className="text-[#008070] hover:underline">
          Back to businesses
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/crm/businesses"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to businesses
          </Link>
          {editing ? (
            <input
              type="text"
              value={editData.name ?? business.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="text-2xl font-semibold bg-transparent border-b border-[#008070] text-[#fafafa] focus:outline-none"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-[#fafafa]">{business.name}</h1>
          )}
          {editing ? (
            <input
              type="url"
              value={editData.website ?? business.website ?? ''}
              onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="Website URL"
              className="mt-1 text-sm bg-transparent border-b border-[#262626] text-[#a1a1aa] focus:border-[#008070] focus:outline-none"
            />
          ) : business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-[#008070] hover:underline"
            >
              {business.website}
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditData({})
                  setEditing(true)
                }}
                className="rounded-lg border border-[#262626] bg-[#171717] px-4 py-2 text-sm text-[#fafafa] hover:bg-[#262626]"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Business Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Details */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Details
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-[#a1a1aa]">Industry</dt>
                {editing ? (
                  <input
                    type="text"
                    value={editData.industry ?? business.industry ?? ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                    className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  />
                ) : (
                  <dd className="mt-1 text-[#fafafa]">{business.industry || '-'}</dd>
                )}
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Notes</dt>
                {editing ? (
                  <textarea
                    value={editData.notes ?? business.notes ?? ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded border border-[#262626] bg-[#171717] px-2 py-1 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  />
                ) : (
                  <dd className="mt-1 text-[#fafafa] whitespace-pre-wrap">{business.notes || '-'}</dd>
                )}
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Created</dt>
                <dd className="mt-1 text-sm text-[#fafafa]">
                  {new Date(business.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* SEO Sites */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              SEO Sites
            </h2>
            {business.seoSites.length === 0 ? (
              <p className="text-sm text-[#a1a1aa] text-center py-4">
                No SEO sites linked yet.
                <br />
                <Link href="/admin/seo" className="text-[#008070] hover:underline">
                  Go to SEO Dashboard
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {business.seoSites.map(site => (
                  <Link
                    key={site.id}
                    href="/admin/seo"
                    className="block rounded-lg bg-[#171717] p-3 hover:bg-[#262626]"
                  >
                    <p className="font-medium text-[#fafafa] truncate">{site.display_name}</p>
                    <p className="text-xs text-[#a1a1aa] truncate">{site.site_url}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Column - Contacts */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Contacts ({business.contacts.length})
              </h2>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="text-sm text-[#008070] hover:text-[#006b5d]"
              >
                + Add
              </button>
            </div>
            {business.contacts.length === 0 ? (
              <p className="text-sm text-[#a1a1aa] text-center py-4">
                No contacts linked yet
              </p>
            ) : (
              <div className="space-y-2">
                {business.contacts.map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between rounded-lg bg-[#171717] p-3"
                  >
                    <Link href={`/admin/crm/leads/${contact.id}`} className="flex-1 min-w-0">
                      <p className="font-medium text-[#fafafa] truncate hover:text-[#008070]">
                        {contact.full_name || contact.email}
                      </p>
                      <p className="text-xs text-[#a1a1aa] truncate">{contact.email}</p>
                    </Link>
                    <div className="flex items-center gap-2 ml-2">
                      {contact.is_client && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                          Client
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="p-1 text-[#a1a1aa] hover:text-red-400"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Report Recipients */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              SEO Report Recipients
            </h2>
            <p className="text-xs text-[#a1a1aa] mb-4">
              Select which contacts should receive SEO reports for this business.
            </p>
            {business.contacts.filter(c => c.email).length === 0 ? (
              <p className="text-sm text-[#a1a1aa] text-center py-4">
                Add contacts with emails first
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {business.contacts
                    .filter(c => c.email)
                    .map(contact => (
                      <label
                        key={contact.id}
                        className="flex items-center gap-3 rounded-lg bg-[#171717] p-3 cursor-pointer hover:bg-[#262626]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(contact.email)}
                          onChange={() => toggleRecipient(contact.email)}
                          className="h-4 w-4 rounded border-[#262626] bg-[#171717] text-[#008070] focus:ring-[#008070]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#fafafa] truncate">
                            {contact.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-[#a1a1aa] truncate">{contact.email}</p>
                        </div>
                      </label>
                    ))}
                </div>
                <button
                  onClick={saveRecipients}
                  className="mt-4 w-full rounded-lg bg-[#008070] py-2 text-sm font-medium text-white hover:bg-[#006b5d]"
                >
                  Save Recipients
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#fafafa]">Add Contact</h2>
              <button
                onClick={() => {
                  setShowAddContactModal(false)
                  setSearchLeads('')
                  setAvailableLeads([])
                }}
                className="text-[#a1a1aa] hover:text-[#fafafa]"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              value={searchLeads}
              onChange={(e) => setSearchLeads(e.target.value)}
              placeholder="Search leads by name or email..."
              className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none"
            />
            <div className="mt-4 flex-1 overflow-y-auto">
              {loadingLeads ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
                </div>
              ) : availableLeads.length === 0 ? (
                <p className="text-center text-sm text-[#a1a1aa] py-8">
                  {searchLeads ? 'No leads found' : 'Type to search leads'}
                </p>
              ) : (
                <div className="space-y-2">
                  {availableLeads.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => handleAddContact(lead.id)}
                      className="w-full flex items-center justify-between rounded-lg bg-[#171717] p-3 hover:bg-[#262626] text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#fafafa] truncate">
                          {lead.full_name || lead.email}
                        </p>
                        <p className="text-xs text-[#a1a1aa] truncate">{lead.email}</p>
                      </div>
                      {lead.is_client && (
                        <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                          Client
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
