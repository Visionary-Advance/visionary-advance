'use client'

import { useEffect } from 'react'

// Registers the admin service worker (/sw.js) that handles Web Push delivery.
// Mounted once in the admin layout. No UI.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('[sw] registration failed:', err))
  }, [])

  return null
}
