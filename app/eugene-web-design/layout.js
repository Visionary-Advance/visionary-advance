export const metadata = {
  title: 'Eugene Web Design & Hosting | Web Designer Eugene Oregon | Visionary Advance',
  description: 'Professional web design and web hosting in Eugene, Oregon. Custom websites, SEO, and reliable hosting for Lane County businesses. Your local Eugene web developer,no templates, built around how you work.',
  keywords: 'web designer eugene, eugene web hosting, eugene web design, web design eugene oregon, eugene oregon web design, web developer eugene, oregon web design, eugene website design, Lane County web design, custom websites Eugene',
  alternates: {
    canonical: 'https://visionaryadvance.com/eugene-web-design',
  },
  openGraph: {
    title: 'Eugene Web Design & Hosting | Web Designer Eugene Oregon',
    description: 'Professional web design and web hosting in Eugene, Oregon. Custom websites, SEO, and reliable hosting for Lane County businesses. Your local Eugene web developer,no templates, built around how you work.',
    url: 'https://visionaryadvance.com/eugene-web-design',
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://visionaryadvance.com/Img/VaLogo_Large.png',
        width: 1200,
        height: 630,
        alt: 'Eugene Web Design & Hosting - Visionary Advance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eugene Web Design & Hosting | Web Designer Eugene Oregon',
    description: 'Professional web design and web hosting in Eugene, Oregon. Custom websites, SEO, and reliable hosting for Lane County businesses. Your local Eugene web developer,no templates, built around how you work.',
    images: ['https://visionaryadvance.com/Img/VaLogo_Large.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function EugeneWebDesignLayout({ children }) {
  return children
}
