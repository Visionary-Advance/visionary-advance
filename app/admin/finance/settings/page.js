// app/admin/finance/settings/page.js — Tax rate settings
'use client'

import { useEffect, useState } from 'react'
import { Button, Card, CardHeader, Field, PageHeader, PageLoader, cx, inputClass, useToast } from '@/Components/Admin/ui'

const FIELDS = {
  rates: [
    { key: 'federal_bracket', label: 'Federal bracket', suffix: '%', hint: 'Your marginal federal rate' },
    { key: 'state_rate', label: 'State rate', suffix: '%', hint: 'State income tax rate' },
  ],
  se: [
    { key: 'se_tax_rate', label: 'SE tax rate', suffix: '%', hint: 'Default 15.3%' },
    { key: 'se_tax_base', label: 'SE tax base', suffix: '%', hint: 'Share of net profit taxed. Default 92.35%' },
  ],
}

export default function FinanceSettingsPage() {
  const notify = useToast()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  useEffect(() => {
    fetch('/api/finance/settings')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not load settings'))))
      .then((data) =>
        setForm({
          federal_bracket: data.federal_bracket?.toString() || '22',
          state_rate: data.state_rate?.toString() || '9',
          state_name: data.state_name || 'Oregon',
          se_tax_rate: data.se_tax_rate?.toString() || '15.3',
          se_tax_base: data.se_tax_base?.toString() || '92.35',
          tax_year: data.tax_year?.toString() || String(new Date().getFullYear()),
        })
      )
      .catch((err) => notify(err.message, 'error'))
  }, [notify])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/finance/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          federal_bracket: parseFloat(form.federal_bracket),
          state_rate: parseFloat(form.state_rate),
          state_name: form.state_name,
          se_tax_rate: parseFloat(form.se_tax_rate),
          se_tax_base: parseFloat(form.se_tax_base),
          tax_year: parseInt(form.tax_year, 10),
        }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to save')
      notify('Tax rates saved. Estimates use them right away.', 'success')
    } catch (err) {
      notify(`Couldn't save: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <PageLoader />

  const percentInput = ({ key, label, suffix, hint }) => (
    <Field key={key} label={label} htmlFor={key} hint={hint}>
      <div className="relative">
        <input
          id={key}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          max="100"
          required
          value={form[key]}
          onChange={(e) => set({ [key]: e.target.value })}
          className={cx(inputClass, 'h-11 pr-8 tabular-nums sm:h-10')}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-adm-subtle">{suffix}</span>
      </div>
    </Field>
  )

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Rates used for estimated tax on the Overview and Tax pages" />

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader title="Income tax" />
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            {FIELDS.rates.map(percentInput)}
            <Field label="State" htmlFor="state_name">
              <input
                id="state_name"
                type="text"
                required
                value={form.state_name}
                onChange={(e) => set({ state_name: e.target.value })}
                className={cx(inputClass, 'h-11 sm:h-10')}
              />
            </Field>
            <Field label="Tax year" htmlFor="tax_year">
              <input
                id="tax_year"
                type="number"
                inputMode="numeric"
                min="2020"
                max="2100"
                required
                value={form.tax_year}
                onChange={(e) => set({ tax_year: e.target.value })}
                className={cx(inputClass, 'h-11 tabular-nums sm:h-10')}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Self-employment tax" description="Social Security and Medicare on your net earnings" />
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            {FIELDS.se.map(percentInput)}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" type="submit" loading={saving} className="w-full sm:w-auto">Save rates</Button>
        </div>
      </form>
    </div>
  )
}
