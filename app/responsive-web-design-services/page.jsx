import LandingPageTemplate from '@/Components/Landing/LandingPageTemplate'
import { landingPagesData } from '@/lib/landing-pages-data'
import { landingPageMetadata } from '@/lib/seo'

const config = landingPagesData['responsive-web-design-services']

export const metadata = landingPageMetadata(config.meta)

export default function ResponsiveWebDesignServicesPage() {
  return <LandingPageTemplate config={config} />
}
