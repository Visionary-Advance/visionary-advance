import { redirect } from 'next/navigation'

// The site list now lives on the SEO home page.
export default function SEOSitesIndex() {
  redirect('/admin/seo')
}
