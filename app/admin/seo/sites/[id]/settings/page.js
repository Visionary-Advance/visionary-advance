'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Link2, Trash2 } from 'lucide-react'
import { useSite } from '@/Components/Admin/SEO/SiteContext'
import { useSEO } from '@/Components/Admin/SEO/SEOContext'
import SiteSettingsTab from '@/Components/Admin/SEO/SiteSettingsTab'
import LinkToBusinessModal from '@/Components/Admin/SEO/LinkToBusinessModal'
import { Button, Card, CardHeader, ConfirmButton, Field, inputClass, useToast } from '@/Components/Admin/SEO/ui'
import { PLAN_TIERS, PLAN_TIER_LABELS } from '@/lib/seo-tiers'

export default function SiteSettingsPage() {
  const { site, updateSite, linkedBusiness, setLinkedBusiness } = useSite()
  const { user, removeSiteLocal } = useSEO()
  const notify = useToast()
  const router = useRouter()
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [savingTier, setSavingTier] = useState(false)

  async function handleTierChange(tier) {
    setSavingTier(true)
    try {
      await updateSite({ plan_tier: tier })
      notify(`Switched to the ${PLAN_TIER_LABELS[tier]} plan`, 'success')
    } catch (err) {
      notify(`Failed to update plan tier: ${err.message}`, 'error')
    } finally {
      setSavingTier(false)
    }
  }

  async function handleLink(businessId) {
    await updateSite({ business_id: businessId })
    if (!businessId) {
      setLinkedBusiness(null)
      notify('Business unlinked', 'info')
      return
    }
    try {
      const res = await fetch(`/api/crm/businesses/${businessId}`)
      const data = await res.json()
      if (data.business) setLinkedBusiness(data.business)
    } catch {}
    notify('Business linked', 'success')
  }

  async function handleRemove() {
    const res = await fetch(`/api/seo/sites?id=${site.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.error) {
      notify(`Failed to remove site: ${data.error}`, 'error')
      return
    }
    removeSiteLocal(site.id)
    notify(`${site.display_name || 'Site'} removed`, 'info')
    router.push('/admin/seo')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader title="Service plan" description="Sets how many keywords this site can track." />
        <div className="p-5">
          <Field label="Plan tier" htmlFor="plan-tier" className="sm:max-w-xs">
            <select
              id="plan-tier"
              value={site.plan_tier || 'basic'}
              onChange={e => handleTierChange(e.target.value)}
              disabled={savingTier}
              className={inputClass}
            >
              {PLAN_TIERS.map(t => <option key={t} value={t}>{PLAN_TIER_LABELS[t]}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="CRM business" description="Links this site to its client so reports and projects line up." />
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          {linkedBusiness ? (
            <span className="inline-flex items-center gap-2 text-sm text-adm-text">
              <Building2 className="h-4 w-4 text-adm-accent" aria-hidden /> {linkedBusiness.name}
            </span>
          ) : (
            <span className="text-sm text-adm-muted">Not linked to a business</span>
          )}
          <Button size="sm" icon={Link2} onClick={() => setShowLinkModal(true)}>
            {site.business_id ? 'Change' : 'Link business'}
          </Button>
        </div>
      </Card>

      <SiteSettingsTab key={site.id} site={site} userEmail={user?.email} onSave={updateSite} />

      <Card className="border-red-500/30">
        <CardHeader title="Remove site" description="Stops tracking this site here. Search Console itself isn't touched, and you can add the site again later." />
        <div className="p-5">
          <ConfirmButton icon={Trash2} onConfirm={handleRemove} confirmLabel="Click again to remove">Remove site</ConfirmButton>
        </div>
      </Card>

      {showLinkModal && <LinkToBusinessModal site={site} onLink={handleLink} onClose={() => setShowLinkModal(false)} />}
    </div>
  )
}
