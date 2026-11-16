'use client'

// Floating primary action for phones. Hidden on md+ where pages show their
// regular header buttons. Rides above the glass bottom nav via
// --admin-nav-offset (set by AdminBottomNav when it is visible).

import Link from 'next/link'

export default function Fab({ href, onClick, label }) {
  const className =
    'fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-adm-accent-solid text-white shadow-[0_8px_30px_rgba(0,0,0,0.55)] ring-1 ring-white/15 transition-transform duration-150 active:scale-95 md:hidden'
  const style = {
    bottom: 'calc(var(--admin-nav-offset, env(safe-area-inset-bottom)) + 16px)',
  }
  const icon = (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
  return href ? (
    <Link href={href} aria-label={label} className={className} style={style}>
      {icon}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} className={className} style={style}>
      {icon}
    </button>
  )
}
