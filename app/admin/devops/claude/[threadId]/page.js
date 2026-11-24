'use client'

// One Claude chat. Your messages go to the claude-chat-run Action; Claude's replies,
// plans and PRs show up here as they arrive (polled every few seconds while it works,
// and a push notification when it's done). Server: lib/claude-chat.js.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { Archive, ArrowLeft, Check, ExternalLink, GitPullRequest, Inbox, Pencil, X } from 'lucide-react'
import { Alert, Badge, Button, EmptyState, IconButton, PageLoader, cx, focusRing, inputClass, useToast } from '@/Components/Admin/ui'
import { announceApprovalsChanged, announceClaudeChanged, devopsApi } from '@/Components/Admin/DevOps/api'
import { usePullToRefresh } from '@/Components/Admin/PullToRefresh'
import { Composer, IN_FLIGHT, Message, RunStatus, ThreadStateBadge } from '@/Components/Admin/DevOps/ClaudeChat'
import Link from 'next/link'

const FAST_POLL = 4000
const SLOW_POLL = 30000

export default function ClaudeThreadPage() {
  const { threadId } = useParams()
  const notify = useToast()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(null) // e.g. "approve:<id>", "send"
  const [pending, setPending] = useState(null) // your message while it's being sent
  const composerRef = useRef(null)
  const endRef = useRef(null)
  const nearBottom = useRef(true)
  const lastCount = useRef(0)
  const lastState = useRef(null)

  const load = useCallback(async () => {
    try {
      const result = await devopsApi(`/api/devops/claude/threads/${threadId}`)
      // Nav badges change when Claude finishes or a plan is resolved
      if (lastState.current && lastState.current !== result.thread.state) {
        announceClaudeChanged()
        if (result.thread.state === 'pr_open' || lastState.current === 'pr_open') announceApprovalsChanged()
      }
      lastState.current = result.thread.state
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [threadId])

  useEffect(() => { load() }, [load])
  usePullToRefresh(load)

  const run = data?.latestRun
  const working = Boolean(run && IN_FLIGHT.includes(run.status))

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') load().catch(() => {})
    }, working ? FAST_POLL : SLOW_POLL)
    const onVisible = () => { if (document.visibilityState === 'visible') load().catch(() => {}) }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [working, load])

  // Follow new messages when you're already at the bottom (or on first load).
  useEffect(() => {
    const onScroll = () => {
      nearBottom.current = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const count = (data?.messages?.length || 0) + (pending ? 1 : 0) + (working ? 1 : 0)
  useLayoutEffect(() => {
    if (!count) return
    const first = lastCount.current === 0
    if (count !== lastCount.current && (first || nearBottom.current)) {
      endRef.current?.scrollIntoView({ block: 'end', behavior: first ? 'instant' : 'smooth' })
    }
    lastCount.current = count
  }, [count])

  async function act(key, fn, { success } = {}) {
    setBusy(key)
    try {
      await fn()
      if (success) notify(success, 'success')
      announceClaudeChanged()
      await load()
      return true
    } catch (err) {
      notify(err.message, 'error')
      await load()
      return false
    } finally {
      setBusy(null)
    }
  }

  async function send(text) {
    setPending(text)
    nearBottom.current = true
    const ok = await act('send', () =>
      devopsApi(`/api/devops/claude/threads/${threadId}/messages`, { method: 'POST', body: { text } }))
    setPending(null)
    return ok
  }

  const onPlan = (messageId, action) =>
    act(`${action}:${messageId}`, () => devopsApi(`/api/devops/claude/plans/${messageId}`, { method: 'POST', body: { action } }), {
      success: action === 'approve' ? 'Approved. Claude is making the changes.' : null,
    })
  const onRun = (runId, action) =>
    act(`${action}:${runId}`, () => devopsApi(`/api/devops/claude/runs/${runId}`, { method: 'POST', body: { action } }))
  const onRevise = () => composerRef.current?.focus('Say what should change and Claude writes a new plan.')

  if (error && !data) {
    return (
      <EmptyState
        icon={X}
        title="Couldn't load this chat"
        description={error}
        action={<Button href="/admin/devops/claude" icon={ArrowLeft}>All chats</Button>}
      />
    )
  }
  if (!data) return <PageLoader />

  const { thread, messages } = data
  const archived = thread.status === 'archived'

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ThreadHeader thread={thread} onChanged={load} />

      {!data.canDispatch && (
        <Alert tone="warn" title="Claude can't be started" className="mb-4">
          Set <code className="text-adm-text">GITHUB_SEO_DISPATCH_TOKEN</code> in Vercel (Actions: write on this repo).
        </Alert>
      )}

      <div className="flex-1 space-y-4 pb-4" role="log" aria-live="polite" aria-label="Conversation">
        {messages.map(m => (
          <Message
            key={m.id}
            message={m}
            threadId={thread.id}
            latestRun={run}
            busy={busy}
            onPlan={onPlan}
            onRetry={id => onRun(id, 'retry')}
            onRevise={onRevise}
          />
        ))}
        {pending && (
          <div className="flex justify-end">
            <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md border border-teal-500/25 bg-teal-500/10 px-3.5 py-2.5 text-[14.5px] leading-6 text-adm-text opacity-70 sm:max-w-[75%]">
              {pending}
            </div>
          </div>
        )}
        <RunStatus run={run} busy={busy} onCancel={id => onRun(id, 'cancel')} />
        <div ref={endRef} />
      </div>

      <div
        className="sticky z-20 -mx-4 border-t border-adm-border/70 bg-adm-bg/85 px-4 pb-3 pt-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-t-2xl lg:border-x lg:px-4"
        style={{ bottom: 'var(--admin-nav-offset, 0px)' }}
      >
        {archived ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-adm-muted">This chat is archived.</p>
            <Button
              size="sm"
              icon={Inbox}
              loading={busy === 'reopen'}
              onClick={() => act('reopen', () => devopsApi(`/api/devops/claude/threads/${thread.id}`, { method: 'PATCH', body: { status: 'open' } }))}
            >
              Reopen
            </Button>
          </div>
        ) : (
          <Composer
            ref={composerRef}
            onSend={send}
            sending={busy === 'send'}
            disabled={working || Boolean(pending)}
            disabledReason="Claude is working. You can send your next message when it replies, or stop the run."
            placeholder={thread.pr_status === 'open' ? 'Ask for changes to the open PR…' : 'Message Claude…'}
            autoFocus={messages.length === 0}
          />
        )}
      </div>
    </div>
  )
}

function ThreadHeader({ thread, onChanged }) {
  const notify = useToast()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(thread.title)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (!editing) setTitle(thread.title) }, [thread.title, editing])

  async function patch(body, message) {
    setSaving(true)
    try {
      await devopsApi(`/api/devops/claude/threads/${thread.id}`, { method: 'PATCH', body })
      if (message) notify(message, 'success')
      setEditing(false)
      announceClaudeChanged()
      announceApprovalsChanged()
      await onChanged()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-4 flex items-start gap-2 border-b border-adm-border pb-3">
      <Link
        href="/admin/devops/claude"
        aria-label="All chats"
        className={cx('-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-adm-muted hover:bg-adm-raised hover:text-adm-text', focusRing)}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
      </Link>

      <div className="min-w-0 flex-1">
        {editing ? (
          <form
            className="flex items-center gap-1.5"
            onSubmit={e => { e.preventDefault(); patch({ title }) }}
          >
            <label htmlFor="thread-title" className="sr-only">Chat title</label>
            <input
              id="thread-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={80}
              autoFocus
              className={cx(inputClass, 'h-9')}
            />
            <IconButton icon={Check} label="Save title" type="submit" disabled={saving || !title.trim()} />
            <IconButton icon={X} label="Cancel" onClick={() => setEditing(false)} />
          </form>
        ) : (
          <div className="flex min-h-9 items-center gap-2">
            <h1 className="min-w-0 truncate text-lg font-semibold text-adm-text">{thread.title}</h1>
            <IconButton icon={Pencil} size="sm" label="Rename chat" onClick={() => setEditing(true)} className="shrink-0" />
          </div>
        )}
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-adm-subtle">
          <ThreadStateBadge state={thread.state} />
          {thread.pr_status === 'open' && thread.pr_url && (
            <a href={thread.pr_url} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 rounded hover:text-adm-text', focusRing)}>
              <GitPullRequest className="h-3.5 w-3.5" aria-hidden /> PR #{thread.pr_number}
              <ExternalLink className="h-3 w-3" aria-hidden /><span className="sr-only">(opens in new tab)</span>
            </a>
          )}
          {thread.pr_status === 'merged' && <Badge tone="good">Merged</Badge>}
          <span className="truncate">{thread.repo.split('/')[1]}</span>
        </div>
      </div>

      {!editing && (
        thread.status === 'archived' ? (
          <IconButton icon={Inbox} label="Reopen chat" onClick={() => patch({ status: 'open' }, 'Chat reopened')} disabled={saving} />
        ) : (
          <IconButton icon={Archive} label="Archive chat" onClick={() => patch({ status: 'archived' }, 'Chat archived')} disabled={saving} />
        )
      )}
    </div>
  )
}
