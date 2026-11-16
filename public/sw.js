/* Visionary Advance Admin — service worker
 * Handles Web Push delivery + notification clicks for the installed PWA.
 * Registered from the admin area (see Components/Admin/ServiceWorkerRegister.jsx).
 */

const DEFAULT_ICON = '/icons/icon-192.png'
const DEFAULT_BADGE = '/icons/icon-192.png'

self.addEventListener('install', () => {
  // Activate this worker immediately on first install.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Take control of open admin tabs without requiring a reload.
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch (e) {
    payload = { title: 'Visionary Advance', body: event.data ? event.data.text() : '' }
  }

  const title = payload.title || 'Visionary Advance'
  const options = {
    body: payload.body || '',
    icon: payload.icon || DEFAULT_ICON,
    badge: payload.badge || DEFAULT_BADGE,
    tag: payload.tag || undefined,
    data: { url: payload.url || '/admin' },
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = (event.notification.data && event.notification.data.url) || '/admin'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus an existing admin window if one is open, navigating it to the target.
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      // Otherwise open a new window.
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})
