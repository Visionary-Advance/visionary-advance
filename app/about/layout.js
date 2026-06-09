import { DEFAULT_OG_IMAGE } from '@/lib/seo'

export const metadata = {
  // `absolute` opts out of the root title template so the brand isn't repeated.
  title: { absolute: 'About Visionary Advance | Eugene Web Design & SEO' },
  description: 'Built on experience, designed for how businesses operate. Custom websites and business systems for professionals in Eugene, Lane County & Oregon.',
  alternates: {
    canonical: 'https://visionaryadvance.com/about',
  },
  openGraph: {
    title: 'About Visionary Advance | Eugene Web Design & SEO',
    description: 'Built on experience, designed for how businesses operate. Custom websites and business systems for professionals in Eugene, Lane County & Oregon.',
    url: 'https://visionaryadvance.com/about',
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Visionary Advance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Visionary Advance | Eugene Web Design & SEO',
    description: 'Built on experience, designed for how businesses operate. Custom websites and business systems for Eugene & Lane County.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function AboutLayout({ children }) {
  return children
}
