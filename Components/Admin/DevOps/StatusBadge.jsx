'use client'

// Site health status. Color always comes with an icon and a word.

import { CircleCheck, CircleHelp, CircleX, ShieldOff, TriangleAlert } from 'lucide-react'
import { Badge, cx } from '@/Components/Admin/ui'

export const STATUS = {
  healthy: { label: 'Healthy', tone: 'good', icon: CircleCheck, bar: 'bg-green-500' },
  degraded: { label: 'Degraded', tone: 'warn', icon: TriangleAlert, bar: 'bg-amber-500' },
  down: { label: 'Down', tone: 'bad', icon: CircleX, bar: 'bg-red-500' },
  blocked: { label: 'Blocked', tone: 'neutral', icon: ShieldOff, bar: 'bg-zinc-500' },
  unknown: { label: 'Unknown', tone: 'neutral', icon: CircleHelp, bar: 'bg-zinc-600' },
}

/** A check recorded as 'unknown' because a firewall turned the monitor away (403/429). */
export function checkStatus(check) {
  if (!check) return 'unknown'
  if (check.status === 'unknown' && [403, 429].includes(check.http_status_code)) return 'blocked'
  return check.status || 'unknown'
}

export default function StatusBadge({ status, className, title }) {
  const s = STATUS[status] || STATUS.unknown
  return (
    <Badge tone={s.tone} icon={s.icon} className={className} title={title}>
      {s.label}
    </Badge>
  )
}

/** Just a colored dot with screen-reader text, for dense lists. */
export function StatusDot({ status, className }) {
  const s = STATUS[status] || STATUS.unknown
  return (
    <span className={cx('relative inline-flex h-2.5 w-2.5 shrink-0', className)} title={s.label}>
      {status === 'down' && <span className="absolute inset-0 animate-ping rounded-full bg-red-500/60" />}
      <span className={cx('relative h-2.5 w-2.5 rounded-full', s.bar)} />
      <span className="sr-only">{s.label}</span>
    </span>
  )
}
