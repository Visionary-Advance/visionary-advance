'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from './A11yProvider'
import { FONT_SCALES, LEVELS } from './a11y-config'

const TEAL = '#008070'

/* ---------------- small UI primitives ---------------- */

function Toggle({ label, desc, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
        active
          ? 'border-[#008070] bg-[#008070]/10'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-900">{label}</span>
        {desc && <span className="block text-xs text-gray-500">{desc}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
          active ? 'bg-[#008070]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            active ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  )
}

function Stepper({ label, value, displayValue, onDec, onInc, canDec, canInc }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDec}
          disabled={!canDec}
          aria-label={`Decrease ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-12 text-center text-sm font-semibold tabular-nums text-gray-900">
          {displayValue}
        </span>
        <button
          type="button"
          onClick={onInc}
          disabled={!canInc}
          aria-label={`Increase ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  )
}

function Segmented({ label, value, options, onChange }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
      <span className="mb-2 block text-sm font-semibold text-gray-900">{label}</span>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
              value === opt.value
                ? 'bg-[#008070] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="px-1 text-xs font-bold uppercase tracking-wide text-gray-400">{title}</h3>
      {children}
    </section>
  )
}

/* ---------------- main widget ---------------- */

export default function AccessibilityWidget() {
  const { settings, update, reset, toggleProfile, profiles, isProfileActive } = useA11y()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const triggerRef = useRef(null)

  const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Esc to close + focus trap + restore focus
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const focusables = () =>
      panel.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])')

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key === 'Tab') {
        const items = focusables()
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    focusables()[0]?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  const fontIdx = FONT_SCALES.indexOf(settings.fontScale)

  return (
    <div data-a11y-widget>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Accessibility options"
        className="fixed bottom-5 right-5 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#008070] text-white shadow-lg ring-2 ring-white transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#008070]/40"
      >
        {/* Universal access icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="3.5" r="2" />
          <path d="M21 7c0 .7-.5 1.2-1.2 1.3L15 9v4l1.8 6.2c.2.7-.2 1.4-.9 1.6-.7.2-1.4-.2-1.6-.9L12 14.5l-2.3 5.4c-.2.7-.9 1.1-1.6.9-.7-.2-1.1-.9-.9-1.6L9 13V9l-4.8-.7C3.5 8.2 3 7.7 3 7c0-.8.7-1.4 1.5-1.3L12 6.8l7.5-1.1C20.3 5.6 21 6.2 21 7z" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility options"
            className="fixed bottom-5 right-5 z-[9999] flex max-h-[85vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-[#008070] px-4 py-3">
              <h2 className="font-bold text-white">Accessibility</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/25"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close accessibility options"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-white hover:bg-white/15"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-4">
              {/* Profiles */}
              <Section title="Profiles">
                <div className="grid grid-cols-2 gap-2">
                  {profiles.map((p) => {
                    const active = isProfileActive(settings, p)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleProfile(p)}
                        className={`rounded-lg border px-2.5 py-2 text-left transition-colors ${
                          active
                            ? 'border-[#008070] bg-[#008070]/10'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-gray-900">{p.label}</span>
                        <span className="block text-[11px] leading-tight text-gray-500">{p.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </Section>

              {/* Content */}
              <Section title="Content">
                <Stepper
                  label="Text size"
                  displayValue={`${Math.round(settings.fontScale * 100)}%`}
                  onDec={() => update('fontScale', FONT_SCALES[fontIdx - 1])}
                  onInc={() => update('fontScale', FONT_SCALES[fontIdx + 1])}
                  canDec={fontIdx > 0}
                  canInc={fontIdx < FONT_SCALES.length - 1}
                />
                <Stepper
                  label="Line spacing"
                  displayValue={settings.lineHeight || 'Off'}
                  onDec={() => update('lineHeight', Math.max(0, settings.lineHeight - 1))}
                  onInc={() => update('lineHeight', Math.min(3, settings.lineHeight + 1))}
                  canDec={settings.lineHeight > 0}
                  canInc={settings.lineHeight < 3}
                />
                <Stepper
                  label="Letter spacing"
                  displayValue={settings.letterSpacing || 'Off'}
                  onDec={() => update('letterSpacing', Math.max(0, settings.letterSpacing - 1))}
                  onInc={() => update('letterSpacing', Math.min(3, settings.letterSpacing + 1))}
                  canDec={settings.letterSpacing > 0}
                  canInc={settings.letterSpacing < 3}
                />
                <Toggle label="Dyslexia-friendly font" active={settings.dyslexiaFont} onClick={() => update('dyslexiaFont', !settings.dyslexiaFont)} />
                <Toggle label="Readable font" active={settings.readableFont} onClick={() => update('readableFont', !settings.readableFont)} />
                <Toggle label="Highlight links" active={settings.highlightLinks} onClick={() => update('highlightLinks', !settings.highlightLinks)} />
                <Toggle label="Highlight headings" active={settings.highlightHeadings} onClick={() => update('highlightHeadings', !settings.highlightHeadings)} />
              </Section>

              {/* Color */}
              <Section title="Color">
                <Segmented
                  label="Contrast"
                  value={settings.contrast}
                  onChange={(v) => update('contrast', v)}
                  options={[
                    { value: 'off', label: 'Off' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                  ]}
                />
                <Segmented
                  label="Saturation"
                  value={settings.saturation}
                  onChange={(v) => update('saturation', v)}
                  options={[
                    { value: 'off', label: 'Normal' },
                    { value: 'low', label: 'Low' },
                    { value: 'high', label: 'High' },
                  ]}
                />
                <Toggle label="Invert colors" active={settings.invert} onClick={() => update('invert', !settings.invert)} />
                <Toggle label="Grayscale" active={settings.grayscale} onClick={() => update('grayscale', !settings.grayscale)} />
              </Section>

              {/* Tools */}
              <Section title="Tools">
                <Toggle label="Stop animations" desc="Pause motion across the site" active={settings.stopAnimations} onClick={() => update('stopAnimations', !settings.stopAnimations)} />
                <Toggle label="Big cursor" active={settings.bigCursor} onClick={() => update('bigCursor', !settings.bigCursor)} />
                <Toggle label="Reading guide" desc="Bar that follows your cursor" active={settings.readingGuide} onClick={() => update('readingGuide', !settings.readingGuide)} />
                <Toggle label="Reading mask" desc="Dims all but the current line" active={settings.readingMask} onClick={() => update('readingMask', !settings.readingMask)} />
                <Toggle label="Highlight focus" active={settings.highlightFocus} onClick={() => update('highlightFocus', !settings.highlightFocus)} />
                <Toggle label="Hide images" active={settings.hideImages} onClick={() => update('hideImages', !settings.hideImages)} />
                {hasTTS && (
                  <Toggle label="Read aloud" desc="Click any text to hear it" active={settings.tts} onClick={() => update('tts', !settings.tts)} />
                )}
              </Section>

              <p className="px-1 pt-1 text-[11px] leading-snug text-gray-400">
                These tools adjust how this site displays for you. Your settings are saved on this device.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
