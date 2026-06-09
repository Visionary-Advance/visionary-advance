// app/works/layout.js
// The /works page is a client component, so its metadata (incl. self-referential
// canonical) lives here to keep it out of the sitemap's non-canonical list.

const OG_IMAGE = 'https://visionaryadvance.com/Img/VaLogo_Large.png'

export const metadata = {
  title: 'Our Work | Web Design & Build Portfolio | Eugene, OR',
  description:
    'See custom websites, SEO, and business systems we have built for Eugene and Lane County businesses — real projects, real results.',
  alternates: { canonical: 'https://visionaryadvance.com/works' },
  openGraph: {
    title: 'Our Work | Web Design & Build Portfolio | Eugene, OR',
    description:
      'See custom websites, SEO, and business systems we have built for Eugene and Lane County businesses — real projects, real results.',
    url: 'https://visionaryadvance.com/works',
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Visionary Advance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Work | Web Design & Build Portfolio | Eugene, OR',
    description:
      'See custom websites, SEO, and business systems we have built for Eugene and Lane County businesses.',
    images: [OG_IMAGE],
  },
}

export default function WorksLayout({ children }) {
  return children
}
