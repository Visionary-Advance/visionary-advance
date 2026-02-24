'use client'

import { useState, useEffect } from 'react'
import { EXPENSE_CATEGORIES } from '@/lib/finance'
import ReceiptUpload from './ReceiptUpload'

export default function ExpenseForm({ isOpen, onClose, onSave, entry = null }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'other_expenses',
    is_recurring: false,
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [savedId, setSavedId] = useState(null)

  useEffect(() => {
    if (entry) {
      setForm({
        description: entry.description || '',
        amount: entry.amount?.toString() || '',
        date: entry.date || new Date().toISOString().split('T')[0],
        category: entry.category || 'other_expenses',
        is_recurring: entry.is_recurring || false,
        notes: entry.notes || '',
      })
      setSavedId(entry.id)
    } else {
      setForm({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'other_expenses',
        is_recurring: false,
        notes: '',
      })
      setSavedId(null)
    }
  }, [entry, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = entry ? `/api/finance/expenses/${entry.id}` : '/api/finance/expenses'
      const method = entry ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      const data = await res.json()
      if (data.entry?.id) setSavedId(data.entry.id)

      onSave()
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#fafafa]">
          {entry ? 'Edit Expense' : 'Add Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">Description</label>
            <input
              type="text"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#525252] focus:border-emerald-500 focus:outline-none"
              placeholder="What did you spend on?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">Amount ($)</label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#525252] focus:border-emerald-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">IRS Category (Schedule C)</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
            >
              {Object.entries(EXPENSE_CATEGORIES).map(([key, { label, scheduleC }]) => (
                <option key={key} value={key}>{label} ({scheduleC})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_recurring"
              checked={form.is_recurring}
              onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })}
              className="h-4 w-4 rounded border-[#262626] bg-[#171717] text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="is_recurring" className="text-sm font-medium text-[#a1a1aa]">
              Recurring expense
            </label>
          </div>

          {(entry?.id || savedId) && (
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Receipt</label>
              <ReceiptUpload
                expenseId={entry?.id || savedId}
                currentUrl={entry?.receipt_url}
                onUploaded={onSave}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#525252] focus:border-emerald-500 focus:outline-none"
              placeholder="Optional notes"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:bg-[#171717] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : entry ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
