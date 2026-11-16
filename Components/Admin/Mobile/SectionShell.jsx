'use client'

// Shared chrome for admin sections (Finance, CRM, …), styled like the SEO shell.
// Desktop (lg+): fixed sidebar. Mobile: frosted sticky top bar that clears the
// notch, a swipeable row of section tabs and an account sheet. Switching between
// sections on mobile is the job of the glass AdminBottomNav.

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ChevronDown, House, LogOut } from 'lucide-react'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import { cx, focusRing } from '@/Components/Admin/ui'
import MobileSheet from './MobileSheet'

export default function SectionShell({ title, icon: SectionIcon, basePath, navItems, children }) {
  const pathname = usePathname() || ''
  const { user, signOut } = useAdminAuth()
  const [showAccount, setShowAccount] = useState(false)
  const tabsRef = useRef(null)
  const headerRef = useRef(null)

  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href))
  const activeItem = [...navItems].reverse().find(isActive)
  const initial = user?.email?.[0]?.toUpperCase() || 'A'

  // Keep the active tab in view in the swipeable tab row
  useEffect(() => {
    const el = tabsRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [pathname])

  // Publish the mobile header height so pages can stick things right under it
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

  const logo = (
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-adm-accent-solid">
      {SectionIcon && <SectionIcon className="h-4 w-4 text-white" aria-hidden />}
    </span>
  )

  return (
    <div className="min-h-dvh bg-adm-bg text-adm-text">
      <a
        href="#section-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-adm-raised focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-adm-border bg-adm-surface lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-adm-border px-4">
            <Link href={basePath} className={cx('flex items-center gap-2.5 rounded-lg font-semibold', focusRing)}>
              {logo}
              <span>{title}</span>
            </Link>
          </div>

          <nav aria-label={title} className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cx(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                        active ? 'bg-adm-raised text-adm-text' : 'text-adm-muted hover:bg-adm-raised hover:text-adm-text',
                        focusRing
                      )}
                    >
                      <item.icon className={cx('h-4 w-4', active && 'text-adm-accent')} aria-hidden />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-adm-border p-3">
            <DesktopUserMenu user={user} initial={initial} signOut={signOut} />
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar + section tabs ───────────────────────────── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-30 border-b border-adm-border/70 bg-adm-bg/80 backdrop-blur-xl lg:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex h-12 items-center gap-2.5 px-4">
          {logo}
          <p className="min-w-0 flex-1 truncate text-[15px] font-semibold">
            {title}
            {activeItem && !activeItem.exact && <span className="font-normal text-adm-subtle"> · {activeItem.label}</span>}
          </p>
          <button
            type="button"
            onClick={() => setShowAccount(true)}
            aria-label="Account"
            className={cx('-mr-1.5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full', focusRing)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-adm-raised text-xs font-semibold ring-1 ring-adm-border">
              {initial}
            </span>
          </button>
        </div>
        <nav ref={tabsRef} aria-label={`${title} sections`} className="scrollbar-hide flex gap-1.5 overflow-x-auto px-4 pb-2.5">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors',
                  active
                    ? 'border-teal-500/30 bg-teal-500/10 text-adm-accent'
                    : 'border-adm-border bg-adm-surface text-adm-muted active:bg-adm-raised',
                  focusRing
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.mobileLabel || item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <MobileSheet open={showAccount} onClose={() => setShowAccount(false)} title={user?.email || 'Account'}>
        <div className="-mx-2">
          <SheetLink href="/admin" icon={ArrowLeft} onClick={() => setShowAccount(false)}>Admin hub</SheetLink>
          <SheetLink href="/" icon={House} onClick={() => setShowAccount(false)}>Back to site</SheetLink>
          <div className="my-1 border-t border-adm-border" />
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-[15px] font-medium text-adm-bad active:bg-adm-raised"
          >
            <LogOut className="h-5 w-5" aria-hidden /> Sign out
          </button>
        </div>
      </MobileSheet>

      {/* ── Page content ────────────────────────────────────────────── */}
      <div className="lg:pl-60">
        <main id="section-main" className="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function SheetLink({ href, icon: Icon, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-medium text-adm-text active:bg-adm-raised"
    >
      <Icon className="h-5 w-5 text-adm-muted" aria-hidden /> {children}
    </Link>
  )
}

function DesktopUserMenu({ user, initial, signOut }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cx('flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm hover:bg-adm-raised', focusRing)}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-adm-raised text-xs font-semibold">
          {initial}
        </span>
        <span className="flex-1 truncate text-adm-muted">{user?.email || 'Admin'}</span>
        <ChevronDown className={cx('h-4 w-4 text-adm-subtle transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div role="menu" className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-adm-border bg-adm-raised p-1 shadow-xl">
            {[
              { href: '/admin', icon: ArrowLeft, label: 'Admin hub' },
              { href: '/', icon: House, label: 'Back to site' },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                className={cx('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-adm-muted hover:bg-adm-hover hover:text-adm-text', focusRing)}
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </Link>
            ))}
            <div className="my-1 border-t border-adm-border" />
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut()}
              className={cx('flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-adm-bad hover:bg-adm-hover', focusRing)}
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
