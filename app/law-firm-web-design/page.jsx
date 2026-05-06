import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'

const config = landingPagesData['law-firm-web-design']

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

export default function LawFirmWebDesignPage() {
  return <LandingPageTemplate config={config} />
}
