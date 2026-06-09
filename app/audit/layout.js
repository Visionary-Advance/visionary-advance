// app/audit/layout.js
const OG_IMAGE = 'https://visionaryadvance.com/Img/VaLogo_Large.png'

export const metadata = {
  // Brand suffix is added by the root layout's title template, so it is omitted here.
  title: 'Free Website Audit | Check Your Site Performance',
  description: 'Get a free website audit powered by Google Lighthouse. Check your site\'s performance, SEO, accessibility, and best practices scores instantly.',
  alternates: { canonical: 'https://visionaryadvance.com/audit' },
  openGraph: {
    title: 'Free Website Audit | Check Your Site Performance',
    description: 'Get a free website audit powered by Google Lighthouse. Check your site\'s performance, SEO, accessibility, and best practices scores instantly.',
    url: 'https://visionaryadvance.com/audit',
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Visionary Advance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Audit | Check Your Site Performance',
    description: 'Get a free website audit powered by Google Lighthouse. Check your site\'s performance, SEO, accessibility, and best practices scores instantly.',
    images: [OG_IMAGE],
  },
}

export default function AuditLayout({ children }) {
  return children
}
