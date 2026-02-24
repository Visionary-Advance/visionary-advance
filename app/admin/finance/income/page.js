// app/admin/finance/income/page.js — Income Tracker
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency, PAYMENT_METHODS } from '@/lib/finance'
import { format } from 'date-fns'
import IncomeForm from '@/Components/Admin/Finance/IncomeForm'

export default function IncomePage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchEntries = async (page = 1) => {
    try {
      const params = new URLSearchParams({ year: year.toString(), page: page.toString(), limit: '20' })
      if (month) params.set('month', month)
      if (search) params.set('search', search)

      const res = await fetch(`/api/finance/income?${params}`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries)
        setPagination(data.pagination)
      }
    } catch (err) {
      console.error('Error fetching income:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchEntries()
  }, [year, month, search])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/finance/income/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteConfirm(null)
        fetchEntries(pagination.page)
      }
    } catch (err) {
      console.error('Error deleting income:', err)
    }
  }

  const handleEdit = (entry) => {
    setEditEntry(entry)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditEntry(null)
  }

  // Calculate running totals
  const totalForView = entries.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Income Tracker</h1>
          <p className="mt-1 text-[#a1a1aa]">Track payments from clients</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          + Add Income
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
        >
          {[2024, 2025, 2026, 2027].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All Months</option>
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
            <option key={i+1} value={i+1}>{m}</option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#525252] focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Running Total */}
      <div className="mb-6 rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-[#a1a1aa]">Showing</p>
            <p className="text-xl font-semibold text-green-400">{formatCurrency(totalForView)}</p>
          </div>
          <div>
            <p className="text-sm text-[#a1a1aa]">Entries</p>
            <p className="text-xl font-semibold text-[#fafafa]">{pagination.total}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] py-16 text-center">
          <p className="text-[#525252]">No income entries found</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Add Your First Income
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#262626]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#0a0a0a]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-[#525252]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {entries.map((entry) => (
                <tr key={entry.id} className="bg-[#0a0a0a] hover:bg-[#171717] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">
                    <Link href={`/admin/finance/income/${entry.id}`} className="text-[#fafafa] hover:text-emerald-400 transition-colors">
                      {entry.client_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-400">{formatCurrency(entry.amount)}</td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">
                    {format(new Date(entry.date_paid + 'T00:00:00'), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">
                    {PAYMENT_METHODS[entry.payment_method]?.label || entry.payment_method}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      entry.type === 'recurring'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-[#171717] text-[#a1a1aa]'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="rounded px-2 py-1 text-xs text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(entry.id)}
                        className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-[#525252]">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchEntries(pagination.page - 1)}
              className="rounded-lg border border-[#262626] px-3 py-1.5 text-sm text-[#a1a1aa] hover:bg-[#171717] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchEntries(pagination.page + 1)}
              className="rounded-lg border border-[#262626] px-3 py-1.5 text-sm text-[#a1a1aa] hover:bg-[#171717] disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Income Form Modal */}
      <IncomeForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSave={() => fetchEntries(pagination.page)}
        entry={editEntry}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#fafafa]">Delete Income Entry</h3>
            <p className="mt-2 text-sm text-[#a1a1aa]">Are you sure? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:bg-[#171717] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
