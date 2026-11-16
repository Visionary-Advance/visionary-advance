// lib/devops-approvals.js
// Review and merge the PRs that SEO "Ship" opens, from DevOps → Approvals.
//
// A task waits here while ship_status = 'pr_open'. Each load pulls the PR live from
// GitHub; a PR merged or closed on GitHub directly is recorded and drops off the list
// (the GitHub webhook does the same without a page load).
//
// Approve = squash-merge pinned to the head SHA you reviewed → task completed.
// Send back = comment your note, close the PR → 'changes_requested'. Shipping the task
// again passes your note to Claude (lib/seo-ship.js).
// Nothing merges without a signed-in admin pressing Approve.

import {
  GitHubError, closePullRequest, commentOnPullRequest, getCheckSummary, getPreview, getPullFiles,
  getPullRequest, hasWriteToken, mergePullRequest, parsePrUrl,
} from './github'
import { sendN8nNotification } from './n8n'

let supabaseClient = null
function getSupabase() {
  if (!supabaseClient) {
    const { createClient } = require('@supabase/supabase-js')
    supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  }
  return supabaseClient
}

export class ApprovalError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

const TASK_SELECT =
  'id, title, description, acceptance_criteria, category, priority, status, ship_status, ship_branch, pr_url, pr_number, ' +
  'ship_run_url, ship_updated_at, merged_at, merged_by, review_note, ' +
  'plan:seo_plans(id, month, site:seo_sites(id, display_name, site_url, github_repo))'

/** Number of PRs waiting, from the database only (cheap; used for the nav badge). */
export async function countPendingApprovals() {
  const { count, error } = await getSupabase()
    .from('seo_plan_tasks')
    .select('id', { count: 'exact', head: true })
    .eq('ship_status', 'pr_open')
  if (error) throw error
  return count || 0
}

async function loadTask(taskId) {
  const { data, error } = await getSupabase().from('seo_plan_tasks').select(TASK_SELECT).eq('id', taskId).maybeSingle()
  if (error) throw error
  if (!data) throw new ApprovalError('Task not found', 404)
  return data
}

function prRef(task) {
  const ref = parsePrUrl(task.pr_url)
  if (!ref) throw new ApprovalError('This task has no GitHub PR link', 409)
  return ref
}

function summarisePr(pr) {
  return {
    number: pr.number,
    title: pr.title,
    body: pr.body || '',
    url: pr.html_url,
    state: pr.merged ? 'merged' : pr.state, // open | closed | merged
    draft: pr.draft,
    head: pr.head?.ref,
    headSha: pr.head?.sha,
    base: pr.base?.ref,
    author: pr.user?.login,
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    additions: pr.additions,
    deletions: pr.deletions,
    changedFiles: pr.changed_files,
    // null while GitHub is still computing it
    mergeable: pr.mergeable,
    mergeableState: pr.mergeable_state, // clean | blocked | behind | dirty | unstable | unknown
  }
}

/**
 * Record a PR's fate on its task. Idempotent: the list sync, the merge button and the
 * webhook can all report the same merge.
 */
async function recordOutcome(task, outcome, { mergedAt, mergedBy, note } = {}) {
  const now = new Date().toISOString()
  const updates = { ship_status: outcome, ship_updated_at: now }
  if (outcome === 'merged') {
    updates.status = 'completed'
    updates.merged_at = mergedAt || now
    updates.merged_by = mergedBy || null
  }
  if (outcome === 'changes_requested') updates.review_note = note || null

  const { error } = await getSupabase()
    .from('seo_plan_tasks')
    .update(updates)
    .eq('id', task.id)
    .in('ship_status', ['pr_open', 'queued', 'running', 'failed'])
  if (error) throw error
}

async function notify(text, extra) {
  try {
    await sendN8nNotification({ type: 'seo_ship', text, ...extra })
  } catch (err) {
    console.error('Approval notification failed:', err)
  }
}

function siteName(task) {
  return task.plan?.site?.display_name || 'SEO'
}

/**
 * Every PR waiting for review, with live GitHub state.
 * Returns { items, githubConfigured, canMerge, synced } where `synced` lists tasks
 * found already merged/closed on GitHub (and now recorded).
 */
export async function listApprovals() {
  const { data: tasks, error } = await getSupabase()
    .from('seo_plan_tasks')
    .select(TASK_SELECT)
    .eq('ship_status', 'pr_open')
    .order('ship_updated_at', { ascending: true })
  if (error) throw error

  const githubConfigured = Boolean(process.env.GITHUB_DEVOPS_TOKEN || process.env.GITHUB_SEO_DISPATCH_TOKEN)
  const synced = []

  const items = await Promise.all((tasks || []).map(async task => {
    const ref = parsePrUrl(task.pr_url)
    const base = { task, repo: ref?.repo || task.plan?.site?.github_repo || null, pr: null, checks: null, preview: null, error: null }
    if (!ref || !githubConfigured) return base

    try {
      const pr = summarisePr(await getPullRequest(ref.repo, ref.number))
      if (pr.state !== 'open') {
        const outcome = pr.state === 'merged' ? 'merged' : 'closed'
        await recordOutcome(task, outcome, { mergedAt: pr.state === 'merged' ? pr.updatedAt : null, mergedBy: 'github' })
        synced.push({ id: task.id, title: task.title, outcome })
        return null
      }
      const [checks, preview] = await Promise.all([
        getCheckSummary(ref.repo, pr.headSha),
        getPreview(ref.repo, pr.headSha),
      ])
      return { ...base, pr, checks, preview }
    } catch (err) {
      return { ...base, error: err.message }
    }
  }))

  return { items: items.filter(Boolean), githubConfigured, canMerge: hasWriteToken(), synced }
}

/** One approval with the diff. */
export async function getApproval(taskId) {
  const task = await loadTask(taskId)
  const ref = prRef(task)
  const pr = summarisePr(await getPullRequest(ref.repo, ref.number))
  const [files, checks, preview] = await Promise.all([
    getPullFiles(ref.repo, ref.number),
    getCheckSummary(ref.repo, pr.headSha),
    getPreview(ref.repo, pr.headSha),
  ])
  return {
    task,
    repo: ref.repo,
    pr,
    checks,
    preview,
    canMerge: hasWriteToken(),
    files: (files || []).map(f => ({
      filename: f.filename,
      status: f.status, // added | modified | removed | renamed
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch ? f.patch.slice(0, 60000) : null, // GitHub omits patches for huge/binary files
    })),
  }
}

/** Approve: squash-merge the exact commit that was reviewed. */
export async function approveAndMerge(taskId, { sha, user }) {
  if (!sha) throw new ApprovalError('Missing the commit you reviewed (sha)')
  const task = await loadTask(taskId)
  if (task.ship_status !== 'pr_open') throw new ApprovalError('This PR is no longer waiting for review', 409)
  const ref = prRef(task)

  const pr = summarisePr(await getPullRequest(ref.repo, ref.number))
  if (pr.state !== 'open') throw new ApprovalError(`The PR is already ${pr.state} on GitHub`, 409)
  if (pr.headSha !== sha) throw new ApprovalError('The PR changed since you opened it. Reload to review the new version.', 409)
  if (pr.draft) throw new ApprovalError('The PR is still a draft on GitHub', 409)
  if (pr.mergeable === false) throw new ApprovalError('GitHub says this PR has conflicts with the base branch', 409)

  try {
    await mergePullRequest(ref.repo, ref.number, { sha, title: pr.title })
  } catch (err) {
    if (err instanceof GitHubError && err.status === 409) {
      throw new ApprovalError(`GitHub refused the merge: ${err.message}`, 409)
    }
    throw err
  }

  await recordOutcome(task, 'merged', { mergedBy: user?.email || 'admin' })
  await notify(`🚀 Merged: ${siteName(task)}\n${task.title}\nDeploying to production now.\n${pr.url}`, {
    site: siteName(task), task_id: task.id, pr_url: pr.url,
  })
  return { merged: true, url: pr.url }
}

/** Send back: leave the note on the PR, close it, and keep the note for the next Ship. */
export async function requestChanges(taskId, { note, user }) {
  const text = String(note || '').trim()
  if (!text) throw new ApprovalError('Say what needs to change')
  const task = await loadTask(taskId)
  if (task.ship_status !== 'pr_open') throw new ApprovalError('This PR is no longer waiting for review', 409)
  const ref = prRef(task)

  await commentOnPullRequest(
    ref.repo, ref.number,
    `**Changes requested** by ${user?.email || 'admin'} in DevOps:\n\n${text}\n\nClosing this PR. Shipping the task again passes this note to Claude.`
  )
  await closePullRequest(ref.repo, ref.number)
  await recordOutcome(task, 'changes_requested', { note: text.slice(0, 2000) })
  return { closed: true }
}

/**
 * GitHub webhook: a Ship PR was merged or closed outside DevOps.
 * `pr` is the webhook's pull_request object.
 */
export async function applyPullRequestClosed(pr) {
  if (!pr?.html_url) return { matched: false }
  const { data: task, error } = await getSupabase()
    .from('seo_plan_tasks')
    .select(TASK_SELECT)
    .eq('pr_url', pr.html_url)
    .eq('ship_status', 'pr_open')
    .maybeSingle()
  if (error) throw error
  if (!task) return { matched: false }

  const outcome = pr.merged ? 'merged' : 'closed'
  await recordOutcome(task, outcome, { mergedAt: pr.merged_at, mergedBy: pr.merged_by?.login ? `github:${pr.merged_by.login}` : 'github' })
  return { matched: true, task_id: task.id, outcome }
}
