'use client'

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MotionConfig, MotionGlobalConfig } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { DEFAULT_SETTINGS, STORAGE_KEY, PROFILES, isProfileActive } from './a11y-config'
import AccessibilityWidget from './AccessibilityWidget'

export const A11yContext = createContext(null)

export const useA11y = () => {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useA11y must be used inside <A11yProvider>')
  return ctx
}

const LINE_HEIGHTS = { 1: '1.6', 2: '2', 3: '2.6' }
const LETTER_SPACING = { 1: '0.06em', 2: '0.12em', 3: '0.2em' }

export default function A11yProvider({ children }) {
  const pathname = usePathname()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [hydrated, setHydrated] = useState(false)
  const [guidePos, setGuidePos] = useState(0)

  // Widget is hidden on admin/login; settings still apply if previously set.
  const hidden = pathname?.startsWith('/admin') || pathname === '/login'

  // ---- Load persisted settings (the inline head script already applied the
  // critical visual classes before paint; this rehydrates React state). ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) })
      else {
        // Respect OS preference on first visit.
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) setSettings((s) => ({ ...s, stopAnimations: true }))
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true)
  }, [])

  // ---- Persist + apply to <html> whenever settings change ----
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* storage may be full / blocked */
    }

    const html = document.documentElement

    // Root font-size scaling (drives all rem-based sizing, incl. Tailwind).
    html.style.fontSize = settings.fontScale === 1 ? '' : `${settings.fontScale * 100}%`

    // Global (html-level) toggles.
    html.classList.toggle('a11y-big-cursor', settings.bigCursor)
    html.classList.toggle('a11y-focus', settings.highlightFocus)
    html.classList.toggle('a11y-no-motion', settings.stopAnimations)

    // Framer Motion: force all animations (incl. opacity fades that
    // reducedMotion deliberately keeps) to snap to their end state. This is the
    // only switch that overrides per-component `transition` props.
    MotionGlobalConfig.instantAnimations = settings.stopAnimations
    MotionGlobalConfig.skipAnimations = settings.stopAnimations
    window.__VA_A11Y_REDUCE__ = settings.stopAnimations
  }, [settings, hydrated])

  // ---- Reading guide / mask: track pointer ----
  useEffect(() => {
    if (!settings.readingGuide && !settings.readingMask) return
    let raf = 0
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setGuidePos(e.clientY))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [settings.readingGuide, settings.readingMask])

  // ---- Text-to-speech: click any text block to read it aloud ----
  useEffect(() => {
    if (!settings.tts) return
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const speak = (e) => {
      // Don't hijack clicks on the widget itself or interactive controls.
      if (e.target.closest('[data-a11y-widget]')) return
      const block = e.target.closest('p, li, h1, h2, h3, h4, h5, h6, a, button, span, td, th, blockquote, figcaption')
      const text = (block?.innerText || '').trim()
      if (!text) return
      e.preventDefault()
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 1
      window.speechSynthesis.speak(u)
    }
    document.addEventListener('click', speak, true)
    document.body.classList.add('a11y-tts-active')
    return () => {
      document.removeEventListener('click', speak, true)
      document.body.classList.remove('a11y-tts-active')
      window.speechSynthesis.cancel()
    }
  }, [settings.tts])

  // ---- Public API ----
  const update = useCallback((key, value) => {
    setSettings((s) => ({ ...s, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const toggleProfile = useCallback((profile) => {
    setSettings((s) => {
      if (isProfileActive(s, profile)) {
        // revert just the keys this profile set
        const reverted = { ...s }
        for (const k of Object.keys(profile.patch)) reverted[k] = DEFAULT_SETTINGS[k]
        return reverted
      }
      return { ...s, ...profile.patch }
    })
  }, [])

  const ctxValue = useMemo(
    () => ({ settings, update, reset, toggleProfile, profiles: PROFILES, isProfileActive }),
    [settings, update, reset, toggleProfile]
  )

  // Set the Framer instant-animation flag synchronously on first paint (before
  // any child motion component runs its mount animation). Pre-hydration we read
  // the value the <head> script derived from saved prefs / OS reduced-motion;
  // once hydrated, `settings` is the source of truth.
  if (typeof window !== 'undefined') {
    const reduce = hydrated ? settings.stopAnimations : window.__VA_A11Y_REDUCE__ === true
    MotionGlobalConfig.instantAnimations = reduce
    MotionGlobalConfig.skipAnimations = reduce
  }

  // ---- Classes / styles applied to the CONTENT wrapper (keeps the widget
  // itself unaffected by filters, fonts, contrast). ----
  const rootClasses = [
    settings.dyslexiaFont && 'a11y-dyslexia',
    settings.readableFont && 'a11y-readable',
    settings.lineHeight && 'a11y-line-height',
    settings.letterSpacing && 'a11y-letter-spacing',
    settings.highlightLinks && 'a11y-links',
    settings.highlightHeadings && 'a11y-headings',
    settings.hideImages && 'a11y-hide-images',
    settings.contrast === 'dark' && 'a11y-contrast-dark',
    settings.contrast === 'light' && 'a11y-contrast-light',
  ]
    .filter(Boolean)
    .join(' ')

  const filters = [
    settings.invert && 'invert(1) hue-rotate(180deg)',
    settings.grayscale && 'grayscale(1)',
    settings.saturation === 'low' && 'saturate(0.5)',
    settings.saturation === 'high' && 'saturate(1.8)',
  ].filter(Boolean)

  const rootStyle = {
    filter: filters.length ? filters.join(' ') : undefined,
    '--a11y-line-height': LINE_HEIGHTS[settings.lineHeight] || undefined,
    '--a11y-letter-spacing': LETTER_SPACING[settings.letterSpacing] || undefined,
  }

  return (
    <A11yContext.Provider value={ctxValue}>
      <MotionConfig reducedMotion={settings.stopAnimations ? 'always' : 'never'}>
        <div id="a11y-root" className={rootClasses || undefined} style={rootStyle}>
          {children}
        </div>
      </MotionConfig>

      {/* Reading guide (horizontal bar) */}
      {settings.readingGuide && (
        <div className="a11y-reading-guide" style={{ top: guidePos }} aria-hidden="true" />
      )}

      {/* Reading mask (dims everything except a strip around the cursor) */}
      {settings.readingMask && (
        <>
          <div className="a11y-reading-mask" style={{ height: Math.max(guidePos - 60, 0) }} aria-hidden="true" />
          <div className="a11y-reading-mask a11y-reading-mask-bottom" style={{ top: guidePos + 60 }} aria-hidden="true" />
        </>
      )}

      {!hidden && <AccessibilityWidget />}
    </A11yContext.Provider>
  )
}
