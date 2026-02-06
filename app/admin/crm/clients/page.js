// app/admin/crm/clients/page.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IndustrySelect from '@/Components/IndustrySelect'

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Filters
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('client_since')
  const [sortOrder, setSortOrder] = useState('desc')

  // Create client modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newClient, setNewClient] = useState({
    first_name: '', last_name: '', email: '', phone: '', website: '', business_id: '', role: '',
  })
  const [businesses, setBusinesses] = useState([])
  const [loadingBusinesses, setLoadingBusinesses] = useState(false)
  const [showCreateBusiness, setShowCreateBusiness] = useState(false)
  const [newBusiness, setNewBusiness] = useState({ name: '', website: '', industry: '' })
  const [creatingBusiness, setCreatingBusiness] = useState(false)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        type: 'clients',
      })

      if (search) params.append('search', search)

      const res = await fetch(`/api/crm/leads?${params}`)
      if (!res.ok) throw new Error('Failed to fetch clients')

      const data = await res.json()
      setClients(data.leads)
      setPagination(prev => ({ ...prev, ...data.pagination }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, sortBy, sortOrder])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const fetchBusinesses = async () => {
    setLoadingBusinesses(true)
    try {
      const res = await fetch('/api/crm/businesses?limit=200')
      const data = await res.json()
      setBusinesses(data.businesses || [])
    } catch (err) {
      console.error('Failed to fetch businesses:', err)
    } finally {
      setLoadingBusinesses(false)
    }
  }

  const handleCreateBusiness = async (e) => {
    e.preventDefault()
    if (!newBusiness.name.trim()) return

    setCreatingBusiness(true)
    try {
      const res = await fetch('/api/crm/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusiness),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Add the new business to the list and select it
      setBusinesses(prev => [data.business, ...prev])
      setNewClient(prev => ({ ...prev, business_id: data.business.id }))
      setShowCreateBusiness(false)
      setNewBusiness({ name: '', website: '', industry: '' })
    } catch (err) {
      alert(err.message)
    } finally {
      setCreatingBusiness(false)
    }
  }

  const handleCreateClient = async (e) => {
    e.preventDefault()
    if (!newClient.email.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/crm/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setShowCreateModal(false)
      setNewClient({ first_name: '', last_name: '', email: '', phone: '', website: '', business_id: '', role: '' })
      router.push(`/admin/crm/clients/${data.client.id}`)
    } catch (err) {
      alert(err.message)
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Clients</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            {pagination.total} total clients
          </p>
        </div>
        <button
          onClick={() => { setShowCreateModal(true); fetchBusinesses() }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d]"
        >
          <PlusIcon className="h-4 w-4" />
          New Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
            className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] py-2.5 pl-10 pr-4 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          />
        </div>

        {/* Sort */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split('-')
            setSortBy(by)
            setSortOrder(order)
          }}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
        >
          <option value="client_since-desc">Newest clients</option>
          <option value="client_since-asc">Oldest clients</option>
          <option value="created_at-desc">Newest first</option>
          <option value="created_at-asc">Oldest first</option>
          <option value="last_activity_at-desc">Recent activity</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#262626] bg-[#0a0a0a]">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchClients}
              className="text-sm text-[#008070] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <ClientIcon className="h-12 w-12 text-[#a1a1aa]" />
            <p className="text-[#a1a1aa]">No clients yet</p>
            <p className="text-sm text-[#a1a1aa]">
              Add a client directly or convert a lead by setting their stage to &quot;Won&quot;.
            </p>
            <button
              onClick={() => { setShowCreateModal(true); fetchBusinesses() }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d]"
            >
              <PlusIcon className="h-4 w-4" />
              New Client
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#171717]">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Client Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-[#171717]"
                >
                  <td className="px-6 py-4">
                    <Link href={`/admin/crm/clients/${client.id}`} className="block">
                      <div className="font-medium text-[#fafafa] hover:text-[#008070]">
                        {client.full_name || client.email}
                      </div>
                      {client.full_name && (
                        <div className="text-sm text-[#a1a1aa]">{client.email}</div>
                      )}
                      {client.phone && (
                        <div className="text-sm text-[#a1a1aa]">{client.phone}</div>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[#fafafa]">{client.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#fafafa]">{formatDate(client.client_since)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#a1a1aa]">{formatDate(client.last_activity_at)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#a1a1aa]">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm text-[#fafafa] transition-colors hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm text-[#fafafa] transition-colors hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-[#fafafa]">New Client</h2>
            <p className="mt-1 text-sm text-[#a1a1aa]">Create a client directly, skipping the lead pipeline.</p>
            <form onSubmit={handleCreateClient} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa]">First Name</label>
                  <input
                    type="text"
                    value={newClient.first_name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, first_name: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa]">Last Name</label>
                  <input
                    type="text"
                    value={newClient.last_name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, last_name: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">Email *</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">Phone</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">Position / Role</label>
                <input
                  type="text"
                  value={newClient.role}
                  onChange={(e) => setNewClient(prev => ({ ...prev, role: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  placeholder="e.g. Owner, Project Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">Website</label>
                <input
                  type="url"
                  value={newClient.website}
                  onChange={(e) => setNewClient(prev => ({ ...prev, website: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              {/* Business Dropdown */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-[#a1a1aa]">Business</label>
                  <button
                    type="button"
                    onClick={() => setShowCreateBusiness(!showCreateBusiness)}
                    className="text-xs text-[#008070] hover:text-[#006b5d]"
                  >
                    {showCreateBusiness ? 'Cancel' : '+ Create New'}
                  </button>
                </div>
                {showCreateBusiness ? (
                  <div className="mt-2 space-y-3 rounded-lg border border-[#262626] bg-[#171717] p-3">
                    <div>
                      <label className="block text-xs text-[#a1a1aa]">Business Name *</label>
                      <input
                        type="text"
                        value={newBusiness.name}
                        onChange={(e) => setNewBusiness(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#0a0a0a] px-2 py-1.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                        placeholder="Business name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#a1a1aa]">Website</label>
                      <input
                        type="url"
                        value={newBusiness.website}
                        onChange={(e) => setNewBusiness(prev => ({ ...prev, website: e.target.value }))}
                        className="mt-1 w-full rounded border border-[#262626] bg-[#0a0a0a] px-2 py-1.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#a1a1aa]">Industry</label>
                      <div className="mt-1">
                        <IndustrySelect
                          value={newBusiness.industry}
                          onChange={(val) => setNewBusiness(prev => ({ ...prev, industry: val }))}
                          className="w-full rounded border border-[#262626] bg-[#0a0a0a] px-2 py-1.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateBusiness}
                      disabled={creatingBusiness || !newBusiness.name.trim()}
                      className="w-full rounded bg-[#008070] py-1.5 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
                    >
                      {creatingBusiness ? 'Creating...' : 'Create Business'}
                    </button>
                  </div>
                ) : (
                  <select
                    value={newClient.business_id}
                    onChange={(e) => setNewClient(prev => ({ ...prev, business_id: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  >
                    <option value="">No business</option>
                    {loadingBusinesses ? (
                      <option disabled>Loading...</option>
                    ) : (
                      businesses.map((biz) => (
                        <option key={biz.id} value={biz.id}>
                          {biz.name}{biz.industry ? ` — ${biz.industry}` : ''}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setShowCreateBusiness(false) }}
                  className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newClient.email.trim()}
                  className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function ClientIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
