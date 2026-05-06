import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'

const config = landingPagesData['construction-website-design']

export const metadata = {
  title: config.meta.title,
  description: config.meta.description,
  alternates: { canonical: config.meta.canonical },
  openGraph: {
    title: config.meta.title,
    description: config.meta.description,
    url: config.meta.canonical,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: config.meta.title,
    description: config.meta.description,
  },
}

export default function ConstructionWebsiteDesignPage() {
  return <LandingPageTemplate config={config} />
}
