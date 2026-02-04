// app/admin/crm/leads/new/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TIMELINES = [
  { value: '', label: 'Select timeline...' },
  { value: 'ASAP / Urgent', label: 'ASAP / Urgent' },
  { value: '1-2 weeks', label: '1-2 weeks' },
  { value: '1 month', label: '1 month' },
  { value: '2-3 months', label: '2-3 months' },
  { value: '3-6 months', label: '3-6 months' },
  { value: 'Flexible / No rush', label: 'Flexible / No rush' },
]

const STAGES = [
  { value: 'contact', label: 'Contact' },
  { value: 'plan_audit_meeting', label: 'Plan Audit Meeting' },
  { value: 'discovery_call', label: 'Discovery Call' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'offer', label: 'Offer' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

export default function NewLeadPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    company: '',
    website: '',
    stage: 'contact',
    needs: '',
    budget: '',
    timeline: '',
    notes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'manual' }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create lead')
      }

      // Redirect to the new lead's detail page
      router.push(`/admin/crm/leads/${data.lead.id}`)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/crm/leads"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to leads
          </Link>
          <h1 className="text-2xl font-semibold text-[#fafafa]">Add New Lead</h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">Enter the lead's information below</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/crm/leads"
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-[#fafafa] transition-colors hover:bg-[#171717]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="new-lead-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              'Create Lead'
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form id="new-lead-form" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#fafafa]">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                    placeholder="lead@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-[#fafafa]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#fafafa]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#fafafa]">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-[#fafafa]">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Pipeline Info */}
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Pipeline
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-[#fafafa]">
                    Stage
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                  >
                    {STAGES.map(stage => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Business Info */}
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Business Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-[#fafafa]">
                    Budget
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                    placeholder="$5,000 - $10,000"
                  />
                </div>
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-[#fafafa]">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                  >
                    {TIMELINES.map(timeline => (
                      <option key={timeline.value} value={timeline.value}>
                        {timeline.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="needs" className="block text-sm font-medium text-[#fafafa]">
                    Needs / Requirements
                  </label>
                  <textarea
                    id="needs"
                    name="needs"
                    rows={4}
                    value={formData.needs}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                    placeholder="What does the lead need?"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Notes
              </h2>
              <textarea
                id="notes"
                name="notes"
                rows={6}
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#262626] bg-[#171717] px-4 py-2.5 text-[#fafafa] placeholder-[#a1a1aa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                placeholder="Any additional notes about this lead..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}
