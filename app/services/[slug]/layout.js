// app/services/[slug]/layout.js
// The service-detail page is a client component; per-service metadata (incl. a
// self-referential canonical) is generated here so each /services/[slug] page
// canonicalizes to itself instead of inheriting the /services canonical.

import { servicesData } from '@/lib/services-data'

const OG_IMAGE = 'https://visionaryadvance.com/Img/VaLogo_Large.png'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const service = servicesData[slug]

  if (!service) {
    return { title: 'Service Not Found' }
  }

  const url = `https://visionaryadvance.com/services/${slug}`
  const title = `${service.title} Services | Eugene, OR`
  const description = (service.scrollRevealText || '').slice(0, 160)
  const image = service.showcaseImage
    ? `https://visionaryadvance.com${service.showcaseImage}`
    : OG_IMAGE

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Visionary Advance',
      type: 'website',
      locale: 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function ServiceDetailLayout({ children }) {
  return children
}
