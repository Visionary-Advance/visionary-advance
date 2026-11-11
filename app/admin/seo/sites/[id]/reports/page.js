'use client'

import { useSite } from '@/Components/Admin/SEO/SiteContext'
import { useSEO } from '@/Components/Admin/SEO/SEOContext'
import SEOReportPanel from '@/Components/Admin/SEO/SEOReportPanel'

export default function SiteReportsPage() {
  const { site } = useSite()
  const { user } = useSEO()
  return <SEOReportPanel site={site} userEmail={user?.email} />
}
