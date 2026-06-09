import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'
import { landingPageMetadata } from '@/lib/seo'

const config = landingPagesData['law-firm-web-design']

export const metadata = landingPageMetadata(config.meta)

export default function LawFirmWebDesignPage() {
  return <LandingPageTemplate config={config} />
}
