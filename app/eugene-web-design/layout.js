import { eugenePageContent } from '@/lib/eugene-page-content'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'

const { meta } = eugenePageContent

export const metadata = {
  // `absolute` opts out of the root title template — meta.title is already a
  // complete, length-tuned SEO title, so we don't append the brand again.
  title: { absolute: meta.title },
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: meta.canonical },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: meta.canonical,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Visionary Advance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function EugeneLayout({ children }) {
  return children
}
