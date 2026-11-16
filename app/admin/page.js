// app/admin/page.js — Admin home
// Phone-first "today" screen for the installed PWA: what needs you, quick actions,
// then every tool. Data loads in parallel and paints from cache on repeat visits.
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns'
import {
  ArrowDownLeft, CalendarClock, ChevronRight, CircleAlert, FolderKanban, Flame, House,
  ListTodo, LogOut, Mic, Receipt, Search, Server, Settings, TrendingUp, UserPlus, Users, Wallet,
} from 'lucide-react'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import SettingsModal from '@/Components/Admin/SettingsModal'
import MobileSheet, { SheetAction } from '@/Components/Admin/Mobile/MobileSheet'
import { Badge, Card, CardHeader, Skeleton, StatTile, cx, focusRing } from '@/Components/Admin/ui'
import { useCachedFetch } from '@/lib/useCachedFetch'
import { fmtMoney } from '@/Components/Admin/Finance/parts'

const TOOLS = [
  { name: 'CRM', description: 'Leads, pipeline and clients', href: '/admin/crm', icon: Users },
  { name: 'Tasks', description: 'Follow-ups and to-dos', href: '/admin/crm/tasks', icon: ListTodo },
  { name: 'Finance', description: 'Income, expenses and tax estimates', href: '/admin/finance', icon: Wallet },
  { name: 'SEO', description: 'Rankings, reports and plans', href: '/admin/seo', icon: Search },
  { name: 'DevOps', description: 'Site health, uptime and incidents', href: '/admin/devops', icon: Server },
  { name: 'Projects', description: 'Client work in progress', href: '/admin/crm/projects', icon: FolderKanban },
  { name: 'SystemForge', description: 'Project scaffolding from code modules', href: '/admin/system-forge', icon: Flame },
]

const ACTIONS = [
  { label: 'New lead', href: '/admin/crm/leads/new', icon: UserPlus },
  { label: 'Add income', href: '/admin/finance/income?new=1', icon: ArrowDownLeft },
  { label: 'Add expense', href: '/admin/finance/expenses?new=1', icon: Receipt },
  { label: 'Pipeline', href: '/admin/crm/pipeline', icon: TrendingUp },
]

const PRIORITY_TONE = { urgent: 'bad', high: 'warn', medium: 'neutral', low: 'neutral' }

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function dueLabel(date) {
  if (!date) return { text: 'No due date', tone: 'neutral' }
  const d = parseISO(date)
  if (isToday(d)) return { text: 'Today', tone: 'warn' }
  if (isPast(d)) return { text: `Overdue · ${format(d, 'MMM d')}`, tone: 'bad' }
  if (isTomorrow(d)) return { text: 'Tomorrow', tone: 'neutral' }
  return { text: format(d, 'EEE, MMM d'), tone: 'neutral' }
}

export default function AdminHome() {
  const { user, signOut } = useAdminAuth()
  const [showAccount, setShowAccount] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const year = new Date().getFullYear()
  const crm = useCachedFetch('/api/crm/stats')
  const finance = useCachedFetch(`/api/finance/stats?year=${year}`)
  const tasks = useCachedFetch('/api/crm/tasks?upcoming=true&limit=5')

  const o = crm.data?.overview
  const summary = tasks.data?.summary
  const overdue = summary?.overdue_count || 0
  const dueToday = summary?.due_today_count || 0
  const deadline = finance.data?.upcomingDeadlines?.[0]
  const stale = crm.data?.staleLeads || []
  const initial = user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <div className="min-h-dvh bg-adm-bg text-adm-text">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-adm-border bg-adm-bg/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-adm-accent-solid text-xs font-bold text-white">VA</span>
          <p className="min-w-0 flex-1 truncate text-[15px] font-semibold">Visionary Advance</p>
          <button
            type="button"
            onClick={() => setShowAccount(true)}
            aria-label="Account"
            className={cx('flex h-11 w-11 items-center justify-center rounded-full', focusRing)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-adm-border bg-adm-raised text-xs font-semibold">
              {initial}
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-8 pt-5 sm:px-6 sm:pt-8">
        <div className="mb-5 sm:mb-6">
          <p className="text-sm text-adm-muted">{format(new Date(), 'EEEE, MMMM d')}</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">{greeting()}</h1>
        </div>

        {/* ── Needs you ────────────────────────────────────────────── */}
        {(overdue > 0 || dueToday > 0 || deadline) && (
          <section aria-label="Needs attention" className="mb-5 space-y-2">
            {(overdue > 0 || dueToday > 0) && (
              <AttentionRow
                href="/admin/crm/tasks"
                tone={overdue > 0 ? 'bad' : 'warn'}
                icon={CircleAlert}
                title={[
                  overdue > 0 && `${overdue} overdue ${overdue === 1 ? 'task' : 'tasks'}`,
                  dueToday > 0 && `${dueToday} due today`,
                ].filter(Boolean).join(' · ')}
                subtitle="Open tasks"
              />
            )}
            {deadline && (
              <AttentionRow
                href="/admin/finance/tax"
                tone="warn"
                icon={CalendarClock}
                title={`Q${deadline.quarter} estimated tax: ${fmtMoney(deadline.amountDue)}`}
                subtitle={`Due ${deadline.deadline}`}
              />
            )}
          </section>
        )}

        {/* ── Glance ───────────────────────────────────────────────── */}
        <section aria-label="At a glance" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatTile
            loading={crm.loading}
            label="New this week"
            value={o?.leadsThisWeek ?? 0}
            hint={o ? `${o.leadsToday || 0} today` : undefined}
            href="/admin/crm/leads"
          />
          <StatTile
            loading={crm.loading}
            label="In pipeline"
            value={o?.activePipeline ?? 0}
            hint={o ? `${o.conversionRate || 0}% win rate` : undefined}
            href="/admin/crm/pipeline"
          />
          <StatTile
            loading={finance.loading}
            label={`Income ${year}`}
            value={fmtMoney(finance.data?.overview?.ytdIncome)}
            spark={finance.data?.monthly?.map((m) => m.income)}
            hint="year to date"
            href="/admin/finance"
          />
          <StatTile
            loading={tasks.loading}
            label="Open tasks"
            value={(summary?.pending_count || 0) + (summary?.in_progress_count || 0)}
            hint={summary ? `${summary.due_this_week_count || 0} more this week` : undefined}
            href="/admin/crm/tasks"
          />
        </section>

        {/* ── Quick actions ────────────────────────────────────────── */}
        <section aria-label="Quick actions" className="mt-5 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-3">
          {ACTIONS.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={cx(
                'flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border border-adm-border bg-adm-surface px-1 py-3 text-center transition-colors hover:border-adm-border-strong active:bg-adm-raised',
                focusRing
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/10 text-adm-accent">
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="text-xs font-medium leading-tight text-adm-text">{label}</span>
            </Link>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ── Up next ────────────────────────────────────────────── */}
          <Card>
            <CardHeader
              title="Up next"
              description="Open tasks due within a week"
              actions={<Link href="/admin/crm/tasks" className="text-xs font-medium text-adm-accent hover:underline">All tasks</Link>}
            />
            {tasks.loading ? (
              <ListSkeleton />
            ) : tasks.data?.tasks?.length ? (
              <ul className="divide-y divide-adm-border">
                {tasks.data.tasks.map((t) => {
                  const due = dueLabel(t.due_date)
                  const who = t.lead_name || t.business_name
                  return (
                    <li key={t.id}>
                      <Link href={`/admin/crm/tasks/${t.id}`} className="flex min-h-16 items-center gap-3 px-4 py-3 active:bg-adm-raised sm:px-5 sm:hover:bg-adm-raised">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-medium sm:text-sm">{t.title}</p>
                          <p className="mt-0.5 flex min-w-0 items-center gap-2 text-xs">
                            <span className={cx('shrink-0', due.tone === 'bad' ? 'text-adm-bad' : due.tone === 'warn' ? 'text-adm-warn' : 'text-adm-subtle')}>{due.text}</span>
                            {who && <span className="truncate text-adm-subtle">· {who}</span>}
                          </p>
                        </div>
                        {(t.priority === 'urgent' || t.priority === 'high') && (
                          <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority === 'urgent' ? 'Urgent' : 'High'}</Badge>
                        )}
                        <ChevronRight className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-adm-subtle sm:px-5">Nothing due this week</p>
            )}
          </Card>

          {/* ── Gone quiet ─────────────────────────────────────────── */}
          <Card>
            <CardHeader
              title="Gone quiet"
              description="Open leads with no activity for 7+ days"
              actions={<Link href="/admin/crm/leads" className="text-xs font-medium text-adm-accent hover:underline">All leads</Link>}
            />
            {crm.loading ? (
              <ListSkeleton />
            ) : stale.length ? (
              <ul className="divide-y divide-adm-border">
                {stale.map((l) => (
                  <li key={l.id}>
                    <Link href={`/admin/crm/leads/${l.id}`} className="flex min-h-16 items-center gap-3 px-4 py-3 active:bg-adm-raised sm:px-5 sm:hover:bg-adm-raised">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-adm-border bg-adm-raised text-sm font-medium text-adm-muted">
                        {(l.full_name || l.email || '?')[0].toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium sm:text-sm">{l.full_name || l.email}</p>
                        <p className="mt-0.5 truncate text-xs text-adm-subtle">
                          {l.company ? `${l.company} · ` : ''}
                          {l.last_activity_at ? `last touch ${format(new Date(l.last_activity_at), 'MMM d')}` : 'no activity yet'}
                        </p>
                      </div>
                      <Badge>{(l.stage || '').replace(/_/g, ' ')}</Badge>
                      <ChevronRight className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-adm-subtle sm:px-5">Every open lead has recent activity</p>
            )}
          </Card>
        </div>

        {/* ── Tools ────────────────────────────────────────────────── */}
        <section aria-labelledby="tools-heading" className="mt-6">
          <h2 id="tools-heading" className="mb-3 text-sm font-medium text-adm-muted">All tools</h2>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-adm-border sm:grid sm:grid-cols-2 sm:divide-y-0">
              {TOOLS.map(({ name, description, href, icon: Icon }) => (
                <li key={name} className="sm:border-b sm:border-adm-border sm:odd:border-r">
                  <Link href={href} className="flex min-h-16 items-center gap-3 px-4 py-3 active:bg-adm-raised sm:px-5 sm:hover:bg-adm-raised">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-adm-border bg-adm-raised text-adm-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium sm:text-sm">{name}</p>
                      <p className="truncate text-xs text-adm-subtle">{description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </main>

      <MobileSheet open={showAccount} onClose={() => setShowAccount(false)} title={user?.email || 'Account'}>
        <div className="-mx-2">
          <SheetAction icon={Settings} onClick={() => { setShowAccount(false); setShowSettings(true) }}>
            Settings & security
          </SheetAction>
          <SheetAction icon={House} href="/" onClick={() => setShowAccount(false)}>Back to site</SheetAction>
          <SheetAction icon={Mic} href="/admin/crm/pocket" onClick={() => setShowAccount(false)}>Recordings inbox</SheetAction>
          <div className="my-1 border-t border-adm-border" />
          <SheetAction icon={LogOut} danger onClick={() => signOut()}>Sign out</SheetAction>
        </div>
      </MobileSheet>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

function AttentionRow({ href, tone, icon: Icon, title, subtitle }) {
  return (
    <Link
      href={href}
      className={cx(
        'flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
        tone === 'bad' ? 'border-red-500/30 bg-red-500/10 active:bg-red-500/15' : 'border-amber-500/30 bg-amber-500/10 active:bg-amber-500/15',
        focusRing
      )}
    >
      <Icon className={cx('h-5 w-5 shrink-0', tone === 'bad' ? 'text-adm-bad' : 'text-adm-warn')} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-adm-text">{title}</p>
        <p className="text-xs text-adm-muted">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-adm-muted" aria-hidden />
    </Link>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3 p-4 sm:p-5">
      {[0, 1, 2].map((i) => <Skeleton key={i} className="h-11 w-full" />)}
    </div>
  )
}
