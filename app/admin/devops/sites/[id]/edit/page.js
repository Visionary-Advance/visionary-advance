'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import CRMLeadSelector from '@/Components/Admin/DevOps/CRMLeadSelector'

export default function EditSitePage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const { loading: authLoading } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
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
  })

  // Fetch existing site data
  useEffect(() => {
    async function fetchSite() {
      try {
        const res = await fetch(`/api/devops/sites/${id}`)
        if (res.ok) {
          const data = await res.json()
          const site = data.site
          setFormData({
            name: site.name || '',
            url: site.url || '',
            api_key: site.api_key || '',
            environment: site.environment || 'production',
            category: site.category || '',
            owner_email: site.owner_email || '',
            check_interval_minutes: site.check_interval_minutes || 5,
            timeout_seconds: site.timeout_seconds || 30,
            is_active: site.is_active ?? true,
            ssl_check_enabled: site.ssl_check_enabled ?? true,
            health_url: site.health_url || '',
            monitor_link: site.monitor_link || '',
            sla_target: site.sla_target ?? 99.9,
            crm_lead_id: site.crm_lead_id || null,
          })
        } else if (res.status === 404) {
          router.push('/admin/devops/sites')
        }
      } catch (err) {
        console.error('Error fetching site:', err)
        setError('Failed to load site data')
      } finally {
        setLoading(false)
      }
    }

    fetchSite()
  }, [id, router])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch(`/api/devops/sites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          check_interval_minutes: parseInt(formData.check_interval_minutes, 10),
          timeout_seconds: parseInt(formData.timeout_seconds, 10),
          sla_target: parseFloat(formData.sla_target) || 99.9,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update site')
      }

      router.push(`/admin/devops/sites/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/admin/devops/sites/${id}`}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Site</h1>
          <p className="text-gray-400">Update site configuration</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="My Client Site"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL *
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://example.com"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                The health check will call /api/health on this URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key (Optional)
              </label>
              <input
                type="text"
                name="api_key"
                value={formData.api_key}
                onChange={handleChange}
                placeholder="Enter API key for authentication"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                Sent as X-API-Key header to the health endpoint
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Health URL (Optional)
              </label>
              <input
                type="url"
                name="health_url"
                value={formData.health_url}
                onChange={handleChange}
                placeholder="https://example.com/custom-health"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                Custom health endpoint. Defaults to {'{URL}/api/health'} if not set
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                External Monitor Link (Optional)
              </label>
              <input
                type="url"
                name="monitor_link"
                value={formData.monitor_link}
                onChange={handleChange}
                placeholder="https://betterstack.com/team/123/monitors/456"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                Link to external monitoring dashboard (BetterStack, UptimeRobot, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Environment & Category */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Classification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Environment
              </label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Client Sites"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Owner Email
              </label>
              <input
                type="email"
                name="owner_email"
                value={formData.owner_email}
                onChange={handleChange}
                placeholder="client@example.com"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SLA Target (%)
              </label>
              <input
                type="number"
                name="sla_target"
                value={formData.sla_target}
                onChange={handleChange}
                min="90"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                Target uptime percentage (default 99.9%)
              </p>
            </div>

            <div className="col-span-2">
              <CRMLeadSelector
                value={formData.crm_lead_id}
                onChange={(id) => setFormData(prev => ({ ...prev, crm_lead_id: id }))}
                ownerEmail={formData.owner_email}
              />
            </div>
          </div>
        </div>

        {/* Monitoring Settings */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Monitoring Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Check Interval (minutes)
                </label>
                <input
                  type="number"
                  name="check_interval_minutes"
                  value={formData.check_interval_minutes}
                  onChange={handleChange}
                  min="1"
                  max="60"
                  className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  name="timeout_seconds"
                  value={formData.timeout_seconds}
                  onChange={handleChange}
                  min="5"
                  max="120"
                  className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#262626] bg-[#171717] text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-300">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="ssl_check_enabled"
                  checked={formData.ssl_check_enabled}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#262626] bg-[#171717] text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-300">SSL Check</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href={`/admin/devops/sites/${id}`}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}
