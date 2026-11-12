'use client'

// SEO shell: a sidebar that knows about your sites (and, inside one, its sections),
// fixed on desktop and a slide-out drawer on mobile.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid, FileText, ArrowLeft, House, LogOut, Menu, X, ChevronDown, ChartLine, Globe, LoaderCircle,
} from 'lucide-react'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import { SEOProvider, useSEO } from '@/Components/Admin/SEO/SEOContext'
import { ToastProvider, cx, focusRing } from '@/Components/Admin/SEO/ui'
import { SITE_SECTIONS, sectionHref, currentSection } from '@/Components/Admin/SEO/sections'
import { PlanRunsProvider, isRunInFlight, usePlanRuns } from '@/Components/Admin/SEO/planRuns'
import { CompactRunProgress } from '@/Components/Admin/SEO/PlanRunProgress'

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
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile drawer on navigation.
  useEffect(() => { setMobileOpen(false) }, [pathname])

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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-adm-border bg-adm-surface shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className={cx('absolute right-3 top-3.5 rounded-lg p-1.5 text-adm-muted hover:bg-adm-raised hover:text-adm-text', focusRing)}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-adm-border bg-adm-surface/95 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={cx('rounded-lg p-2 -ml-2 text-adm-muted hover:bg-adm-raised hover:text-adm-text', focusRing)}
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <Link href="/admin/seo" className="flex items-center gap-2 font-semibold">
            <Logo /> SEO
          </Link>
        </header>

        <main id="seo-main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
