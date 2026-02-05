// app/admin/crm/clients/page.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ScoreBadge from '@/Components/CRM/Shared/ScoreBadge'
import SourceBadge from '@/Components/CRM/Shared/SourceBadge'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Filters
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [sortBy, setSortBy] = useState('client_since')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        type: 'clients', // Only fetch clients
      })

      if (search) params.append('search', search)
      if (sourceFilter) params.append('source', sourceFilter)

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
  }, [pagination.page, pagination.limit, search, sourceFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

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

        {/* Source filter */}
        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value)
            setPagination(prev => ({ ...prev, page: 1 }))
          }}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
        >
          <option value="">All sources</option>
          <option value="website_audit">Website Audit</option>
          <option value="systems_form">Systems Form</option>
          <option value="contact_form">Contact Form</option>
          <option value="audit_email">Audit Email</option>
          <option value="manual">Manual</option>
        </select>

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
              When a lead's stage is set to "Won", they become a client.
            </p>
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
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Client Since
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
                    <SourceBadge source={client.source} />
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={client.score || 0} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#fafafa]">{formatDate(client.client_since)}</div>
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

function ClientIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
