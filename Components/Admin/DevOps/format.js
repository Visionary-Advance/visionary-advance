// Formatting helpers shared by the DevOps pages.

export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url || ''
  }
}

export function timeAgo(date) {
  if (!date) return 'Never'
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function fmtDateTime(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function duration(start, end) {
  if (!start) return '—'
  const mins = Math.max(0, Math.floor(((end ? new Date(end) : new Date()) - new Date(start)) / 60000))
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ${mins % 60}m`
  return `${Math.floor(hours / 24)}d ${hours % 24}h`
}

export const ENVIRONMENT = {
  production: { label: 'Production', tone: 'neutral' },
  staging: { label: 'Staging', tone: 'warn' },
  development: { label: 'Development', tone: 'info' },
}
