'use client'

const STAGE_CONFIG = {
  contact: { label: 'Contact', color: 'bg-gray-500/10 text-gray-400 ring-gray-500/20' },
  plan_audit_meeting: { label: 'Plan Audit Meeting', color: 'bg-violet-500/10 text-violet-400 ring-violet-500/20' },
  discovery_call: { label: 'Discovery Call', color: 'bg-blue-500/10 text-blue-400 ring-blue-500/20' },
  proposal: { label: 'Proposal', color: 'bg-amber-500/10 text-amber-400 ring-amber-500/20' },
  offer: { label: 'Offer', color: 'bg-pink-500/10 text-pink-400 ring-pink-500/20' },
  negotiating: { label: 'Negotiating', color: 'bg-orange-500/10 text-orange-400 ring-orange-500/20' },
  won: { label: 'Won', color: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' },
  lost: { label: 'Lost', color: 'bg-red-500/10 text-red-400 ring-red-500/20' },
}

export default function StageBadge({ stage }) {
  const config = STAGE_CONFIG[stage] || { label: stage, color: 'bg-gray-500/10 text-gray-400 ring-gray-500/20' }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.color}`}
    >
      {config.label}
    </span>
  )
}

export { STAGE_CONFIG }
