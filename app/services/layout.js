import { DEFAULT_OG_IMAGE } from '@/lib/seo'

export const metadata = {
  // Shortened from "Web Design & Custom Business Systems Services | Eugene, OR"
  // so the title + brand suffix stays under the ~60 char limit.
  title: 'Web Design & Business Systems | Eugene, OR',
  description: 'Custom websites, dashboards, SEO, and business systems built around how you work. No templates, no shortcuts. Serving Eugene, Lane County & Oregon.',
  alternates: {
    canonical: 'https://visionaryadvance.com/services',
  },
  openGraph: {
    title: 'Web Design & Business Systems | Eugene, OR',
    description: 'Custom websites, dashboards, SEO, and business systems built around how you work. No templates, no shortcuts. Serving Eugene, Lane County & Oregon.',
    url: 'https://visionaryadvance.com/services',
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Visionary Advance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design & Business Systems | Eugene, OR',
    description: 'Custom websites, dashboards, SEO, and business systems built around how you work. Serving Eugene & Lane County.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function ServicesLayout({ children }) {
  return children
}
