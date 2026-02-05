// app/admin/crm/leads/[id]/proposals/new/page.js
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProposalEditor from '@/Components/CRM/Proposals/ProposalEditor'

export default function NewProposalPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [lead, setLead] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    project_id: '',
    total_amount: '',
    currency: 'USD',
    valid_until: '',
    line_items: [],
    content_json: null,
    content_html: '',
  })

  const [newLineItem, setNewLineItem] = useState({
    description: '',
    quantity: 1,
    unit_price: '',
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [leadRes, projectsRes] = await Promise.all([
        fetch(`/api/crm/leads/${id}`),
        fetch(`/api/crm/leads/${id}/projects`),
      ])

      if (leadRes.ok) {
        const data = await leadRes.json()
        setLead(data)
      }

      if (projectsRes.ok) {
        const data = await projectsRes.json()
        setProjects(data.projects || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditorChange = ({ json, html }) => {
    setForm(prev => ({ ...prev, content_json: json, content_html: html }))
  }

  const addLineItem = () => {
    if (!newLineItem.description || !newLineItem.unit_price) return

    const item = {
      id: `item-${Date.now()}`,
      description: newLineItem.description,
      quantity: parseFloat(newLineItem.quantity) || 1,
      unit_price: parseFloat(newLineItem.unit_price),
      total: (parseFloat(newLineItem.quantity) || 1) * parseFloat(newLineItem.unit_price),
    }

    setForm(prev => ({
      ...prev,
      line_items: [...prev.line_items, item],
      total_amount: prev.line_items.reduce((sum, i) => sum + i.total, 0) + item.total,
    }))

    setNewLineItem({ description: '', quantity: 1, unit_price: '' })
  }

  const removeLineItem = (itemId) => {
    setForm(prev => {
      const newItems = prev.line_items.filter(i => i.id !== itemId)
      return {
        ...prev,
        line_items: newItems,
        total_amount: newItems.reduce((sum, i) => sum + i.total, 0),
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      alert('Title is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/crm/leads/${id}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          project_id: form.project_id || null,
          content_json: form.content_json,
          content_html: form.content_html,
          total_amount: form.total_amount || null,
          currency: form.currency,
          line_items: form.line_items,
          valid_until: form.valid_until || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to create proposal')

      const data = await res.json()
      router.push(`/admin/crm/proposals/${data.proposal.id}`)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: form.currency || 'USD',
    }).format(amount || 0)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/crm/leads/${id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to {lead?.full_name || 'lead'}
        </Link>
        <h1 className="text-2xl font-semibold text-[#fafafa]">New Proposal</h1>
        {lead?.company && (
          <p className="mt-1 text-[#a1a1aa]">For {lead.company}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Website Redesign Proposal"
              className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-1">Project (optional)</label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-[#fafafa] focus:border-[#008070] focus:outline-none"
              >
                <option value="">No project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-1">Valid Until</label>
              <input
                type="date"
                name="valid_until"
                value={form.valid_until}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-[#fafafa] focus:border-[#008070] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4">
            Line Items
          </h2>

          {form.line_items.length > 0 && (
            <div className="mb-4 space-y-2">
              {form.line_items.map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-[#171717] p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#fafafa]">{item.description}</p>
                    <p className="text-xs text-[#a1a1aa]">
                      {item.quantity} x {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#fafafa]">
                      {formatCurrency(item.total)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-2 border-t border-[#262626]">
                <span className="text-lg font-semibold text-[#fafafa]">
                  Total: {formatCurrency(form.total_amount)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs text-[#a1a1aa] mb-1">Description</label>
              <input
                type="text"
                value={newLineItem.description}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Website Design & Development"
                className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none"
              />
            </div>
            <div className="w-20">
              <label className="block text-xs text-[#a1a1aa] mb-1">Qty</label>
              <input
                type="number"
                value={newLineItem.quantity}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, quantity: e.target.value }))}
                min="1"
                className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs text-[#a1a1aa] mb-1">Unit Price</label>
              <input
                type="number"
                value={newLineItem.unit_price}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, unit_price: e.target.value }))}
                placeholder="5000"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addLineItem}
              disabled={!newLineItem.description || !newLineItem.unit_price}
              className="rounded-lg bg-[#262626] px-3 py-2 text-sm text-[#fafafa] hover:bg-[#363636] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        {/* Content Editor */}
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4">
            Proposal Content
          </h2>
          <ProposalEditor
            content={form.content_json}
            onChange={handleEditorChange}
            editable={true}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/crm/leads/${id}`}
            className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#008070] px-6 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Creating...' : 'Create Proposal'}
          </button>
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

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}
