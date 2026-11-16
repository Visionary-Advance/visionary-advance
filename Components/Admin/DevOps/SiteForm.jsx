'use client'

// Add / edit a monitored site. Used by sites/new and sites/[id]/edit.

import { useState } from 'react'
import { Alert, Button, Card, CardHeader, Field, cx, inputClass } from '@/Components/Admin/ui'
import CRMLeadSelector from './CRMLeadSelector'
import { ENVIRONMENT } from './format'

export const EMPTY_SITE = {
  name: '',
  url: '',
  api_key: '',
  environment: 'production',
  category: '',
  owner_email: '',
  check_interval_minutes: 5,
  timeout_seconds: 30,
  is_active: true,
  ssl_check_enabled: true,
  health_url: '',
  monitor_link: '',
  sla_target: 99.9,
  crm_lead_id: null,
}

/** Site row from the API → form values. */
export function siteToForm(site) {
  const form = { ...EMPTY_SITE }
  for (const key of Object.keys(EMPTY_SITE)) {
    if (site[key] !== null && site[key] !== undefined) form[key] = site[key]
  }
  return form
}

export default function SiteForm({ initial = EMPTY_SITE, submitLabel, onSubmit, cancelHref }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (name, value) => setForm(f => ({ ...f, [name]: value }))
  const bind = name => ({
    id: `site-${name}`,
    name,
    value: form[name] ?? '',
    onChange: e => set(name, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        ...form,
        check_interval_minutes: parseInt(form.check_interval_minutes, 10) || 5,
        timeout_seconds: parseInt(form.timeout_seconds, 10) || 30,
        sla_target: parseFloat(form.sla_target) || 99.9,
      })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && <Alert tone="bad" title="Couldn't save">{error}</Alert>}

      <Card>
        <CardHeader title="Site" />
        <div className="space-y-4 p-5">
          <Field label="Name" htmlFor="site-name">
            <input {...bind('name')} required placeholder="Three Peaks Tree Service" className={inputClass} />
          </Field>
          <Field label="URL" htmlFor="site-url" hint="DevOps calls /api/health on this URL unless you set a custom health URL below.">
            <input {...bind('url')} type="url" required placeholder="https://example.com" className={inputClass} />
          </Field>
          <Field label="Custom health URL" htmlFor="site-health_url" hint="Optional. Defaults to {URL}/api/health.">
            <input {...bind('health_url')} type="url" placeholder="https://example.com/custom-health" className={inputClass} />
          </Field>
          <Field label="API key" htmlFor="site-api_key" hint="Optional. Sent as the X-API-Key header to the health endpoint.">
            <input {...bind('api_key')} autoComplete="off" spellCheck={false} className={cx(inputClass, 'font-mono')} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Details" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <Field label="Environment" htmlFor="site-environment">
            <select {...bind('environment')} className={inputClass}>
              {Object.entries(ENVIRONMENT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
          <Field label="Category" htmlFor="site-category">
            <input {...bind('category')} placeholder="Client sites" className={inputClass} />
          </Field>
          <Field label="Owner email" htmlFor="site-owner_email">
            <input {...bind('owner_email')} type="email" placeholder="client@example.com" className={inputClass} />
          </Field>
          <Field label="Uptime target (%)" htmlFor="site-sla_target">
            <input {...bind('sla_target')} type="number" min="90" max="100" step="0.1" className={inputClass} />
          </Field>
          <Field label="External monitor link" htmlFor="site-monitor_link" hint="Optional. BetterStack, UptimeRobot, etc." className="sm:col-span-2">
            <input {...bind('monitor_link')} type="url" placeholder="https://…" className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <CRMLeadSelector value={form.crm_lead_id} onChange={id => set('crm_lead_id', id)} ownerEmail={form.owner_email} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Monitoring" />
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Check every (minutes)" htmlFor="site-check_interval_minutes">
              <input {...bind('check_interval_minutes')} type="number" min="1" max="60" className={inputClass} />
            </Field>
            <Field label="Timeout (seconds)" htmlFor="site-timeout_seconds">
              <input {...bind('timeout_seconds')} type="number" min="5" max="120" className={inputClass} />
            </Field>
          </div>
          <Toggle id="site-is_active" label="Monitoring on" hint="Paused sites aren't checked." checked={form.is_active} onChange={v => set('is_active', v)} />
          <Toggle id="site-ssl_check_enabled" label="SSL check" hint="Warn when HTTPS stops working." checked={form.ssl_check_enabled} onChange={v => set('ssl_check_enabled', v)} />
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {cancelHref && <Button variant="ghost" href={cancelHref}>Cancel</Button>}
        <Button type="submit" variant="primary" loading={saving}>{saving ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  )
}

function Toggle({ id, label, hint, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-adm-border bg-adm-raised accent-teal-500"
      />
      <span>
        <span className="block text-sm font-medium text-adm-text">{label}</span>
        <span className="block text-xs text-adm-subtle">{hint}</span>
      </span>
    </label>
  )
}
