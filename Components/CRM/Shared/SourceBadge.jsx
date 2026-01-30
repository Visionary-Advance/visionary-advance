'use client'

const SOURCE_CONFIG = {
  website_audit: { label: 'Website Audit', color: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20' },
  systems_form: { label: 'Systems Form', color: 'bg-purple-500/10 text-purple-400 ring-purple-500/20' },
  contact_form: { label: 'Contact Form', color: 'bg-blue-500/10 text-blue-400 ring-blue-500/20' },
  audit_email: { label: 'Audit Email', color: 'bg-teal-500/10 text-teal-400 ring-teal-500/20' },
  manual: { label: 'Manual', color: 'bg-gray-500/10 text-gray-400 ring-gray-500/20' },
}

export default function SourceBadge({ source }) {
  const config = SOURCE_CONFIG[source] || { label: source, color: 'bg-gray-500/10 text-gray-400 ring-gray-500/20' }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.color}`}
    >
      {config.label}
    </span>
  )
}

export { SOURCE_CONFIG }
