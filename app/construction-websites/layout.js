import '../globals.css'

export const metadata = {
  title: 'Construction Website Design & Development | Lead Generation Experts',
  description: 'Professional construction website design services that generate leads. SEO-optimized, mobile-responsive websites for contractors, builders, and construction companies. Get your free website audit today.',
  keywords: 'construction website design, contractor website, builder website, construction web development, contractor lead generation, construction company website, construction SEO, contractor web design',
  authors: [{ name: 'Visionary Advance' }],
  creator: 'Visionary Advance',
  publisher: 'Visionary Advance',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionaryadvance.com/construction-websites',
    title: 'Construction Website Design That Generates Leads | Visionary Advance',
    description: 'Turn your construction website into a lead-generating machine. Professional, SEO-optimized websites designed specifically for construction companies, contractors, and builders.',
    siteName: 'Visionary Advance',
    images: [
      {
        url: 'https://visionaryadvance.com/og-construction-websites.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Website Design Services',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Website Design That Generates Leads',
    description: 'Professional construction website design services. SEO-optimized, mobile-responsive websites for contractors and builders. Get more leads today.',
    images: ['https://visionaryadvance.com/og-construction-websites.jpg'],
    creator: '@visionaryadvance',
  },

  // Additional Meta Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tags (update with actual verification codes when available)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // Alternate languages (if applicable)
  alternates: {
    canonical: 'https://visionaryadvance.com/construction-websites',
  },

  // Category
  category: 'Web Design & Development',
}

export default function LandingLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://visionaryadvance.com/construction-websites" />
      </head>
       <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17658795216"
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17658795216');
          `}
        </Script>
      <body>{children}</body>
    </html>
  )
}