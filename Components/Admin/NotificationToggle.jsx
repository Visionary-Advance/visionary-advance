'use client'

import { useState, useEffect, useCallback } from 'react'

// Base64 URL-safe VAPID public key -> Uint8Array for PushManager.subscribe.
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

export default function NotificationToggle() {
  const [supported, setSupported] = useState(true)
  const [standalone, setStandalone] = useState(true)
  const [permission, setPermission] = useState('default')
  const [subscribed, setSubscribed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const refreshState = useCallback(async () => {
    const ok =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    setSupported(ok)
    setStandalone(isStandalone())
    if (!ok) return

    setPermission(Notification.permission)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setSubscribed(!!sub)
    } catch {
      setSubscribed(false)
    }
  }, [])

  useEffect(() => {
    refreshState()
  }, [refreshState])

  const enable = async () => {
    setError('')
    setSuccess('')
    if (!VAPID_PUBLIC_KEY) {
      setError('Push is not configured on the server (missing VAPID key).')
      return
    }
    setBusy(true)
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') {
        setError('Notification permission was not granted.')
        return
      }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      })
      if (!res.ok) throw new Error('Failed to save subscription')

      setSubscribed(true)
      setSuccess('Notifications enabled on this device.')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not enable notifications.')
    } finally {
      setBusy(false)
    }
  }

  const disable = async () => {
    setError('')
    setSuccess('')
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setSubscribed(false)
      setSuccess('Notifications disabled on this device.')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not disable notifications.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-[#fafafa]">Push Notifications</h3>
          <p className="mt-1 text-xs text-[#a1a1aa]">
            Get alerted on this device for new leads, bookings, incidents, and signups.
          </p>
        </div>
        {subscribed && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            Enabled
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {!supported ? (
        <div className="rounded-lg border border-[#262626] bg-[#171717] p-4 text-sm text-[#a1a1aa]">
          This browser doesn&apos;t support push notifications.
        </div>
      ) : !standalone && /iPhone|iPad|iPod/.test(
          typeof navigator !== 'undefined' ? navigator.userAgent : ''
        ) ? (
        <div className="rounded-lg border border-[#262626] bg-[#171717] p-4 text-sm text-[#a1a1aa]">
          On iPhone/iPad, first add this app to your Home Screen (Share →{' '}
          <span className="text-[#fafafa]">Add to Home Screen</span>), then open it
          from the home screen and enable notifications here.
        </div>
      ) : subscribed ? (
        <button
          onClick={disable}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] transition-colors hover:bg-[#262626] disabled:opacity-50"
        >
          {busy ? 'Working…' : 'Disable notifications'}
        </button>
      ) : (
        <button
          onClick={enable}
          disabled={busy || permission === 'denied'}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008070] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:opacity-50"
        >
          {busy ? 'Working…' : 'Enable notifications'}
        </button>
      )}

      {permission === 'denied' && (
        <p className="text-xs text-[#a1a1aa]">
          Notifications are blocked in your browser/OS settings. Re-allow them for
          this site to enable.
        </p>
      )}
    </div>
  )
}
