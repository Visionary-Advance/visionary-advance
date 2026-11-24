'use client'

// Pieces of the Claude chat (DevOps → Claude): messages, plan and PR cards, the run
// status line and the composer. Pages: app/admin/devops/claude/**. Server: lib/claude-chat.js.

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowUp, Bot, Check, ChevronRight, CircleAlert, Database, ExternalLink, FileCode, GitPullRequest, Pencil,
  RotateCcw, Square, TriangleAlert, X,
} from 'lucide-react'
import { Badge, Button, cx, focusRing } from '@/Components/Admin/ui'
import { useTicker } from '@/Components/Admin/SEO/planRuns'
import { fmtDateTime, timeAgo } from '@/Components/Admin/DevOps/format'

export const IN_FLIGHT = ['queued', 'running']

// ---------------------------------------------------------------------------
// Markdown (Claude's answers, plan summaries, PR summaries). No raw HTML.

const mdComponents = {
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  h1: ({ children }) => <p className="mb-1 mt-3 font-semibold text-adm-text first:mt-0">{children}</p>,
  h2: ({ children }) => <p className="mb-1 mt-3 font-semibold text-adm-text first:mt-0">{children}</p>,
  h3: ({ children }) => <p className="mb-1 mt-3 font-semibold text-adm-text first:mt-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-adm-text">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-adm-accent underline underline-offset-2">{children}</a>
  ),
  blockquote: ({ children }) => <blockquote className="my-2 border-l-2 border-adm-border-strong pl-3 text-adm-muted">{children}</blockquote>,
  code: ({ className, children }) =>
    className ? (
      <code className={cx(className, 'font-mono text-[12.5px]')}>{children}</code>
    ) : (
      <code className="rounded bg-adm-raised px-1 py-0.5 font-mono text-[12.5px] text-adm-text">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-adm-border bg-adm-bg p-3 text-[12.5px] leading-5">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto"><table className="w-full border-collapse text-left text-[13px]">{children}</table></div>
  ),
  th: ({ children }) => <th className="border-b border-adm-border px-2 py-1 font-medium text-adm-text">{children}</th>,
  td: ({ children }) => <td className="border-b border-adm-border px-2 py-1">{children}</td>,
}

export function Markdown({ children, className }) {
  return (
    <div className={cx('break-words text-[14.5px] leading-6 text-adm-text/90', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{children || ''}</ReactMarkdown>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Thread state (list rows and header)

export const THREAD_STATE = {
  working: { label: 'Working', tone: 'accent' },
  waiting: { label: 'Needs you', tone: 'warn' },
  pr_open: { label: 'PR open', tone: 'info' },
  failed: { label: 'Failed', tone: 'bad' },
  idle: null,
}

export function ThreadStateBadge({ state }) {
  const s = THREAD_STATE[state]
  if (!s) return null
  return <Badge tone={s.tone}>{s.label}</Badge>
}

// ---------------------------------------------------------------------------
// Messages

export function Message({ message, threadId, latestRun, busy, onPlan, onRetry, onRevise }) {
  switch (message.kind) {
    case 'plan':
      return <PlanCard message={message} busy={busy} onPlan={onPlan} onRevise={onRevise} />
    case 'pr':
      return <PrCard message={message} threadId={threadId} />
    case 'error':
      return <ErrorCard message={message} latestRun={latestRun} busy={busy} onRetry={onRetry} />
    case 'event':
      return (
        <p className="py-1 text-center text-xs text-adm-subtle">
          {message.body} <span className="whitespace-nowrap">· {timeAgo(message.created_at)}</span>
        </p>
      )
    default:
      return message.role === 'user' ? <UserBubble message={message} /> : <ClaudeBubble message={message} />
  }
}

function UserBubble({ message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] sm:max-w-[75%]">
        <div className="whitespace-pre-wrap break-words rounded-2xl rounded-br-md border border-teal-500/25 bg-teal-500/10 px-3.5 py-2.5 text-[14.5px] leading-6 text-adm-text">
          {message.body}
        </div>
        <Time date={message.created_at} className="text-right" />
      </div>
    </div>
  )
}

function ClaudeBubble({ message }) {
  return (
    <div className="flex gap-2.5">
      <ClaudeAvatar />
      <div className="min-w-0 flex-1">
        {message.kind === 'question' && <Badge tone="warn" className="mb-1.5">Question</Badge>}
        <Markdown>{message.body}</Markdown>
        <Time date={message.created_at} />
      </div>
    </div>
  )
}

function ClaudeAvatar() {
  return (
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-adm-raised ring-1 ring-adm-border" aria-hidden>
      <Bot className="h-4 w-4 text-adm-accent" />
    </span>
  )
}

function Time({ date, className }) {
  return (
    <p className={cx('mt-1 text-[11px] text-adm-subtle', className)} title={fmtDateTime(date)}>
      {timeAgo(date)}
    </p>
  )
}

const PLAN_STATUS = {
  approved: { label: 'Approved, in progress', tone: 'accent' },
  shipped: { label: 'Shipped as a PR', tone: 'good' },
  superseded: { label: 'Replaced by a newer plan', tone: 'neutral' },
  dismissed: { label: 'Dismissed', tone: 'neutral' },
}
const SIZE_LABEL = { S: 'Small', M: 'Medium', L: 'Large' }

function PlanCard({ message, busy, onPlan, onRevise }) {
  const plan = message.data || {}
  const status = plan.status || 'proposed'
  const open = status === 'proposed'
  const done = PLAN_STATUS[status]

  return (
    <div className="flex gap-2.5">
      <ClaudeAvatar />
      <div className={cx('min-w-0 flex-1 overflow-hidden rounded-xl border bg-adm-surface', open ? 'border-teal-500/30' : 'border-adm-border', !open && status !== 'shipped' && status !== 'approved' && 'opacity-70')}>
        <div className="border-b border-adm-border px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="accent">Plan</Badge>
            {plan.size && <Badge>{SIZE_LABEL[plan.size] || plan.size}</Badge>}
            {plan.needs_migration && <Badge tone="warn" icon={Database}>Migration</Badge>}
            {done && <Badge tone={done.tone}>{done.label}</Badge>}
          </div>
          <h3 className="mt-2 text-[15px] font-semibold leading-snug text-adm-text">{plan.title}</h3>
          <Markdown className="mt-1 text-adm-muted">{plan.summary}</Markdown>
        </div>

        <ol className="divide-y divide-adm-border">
          {(plan.steps || []).map((step, i) => (
            <li key={i}>
              <details className="group">
                <summary className={cx('flex cursor-pointer list-none items-start gap-3 px-4 py-2.5 text-sm hover:bg-adm-raised [&::-webkit-details-marker]:hidden', focusRing)}>
                  <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-adm-raised text-[11px] font-semibold tabular-nums text-adm-muted ring-1 ring-adm-border">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-adm-text">{step.title}</span>
                  {(step.detail || step.files?.length > 0) && (
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-adm-subtle transition-transform group-open:rotate-90" aria-hidden />
                  )}
                </summary>
                {(step.detail || step.files?.length > 0) && (
                  <div className="pb-3 pl-12 pr-4">
                    {step.detail && <Markdown className="text-[13.5px] leading-[1.4rem] text-adm-muted">{step.detail}</Markdown>}
                    {step.files?.length > 0 && <FileList files={step.files} className="mt-2" />}
                  </div>
                )}
              </details>
            </li>
          ))}
        </ol>

        {(plan.risks?.length > 0 || plan.files?.length > 0) && (
          <div className="space-y-3 border-t border-adm-border px-4 py-3">
            {plan.risks?.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-adm-warn">
                  <TriangleAlert className="h-3.5 w-3.5" aria-hidden /> Watch out for
                </p>
                <ul className="space-y-1 text-[13.5px] text-adm-muted">
                  {plan.risks.map((r, i) => <li key={i} className="flex gap-2"><span aria-hidden>·</span><span className="min-w-0">{r}</span></li>)}
                </ul>
              </div>
            )}
            {plan.files?.length > 0 && (
              <details>
                <summary className={cx('cursor-pointer text-xs font-medium text-adm-subtle hover:text-adm-text', focusRing)}>
                  {plan.files.length} file{plan.files.length === 1 ? '' : 's'}
                </summary>
                <FileList files={plan.files} className="mt-2" />
              </details>
            )}
          </div>
        )}

        {open && (
          <div className="flex flex-wrap items-center gap-2 border-t border-adm-border bg-adm-raised/40 px-4 py-3">
            <Button variant="primary" icon={Check} loading={busy === `approve:${message.id}`} disabled={Boolean(busy)} onClick={() => onPlan(message.id, 'approve')}>
              Approve
            </Button>
            <Button icon={Pencil} disabled={Boolean(busy)} onClick={onRevise}>Revise</Button>
            <Button variant="ghost" icon={X} loading={busy === `dismiss:${message.id}`} disabled={Boolean(busy)} onClick={() => onPlan(message.id, 'dismiss')} className="ml-auto">
              Dismiss
            </Button>
          </div>
        )}
        {plan.pr_url && status === 'shipped' && (
          <div className="border-t border-adm-border px-4 py-2.5">
            <a href={plan.pr_url} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 rounded text-xs text-adm-muted hover:text-adm-text', focusRing)}>
              View the PR <ExternalLink className="h-3 w-3" aria-hidden /><span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function FileList({ files, className }) {
  return (
    <ul className={cx('space-y-0.5', className)}>
      {files.map((f) => (
        <li key={f} className="flex min-w-0 items-center gap-1.5 font-mono text-[12px] text-adm-muted">
          <FileCode className="h-3.5 w-3.5 shrink-0 text-adm-subtle" aria-hidden />
          <span className="truncate" title={f}>{f}</span>
        </li>
      ))}
    </ul>
  )
}

function PrCard({ message, threadId }) {
  const d = message.data || {}
  return (
    <div className="flex gap-2.5">
      <ClaudeAvatar />
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-blue-500/25 bg-adm-surface">
        <div className="px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-adm-info">
            <GitPullRequest className="h-3.5 w-3.5" aria-hidden />
            {d.updated ? `Updated PR #${d.pr_number}` : `Opened PR #${d.pr_number}`}
          </p>
          {d.branch && <p className="mt-0.5 truncate font-mono text-[11.5px] text-adm-subtle">{d.branch}</p>}
          <Markdown className="mt-2">{message.body}</Markdown>
          {d.needs_migration && (
            <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[13px] text-adm-muted">
              <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-adm-warn" aria-hidden />
              Includes a database migration. Apply it in Supabase before or right after merging.
            </p>
          )}
          {d.files?.length > 0 && (
            <details className="mt-3">
              <summary className={cx('cursor-pointer text-xs font-medium text-adm-subtle hover:text-adm-text', focusRing)}>
                {d.files.length} file{d.files.length === 1 ? '' : 's'} changed
              </summary>
              <FileList files={d.files} className="mt-2" />
            </details>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-adm-border bg-adm-raised/40 px-4 py-3">
          <Button variant="primary" icon={GitPullRequest} href={`/admin/devops/approvals?task=claude-${threadId}`}>Review &amp; merge</Button>
          {d.pr_url && <Button variant="ghost" icon={ExternalLink} href={d.pr_url} external>GitHub</Button>}
        </div>
        <Time date={message.created_at} className="px-4 pb-2" />
      </div>
    </div>
  )
}

function ErrorCard({ message, latestRun, busy, onRetry }) {
  const d = message.data || {}
  const canRetry = latestRun && latestRun.id === message.run_id && latestRun.status === 'failed'
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/25" aria-hidden>
        <CircleAlert className="h-4 w-4 text-adm-bad" />
      </span>
      <div className="min-w-0 flex-1 rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3" role="alert">
        <p className="text-sm font-medium text-adm-text">
          {d.mode === 'execute' ? "Claude couldn't finish the changes" : "Claude couldn't reply"}
        </p>
        <p className="mt-1 whitespace-pre-wrap break-words text-[13px] text-adm-muted">{message.body}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {canRetry && (
            <Button size="sm" icon={RotateCcw} loading={busy === `retry:${latestRun.id}`} disabled={Boolean(busy)} onClick={() => onRetry(latestRun.id)}>
              Retry
            </Button>
          )}
          {d.run_url && <Button size="sm" variant="ghost" icon={ExternalLink} href={d.run_url} external>Run on GitHub</Button>}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Run status ("Claude is reading the code… 1:12")

const STAGES = {
  plan: { queued: 'Waiting for GitHub to start', reading: 'Reading the chat', thinking: 'Reading the code and thinking' },
  execute: { queued: 'Waiting for GitHub to start', reading: 'Getting the plan', editing: 'Making the changes', pushing: 'Opening the PR' },
}

function clock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function RunStatus({ run, busy, onCancel }) {
  const active = Boolean(run && IN_FLIGHT.includes(run.status))
  const now = useTicker(active, 1000)
  if (!active) return null

  const stage = run.meta?.stage || 'queued'
  const label = STAGES[run.mode]?.[stage] || 'Working'
  const since = run.started_at || run.created_at

  return (
    <div className="flex gap-2.5" role="status">
      <ClaudeAvatar />
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-adm-border bg-adm-surface px-3.5 py-2.5">
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-adm-accent opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-adm-accent" />
        </span>
        <p className="min-w-0 flex-1 text-sm text-adm-text">
          {label}…
          <span className="ml-1.5 tabular-nums text-adm-subtle">{clock(now - new Date(since).getTime())}</span>
        </p>
        {run.run_url && (
          <a href={run.run_url} target="_blank" rel="noopener noreferrer" className={cx('hidden rounded text-xs text-adm-subtle hover:text-adm-text sm:inline', focusRing)}>
            GitHub
          </a>
        )}
        <Button size="sm" variant="ghost" icon={Square} loading={busy === `cancel:${run.id}`} disabled={Boolean(busy)} onClick={() => onCancel(run.id)}>
          Stop
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composer: grows with the text; Enter sends on a keyboard, Shift+Enter for a new line.
// On touch screens Enter is a new line and the button sends.

export const Composer = forwardRef(function Composer(
  { onSend, disabled, disabledReason, placeholder = 'Message Claude…', autoFocus, sending },
  ref
) {
  const [text, setText] = useState('')
  const [hint, setHint] = useState(null)
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: (prompt) => {
      if (prompt) setHint(prompt)
      inputRef.current?.focus()
    },
  }))

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`
  }, [text])

  const canSend = text.trim().length > 0 && !disabled && !sending

  async function send() {
    if (!canSend) return
    const ok = await onSend(text.trim())
    if (ok !== false) {
      setText('')
      setHint(null)
    }
  }

  function onKeyDown(e) {
    const touch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
    if (e.key === 'Enter' && !e.shiftKey && !touch && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div>
      {(disabledReason || hint) && (
        <p className="mb-1.5 px-1 text-xs text-adm-subtle">{disabled ? disabledReason : hint}</p>
      )}
      <div className="flex items-end gap-2 rounded-2xl border border-adm-border bg-adm-raised p-1.5 pl-3.5 focus-within:border-adm-accent">
        <label htmlFor="claude-composer" className="sr-only">Message Claude</label>
        <textarea
          id="claude-composer"
          ref={inputRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={10000}
          enterKeyHint="send"
          className="max-h-[220px] min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 text-adm-text placeholder:text-adm-subtle focus:outline-none"
        />
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          aria-label="Send"
          className={cx(
            'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors',
            canSend ? 'bg-adm-accent-solid text-white hover:bg-adm-accent-solid-hover' : 'bg-adm-hover text-adm-subtle',
            'disabled:cursor-not-allowed',
            focusRing
          )}
        >
          <ArrowUp className={cx('h-4 w-4', sending && 'animate-pulse')} aria-hidden />
        </button>
      </div>
    </div>
  )
})

/** Row in the chat list. */
export function ThreadRow({ thread }) {
  return (
    <li>
      <Link
        href={`/admin/devops/claude/${thread.id}`}
        className={cx('flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-adm-raised active:bg-adm-raised', focusRing)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-[15px] font-medium text-adm-text">{thread.title}</p>
            <span className="shrink-0 text-xs text-adm-subtle">{timeAgo(thread.last_message_at)}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-[13px] text-adm-muted">{thread.preview || 'No messages yet'}</p>
            <ThreadStateBadge state={thread.state} />
          </div>
        </div>
      </Link>
    </li>
  )
}
