'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'

// Floating tab bar in the style of iOS 26 "Liquid Glass" (Apple's "Adopting Liquid
// Glass"): a glass capsule on its own layer above the content, a glass lens that
// slides to the selected tab, and a bar that shrinks to the current tab while you
// scroll down and comes back when you scroll up (tap it to expand). A soft blur at
// the bottom edge keeps it legible over content ("scroll edge effect").
//
// Only shown in the installed app (standalone) on phones; section sidebars do this
// job on wider screens. Glass styles live in globals.css (.liquid-glass*), including
// the Reduce Transparency fallback.

const NAV = [
  { href: '/admin', label: 'Home', exact: true, Icon: HomeIcon },
  { href: '/admin/crm', label: 'CRM', Icon: CrmIcon },
  { href: '/admin/devops', label: 'DevOps', Icon: DevOpsIcon },
  { href: '/admin/finance', label: 'Finance', Icon: FinanceIcon },
  { href: '/admin/seo', label: 'SEO', Icon: SeoIcon },
]

const SPRING = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }
const MINIMIZE_AFTER = 120 // px scrolled before the bar may shrink
const DIRECTION_SLOP = 6 // px of movement before a scroll counts as a direction

export default function AdminBottomNav() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [standalone, setStandalone] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () =>
      setStandalone(
        window.matchMedia?.('(display-mode: standalone)').matches ||
          window.navigator.standalone === true
      )
    check()
    const mq = window.matchMedia?.('(display-mode: standalone)')
    mq?.addEventListener?.('change', check)
    return () => mq?.removeEventListener?.('change', check)
  }, [])

  // Keep page content clear of the floating bar while it's shown
  // (only when the bar is actually visible: standalone + mobile width).
  useEffect(() => {
    if (!standalone) return
    const mq = window.matchMedia('(max-width: 767px)')
    const prev = document.body.style.paddingBottom
    const root = document.documentElement
    const apply = () => {
      document.body.style.paddingBottom = mq.matches ? '96px' : prev
      // Lets floating buttons (Fab) and toasts sit above the bar
      if (mq.matches) root.style.setProperty('--admin-nav-offset', 'calc(env(safe-area-inset-bottom) + 84px)')
      else root.style.removeProperty('--admin-nav-offset')
    }
    apply()
    mq.addEventListener?.('change', apply)
    return () => {
      mq.removeEventListener?.('change', apply)
      document.body.style.paddingBottom = prev
      root.style.removeProperty('--admin-nav-offset')
    }
  }, [standalone])

  // Shrink while scrolling down, expand while scrolling up or near the top
  useEffect(() => {
    if (!standalone) return
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      if (Math.abs(delta) < DIRECTION_SLOP) return
      if (y < MINIMIZE_AFTER || delta < 0) setMinimized(false)
      else setMinimized(true)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [standalone])

  // A new page starts with the full bar
  useEffect(() => { setMinimized(false) }, [pathname])

  if (!standalone) return null

  const isActive = (item) => (item.exact ? pathname === item.href : pathname?.startsWith(item.href))
  const active = NAV.find(isActive) || NAV[0]
  const transition = reduceMotion ? { duration: 0 } : SPRING

  return (
    <>
      {/* Scroll edge effect: content softens as it passes under the bar */}
      <div aria-hidden className="liquid-glass-edge pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden" />

      <nav
        aria-label="Primary"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex px-4 md:hidden"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
          justifyContent: minimized ? 'flex-start' : 'center',
        }}
      >
        <LayoutGroup>
          <motion.div
            layout
            transition={transition}
            className="liquid-glass pointer-events-auto relative flex items-stretch overflow-hidden rounded-full p-1"
            style={{ width: minimized ? 'auto' : '100%', maxWidth: minimized ? undefined : 400 }}
          >
            {minimized ? (
              <button
                type="button"
                onClick={() => setMinimized(false)}
                aria-label={`${active.label}. Show all tabs`}
                className="relative flex h-[52px] w-[56px] items-center justify-center rounded-full text-[#2dd4bf]"
              >
                <active.Icon className="relative h-6 w-6" />
              </button>
            ) : (
              NAV.map(({ href, label, exact, Icon }) => {
                const on = isActive({ href, exact })
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={on ? 'page' : undefined}
                    className={`relative flex h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full transition-colors duration-200 ${
                      on ? 'text-[#2dd4bf]' : 'text-white/75 active:text-white'
                    }`}
                  >
                    {on && (
                      <motion.span layoutId="liquidGlassLens" transition={transition} className="liquid-glass-lens absolute inset-0 rounded-full" />
                    )}
                    <Icon className="relative h-[22px] w-[22px]" />
                    <span className="relative text-[10px] font-semibold leading-none tracking-tight">{label}</span>
                  </Link>
                )
              })
            )}
          </motion.div>
        </LayoutGroup>
      </nav>
    </>
  )
}

// ── Icons (1.6 stroke, inherit currentColor) ──────────────────────────────
function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  )
}
function CrmIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
function DevOpsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
    </svg>
  )
}
function FinanceIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function SeoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
