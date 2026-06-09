import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'
import { landingPageMetadata } from '@/lib/seo'

const config = landingPagesData['small-business-website-design']

export const metadata = landingPageMetadata(config.meta)

export default function SmallBusinessWebsiteDesignPage() {
  return <LandingPageTemplate config={config} />
}
