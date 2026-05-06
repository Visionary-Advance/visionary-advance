import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'

const config = landingPagesData['responsive-web-design-services']

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

export default function ResponsiveWebDesignServicesPage() {
  return <LandingPageTemplate config={config} />
}
