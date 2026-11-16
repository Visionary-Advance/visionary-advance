'use client'

// Pull down at the top of any admin page to refresh it (touch screens only).
//
// What "refresh" does, in order:
//   1. the page's own handler, if it registered one with usePullToRefresh(fn)
//   2. otherwise re-fetch everything loaded through useCachedFetch on screen
//   3. if nothing was, reload the page
//
// Also tags <html> with .va-admin so globals.css can hide the scrollbar in the
// installed app and stop the browser's own pull-to-refresh from competing.

import { useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { invalidate } from '@/lib/useCachedFetch'
import { cx } from '@/Components/Admin/ui'

const THRESHOLD = 70 // px of (damped) pull needed to refresh
const MAX_PULL = 110
const MIN_SPIN_MS = 600 // keep the spinner up long enough to read as "it refreshed"

// Pages register handlers here; the most recently mounted one wins.
const handlers = []

export function usePullToRefresh(handler) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    const entry = () => ref.current?.()
    handlers.push(entry)
    return () => {
      const i = handlers.lastIndexOf(entry)
      if (i !== -1) handlers.splice(i, 1)
    }
  }, [])
}

async function runRefresh() {
  const handler = handlers[handlers.length - 1]
  if (handler) return handler()
  const reloaded = await invalidate('/api/')
  if (!reloaded.length) window.location.reload()
}

// A touch that starts inside something scrolled (a drawer, a table) scrolls that instead
function startsInScrolledElement(target) {
  for (let el = target; el && el !== document.body; el = el.parentElement) {
    if (el.dataset?.noPullRefresh !== undefined) return true
    if (el.scrollTop > 0) return true
  }
  return false
}

export default function PullToRefresh() {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const gesture = useRef(null)
  const refreshingRef = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('va-admin')
    return () => root.classList.remove('va-admin')
  }, [])

  useEffect(() => {
    if (!('ontouchstart' in window)) return undefined

    const onStart = e => {
      if (refreshingRef.current || e.touches.length !== 1) return
      // A sheet or modal is open (they lock body scroll)
      if (document.body.style.overflow === 'hidden') return
      if (window.scrollY > 0 || startsInScrolledElement(e.target)) return
      const t = e.touches[0]
      gesture.current = { x: t.clientX, y: t.clientY, decided: false, active: false, armed: false }
    }

    const onMove = e => {
      const g = gesture.current
      if (!g) return
      const t = e.touches[0]
      const dx = t.clientX - g.x
      const dy = t.clientY - g.y

      // Decide once: a sideways swipe (tab rows) or an upward scroll isn't a pull
      if (!g.decided) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
        g.decided = true
        g.active = dy > 0 && Math.abs(dy) > Math.abs(dx) && window.scrollY <= 0
        if (!g.active) {
          gesture.current = null
          return
        }
      }

      // Rubber-band resistance: easy at first, heavier as it goes
      const distance = Math.min(MAX_PULL, Math.max(0, dy) * 0.5)
      setPull(distance)
      if (distance >= THRESHOLD && !g.armed) {
        g.armed = true
        navigator.vibrate?.(8)
      } else if (distance < THRESHOLD) {
        g.armed = false
      }
    }

    const onEnd = async () => {
      const g = gesture.current
      gesture.current = null
      if (!g?.active) return
      if (!g.armed) {
        setPull(0)
        return
      }
      refreshingRef.current = true
      setRefreshing(true)
      setPull(THRESHOLD * 0.8)
      const started = Date.now()
      try {
        await runRefresh()
      } catch (err) {
        console.error('Pull to refresh failed:', err)
      } finally {
        const wait = MIN_SPIN_MS - (Date.now() - started)
        if (wait > 0) await new Promise(r => setTimeout(r, wait))
        refreshingRef.current = false
        setRefreshing(false)
        setPull(0)
      }
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [])

  const progress = Math.min(1, pull / THRESHOLD)
  const visible = pull > 0 || refreshing

  return (
    <div
      aria-hidden={!refreshing}
      role="status"
      className="pointer-events-none fixed inset-x-0 z-[45] flex justify-center"
      style={{
        top: 'var(--admin-header-h, calc(env(safe-area-inset-top) + 56px))',
        transform: `translateY(${pull - 44}px)`,
        opacity: visible ? Math.max(0.35, progress) : 0,
        // Follow the finger exactly while pulling; ease when snapping back
        transition: gesture.current ? 'none' : 'transform 260ms cubic-bezier(.2,.8,.2,1), opacity 200ms',
      }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-adm-raised/90 shadow-lg backdrop-blur-xl">
        <RefreshCw
          className={cx('h-[18px] w-[18px]', progress >= 1 || refreshing ? 'text-adm-accent' : 'text-adm-muted', refreshing && 'animate-spin')}
          style={refreshing ? undefined : { transform: `rotate(${progress * 270}deg)` }}
          aria-hidden
        />
      </span>
      <span className="sr-only">{refreshing ? 'Refreshing' : ''}</span>
    </div>
  )
}
