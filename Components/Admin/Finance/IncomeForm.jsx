'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link2 } from 'lucide-react'
import { PAYMENT_METHODS } from '@/lib/finance'
import { Button, Field, Modal, SegmentedControl, cx, inputClass, useToast } from '@/Components/Admin/ui'

const today = () => new Date().toISOString().split('T')[0]

const blank = () => ({
  client_id: null,
  client_name: '',
  amount: '',
  date_paid: today(),
  payment_method: 'other',
  type: 'one-time',
  notes: '',
})

export default function IncomeForm({ isOpen, onClose, onSave, entry = null }) {
  if (!isOpen) return null
  return <IncomeFormModal onClose={onClose} onSave={onSave} entry={entry} />
}

function IncomeFormModal({ onClose, onSave, entry }) {
  const notify = useToast()
  const [form, setForm] = useState(() =>
    entry
      ? {
          client_id: entry.client_id || null,
          client_name: entry.client_name || '',
          amount: entry.amount?.toString() || '',
          date_paid: entry.date_paid || today(),
          payment_method: entry.payment_method || 'other',
          type: entry.type || 'one-time',
          notes: entry.notes || '',
        }
      : blank()
  )
  const [saving, setSaving] = useState(false)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  // Client picker
  const [clientSearch, setClientSearch] = useState(entry?.client_name || '')
  const [clients, setClients] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [fetchingClients, setFetchingClients] = useState(false)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const fetchClients = useCallback(async (search) => {
    setFetchingClients(true)
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const res = await fetch(`/api/finance/clients${params}`)
      if (res.ok) setClients((await res.json()).clients || [])
    } catch {
      // The picker still accepts a typed name
    } finally {
      setFetchingClients(false)
    }
  }, [])

  const onClientInput = (e) => {
    const value = e.target.value
    setClientSearch(value)
    set({ client_id: null, client_name: value })
    setShowDropdown(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchClients(value), 300)
  }

  const pickClient = (client) => {
    set({ client_id: client.id, client_name: client.full_name })
    setClientSearch(client.full_name)
    setShowDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(entry ? `/api/finance/income/${entry.id}` : '/api/finance/income', {
        method: entry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to save')
      notify(entry ? 'Income updated' : 'Income added', 'success')
      onSave()
      onClose()
    } catch (err) {
      notify(`Couldn't save: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={entry ? 'Edit income' : 'Add income'}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="income-form" loading={saving}>
            {entry ? 'Save changes' : 'Add income'}
          </Button>
        </>
      }
    >
      <form id="income-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="Client" htmlFor="inc-client" hint={form.client_id ? 'Linked to a CRM client' : 'Pick a CRM client or type any name'}>
          <div ref={dropdownRef} className="relative">
            <input
              id="inc-client"
              type="text"
              required
              autoComplete="off"
              value={clientSearch}
              onChange={onClientInput}
              onFocus={() => { setShowDropdown(true); fetchClients(clientSearch) }}
              className={cx(inputClass, 'h-11 sm:h-10', form.client_id && 'pr-9')}
              placeholder="Search clients…"
            />
            {form.client_id && <Link2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-adm-accent" aria-label="Linked" />}
            {showDropdown && (
              <div className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-adm-border bg-adm-raised p-1 shadow-xl">
                {fetchingClients ? (
                  <p className="px-3 py-2 text-sm text-adm-subtle">Searching…</p>
                ) : clients.length > 0 ? (
                  clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => pickClient(client)}
                      className="block w-full cursor-pointer rounded-md px-3 py-2 text-left hover:bg-adm-hover"
                    >
                      <span className="block truncate text-sm text-adm-text">{client.full_name}</span>
                      <span className="block truncate text-xs text-adm-subtle">
                        {client.email}{client.company ? ` · ${client.company}` : ''}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-adm-subtle">{clientSearch ? 'No matching clients' : 'Type to search clients'}</p>
                )}
              </div>
            )}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount" htmlFor="inc-amount">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-adm-subtle">$</span>
              <input
                id="inc-amount"
                type="number"
                inputMode="decimal"
                required
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => set({ amount: e.target.value })}
                className={cx(inputClass, 'h-11 pl-7 tabular-nums sm:h-10')}
                placeholder="0.00"
              />
            </div>
          </Field>
          <Field label="Date paid" htmlFor="inc-date">
            <input
              id="inc-date"
              type="date"
              required
              value={form.date_paid}
              onChange={(e) => set({ date_paid: e.target.value })}
              className={cx(inputClass, 'h-11 sm:h-10')}
            />
          </Field>
        </div>

        <Field label="Payment method" htmlFor="inc-method">
          <select
            id="inc-method"
            value={form.payment_method}
            onChange={(e) => set({ payment_method: e.target.value })}
            className={cx(inputClass, 'h-11 cursor-pointer sm:h-10')}
          >
            {Object.entries(PAYMENT_METHODS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </Field>

        <Field label="Type">
          <SegmentedControl
            label="Income type"
            value={form.type}
            onChange={(type) => set({ type })}
            options={[{ value: 'one-time', label: 'One-time' }, { value: 'recurring', label: 'Recurring' }]}
            className="w-full [&>button]:flex-1 [&>button]:justify-center"
          />
        </Field>

        <Field label="Notes" htmlFor="inc-notes">
          <textarea
            id="inc-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => set({ notes: e.target.value })}
            className={inputClass}
            placeholder="Optional"
          />
        </Field>
      </form>
    </Modal>
  )
}
