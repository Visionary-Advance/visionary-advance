'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PAYMENT_METHODS } from '@/lib/finance'

export default function IncomeForm({ isOpen, onClose, onSave, entry = null }) {
  const [form, setForm] = useState({
    client_id: null,
    client_name: '',
    amount: '',
    date_paid: new Date().toISOString().split('T')[0],
    payment_method: 'other',
    type: 'one-time',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  // Client picker state
  const [clientSearch, setClientSearch] = useState('')
  const [clients, setClients] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [fetchingClients, setFetchingClients] = useState(false)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (entry) {
      setForm({
        client_id: entry.client_id || null,
        client_name: entry.client_name || '',
        amount: entry.amount?.toString() || '',
        date_paid: entry.date_paid || new Date().toISOString().split('T')[0],
        payment_method: entry.payment_method || 'other',
        type: entry.type || 'one-time',
        notes: entry.notes || '',
      })
      setClientSearch(entry.client_name || '')
    } else {
      setForm({
        client_id: null,
        client_name: '',
        amount: '',
        date_paid: new Date().toISOString().split('T')[0],
        payment_method: 'other',
        type: 'one-time',
        notes: '',
      })
      setClientSearch('')
    }
  }, [entry, isOpen])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchClients = useCallback(async (search) => {
    setFetchingClients(true)
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const res = await fetch(`/api/finance/clients${params}`)
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
      }
    } catch (err) {
      console.error('Error fetching clients:', err)
    } finally {
      setFetchingClients(false)
    }
  }, [])

  const handleClientSearchChange = (e) => {
    const value = e.target.value
    setClientSearch(value)
    // Clear selection if user types after selecting
    setForm(prev => ({ ...prev, client_id: null, client_name: value }))
    setShowDropdown(true)

    // Debounced fetch
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchClients(value), 300)
  }

  const handleClientSelect = (client) => {
    setForm(prev => ({
      ...prev,
      client_id: client.id,
      client_name: client.full_name,
    }))
    setClientSearch(client.full_name)
    setShowDropdown(false)
  }

  const handleClientFocus = () => {
    setShowDropdown(true)
    fetchClients(clientSearch)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = entry ? `/api/finance/income/${entry.id}` : '/api/finance/income'
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
      <div className="w-full max-w-lg rounded-2xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#fafafa]">
          {entry ? 'Edit Income' : 'Add Income'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Client Picker */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-[#a1a1aa]">Client</label>
            <input
              type="text"
              required
              value={clientSearch}
              onChange={handleClientSearchChange}
              onFocus={handleClientFocus}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#525252] focus:border-emerald-500 focus:outline-none"
              placeholder="Search clients..."
            />
            {form.client_id && (
              <span className="absolute right-3 top-[2.15rem] text-xs text-emerald-400">Linked</span>
            )}

            {showDropdown && (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-[#262626] bg-[#171717] shadow-lg">
                {fetchingClients ? (
                  <div className="px-3 py-2 text-sm text-[#525252]">Searching...</div>
                ) : clients.length > 0 ? (
                  clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => handleClientSelect(client)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#262626] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[#fafafa]">{client.full_name}</p>
                        <p className="truncate text-xs text-[#525252]">
                          {client.email}{client.company ? ` · ${client.company}` : ''}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-[#525252]">
                    {clientSearch ? 'No clients found' : 'Type to search clients'}
                  </div>
                )}
              </div>
            )}
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
              <label className="block text-sm font-medium text-[#a1a1aa]">Date Paid</label>
              <input
                type="date"
                required
                value={form.date_paid}
                onChange={(e) => setForm({ ...form, date_paid: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">Payment Method</label>
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              >
                {Object.entries(PAYMENT_METHODS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
          </div>

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
              {loading ? 'Saving...' : entry ? 'Update' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
