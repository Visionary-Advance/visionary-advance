// app/admin/finance/settings/page.js — Finance Settings
'use client'

import { useState, useEffect } from 'react'

export default function FinanceSettingsPage() {
  const [form, setForm] = useState({
    federal_bracket: '',
    state_rate: '',
    state_name: '',
    se_tax_rate: '',
    se_tax_base: '',
    tax_year: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/finance/settings')
        if (res.ok) {
          const data = await res.json()
          setForm({
            federal_bracket: data.federal_bracket?.toString() || '22',
            state_rate: data.state_rate?.toString() || '9',
            state_name: data.state_name || 'Oregon',
            se_tax_rate: data.se_tax_rate?.toString() || '15.3',
            se_tax_base: data.se_tax_base?.toString() || '92.35',
            tax_year: data.tax_year?.toString() || new Date().getFullYear().toString(),
          })
        }
      } catch (err) {
        console.error('Error fetching settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
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
          tax_year: parseInt(form.tax_year),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#fafafa]">Finance Settings</h1>
        <p className="mt-1 text-[#a1a1aa]">Configure tax rates for estimated payment calculations</p>
      </div>

      <div className="max-w-xl rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">Federal Tax Bracket (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.federal_bracket}
                onChange={(e) => setForm({ ...form, federal_bracket: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-[#525252]">Your marginal federal tax bracket</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">State Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.state_rate}
                onChange={(e) => setForm({ ...form, state_rate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-[#525252]">State income tax rate</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">State Name</label>
            <input
              type="text"
              value={form.state_name}
              onChange={(e) => setForm({ ...form, state_name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">SE Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.se_tax_rate}
                onChange={(e) => setForm({ ...form, se_tax_rate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-[#525252]">Self-employment tax rate (default 15.3%)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa]">SE Tax Base (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.se_tax_base}
                onChange={(e) => setForm({ ...form, se_tax_base: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-[#525252]">% of net profit subject to SE tax (default 92.35%)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">Tax Year</label>
            <input
              type="number"
              min="2020"
              max="2100"
              value={form.tax_year}
              onChange={(e) => setForm({ ...form, tax_year: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && (
              <span className="text-sm font-medium text-green-400">Settings saved successfully</span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
