// Components/Admin/SystemForge/TypeBadge.jsx
'use client'

const TYPE_CONFIG = {
  module: {
    color: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
    label: 'Module'
  },
  component: {
    color: 'bg-green-500/10 text-green-400 ring-green-500/20',
    label: 'Component'
  },
  snippet: {
    color: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    label: 'Snippet'
  }
}

export default function TypeBadge({ type }) {
  const { color, label } = TYPE_CONFIG[type] || TYPE_CONFIG.module

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${color}`}>
      {label}
    </span>
  )
}
