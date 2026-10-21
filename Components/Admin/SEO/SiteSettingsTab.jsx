'use client'

import { useEffect, useState } from 'react'
import { getCRMAuthClient } from '@/lib/supabase-crm-client'

// Admin sessions live in localStorage, so admin-guarded routes need the bearer token
async function authFetch(url, options = {}) {
  const { data } = await getCRMAuthClient().auth.getSession()
  const token = data?.session?.access_token

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

// Report data sources for a site: its GA4 property and the inboxes its forms notify
export default function SiteSettingsTab({ site, userEmail, onSaved }) {
  const [googleStatus, setGoogleStatus] = useState(null)
  const [properties, setProperties] = useState(null)
  const [propertiesError, setPropertiesError] = useState('')
  const [propertyId, setPropertyId] = useState(site.ga4_property_id || '')
  const [emailsText, setEmailsText] = useState((site.notification_emails || []).join('\n'))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', tone: 'info' })

  useEffect(() => {
    if (!userEmail) return
    fetch(`/api/auth/google/status?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then(setGoogleStatus)
      .catch(() => setGoogleStatus({ connected: false }))
  }, [userEmail])

  useEffect(() => {
    if (!googleStatus?.hasAnalytics) return
    authFetch('/api/seo/ga4/properties')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setProperties(data.properties)
      })
      .catch((err) => setPropertiesError(err.message))
  }, [googleStatus?.hasAnalytics])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage({ text: '', tone: 'info' })
    try {
      const res = await fetch(`/api/seo/sites?id=${site.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ga4_property_id: propertyId || null,
          notification_emails: emailsText
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setEmailsText((data.site.notification_emails || []).join('\n'))
      onSaved(data.site)
      setMessage({ text: 'Saved. The next report will use these settings.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const reconnectUrl = `/api/auth/google/start?adminEmail=${encodeURIComponent(userEmail || '')}&returnUrl=${encodeURIComponent(`/admin/seo/sites/${site.id}?tab=settings`)}`
  const savedPropertyMissing = propertyId && properties && !properties.some((p) => p.id === propertyId)

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      {/* GA4 */}
      <section className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
        <h3 className="text-lg font-semibold text-white">Google Analytics 4</h3>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          Adds visits, visitors, conversions, traffic sources and top pages to the monthly report.
        </p>

        {googleStatus === null ? (
          <p className="text-sm text-gray-500">Checking Google connection…</p>
        ) : !googleStatus.hasAnalytics ? (
          <div className="rounded-lg border border-amber-700/50 bg-amber-900/20 p-4">
            <p className="text-sm text-amber-200">
              The Google connection doesn&apos;t have Analytics access yet. Reconnect and approve the
              Analytics permission to pick a property.
            </p>
            <a
              href={reconnectUrl}
              className="inline-block mt-3 text-sm bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Reconnect Google
            </a>
          </div>
        ) : propertiesError ? (
          <p className="text-sm text-red-400">Couldn&apos;t load GA4 properties: {propertiesError}</p>
        ) : properties === null ? (
          <p className="text-sm text-gray-500">Loading properties…</p>
        ) : (
          <>
            <label htmlFor="ga4-property" className="block text-sm text-gray-300 mb-1.5">Property</label>
            <select
              id="ga4-property"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full bg-[#171717] border border-[#262626] text-white text-sm rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
            >
              <option value="">Not linked</option>
              {savedPropertyMissing && (
                <option value={propertyId}>{propertyId} (no access)</option>
              )}
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.account} ({p.id})
                </option>
              ))}
            </select>
            {properties.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">
                No properties found. Add {googleStatus.email} as a Viewer in the client&apos;s GA4 property.
              </p>
            )}
            {savedPropertyMissing && (
              <p className="text-xs text-amber-400 mt-2">
                {googleStatus.email} can&apos;t see this property anymore. Ask the client to re-add it as a Viewer.
              </p>
            )}
          </>
        )}
      </section>

      {/* Notification emails */}
      <section className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
        <h3 className="text-lg font-semibold text-white">Website emails</h3>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          Inboxes this site&apos;s forms send to. Emails Resend delivers to these addresses (and any
          address on the site&apos;s own domain) are counted daily. Not shown in reports yet — this
          builds up history for later.
        </p>
        <label htmlFor="notification-emails" className="block text-sm text-gray-300 mb-1.5">
          One address per line
        </label>
        <textarea
          id="notification-emails"
          rows={4}
          value={emailsText}
          onChange={(e) => setEmailsText(e.target.value)}
          placeholder="owner@gmail.com"
          className="w-full bg-[#171717] border border-[#262626] text-white text-sm rounded-lg px-3 py-2 font-mono focus:border-teal-500 focus:outline-none"
        />
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {message.text && (
          <p role="status" className={`text-sm ${message.tone === 'error' ? 'text-red-400' : 'text-teal-400'}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  )
}
