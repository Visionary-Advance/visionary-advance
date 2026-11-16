'use client'

// Approvals: PRs opened by SEO "Ship", waiting for you. Review the change, open the
// Vercel preview, then Approve & merge (deploys to production) or Send back with a note.
// ?task=<id> opens a review directly (Telegram links here).

import { Suspense, useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  CircleAlert, CircleCheck, CircleDashed, CircleX, ExternalLink, FileCode, GitBranch, GitMerge, GitPullRequest,
  Globe, Undo2,
} from 'lucide-react'
import {
  Alert, Badge, Button, Card, Drawer, EmptyState, Field, PageHeader, PageLoader, SectionLabel, Skeleton, cx,
  focusRing, inputClass, useToast,
} from '@/Components/Admin/ui'
import { announceApprovalsChanged, devopsApi } from '@/Components/Admin/DevOps/api'
import { usePullToRefresh } from '@/Components/Admin/PullToRefresh'
import { timeAgo } from '@/Components/Admin/DevOps/format'

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Approvals />
    </Suspense>
  )
}

function Approvals() {
  const notify = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const openTaskId = searchParams.get('task')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      const result = await devopsApi('/api/devops/approvals')
      setData(result)
      setError(null)
      if (result.synced?.length) {
        const merged = result.synced.filter(s => s.outcome === 'merged').length
        const closed = result.synced.length - merged
        notify(
          [merged && `${merged} PR${merged === 1 ? ' was' : 's were'} already merged on GitHub`, closed && `${closed} closed`]
            .filter(Boolean).join(', ') + '. Their tasks are updated.',
          'info'
        )
        announceApprovalsChanged()
      }
    } catch (err) {
      setError(err.message)
    }
  }, [notify])

  useEffect(() => { load() }, [load])
  usePullToRefresh(load)

  const openTask = id => router.push(id ? `${pathname}?task=${id}` : pathname, { scroll: false })

  const onDone = useCallback(() => {
    openTask(null)
    announceApprovalsChanged()
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load])

  if (error && !data) {
    return <EmptyState icon={GitPullRequest} title="Couldn't load approvals" description={error} action={<Button onClick={load}>Try again</Button>} />
  }
  if (!data) return <PageLoader />

  const items = data.items || []

  return (
    <div>
      <PageHeader
        title="Approvals"
        description="Changes Claude made from your SEO plans. Approving merges the PR and deploys the site."
      />

      {!data.githubConfigured && (
        <Alert tone="warn" title="GitHub isn't connected" className="mb-4">
          Set <code className="text-adm-text">GITHUB_DEVOPS_TOKEN</code> in Vercel to load PR details here.
        </Alert>
      )}
      {data.githubConfigured && !data.canMerge && (
        <Alert tone="info" title="Review-only for now" className="mb-4">
          Approving needs <code className="text-adm-text">GITHUB_DEVOPS_TOKEN</code> with Pull requests and Contents write access.
          Until then, merge on GitHub; this list updates itself either way.
        </Alert>
      )}

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={CircleCheck}
            title="Nothing waiting"
            description="When you ship a task from an SEO plan, its PR shows up here for review."
            action={<Button href="/admin/seo">Go to SEO</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map(item => <ApprovalCard key={item.task.id} item={item} onReview={() => openTask(item.task.id)} />)}
        </div>
      )}

      {openTaskId && (
        <ReviewDrawer
          taskId={openTaskId}
          canMerge={data.canMerge}
          onClose={() => openTask(null)}
          onDone={onDone}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------

function ApprovalCard({ item, onReview }) {
  const { task, pr, checks, preview, error } = item
  const site = task.plan?.site?.display_name || item.repo

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-adm-subtle">{site}</p>
          <h2 className="mt-0.5 text-base font-semibold text-adm-text">{task.title}</h2>
          {pr && (
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-adm-subtle">
              <span className="inline-flex min-w-0 items-center gap-1"><GitBranch className="h-3.5 w-3.5 shrink-0" aria-hidden /><span className="truncate">{pr.head}</span> → {pr.base}</span>
              <span className="tabular-nums"><span className="text-adm-good">+{pr.additions}</span> <span className="text-adm-bad">−{pr.deletions}</span> · {pr.changedFiles} file{pr.changedFiles === 1 ? '' : 's'}</span>
              <span>Opened {timeAgo(pr.createdAt)}</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {preview?.url && <Button size="sm" icon={Globe} href={preview.url} external>Preview</Button>}
          <Button size="sm" variant="primary" icon={GitPullRequest} onClick={onReview} disabled={!pr}>Review</Button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-xs text-adm-bad" role="alert">{error}</p>
      ) : pr ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <ChecksBadge checks={checks} />
          <PreviewBadge preview={preview} />
          <MergeableBadge pr={pr} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-adm-subtle">PR details unavailable.</p>
      )}
    </Card>
  )
}

function ChecksBadge({ checks }) {
  if (!checks || checks.state === 'none') return <Badge icon={CircleDashed}>No checks</Badge>
  if (checks.state === 'passed') return <Badge tone="good" icon={CircleCheck}>Checks passed</Badge>
  if (checks.state === 'pending') return <Badge tone="warn" icon={CircleDashed}>Checks running ({checks.pending})</Badge>
  return <Badge tone="bad" icon={CircleX}>{checks.failed} check{checks.failed === 1 ? '' : 's'} failed</Badge>
}

function PreviewBadge({ preview }) {
  if (!preview) return <Badge icon={Globe}>No preview yet</Badge>
  if (preview.state === 'success') return <Badge tone="good" icon={Globe}>Preview ready</Badge>
  if (['failure', 'error'].includes(preview.state)) return <Badge tone="bad" icon={Globe}>Preview failed</Badge>
  return <Badge tone="warn" icon={Globe}>Preview building</Badge>
}

function MergeableBadge({ pr }) {
  if (pr.draft) return <Badge icon={CircleAlert}>Draft</Badge>
  if (pr.mergeable === false) return <Badge tone="bad" icon={CircleX}>Conflicts</Badge>
  if (pr.mergeableState === 'behind') return <Badge tone="warn" icon={CircleAlert}>Behind {pr.base}</Badge>
  if (pr.mergeableState === 'blocked') return <Badge tone="warn" icon={CircleAlert}>Blocked by branch rules</Badge>
  return null
}

// ---------------------------------------------------------------------------

function ReviewDrawer({ taskId, canMerge, onClose, onDone }) {
  const notify = useToast()
  const [detail, setDetail] = useState(null)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('review') // review | send-back
  const [note, setNote] = useState('')
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setDetail(null)
    setError(null)
    devopsApi(`/api/devops/approvals/${taskId}`)
      .then(setDetail)
      .catch(err => setError(err.message))
  }, [taskId])

  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 5000)
    return () => clearTimeout(t)
  }, [armed])

  const task = detail?.task
  const pr = detail?.pr
  const waiting = task?.ship_status === 'pr_open' && pr?.state === 'open'
  const blockedReason = !pr ? null
    : !canMerge ? 'Approving needs GITHUB_DEVOPS_TOKEN.'
    : pr.draft ? 'The PR is a draft.'
    : pr.mergeable === false ? 'The PR has conflicts. Resolve them on GitHub.'
    : null

  async function approve() {
    if (!armed) return setArmed(true)
    setBusy(true)
    try {
      await devopsApi(`/api/devops/approvals/${taskId}/merge`, { method: 'POST', body: { sha: pr.headSha } })
      notify(`Merged. ${task.plan?.site?.display_name || 'The site'} is deploying.`, 'success')
      onDone()
    } catch (err) {
      notify(err.message, 'error')
      setArmed(false)
    } finally {
      setBusy(false)
    }
  }

  async function sendBack() {
    setBusy(true)
    try {
      await devopsApi(`/api/devops/approvals/${taskId}/request-changes`, { method: 'POST', body: { note } })
      notify('Sent back. Ship the task again from the SEO plan when ready.', 'success')
      onDone()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const header = (
    <div className="min-w-0">
      <p className="text-xs font-medium text-adm-subtle">{task?.plan?.site?.display_name || detail?.repo || 'Loading…'}</p>
      <h2 className="mt-0.5 text-base font-semibold text-adm-text">{task?.title || 'Review'}</h2>
    </div>
  )

  const footer = detail && waiting && (
    mode === 'send-back' ? (
      <div className="space-y-3">
        <Field label="What should change?" htmlFor="sendback-note" hint="Posted on the PR, which then closes. Shipping the task again gives Claude this note.">
          <textarea id="sendback-note" rows={3} value={note} onChange={e => setNote(e.target.value)} className={cx(inputClass, 'resize-y')} data-autofocus />
        </Field>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setMode('review')}>Cancel</Button>
          <Button variant="danger" icon={Undo2} onClick={sendBack} loading={busy} disabled={!note.trim()}>Close PR and send back</Button>
        </div>
      </div>
    ) : (
      <div className="space-y-2">
        {blockedReason && <p className="text-xs text-adm-warn">{blockedReason}</p>}
        {!blockedReason && detail.checks?.state === 'failed' && (
          <p className="text-xs text-adm-bad">Some checks failed. Make sure that's expected before merging.</p>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" icon={Undo2} onClick={() => setMode('send-back')}>Send back</Button>
          {detail.preview?.url && <Button icon={Globe} href={detail.preview.url} external>Open preview</Button>}
          <Button
            variant={armed ? 'danger' : 'primary'}
            icon={GitMerge}
            onClick={approve}
            loading={busy}
            disabled={Boolean(blockedReason)}
          >
            {armed ? 'Tap again to merge and deploy' : 'Approve & merge'}
          </Button>
        </div>
      </div>
    )
  )

  return (
    <Drawer onClose={onClose} header={header} footer={footer} label="Review PR">
      {error ? (
        <Alert tone="bad" title="Couldn't load this PR">{error}</Alert>
      ) : !detail ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          {!waiting && (
            <Alert tone="info" title="Not waiting for review">
              {pr.state === 'merged' ? 'This PR is already merged.' : pr.state === 'closed' ? 'This PR is closed.' : `Task status: ${task.ship_status}.`}
            </Alert>
          )}

          <div className="flex flex-wrap gap-1.5">
            <ChecksBadge checks={detail.checks} />
            <PreviewBadge preview={detail.preview} />
            <MergeableBadge pr={pr} />
            <a href={pr.url} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 rounded text-xs text-adm-muted hover:text-adm-text', focusRing)}>
              #{pr.number} on GitHub <ExternalLink className="h-3 w-3" aria-hidden /><span className="sr-only">(opens in new tab)</span>
            </a>
          </div>

          {task.description && (
            <section>
              <SectionLabel className="mb-2">Why</SectionLabel>
              <p className="whitespace-pre-wrap text-sm text-adm-muted">{task.description}</p>
            </section>
          )}

          {task.acceptance_criteria?.length > 0 && (
            <section>
              <SectionLabel className="mb-2">Done when</SectionLabel>
              <ul className="space-y-1.5 text-sm text-adm-muted">
                {task.acceptance_criteria.map((c, i) => (
                  <li key={i} className="flex gap-2"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />{c}</li>
                ))}
              </ul>
            </section>
          )}

          {pr.body && (
            <section>
              <SectionLabel className="mb-2">What Claude changed</SectionLabel>
              <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-adm-border bg-adm-bg p-3 text-sm text-adm-muted">{pr.body}</div>
            </section>
          )}

          {detail.checks?.items?.length > 0 && (
            <section>
              <SectionLabel className="mb-2">Checks</SectionLabel>
              <ul className="divide-y divide-adm-border rounded-lg border border-adm-border">
                {detail.checks.items.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 px-3 py-2 text-sm">
                    {c.state === 'passed' ? <CircleCheck className="h-4 w-4 text-adm-good" aria-label="Passed" />
                      : c.state === 'pending' ? <CircleDashed className="h-4 w-4 text-adm-warn" aria-label="Running" />
                      : <CircleX className="h-4 w-4 text-adm-bad" aria-label="Failed" />}
                    <span className="min-w-0 flex-1 truncate text-adm-text">{c.name}</span>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className={cx('rounded text-adm-subtle hover:text-adm-text', focusRing)}>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden /><span className="sr-only">Open {c.name}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <SectionLabel className="mb-2">
              Files changed ({detail.files.length}) · <span className="text-adm-good">+{pr.additions}</span> <span className="text-adm-bad">−{pr.deletions}</span>
            </SectionLabel>
            <div className="space-y-2">
              {detail.files.map(file => <FileDiff key={file.filename} file={file} defaultOpen={detail.files.length <= 3} />)}
            </div>
          </section>
        </div>
      )}
    </Drawer>
  )
}

function FileDiff({ file, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const tone = { added: 'good', removed: 'bad', renamed: 'info' }[file.status] || 'neutral'

  return (
    <div className="overflow-hidden rounded-lg border border-adm-border">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className={cx('flex w-full cursor-pointer items-center gap-2 bg-adm-raised px-3 py-2 text-left text-sm hover:bg-adm-hover', focusRing)}
      >
        <FileCode className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-adm-text" title={file.filename}>{file.filename}</span>
        {file.status !== 'modified' && <Badge tone={tone} className="capitalize">{file.status}</Badge>}
        <span className="shrink-0 font-mono text-xs tabular-nums"><span className="text-adm-good">+{file.additions}</span> <span className="text-adm-bad">−{file.deletions}</span></span>
      </button>
      {open && (
        file.patch ? (
          <pre className="max-h-[28rem] overflow-auto bg-adm-bg py-2 text-[12px] leading-5">
            {file.patch.split('\n').map((line, i) => (
              <div
                key={i}
                className={cx(
                  'whitespace-pre px-3',
                  line.startsWith('+') ? 'bg-green-500/10 text-green-300'
                    : line.startsWith('-') ? 'bg-red-500/10 text-red-300'
                    : line.startsWith('@@') ? 'text-adm-info'
                    : 'text-adm-muted'
                )}
              >
                {line || ' '}
              </div>
            ))}
          </pre>
        ) : (
          <p className="bg-adm-bg px-3 py-2 text-xs text-adm-subtle">No inline diff (binary or too large). See it on GitHub.</p>
        )
      )}
    </div>
  )
}
