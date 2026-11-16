// lib/github.js
// Small GitHub REST client for reviewing and merging the PRs the SEO Ship flow opens.
//
// Token: GITHUB_DEVOPS_TOKEN, a fine-grained PAT on the Visionary-Advance org with
// Pull requests (read & write), Contents (read & write), Deployments (read) and
// Commit statuses (read). Reads fall back to GITHUB_SEO_DISPATCH_TOKEN so the
// approvals list can still try to load before the new token exists; merging never does.

import crypto from 'crypto'

const API = 'https://api.github.com'

export class GitHubError extends Error {
  constructor(message, status = 502) {
    super(message)
    this.status = status
  }
}

function readToken() {
  return process.env.GITHUB_DEVOPS_TOKEN || process.env.GITHUB_SEO_DISPATCH_TOKEN || null
}

function writeToken() {
  const token = process.env.GITHUB_DEVOPS_TOKEN
  if (!token) {
    throw new GitHubError('GITHUB_DEVOPS_TOKEN is not configured, so PRs can only be merged on GitHub for now', 500)
  }
  return token
}

export function hasWriteToken() {
  return Boolean(process.env.GITHUB_DEVOPS_TOKEN)
}

async function gh(path, { method = 'GET', body, write = false, accept } = {}) {
  const token = write ? writeToken() : readToken()
  if (!token) throw new GitHubError('No GitHub token configured (GITHUB_DEVOPS_TOKEN)', 500)

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept || 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    let message = `${res.status}`
    try {
      const data = await res.json()
      message = data.message || message
    } catch {}
    const hint = res.status === 403 || res.status === 404
      ? ' (check the token can see this repo and has the needed permissions)'
      : ''
    throw new GitHubError(`GitHub ${method} ${path.split('?')[0]} failed: ${message}${hint}`, res.status === 404 ? 404 : res.status === 409 || res.status === 405 ? 409 : 502)
  }
  if (res.status === 204) return null
  return res.json()
}

/** "https://github.com/Org/repo/pull/12" → { repo: 'Org/repo', number: 12 } */
export function parsePrUrl(url) {
  const m = String(url || '').match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/)
  return m ? { repo: m[1], number: Number(m[2]) } : null
}

export function getPullRequest(repo, number) {
  return gh(`/repos/${repo}/pulls/${number}`)
}

/** Changed files with their patches (first 100, which covers any Ship PR). */
export function getPullFiles(repo, number) {
  return gh(`/repos/${repo}/pulls/${number}/files?per_page=100`)
}

/**
 * Summarise checks for a commit: GitHub check runs plus legacy commit statuses.
 * Returns { state: 'passed'|'failed'|'pending'|'none', total, passed, failed, pending, items }.
 */
export async function getCheckSummary(repo, sha) {
  const [runs, combined] = await Promise.all([
    gh(`/repos/${repo}/commits/${sha}/check-runs?per_page=100`).catch(() => ({ check_runs: [] })),
    gh(`/repos/${repo}/commits/${sha}/status`).catch(() => ({ statuses: [] })),
  ])

  const items = [
    ...(runs.check_runs || []).map(r => ({
      name: r.name,
      state: r.status !== 'completed' ? 'pending'
        : ['success', 'neutral', 'skipped'].includes(r.conclusion) ? 'passed' : 'failed',
      url: r.details_url || r.html_url,
    })),
    ...(combined.statuses || []).map(s => ({
      name: s.context,
      state: s.state === 'success' ? 'passed' : s.state === 'pending' ? 'pending' : 'failed',
      url: s.target_url,
    })),
  ]

  const count = st => items.filter(i => i.state === st).length
  const failed = count('failed')
  const pending = count('pending')
  const passed = count('passed')
  return {
    state: items.length === 0 ? 'none' : failed ? 'failed' : pending ? 'pending' : 'passed',
    total: items.length,
    passed,
    failed,
    pending,
    items,
  }
}

/**
 * The Vercel preview for a commit, from GitHub deployments.
 * Returns { url, state } or null when Vercel hasn't reported one.
 */
export async function getPreview(repo, sha) {
  const deployments = await gh(`/repos/${repo}/deployments?sha=${sha}&per_page=10`).catch(() => [])
  for (const d of deployments || []) {
    if (/production/i.test(d.environment || '')) continue
    const statuses = await gh(`/repos/${repo}/deployments/${d.id}/statuses?per_page=5`).catch(() => [])
    const latest = statuses?.[0]
    if (!latest) continue
    return {
      url: latest.environment_url || latest.target_url || null,
      state: latest.state, // success | pending | in_progress | failure | error | inactive
    }
  }
  return null
}

/** Squash-merge, pinned to the SHA that was reviewed. */
export function mergePullRequest(repo, number, { sha, title }) {
  return gh(`/repos/${repo}/pulls/${number}/merge`, {
    method: 'PUT',
    write: true,
    body: { sha, merge_method: 'squash', commit_title: title ? `${title} (#${number})` : undefined },
  })
}

export function commentOnPullRequest(repo, number, body) {
  return gh(`/repos/${repo}/issues/${number}/comments`, { method: 'POST', write: true, body: { body } })
}

export function closePullRequest(repo, number) {
  return gh(`/repos/${repo}/pulls/${number}`, { method: 'PATCH', write: true, body: { state: 'closed' } })
}

/**
 * Verify a GitHub webhook delivery. `rawBody` must be the exact request text.
 * Fails closed when GITHUB_WEBHOOK_SECRET is unset.
 */
export function verifyWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret || !signatureHeader?.startsWith('sha256=')) return false
  const expected = Buffer.from(`sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`)
  const received = Buffer.from(signatureHeader)
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}
