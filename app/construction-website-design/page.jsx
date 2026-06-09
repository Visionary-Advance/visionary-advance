import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'
import { landingPageMetadata } from '@/lib/seo'

const config = landingPagesData['construction-website-design']

export const metadata = landingPageMetadata(config.meta)

export default function ConstructionWebsiteDesignPage() {
  return <LandingPageTemplate config={config} />
}
