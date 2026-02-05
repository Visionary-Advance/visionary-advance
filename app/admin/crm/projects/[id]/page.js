// app/admin/crm/projects/[id]/page.js
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MilestoneTimeline from '@/Components/CRM/Projects/MilestoneTimeline'
import ProposalCard from '@/Components/CRM/Proposals/ProposalCard'
import TaskList from '@/Components/CRM/Projects/Tasks/TaskList'
import TimeTracker from '@/Components/CRM/Projects/Time/TimeTracker'

const STATUS_CONFIG = {
  planning: { label: 'Planning', bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' },
  active: { label: 'Active', bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20' },
  on_hold: { label: 'On Hold', bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  completed: { label: 'Completed', bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20' },
}

const STATUS_OPTIONS = ['planning', 'active', 'on_hold', 'completed', 'cancelled']

export default function ProjectDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [project, setProject] = useState(null)
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: '',
    budget: '',
    estimated_hours: '',
    start_date: '',
    target_end_date: '',
  })

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/crm/projects/${id}`)
      if (!res.ok) throw new Error('Project not found')

      const data = await res.json()
      setProject(data.project)
      setForm({
        name: data.project.name || '',
        description: data.project.description || '',
        status: data.project.status || 'planning',
        budget: data.project.budget || '',
        estimated_hours: data.project.estimated_hours || '',
        start_date: data.project.start_date || '',
        target_end_date: data.project.target_end_date || '',
      })

      // Fetch lead info
      if (data.project.lead_id) {
        const leadRes = await fetch(`/api/crm/leads/${data.project.lead_id}`)
        if (leadRes.ok) {
          const leadData = await leadRes.json()
          setLead(leadData)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/crm/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          status: form.status,
          budget: form.budget ? parseFloat(form.budget) : null,
          estimated_hours: form.estimated_hours ? parseFloat(form.estimated_hours) : null,
          start_date: form.start_date || null,
          target_end_date: form.target_end_date || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setProject(data.project)
      setEditing(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/crm/projects/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      router.push(`/admin/crm/leads/${project.lead_id}`)
    } catch (err) {
      alert(err.message)
      setDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`/api/crm/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      const data = await res.json()
      setProject(data.project)
      setForm(prev => ({ ...prev, status: newStatus }))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleMilestoneUpdate = (updatedProject) => {
    setProject(updatedProject)
  }

  const formatCurrency = (amount) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Calculate progress
  const milestones = project?.milestones || []
  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const progress = milestones.length > 0
    ? Math.round((completedMilestones / milestones.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || 'Project not found'}</p>
        <Link href="/admin/crm" className="text-[#008070] hover:underline">
          Back to CRM
        </Link>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/admin/crm/leads/${project.lead_id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to {lead?.full_name || lead?.company || 'lead'}
          </Link>
          {editing ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="text-2xl font-semibold text-[#fafafa] bg-transparent border-b border-[#262626] focus:border-[#008070] focus:outline-none w-full"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-[#fafafa]">{project.name}</h1>
          )}
          {lead && (
            <p className="mt-1 text-[#a1a1aa]">
              {lead.full_name} {lead.company && `· ${lead.company}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg bg-[#262626] px-4 py-2 text-sm text-[#fafafa] hover:bg-[#363636]"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
          Status
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_OPTIONS.map((status) => {
            const isCurrent = project.status === status
            const config = STATUS_CONFIG[status]

            return (
              <button
                key={status}
                onClick={() => !isCurrent && handleStatusChange(status)}
                disabled={isCurrent}
                className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[#008070] text-white'
                    : 'bg-[#0a0a0a] text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa]'
                } border border-[#262626] disabled:cursor-not-allowed`}
              >
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Description
            </h2>
            {editing ? (
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Project description..."
                className="w-full rounded-lg border border-[#262626] bg-[#171717] p-3 text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none"
              />
            ) : (
              <p className="text-[#fafafa] whitespace-pre-wrap">
                {project.description || <span className="text-[#a1a1aa]">No description</span>}
              </p>
            )}
          </div>

          {/* Milestones */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Milestones
              </h2>
              {milestones.length > 0 && (
                <span className="text-sm text-[#a1a1aa]">
                  {completedMilestones}/{milestones.length} complete ({progress}%)
                </span>
              )}
            </div>
            {milestones.length > 0 && (
              <div className="mb-4 h-2 rounded-full bg-[#262626] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#008070] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <MilestoneTimeline
              projectId={id}
              milestones={project.milestones || []}
              onUpdate={handleMilestoneUpdate}
            />
          </div>

          {/* Tasks */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <TaskList projectId={id} onUpdate={fetchProject} />
          </div>

          {/* Time Tracking */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <TimeTracker
              projectId={id}
              estimatedHours={project.estimated_hours}
              onUpdate={fetchProject}
            />
          </div>

          {/* Proposals */}
          {project.proposals && project.proposals.length > 0 && (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Linked Proposals
                </h2>
                <Link
                  href={`/admin/crm/leads/${project.lead_id}/proposals/new?project=${id}`}
                  className="text-sm text-[#008070] hover:text-[#006b5d]"
                >
                  + New
                </Link>
              </div>
              <div className="space-y-3">
                {project.proposals.map(proposal => (
                  <ProposalCard key={proposal.id} proposal={proposal} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Details
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-[#a1a1aa]">Budget</dt>
                <dd className="mt-1">
                  {editing ? (
                    <input
                      type="number"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="5000"
                      className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-[#fafafa]">
                      {formatCurrency(project.budget)}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Estimated Hours</dt>
                <dd className="mt-1">
                  {editing ? (
                    <input
                      type="number"
                      name="estimated_hours"
                      value={form.estimated_hours}
                      onChange={handleChange}
                      placeholder="40"
                      className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                    />
                  ) : (
                    <span className="text-[#fafafa]">
                      {project.estimated_hours ? `${project.estimated_hours}h` : '-'}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Start Date</dt>
                <dd className="mt-1">
                  {editing ? (
                    <input
                      type="date"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                    />
                  ) : (
                    <span className="text-[#fafafa]">{formatDate(project.start_date)}</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Target End Date</dt>
                <dd className="mt-1">
                  {editing ? (
                    <input
                      type="date"
                      name="target_end_date"
                      value={form.target_end_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none"
                    />
                  ) : (
                    <span className="text-[#fafafa]">{formatDate(project.target_end_date)}</span>
                  )}
                </dd>
              </div>
              {project.actual_end_date && (
                <div>
                  <dt className="text-xs text-[#a1a1aa]">Completed</dt>
                  <dd className="mt-1 text-emerald-400">{formatDate(project.actual_end_date)}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Financials */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Financials
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-[#a1a1aa]">Invoiced</dt>
                <dd className="mt-1 text-[#fafafa]">{formatCurrency(project.amount_invoiced)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Paid</dt>
                <dd className="mt-1 text-emerald-400">{formatCurrency(project.amount_paid)}</dd>
              </div>
              {project.budget && (
                <div>
                  <dt className="text-xs text-[#a1a1aa]">Remaining Budget</dt>
                  <dd className={`mt-1 ${(project.budget - (project.amount_invoiced || 0)) < 0 ? 'text-red-400' : 'text-[#fafafa]'}`}>
                    {formatCurrency(project.budget - (project.amount_invoiced || 0))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* DevOps Sites */}
          {project.devopsSites && project.devopsSites.length > 0 && (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Linked Sites
              </h2>
              <div className="space-y-2">
                {project.devopsSites.map(site => (
                  <Link
                    key={site.id}
                    href={`/admin/devops/sites/${site.id}`}
                    className="block rounded-lg bg-[#171717] p-3 hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#fafafa]">{site.name}</span>
                      <StatusBadge status={site.status} />
                    </div>
                    {site.url && (
                      <span className="text-xs text-[#a1a1aa] truncate block mt-1">{site.url}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[#262626] px-3 py-1 text-sm text-[#a1a1aa]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
              Metadata
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-[#a1a1aa]">Created</dt>
                <dd className="mt-1 text-sm text-[#fafafa]">{formatDate(project.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#a1a1aa]">Last Updated</dt>
                <dd className="mt-1 text-sm text-[#fafafa]">{formatDate(project.updated_at)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
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

function StatusBadge({ status }) {
  const configs = {
    healthy: { label: 'Healthy', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    degraded: { label: 'Degraded', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    down: { label: 'Down', bg: 'bg-red-500/10', text: 'text-red-400' },
    unknown: { label: 'Unknown', bg: 'bg-gray-500/10', text: 'text-gray-400' },
  }
  const config = configs[status] || configs.unknown

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
