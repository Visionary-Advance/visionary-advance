'use client'

// Bottom sheet on phones, centred dialog on sm+.
// Sits above the glass bottom nav (z-60) and pads for the home indicator.

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

export default function MobileSheet({ open, onClose, title, children, maxWidth = 'sm:max-w-md' }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted) return null

  // Portal so no transformed / filtered ancestor can trap the fixed overlay
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-[22px] border border-adm-border bg-adm-surface px-4 pt-2 text-adm-text shadow-2xl sm:rounded-2xl sm:px-6 sm:pt-6 ${maxWidth}`}
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          >
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-adm-border-strong sm:hidden" />
            {title && <p className="mb-2 truncate px-1 text-xs font-medium text-adm-subtle">{title}</p>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// Row button for action sheets
export function SheetAction({ onClick, href, danger, children, icon: Icon, target }) {
  const cls = `flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-[15px] font-medium transition-colors active:bg-adm-raised ${
    danger ? 'text-adm-bad' : 'text-adm-text'
  }`
  if (href && !target) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {Icon && <Icon className="h-5 w-5 text-current opacity-70" />}
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} target={target} rel={target ? 'noopener noreferrer' : undefined} className={cls}>
        {Icon && <Icon className="h-5 w-5 text-current opacity-70" />}
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={cls}>
      {Icon && <Icon className="h-5 w-5 text-current opacity-70" />}
      {children}
    </button>
  )
}
