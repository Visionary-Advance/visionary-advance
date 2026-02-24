// app/admin/finance/expenses/page.js — Expense Categorizer
'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, EXPENSE_CATEGORIES } from '@/lib/finance'
import { format } from 'date-fns'
import ExpenseForm from '@/Components/Admin/Finance/ExpenseForm'
import CategoryBadge from '@/Components/Admin/Finance/CategoryBadge'
import CategoryPieChart from '@/Components/Admin/Finance/CategoryPieChart'

export default function ExpensesPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState('')
  const [category, setCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [categoryData, setCategoryData] = useState([])

  const fetchEntries = async (page = 1) => {
    try {
      const params = new URLSearchParams({ year: year.toString(), page: page.toString(), limit: '20' })
      if (month) params.set('month', month)
      if (category) params.set('category', category)

      const res = await fetch(`/api/finance/expenses?${params}`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries)
        setPagination(data.pagination)
      }
    } catch (err) {
      console.error('Error fetching expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryBreakdown = async () => {
    try {
      const res = await fetch(`/api/finance/stats?year=${year}`)
      if (res.ok) {
        const data = await res.json()
        setCategoryData(data.byCategory || [])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchEntries()
    fetchCategoryBreakdown()
  }, [year, month, category])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/finance/expenses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteConfirm(null)
        fetchEntries(pagination.page)
        fetchCategoryBreakdown()
      }
    } catch (err) {
      console.error('Error deleting expense:', err)
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

  const handleSave = () => {
    fetchEntries(pagination.page)
    fetchCategoryBreakdown()
  }

  const totalForView = entries.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Expenses</h1>
          <p className="mt-1 text-[#a1a1aa]">Categorize expenses by IRS Schedule C</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          + Add Expense
        </button>
      </div>

      {/* Category Pie Chart */}
      {categoryData.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold text-[#fafafa]">Spending by Category</h2>
          <p className="mt-1 text-sm text-[#525252]">{year} expense distribution</p>
          <CategoryPieChart data={categoryData} />
        </div>
      )}

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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {Object.entries(EXPENSE_CATEGORIES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Running Total */}
      <div className="mb-6 rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-[#a1a1aa]">Showing</p>
            <p className="text-xl font-semibold text-red-400">{formatCurrency(totalForView)}</p>
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
          <p className="text-[#525252]">No expense entries found</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Add Your First Expense
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#262626]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#0a0a0a]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#525252]">Receipt</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-[#525252]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {entries.map((entry) => (
                <tr key={entry.id} className="bg-[#0a0a0a] hover:bg-[#171717] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#fafafa]">{entry.description}</span>
                      {entry.is_recurring && (
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                          recurring
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-400">{formatCurrency(entry.amount)}</td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">
                    {format(new Date(entry.date + 'T00:00:00'), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={entry.category} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    {entry.receipt_url ? (
                      <a
                        href={entry.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-400 hover:text-emerald-300 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-sm text-[#525252]">-</span>
                    )}
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

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSave={handleSave}
        entry={editEntry}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#fafafa]">Delete Expense Entry</h3>
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
