'use client'

// SEO shell: a sidebar that knows about your sites (and, inside one, its sections),
// fixed on desktop. On phones: a sticky top bar with section tabs and bottom sheets.

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid, FileText, ArrowLeft, House, LogOut, ChevronDown, ChevronsUpDown, Check, ChartLine, Globe, LoaderCircle,
} from 'lucide-react'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import { SEOProvider, useSEO } from '@/Components/Admin/SEO/SEOContext'
import { ToastProvider, cx, focusRing } from '@/Components/Admin/SEO/ui'
import { SITE_SECTIONS, sectionHref, currentSection } from '@/Components/Admin/SEO/sections'
import { PlanRunsProvider, isRunInFlight, usePlanRuns } from '@/Components/Admin/SEO/planRuns'
import { CompactRunProgress } from '@/Components/Admin/SEO/PlanRunProgress'
import { hostOf } from '@/Components/Admin/SEO/format'
import MobileSheet from '@/Components/Admin/Mobile/MobileSheet'

export default function SEOLayout({ children }) {
  return (
    <SEOProvider>
      <ToastProvider>
        <PlanRunsProvider>
          <Shell>{children}</Shell>
        </PlanRunsProvider>
      </ToastProvider>
    </SEOProvider>
  )
}

function Shell({ children }) {
  return (
    <div className="min-h-dvh bg-adm-bg text-adm-text">
      <a
        href="#seo-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-adm-raised focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-adm-border bg-adm-surface lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-60">
        <MobileHeader />

        <main id="seo-main" className="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-adm-accent-solid">
      <ChartLine className="h-4 w-4 text-white" aria-hidden />
    </span>
  )
}

function SidebarContent() {
  const pathname = usePathname()
  const { sites, sitesLoading, planBySite } = useSEO()
  const { runs } = usePlanRuns()
  const activeSiteId = pathname.match(/^\/admin\/seo\/sites\/([^/]+)/)?.[1]

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-adm-border px-4">
        <Link href="/admin/seo" className={cx('flex items-center gap-2.5 rounded-lg font-semibold', focusRing)}>
          <Logo />
          <span>SEO</span>
        </Link>
      </div>

      <nav aria-label="SEO" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          <NavItem href="/admin/seo" icon={LayoutGrid} active={pathname === '/admin/seo'}>All sites</NavItem>
          <NavItem href="/admin/seo/reports" icon={FileText} active={pathname.startsWith('/admin/seo/reports')}>Reports</NavItem>
        </ul>

        <p className="mb-1.5 mt-6 px-2.5 text-xs font-medium uppercase tracking-wider text-adm-subtle">Sites</p>
        {sitesLoading && sites.length === 0 ? (
          <div className="space-y-2 px-2.5">
            {[0, 1, 2].map(i => <div key={i} className="h-5 animate-pulse rounded bg-adm-raised" />)}
          </div>
        ) : sites.length === 0 ? (
          <p className="px-2.5 text-sm text-adm-subtle">No sites yet</p>
        ) : (
          <ul className="space-y-0.5">
            {sites.map(site => (
              <SiteNavItem
                key={site.id}
                site={site}
                pathname={pathname}
                expanded={site.id === activeSiteId}
                hasDraft={planBySite[site.id]?.hasDraft}
                generating={isRunInFlight(runs?.[site.id])}
              />
            ))}
          </ul>
        )}
      </nav>

      <BackgroundRuns sites={sites} runs={runs} />

      <div className="border-t border-adm-border p-3">
        <UserMenu />
      </div>
    </div>
  )
}

function NavItem({ href, icon: Icon, active, children, small }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cx(
          'flex items-center gap-2.5 rounded-lg px-2.5 font-medium transition-colors',
          small ? 'py-1.5 text-[13px]' : 'py-2 text-sm',
          active ? 'bg-adm-raised text-adm-text' : 'text-adm-muted hover:bg-adm-raised hover:text-adm-text',
          focusRing
        )}
      >
        {Icon && <Icon className={cx(small ? 'h-3.5 w-3.5' : 'h-4 w-4', active ? 'text-adm-accent' : '')} aria-hidden />}
        <span className="truncate">{children}</span>
      </Link>
    </li>
  )
}

// Every plan run in progress, visible from any SEO page.
function BackgroundRuns({ sites, runs }) {
  const active = sites.filter(s => isRunInFlight(runs?.[s.id]))
  if (active.length === 0) return null
  return (
    <section aria-label="Plans being generated" className="border-t border-adm-border px-3 py-3">
      <p className="mb-2 px-2.5 text-xs font-medium uppercase tracking-wider text-adm-subtle">
        Generating {active.length} plan{active.length === 1 ? '' : 's'}
      </p>
      <ul className="space-y-1">
        {active.map(site => (
          <li key={site.id}>
            <Link
              href={sectionHref(site.id, 'plan')}
              className={cx('block rounded-lg px-2.5 py-1.5 hover:bg-adm-raised', focusRing)}
            >
              <span className="block truncate text-[13px] font-medium text-adm-text">{site.display_name || site.site_url}</span>
              <CompactRunProgress run={runs[site.id]} name={site.display_name} className="mt-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SiteNavItem({ site, pathname, expanded, hasDraft, generating }) {
  const base = `/admin/seo/sites/${site.id}`
  return (
    <li>
      <Link
        href={base}
        aria-expanded={expanded}
        className={cx(
          'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
          expanded ? 'text-adm-text' : 'text-adm-muted hover:bg-adm-raised hover:text-adm-text',
          focusRing
        )}
      >
        <Globe className="h-4 w-4 shrink-0" aria-hidden />
        <span className="flex-1 truncate">{site.display_name || site.site_url}</span>
        {generating ? (
          <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin text-adm-info" aria-label="Generating a plan" />
        ) : hasDraft && (
          <span className="h-2 w-2 shrink-0 rounded-full bg-adm-warn" title="Draft plan waiting for approval">
            <span className="sr-only">Draft plan waiting for approval</span>
          </span>
        )}
        <ChevronDown className={cx('h-3.5 w-3.5 shrink-0 transition-transform', expanded ? '' : '-rotate-90')} aria-hidden />
      </Link>
      {expanded && (
        <ul className="mb-2 ml-4 mt-0.5 space-y-0.5 border-l border-adm-border pl-2">
          {SITE_SECTIONS.map(section => {
            const href = sectionHref(site.id, section.slug)
            const active = currentSection(pathname, site.id) === section.slug
            return (
              <NavItem key={section.slug} href={href} icon={section.icon} active={active} small>
                {section.label}
              </NavItem>
            )
          })}
        </ul>
      )}
    </li>
  )
}

function UserMenu() {
  const { user, signOut } = useAdminAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cx('flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm hover:bg-adm-raised cursor-pointer', focusRing)}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-adm-raised text-xs font-semibold text-adm-text">
          {user?.email?.[0]?.toUpperCase() || 'A'}
        </span>
        <span className="flex-1 truncate text-adm-muted">{user?.email || 'Admin'}</span>
        <ChevronDown className={cx('h-4 w-4 text-adm-subtle transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div role="menu" className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-adm-border bg-adm-raised p-1 shadow-xl">
            <MenuLink href="/admin" icon={ArrowLeft}>Admin hub</MenuLink>
            <MenuLink href="/" icon={House}>Back to site</MenuLink>
            <div className="my-1 border-t border-adm-border" />
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut()}
              className={cx('flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-adm-bad hover:bg-adm-hover cursor-pointer', focusRing)}
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function MenuLink({ href, icon: Icon, children }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className={cx('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-adm-muted hover:bg-adm-hover hover:text-adm-text', focusRing)}
    >
      <Icon className="h-4 w-4" aria-hidden /> {children}
    </Link>
  )
}

// ── Mobile chrome (below lg) ──────────────────────────────────────────────
// Frosted sticky bar that clears the notch: the title doubles as the site
// switcher, a pill shows plan runs in progress, and the avatar opens the
// account sheet. Under it, swipeable section tabs stay in reach while you scroll.

const TOP_TABS = [
  { href: '/admin/seo', label: 'All sites', icon: LayoutGrid, exact: true },
  { href: '/admin/seo/reports', label: 'Reports', icon: FileText },
]

function MobileHeader() {
  const pathname = usePathname() || ''
  const { user } = useAdminAuth()
  const { sites } = useSEO()
  const { runs } = usePlanRuns()
  const [sheet, setSheet] = useState(null) // 'sites' | 'runs' | 'account' | null
  const headerRef = useRef(null)
  const tabsRef = useRef(null)

  const activeSiteId = pathname.match(/^\/admin\/seo\/sites\/([^/]+)/)?.[1]
  const activeSite = activeSiteId ? sites.find(s => s.id === activeSiteId) : null
  const section = activeSiteId ? currentSection(pathname, activeSiteId) : null
  const running = sites.filter(s => isRunInFlight(runs?.[s.id]))

  const tabs = activeSiteId
    ? SITE_SECTIONS.map(s => ({ href: sectionHref(activeSiteId, s.slug), label: s.label, icon: s.icon, active: s.slug === section }))
    : TOP_TABS.map(t => ({ ...t, active: t.exact ? pathname === t.href : pathname.startsWith(t.href) }))

  // Close any sheet on navigation
  useEffect(() => { setSheet(null) }, [pathname])

  // Keep the active tab in view
  useEffect(() => {
    tabsRef.current?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [pathname])

  // Publish the header height so pages can stick things right under it
  useEffect(() => {
    const el = headerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const root = document.documentElement
    const ro = new ResizeObserver(() => root.style.setProperty('--admin-header-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--admin-header-h')
    }
  }, [])

  const title = activeSite ? (activeSite.display_name || hostOf(activeSite.site_url)) : 'SEO'
  const close = () => setSheet(null)

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-30 border-b border-adm-border/70 bg-adm-bg/80 backdrop-blur-xl lg:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex h-12 items-center gap-1.5 px-4">
          <Logo />
          <button
            type="button"
            onClick={() => setSheet('sites')}
            aria-haspopup="dialog"
            className={cx('flex h-11 min-w-0 flex-1 cursor-pointer items-center gap-1 rounded-lg px-1.5 text-left', focusRing)}
          >
            <span className="truncate text-[15px] font-semibold">{title}</span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
            <span className="sr-only">Switch site</span>
          </button>
          {running.length > 0 && (
            <button
              type="button"
              onClick={() => setSheet('runs')}
              aria-label={`${running.length} plan${running.length === 1 ? '' : 's'} generating`}
              className={cx('flex h-11 shrink-0 cursor-pointer items-center', focusRing)}
            >
              <span className="flex h-8 items-center gap-1.5 rounded-full border border-adm-border bg-adm-surface px-2.5 text-xs font-medium tabular-nums text-adm-info">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> {running.length}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setSheet('account')}
            aria-label="Account"
            className={cx('-mr-1.5 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full', focusRing)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-adm-raised text-xs font-semibold ring-1 ring-adm-border">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </span>
          </button>
        </div>

        <nav ref={tabsRef} aria-label={activeSiteId ? 'Site sections' : 'SEO'} className="scrollbar-hide flex gap-1.5 overflow-x-auto px-4 pb-2.5">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              data-active={tab.active}
              aria-current={tab.active ? 'page' : undefined}
              className={cx(
                'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors',
                tab.active
                  ? 'border-teal-500/30 bg-teal-500/10 text-adm-accent'
                  : 'border-adm-border bg-adm-surface text-adm-muted active:bg-adm-raised',
                focusRing
              )}
            >
              <tab.icon className="h-4 w-4" aria-hidden />
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>

      <SitesSheet open={sheet === 'sites'} onClose={close} activeSiteId={activeSiteId} section={section} pathname={pathname} />
      <RunsSheet open={sheet === 'runs'} onClose={close} sites={running} runs={runs} />
      <AccountSheet open={sheet === 'account'} onClose={close} />
    </>
  )
}

function SitesSheet({ open, onClose, activeSiteId, section, pathname }) {
  const { sites, sitesLoading, planBySite } = useSEO()
  const { runs } = usePlanRuns()

  return (
    <MobileSheet open={open} onClose={onClose} title="Go to">
      <div className="-mx-2">
        <SheetLink href="/admin/seo" icon={LayoutGrid} active={pathname === '/admin/seo'} onClick={onClose}>All sites</SheetLink>
        <SheetLink href="/admin/seo/reports" icon={FileText} active={pathname.startsWith('/admin/seo/reports')} onClick={onClose}>Reports</SheetLink>

        <p className="mb-1 mt-4 px-3 text-xs font-medium uppercase tracking-wider text-adm-subtle">Sites</p>
        {sitesLoading && sites.length === 0 ? (
          <div className="space-y-2 px-3 py-2">
            {[0, 1, 2].map(i => <div key={i} className="h-6 animate-pulse rounded bg-adm-raised" />)}
          </div>
        ) : sites.length === 0 ? (
          <p className="px-3 py-2 text-sm text-adm-subtle">No sites yet</p>
        ) : (
          <ul>
            {sites.map(site => {
              const generating = isRunInFlight(runs?.[site.id])
              const hasDraft = planBySite[site.id]?.hasDraft
              const current = site.id === activeSiteId
              return (
                <li key={site.id}>
                  <Link
                    // Stay on the same section when hopping between sites
                    href={sectionHref(site.id, section || '')}
                    onClick={onClose}
                    aria-current={current ? 'page' : undefined}
                    className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2 active:bg-adm-raised"
                  >
                    <Globe className={cx('h-5 w-5 shrink-0', current ? 'text-adm-accent' : 'text-adm-muted')} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-adm-text">{site.display_name || hostOf(site.site_url)}</span>
                      <span className="block truncate text-xs text-adm-subtle">{hostOf(site.site_url)}</span>
                    </span>
                    {generating ? (
                      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-adm-info" aria-label="Generating a plan" />
                    ) : hasDraft && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-adm-warn" title="Draft plan waiting for approval">
                        <span className="sr-only">Draft plan waiting for approval</span>
                      </span>
                    )}
                    {current && <Check className="h-4 w-4 shrink-0 text-adm-accent" aria-hidden />}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </MobileSheet>
  )
}

function RunsSheet({ open, onClose, sites, runs }) {
  return (
    <MobileSheet open={open} onClose={onClose} title={`Generating ${sites.length} plan${sites.length === 1 ? '' : 's'}`}>
      <ul className="-mx-2">
        {sites.map(site => (
          <li key={site.id}>
            <Link
              href={sectionHref(site.id, 'plan')}
              onClick={onClose}
              className="block rounded-xl px-3 py-3 active:bg-adm-raised"
            >
              <span className="block truncate text-[15px] font-medium text-adm-text">{site.display_name || hostOf(site.site_url)}</span>
              <CompactRunProgress run={runs[site.id]} name={site.display_name} className="mt-1.5" />
            </Link>
          </li>
        ))}
      </ul>
    </MobileSheet>
  )
}

function AccountSheet({ open, onClose }) {
  const { user, signOut } = useAdminAuth()
  return (
    <MobileSheet open={open} onClose={onClose} title={user?.email || 'Account'}>
      <div className="-mx-2">
        <SheetLink href="/admin" icon={ArrowLeft} onClick={onClose}>Admin hub</SheetLink>
        <SheetLink href="/" icon={House} onClick={onClose}>Back to site</SheetLink>
        <div className="my-1 border-t border-adm-border" />
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3.5 text-left text-[15px] font-medium text-adm-bad active:bg-adm-raised"
        >
          <LogOut className="h-5 w-5" aria-hidden /> Sign out
        </button>
      </div>
    </MobileSheet>
  )
}

function SheetLink({ href, icon: Icon, active, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-medium text-adm-text active:bg-adm-raised"
    >
      <Icon className={cx('h-5 w-5', active ? 'text-adm-accent' : 'text-adm-muted')} aria-hidden /> {children}
    </Link>
  )
}
