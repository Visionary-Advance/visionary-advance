// Components/Admin/SystemForge/ModuleForm.jsx
'use client'

import { useState } from 'react'

export default function ModuleForm({ module, onClose, onSuccess }) {
  const isEdit = !!module
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [name, setName] = useState(module?.name || '')
  const [description, setDescription] = useState(module?.description || '')
  const [type, setType] = useState(module?.type || 'module')
  const [category, setCategory] = useState(module?.category || '')
  const [industryTags, setIndustryTags] = useState(module?.industry_tags?.join(', ') || '')
  const [dependencies, setDependencies] = useState(
    module?.dependencies ? JSON.stringify(module.dependencies, null, 2) : '{}'
  )
  const [envVars, setEnvVars] = useState(
    module?.env_vars ? module.env_vars.map(e => typeof e === 'string' ? e : e.name).join('\n') : ''
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      // Parse dependencies JSON
      let parsedDeps = {}
      try {
        parsedDeps = JSON.parse(dependencies)
      } catch {
        setError('Invalid JSON in dependencies')
        setSaving(false)
        return
      }

      // Parse industry tags
      const tags = industryTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      // Parse env vars
      const envs = envVars
        .split('\n')
        .map(e => e.trim())
        .filter(Boolean)
        .map(name => ({ name }))

      const data = {
        name,
        description,
        type,
        category: category || null,
        industry_tags: tags,
        dependencies: parsedDeps,
        env_vars: envs,
      }

      const url = isEdit
        ? `/api/system-forge/modules/${module.id}`
        : '/api/system-forge/modules'

      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Failed to save module')
      }

      const result = await res.json()
      onSuccess(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-[#262626] bg-[#0a0a0a]">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#262626] bg-[#0a0a0a] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#fafafa]">
            {isEdit ? 'Edit Module' : 'Create Module'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa]"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
              placeholder="e.g., Contact Form"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">
              Type <span className="text-red-400">*</span>
            </label>
            <div className="mt-2 flex gap-3">
              {['module', 'component', 'snippet'].map((t) => (
                <label
                  key={t}
                  className={`flex-1 cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors ${
                    type === t
                      ? 'border-[#008070] bg-[#008070]/10 text-[#fafafa]'
                      : 'border-[#262626] text-[#a1a1aa] hover:bg-[#171717]'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={(e) => setType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
              placeholder="What does this module do?"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
              placeholder="e.g., Forms, Authentication, UI"
            />
          </div>

          {/* Industry Tags */}
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">Industry Tags</label>
            <input
              type="text"
              value={industryTags}
              onChange={(e) => setIndustryTags(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
              placeholder="construction, healthcare, ecommerce (comma-separated)"
            />
          </div>

          {/* Dependencies */}
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">
              NPM Dependencies (JSON)
            </label>
            <textarea
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 font-mono text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
              placeholder='{"react-hook-form": "^7.0.0"}'
            />
          </div>

          {/* Environment Variables */}
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">
              Environment Variables
            </label>
            <textarea
              value={envVars}
              onChange={(e) => setEnvVars(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 font-mono text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
              placeholder="API_KEY&#10;DATABASE_URL (one per line)"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-[#fafafa] hover:bg-[#171717]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
