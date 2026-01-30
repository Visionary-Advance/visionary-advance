// app/admin/crm/leads/page.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ScoreBadge from '@/Components/CRM/Shared/ScoreBadge'
import StageBadge from '@/Components/CRM/Shared/StageBadge'
import SourceBadge from '@/Components/CRM/Shared/SourceBadge'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Filters
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
      })

      if (search) params.append('search', search)
      if (stageFilter) params.append('stage', stageFilter)
      if (sourceFilter) params.append('source', sourceFilter)

      const res = await fetch(`/api/crm/leads?${params}`)
      if (!res.ok) throw new Error('Failed to fetch leads')

      const data = await res.json()
      setLeads(data.leads)
      setPagination(prev => ({ ...prev, ...data.pagination }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, stageFilter, sourceFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Leads</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            {pagination.total} total leads
          </p>
        </div>
        <Link
          href="/admin/crm/leads/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006b5d]"
        >
          <PlusIcon className="h-4 w-4" />
          Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
            className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] py-2.5 pl-10 pr-4 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          />
        </div>

        {/* Stage filter */}
        <select
          value={stageFilter}
          onChange={(e) => {
            setStageFilter(e.target.value)
            setPagination(prev => ({ ...prev, page: 1 }))
          }}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
        >
          <option value="">All stages</option>
          <option value="contact">Contact</option>
          <option value="plan_audit_meeting">Plan Audit Meeting</option>
          <option value="discovery_call">Discovery Call</option>
          <option value="proposal">Proposal</option>
          <option value="offer">Offer</option>
          <option value="negotiating">Negotiating</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

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
          <option value="created_at-desc">Newest first</option>
          <option value="created_at-asc">Oldest first</option>
          <option value="score-desc">Highest score</option>
          <option value="score-asc">Lowest score</option>
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
              onClick={fetchLeads}
              className="text-sm text-[#008070] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <p className="text-[#a1a1aa]">No leads found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#171717]">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-[#171717]"
                >
                  <td className="px-6 py-4">
                    <Link href={`/admin/crm/leads/${lead.id}`} className="block">
                      <div className="font-medium text-[#fafafa] hover:text-[#008070]">
                        {lead.full_name || lead.email}
                      </div>
                      {lead.company && (
                        <div className="text-sm text-[#a1a1aa]">{lead.company}</div>
                      )}
                      {lead.full_name && (
                        <div className="text-sm text-[#a1a1aa]">{lead.email}</div>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <StageBadge stage={lead.stage} />
                  </td>
                  <td className="px-6 py-4">
                    <SourceBadge source={lead.source} />
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={lead.score || 0} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#fafafa]">{formatDate(lead.created_at)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#a1a1aa]">{formatTime(lead.last_activity_at)}</div>
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
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}
