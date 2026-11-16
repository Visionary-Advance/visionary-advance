'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Frosted-glass floating tab bar for the admin area.
// Only renders when the app is running as an installed PWA (standalone),
// and only on mobile (hidden on md+ where the section sidebars live).
const NAV = [
  { href: '/admin', label: 'Home', exact: true, Icon: HomeIcon },
  { href: '/admin/crm', label: 'CRM', Icon: CrmIcon },
  { href: '/admin/devops', label: 'DevOps', Icon: DevOpsIcon },
  { href: '/admin/finance', label: 'Finance', Icon: FinanceIcon },
  { href: '/admin/seo', label: 'SEO', Icon: SeoIcon },
]

export default function AdminBottomNav() {
  const pathname = usePathname()
  const [standalone, setStandalone] = useState(false)

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
    const apply = () => {
      document.body.style.paddingBottom = mq.matches ? '92px' : prev
    }
    apply()
    mq.addEventListener?.('change', apply)
    return () => {
      mq.removeEventListener?.('change', apply)
      document.body.style.paddingBottom = prev
    }
  }, [standalone])

  if (!standalone) return null

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center md:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
      aria-label="Primary"
    >
      <div className="pointer-events-auto relative mx-3 flex w-full max-w-sm items-stretch justify-between gap-1 overflow-hidden rounded-[26px] border border-white/10 bg-[#0a0a0a]/60 p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* top edge highlight to sell the glass look */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {NAV.map(({ href, label, exact, Icon }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-[20px] px-1 py-1.5 transition-colors ${
                active ? 'text-[#16b39b]' : 'text-[#a1a1aa] active:text-[#fafafa]'
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-[20px] bg-white/10 ring-1 ring-inset ring-white/10" />
              )}
              <Icon className="relative h-[22px] w-[22px]" />
              <span className="relative text-[10px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
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
