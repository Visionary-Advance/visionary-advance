'use client'

import Link from 'next/link'

const STATUS_CONFIG = {
  planning: { label: 'Planning', bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' },
  active: { label: 'Active', bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20' },
  on_hold: { label: 'On Hold', bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  completed: { label: 'Completed', bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20' },
}

export default function ProjectCard({ project, compact = false }) {
  const config = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning

  // Calculate progress from milestones
  const milestones = project.milestones || []
  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const progress = milestones.length > 0
    ? Math.round((completedMilestones / milestones.length) * 100)
    : (project.status === 'completed' ? 100 : 0)

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

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
            {config.label}
          </span>
          <span className="text-sm text-[#fafafa] truncate">{project.name}</span>
        </div>
        {project.budget && (
          <span className="flex-shrink-0 text-sm text-[#a1a1aa]">
            {formatCurrency(project.budget)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#262626] bg-[#171717] p-4 hover:border-[#363636] transition-colors">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
              {config.label}
            </span>
          </div>
          <h3 className="mt-2 text-base font-medium text-[#fafafa]">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-sm text-[#a1a1aa] line-clamp-2">{project.description}</p>
          )}
        </div>
        {project.budget && (
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-lg font-semibold text-[#fafafa]">{formatCurrency(project.budget)}</div>
            <div className="text-xs text-[#a1a1aa]">Budget</div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {milestones.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#a1a1aa]">Progress</span>
            <span className="text-[#fafafa]">{completedMilestones}/{milestones.length} milestones</span>
          </div>
          <div className="h-2 rounded-full bg-[#262626] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#008070] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="mt-4 flex items-center gap-4 text-xs text-[#a1a1aa]">
        {project.start_date && (
          <span>Start: {formatDate(project.start_date)}</span>
        )}
        {project.target_end_date && (
          <span>Target: {formatDate(project.target_end_date)}</span>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-[#262626] px-2 py-0.5 text-xs text-[#a1a1aa]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
