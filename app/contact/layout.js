import { DEFAULT_OG_IMAGE } from '@/lib/seo'

export const metadata = {
  // `absolute` opts out of the root title template so the brand isn't repeated.
  title: { absolute: 'Contact Us | Eugene Web Design | Visionary Advance' },
  description: 'Get in touch to discuss your website or custom business system project. Based in Eugene, serving Lane County & Oregon businesses.',
  alternates: {
    canonical: 'https://visionaryadvance.com/contact',
  },
  openGraph: {
    title: 'Contact Us | Eugene Web Design | Visionary Advance',
    description: 'Get in touch to discuss your website or custom business system project. Based in Eugene, serving Lane County & Oregon businesses.',
    url: 'https://visionaryadvance.com/contact',
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Visionary Advance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Eugene Web Design | Visionary Advance',
    description: 'Get in touch to discuss your website or custom system project. Eugene, Lane County & Oregon.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function ContactLayout({ children }) {
  return children
}
