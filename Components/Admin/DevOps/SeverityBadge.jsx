'use client'

// Incident severity and incident status badges.

import { CircleAlert, CircleCheck, Eye, Info, Search, Siren, Target, TriangleAlert } from 'lucide-react'
import { Badge } from '@/Components/Admin/ui'

export const SEVERITY = {
  critical: { label: 'Critical', tone: 'bad', icon: Siren },
  major: { label: 'Major', tone: 'warn', icon: TriangleAlert },
  minor: { label: 'Minor', tone: 'neutral', icon: CircleAlert },
  info: { label: 'Info', tone: 'info', icon: Info },
}

export const INCIDENT_STATUS = {
  open: { label: 'Open', tone: 'bad', icon: CircleAlert },
  investigating: { label: 'Investigating', tone: 'warn', icon: Search },
  identified: { label: 'Identified', tone: 'warn', icon: Target },
  monitoring: { label: 'Monitoring', tone: 'info', icon: Eye },
  resolved: { label: 'Resolved', tone: 'good', icon: CircleCheck },
}

export const INCIDENT_STATUS_ORDER = ['open', 'investigating', 'identified', 'monitoring', 'resolved']

export default function SeverityBadge({ severity, className }) {
  const s = SEVERITY[severity] || SEVERITY.info
  return <Badge tone={s.tone} icon={s.icon} className={className}>{s.label}</Badge>
}

export function IncidentStatusBadge({ status, className }) {
  const s = INCIDENT_STATUS[status] || INCIDENT_STATUS.open
  return <Badge tone={s.tone} icon={s.icon} className={className}>{s.label}</Badge>
}
