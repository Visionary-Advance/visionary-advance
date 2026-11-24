'use client'

// DevOps API calls. Every /api/devops/* route requires an admin session, and admin
// sessions live in localStorage, so requests carry the bearer token (authFetch).

import { authFetch } from '@/Components/Admin/SEO/planRuns'

export { authFetch }

/** JSON request that throws the server's error message on failure. */
export async function devopsApi(url, { method = 'GET', body } = {}) {
  const res = await authFetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

// Tell the shell to refresh the Claude "needs you" count after a chat changes
export function announceClaudeChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('devops:claude-changed'))
}

// Tell the shell to refresh the Approvals count after a merge or send-back
export function announceApprovalsChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('devops:approvals-changed'))
}
