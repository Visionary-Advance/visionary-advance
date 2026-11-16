'use client'

import { useEffect, useState } from 'react'

const DISMISS_KEY = 'va-install-dismissed'

// Shows an "install this app" prompt in the admin area.
// - Android/Chrome: a real install button (fires the native beforeinstallprompt dialog)
// - iOS/Safari: instructions, because Apple exposes no programmatic install
// Hidden once installed (standalone) or dismissed.
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null) // Android beforeinstallprompt event
  const [isIOS, setIsIOS] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Already installed → never show.
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (standalone) return

    // Previously dismissed → respect it.
    if (localStorage.getItem(DISMISS_KEY) === '1') return

    const ua = navigator.userAgent
    const ios = /iPhone|iPad|iPod/.test(ua) && !window.MSStream
    // Only iOS *Safari* can add to home screen (not Chrome/Firefox on iOS).
    const iosSafari = ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
    setIsIOS(ios)

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferred(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    const onInstalled = () => setVisible(false)
    window.addEventListener('appinstalled', onInstalled)

    // iOS fires no event — show the instruction banner directly.
    if (iosSafari) setVisible(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    if (outcome === 'accepted') setVisible(false)
  }

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {}
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-2xl border border-[#262626] bg-[#0a0a0a]/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:right-4 sm:mx-0">
      <div className="flex items-start gap-3">
        <img
          src="/icons/icon-192.png"
          alt="VA Admin"
          className="h-10 w-10 flex-shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#fafafa]">Install VA Admin</p>
          {isIOS ? (
            <p className="mt-1 text-xs leading-relaxed text-[#a1a1aa]">
              Tap the <span className="text-[#fafafa]">Share</span> icon{' '}
              <span aria-hidden>􀈂</span> in Safari, then{' '}
              <span className="text-[#fafafa]">Add to Home Screen</span> to install
              and enable notifications.
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-[#a1a1aa]">
              Add this dashboard to your home screen for quick access and push
              notifications.
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            {!isIOS && (
              <button
                onClick={install}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#008070] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#006b5d]"
              >
                Install app
              </button>
            )}
            <button
              onClick={dismiss}
              className="inline-flex items-center rounded-lg border border-[#262626] bg-[#171717] px-3 py-1.5 text-xs font-medium text-[#a1a1aa] transition-colors hover:text-[#fafafa]"
            >
              {isIOS ? 'Got it' : 'Not now'}
            </button>
          </div>
        </div>

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
