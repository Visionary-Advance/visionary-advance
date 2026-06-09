import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'
import { landingPageMetadata } from '@/lib/seo'

const config = landingPagesData['ecommerce-web-design-agency']

export const metadata = landingPageMetadata(config.meta)

export default function EcommerceWebDesignAgencyPage() {
  return <LandingPageTemplate config={config} />
}
