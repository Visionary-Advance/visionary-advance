export const metadata = {
  title: 'Eugene Web Design & Development | Custom Websites | Visionary Advance',
  description: 'Professional web design in Eugene, Oregon. Custom websites and business systems built for Lane County businesses. No templates — built around how you work.',
  keywords: 'Eugene web design, web designer Eugene, Eugene website designer, Lane County web design, Eugene web developer, Oregon web design, Eugene Oregon website design, custom websites Eugene',
  alternates: {
    canonical: 'https://visionaryadvance.com/eugene-web-design',
  },
  openGraph: {
    title: 'Eugene Web Design & Development | Custom Websites',
    description: 'Professional web design in Eugene, Oregon. Custom websites and business systems built for Lane County businesses. No templates — built around how you work.',
    url: 'https://visionaryadvance.com/eugene-web-design',
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://visionaryadvance.com/Img/VaLogo_Large.png',
        width: 1200,
        height: 630,
        alt: 'Eugene Web Design - Visionary Advance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eugene Web Design & Development | Custom Websites',
    description: 'Professional web design in Eugene, Oregon. Custom websites for Lane County businesses.',
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
