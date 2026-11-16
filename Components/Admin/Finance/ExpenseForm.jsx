'use client'

import { useState } from 'react'
import { EXPENSE_CATEGORIES } from '@/lib/finance'
import { Button, Field, Modal, cx, inputClass, useToast } from '@/Components/Admin/ui'
import ReceiptUpload from './ReceiptUpload'

const today = () => new Date().toISOString().split('T')[0]

export default function ExpenseForm({ isOpen, onClose, onSave, entry = null }) {
  if (!isOpen) return null
  return <ExpenseFormModal onClose={onClose} onSave={onSave} entry={entry} />
}

function ExpenseFormModal({ onClose, onSave, entry }) {
  const notify = useToast()
  const [form, setForm] = useState(() => ({
    description: entry?.description || '',
    amount: entry?.amount?.toString() || '',
    date: entry?.date || today(),
    category: entry?.category || 'other_expenses',
    is_recurring: entry?.is_recurring || false,
    notes: entry?.notes || '',
  }))
  const [saving, setSaving] = useState(false)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(entry ? `/api/finance/expenses/${entry.id}` : '/api/finance/expenses', {
        method: entry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to save')
      notify(entry ? 'Expense updated' : 'Expense added. Edit it to attach a receipt.', 'success')
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
      title={entry ? 'Edit expense' : 'Add expense'}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="expense-form" loading={saving}>
            {entry ? 'Save changes' : 'Add expense'}
          </Button>
        </>
      }
    >
      <form id="expense-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="Description" htmlFor="exp-desc">
          <input
            id="exp-desc"
            type="text"
            required
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            className={cx(inputClass, 'h-11 sm:h-10')}
            placeholder="What was it for?"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount" htmlFor="exp-amount">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-adm-subtle">$</span>
              <input
                id="exp-amount"
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
          <Field label="Date" htmlFor="exp-date">
            <input
              id="exp-date"
              type="date"
              required
              value={form.date}
              onChange={(e) => set({ date: e.target.value })}
              className={cx(inputClass, 'h-11 sm:h-10')}
            />
          </Field>
        </div>

        <Field label="Schedule C category" htmlFor="exp-cat">
          <select
            id="exp-cat"
            value={form.category}
            onChange={(e) => set({ category: e.target.value })}
            className={cx(inputClass, 'h-11 cursor-pointer sm:h-10')}
          >
            {Object.entries(EXPENSE_CATEGORIES).map(([key, { label, scheduleC }]) => (
              <option key={key} value={key}>{label} ({scheduleC})</option>
            ))}
          </select>
        </Field>

        <label htmlFor="exp-recurring" className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-adm-border bg-adm-raised px-3 py-2.5">
          <input
            id="exp-recurring"
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) => set({ is_recurring: e.target.checked })}
            className="h-4 w-4 cursor-pointer accent-teal-500"
          />
          <span className="text-sm text-adm-text">Recurring expense</span>
          <span className="ml-auto text-xs text-adm-subtle">subscriptions, rent…</span>
        </label>

        {entry?.id && (
          <Field label="Receipt">
            <ReceiptUpload expenseId={entry.id} currentUrl={entry.receipt_url} onUploaded={onSave} />
          </Field>
        )}

        <Field label="Notes" htmlFor="exp-notes">
          <textarea
            id="exp-notes"
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
