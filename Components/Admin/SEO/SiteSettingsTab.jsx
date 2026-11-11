'use client'

// Report data sources for a site: its GA4 property and the inboxes its forms notify.

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { getCRMAuthClient } from '@/lib/supabase-crm-client'
import { Alert, Button, Card, CardHeader, Field, Skeleton, inputClass, cx, useToast } from './ui'

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

export default function SiteSettingsTab({ site, userEmail, onSave }) {
  const notify = useToast()
  const [googleStatus, setGoogleStatus] = useState(null)
  const [properties, setProperties] = useState(null)
  const [propertiesError, setPropertiesError] = useState('')
  const [propertyId, setPropertyId] = useState(site.ga4_property_id || '')
  const [emailsText, setEmailsText] = useState((site.notification_emails || []).join('\n'))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!userEmail) return
    fetch(`/api/auth/google/status?email=${encodeURIComponent(userEmail)}`)
      .then(r => r.json())
      .then(setGoogleStatus)
      .catch(() => setGoogleStatus({ connected: false }))
  }, [userEmail])

  useEffect(() => {
    if (!googleStatus?.hasAnalytics) return
    authFetch('/api/seo/ga4/properties')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setProperties(data.properties)
      })
      .catch(err => setPropertiesError(err.message))
  }, [googleStatus?.hasAnalytics])

  const dirty =
    (propertyId || '') !== (site.ga4_property_id || '') ||
    emailsText.trim() !== (site.notification_emails || []).join('\n').trim()

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await onSave({ ga4_property_id: propertyId || null, notification_emails: emailsText })
      setEmailsText((updated?.notification_emails || []).join('\n'))
      notify('Saved. The next report will use these settings.', 'success')
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const reconnectUrl = `/api/auth/google/start?adminEmail=${encodeURIComponent(userEmail || '')}&returnUrl=${encodeURIComponent(`/admin/seo/sites/${site.id}/settings`)}`
  const savedPropertyMissing = propertyId && properties && !properties.some(p => p.id === propertyId)

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader title="Google Analytics 4" description="Adds visits, visitors, conversions, traffic sources and top pages to the monthly report." />
        <div className="p-5">
          {googleStatus === null ? (
            <Skeleton className="h-9 w-full" />
          ) : !googleStatus.hasAnalytics ? (
            <Alert
              tone="warn"
              title="Analytics access isn't approved yet"
              action={<Button size="sm" icon={RefreshCw} href={reconnectUrl}>Reconnect Google</Button>}
            >
              Reconnect and approve the Analytics permission to pick a property.
            </Alert>
          ) : propertiesError ? (
            <Alert tone="bad" title="Couldn't load GA4 properties">{propertiesError}</Alert>
          ) : properties === null ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Field
              label="Property"
              htmlFor="ga4-property"
              hint={properties.length === 0 ? `No properties found. Add ${googleStatus.email} as a Viewer in the client's GA4 property.` : undefined}
              error={savedPropertyMissing ? `${googleStatus.email} can't see this property anymore. Ask the client to re-add it as a Viewer.` : undefined}
            >
              <select id="ga4-property" value={propertyId} onChange={e => setPropertyId(e.target.value)} className={inputClass}>
                <option value="">Not linked</option>
                {savedPropertyMissing && <option value={propertyId}>{propertyId} (no access)</option>}
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.account} ({p.id})</option>
                ))}
              </select>
            </Field>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Website emails"
          description="Inboxes this site's forms send to. Deliveries to these addresses (and any address on the site's own domain) are counted daily. Not in reports yet; this builds up history."
        />
        <div className="p-5">
          <Field label="One address per line" htmlFor="notification-emails">
            <textarea
              id="notification-emails"
              rows={4}
              value={emailsText}
              onChange={e => setEmailsText(e.target.value)}
              placeholder="owner@gmail.com"
              className={cx(inputClass, 'font-mono')}
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" loading={saving} disabled={!dirty}>Save report settings</Button>
        {!dirty && <span className="text-sm text-adm-subtle">No unsaved changes</span>}
      </div>
    </form>
  )
}
