'use client'

import { useSite } from '@/Components/Admin/SEO/SiteContext'
import KeywordsTab from '@/Components/Admin/SEO/KeywordsTab'

export default function SiteKeywordsPage() {
  const { site } = useSite()
  return <KeywordsTab siteId={site.id} />
}
