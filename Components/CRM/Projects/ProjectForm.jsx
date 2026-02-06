'use client'

import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function ProjectForm({ leadId, businessId, contacts, project, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    budget: project?.budget || '',
    start_date: project?.start_date || '',
    target_end_date: project?.target_end_date || '',
    tags: project?.tags?.join(', ') || '',
    contact_id: contacts?.length === 1 ? contacts[0].id : '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Project name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
        budget: form.budget ? parseFloat(form.budget) : null,
        start_date: form.start_date || null,
        target_end_date: form.target_end_date || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }

      if (businessId) {
        if (!form.contact_id) {
          setError('Please select a contact')
          setLoading(false)
          return
        }
        payload.contact_id = form.contact_id
      }

      const isEdit = !!project?.id
      const url = isEdit
        ? `/api/crm/projects/${project.id}`
        : businessId
          ? `/api/crm/businesses/${businessId}/projects`
          : `/api/crm/leads/${leadId}/projects`

      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save project')
      }

      const data = await res.json()
      if (onSave) onSave(data.project)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Contact Selector (business mode) */}
      {businessId && contacts && contacts.length > 1 && (
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">
            Contact <span className="text-red-400">*</span>
          </label>
          <select
            name="contact_id"
            value={form.contact_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
            required
          >
            <option value="">Select a contact...</option>
            {contacts.map(c => (
              <option key={c.id} value={c.id}>
                {c.full_name || c.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm text-[#a1a1aa] mb-1">
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g., Website Redesign"
          className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-[#a1a1aa] mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Project details..."
          className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
        />
      </div>

      {/* Status and Budget */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">Budget</label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="5000"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          />
        </div>
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">Target End Date</label>
          <input
            type="date"
            name="target_end_date"
            value={form.target_end_date}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm text-[#a1a1aa] mb-1">Tags</label>
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="web design, responsive, SEO"
          className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
        />
        <p className="mt-1 text-xs text-[#a1a1aa]">Separate tags with commas</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : project?.id ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}
