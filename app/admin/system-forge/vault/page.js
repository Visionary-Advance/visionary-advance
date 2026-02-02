// app/admin/system-forge/vault/page.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ModuleCard from '@/Components/Admin/SystemForge/ModuleCard'
import ModuleForm from '@/Components/Admin/SystemForge/ModuleForm'

export default function VaultPage() {
  const [modules, setModules] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const fetchModules = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (typeFilter) params.set('type', typeFilter)
      if (categoryFilter) params.set('category', categoryFilter)

      const res = await fetch(`/api/system-forge/modules?${params}`)
      if (res.ok) {
        const data = await res.json()
        setModules(data.modules || [])
        if (data.categories) {
          setCategories(data.categories)
        }
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error)
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, categoryFilter])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const handleModuleCreated = (newModule) => {
    setModules([newModule, ...modules])
    setShowForm(false)
  }

  const handleDelete = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all files.')) {
      return
    }

    try {
      const res = await fetch(`/api/system-forge/modules/${moduleId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setModules(modules.filter(m => m.id !== moduleId))
      }
    } catch (error) {
      console.error('Failed to delete module:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Code Vault</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Reusable modules, components, and snippets
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#006b5d] transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Module
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] py-2.5 px-4 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] py-2.5 px-4 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
        >
          <option value="">All Types</option>
          <option value="module">Module</option>
          <option value="component">Component</option>
          <option value="snippet">Snippet</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-[#262626] bg-[#0a0a0a] py-2.5 px-4 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {(search || typeFilter || categoryFilter) && (
          <button
            onClick={() => {
              setSearch('')
              setTypeFilter('')
              setCategoryFilter('')
            }}
            className="text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Module Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-xl border border-[#262626] bg-[#0a0a0a] animate-pulse" />
          ))}
        </div>
      ) : modules.length === 0 ? (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] px-6 py-16 text-center">
          <BoxIcon className="mx-auto h-12 w-12 text-[#525252]" />
          <p className="mt-4 text-[#fafafa]">No modules found</p>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            {search || typeFilter || categoryFilter
              ? 'Try adjusting your filters'
              : 'Create your first module or import from GitHub'}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d]"
            >
              <PlusIcon className="h-4 w-4" />
              Create Module
            </button>
            <Link
              href="/admin/system-forge/import"
              className="flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-[#fafafa] hover:bg-[#171717]"
            >
              <ImportIcon className="h-4 w-4" />
              Import
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onDelete={() => handleDelete(module.id)}
            />
          ))}
        </div>
      )}

      {/* Module Form Modal */}
      {showForm && (
        <ModuleForm
          onClose={() => setShowForm(false)}
          onSuccess={handleModuleCreated}
        />
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

function BoxIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

function ImportIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}
