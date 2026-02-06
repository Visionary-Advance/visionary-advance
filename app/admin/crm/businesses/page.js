'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import IndustrySelect from '@/Components/IndustrySelect'

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newBusiness, setNewBusiness] = useState({ name: '', website: '', industry: '' })

  useEffect(() => {
    fetchBusinesses()
  }, [search])

  const fetchBusinesses = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const res = await fetch(`/api/crm/businesses?${params}`)
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setBusinesses(data.businesses || [])
    } catch (err) {
      console.error('Error fetching businesses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newBusiness.name.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/crm/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusiness),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setBusinesses(prev => [data.business, ...prev])
      setShowCreateModal(false)
      setNewBusiness({ name: '', website: '', industry: '' })
    } catch (err) {
      alert(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Businesses</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Manage client businesses and their contacts
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d]"
        >
          <PlusIcon className="h-4 w-4" />
          New Business
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a1a1aa]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search businesses..."
          className="w-full rounded-lg border border-[#262626] bg-[#171717] py-2 pl-10 pr-4 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none"
        />
      </div>

      {/* Business List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
        </div>
      ) : businesses.length === 0 ? (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-12 text-center">
          <BuildingIcon className="mx-auto h-12 w-12 text-[#a1a1aa]" />
          <h3 className="mt-4 text-lg font-medium text-[#fafafa]">No businesses yet</h3>
          <p className="mt-2 text-sm text-[#a1a1aa]">
            Create a business to group contacts and link SEO sites.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d]"
          >
            <PlusIcon className="h-4 w-4" />
            Create Business
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Link
              key={business.id}
              href={`/admin/crm/businesses/${business.id}`}
              className="group rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 transition-colors hover:border-[#008070]/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#fafafa] truncate group-hover:text-[#008070]">
                    {business.name}
                  </h3>
                  {business.website && (
                    <p className="mt-1 text-sm text-[#a1a1aa] truncate">{business.website}</p>
                  )}
                </div>
                {business.industry && (
                  <span className="ml-2 flex-shrink-0 rounded-full bg-[#171717] px-2 py-1 text-xs text-[#a1a1aa]">
                    {business.industry}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-[#a1a1aa]">
                  <UsersIcon className="h-4 w-4" />
                  <span>{business.contact_count} contacts</span>
                </div>
                <div className="flex items-center gap-1 text-[#a1a1aa]">
                  <ChartIcon className="h-4 w-4" />
                  <span>{business.seo_site_count} SEO sites</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-[#fafafa]">Create Business</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={newBusiness.name}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  placeholder="Acme Construction"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">
                  Website
                </label>
                <input
                  type="url"
                  value={newBusiness.website}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, website: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">
                  Industry
                </label>
                <div className="mt-1">
                  <IndustrySelect
                    value={newBusiness.industry}
                    onChange={(val) => setNewBusiness(prev => ({ ...prev, industry: val }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newBusiness.name.trim()}
                  className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Business'}
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
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
