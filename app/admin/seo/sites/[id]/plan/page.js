'use client'

import { useSite } from '@/Components/Admin/SEO/SiteContext'
import SEOPlanView from '@/Components/Admin/SEO/SEOPlanView'

export default function SitePlanPage() {
  const { site, refreshPlanSummary } = useSite()
  return <SEOPlanView site={site} onPlanChange={refreshPlanSummary} />
}
