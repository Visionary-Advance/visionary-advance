import { DM_Sans, Instrument_Sans } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/Components/ConditionalLayout";
import Script from "next/script";

const dmSansReg = DM_Sans({
  variable: 'dm-sans-regular',
  subsets:['latin'],
  weight:['400'],
  style:['normal', 'italic']
})
const dmSansBold = DM_Sans({
  variable:'dm-sans-bold',
  subsets:['latin'],
  weight:['700'],
  style:['normal', 'italic']
})
const instSans = Instrument_Sans({
  variable:'dm-sans-bold',
  subsets:['latin'],
  weight:['700'],
  style:['normal', 'italic']
})

export const metadata = {
  metadataBase: new URL('https://visionaryadvance.com'),
  title: {
    default: "Custom Business Systems & SEO Web Design | Eugene, OR – Visionary Advance",
    template: "%s | Visionary Advance"
  },
  description: "Custom-built websites, dashboards, and business systems designed around how you work. Serving Eugene & Lane County businesses.",
  keywords: "custom business systems, Eugene web design, contractor management systems, warehouse inventory systems, custom dashboards, custom CMS, Lane County web development, Oregon web design, SEO services",
  authors: [{ name: "Visionary Advance" }],
  creator: "Visionary Advance",
  publisher: "Visionary Advance",

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionaryadvance.com',
    title: 'Custom Websites & Business Systems | Eugene, OR – Visionary Advance',
    description: 'Custom-built websites, dashboards, and business systems designed around how you work. Serving Eugene, Lane County & Oregon businesses.',
    siteName: 'Visionary Advance',
    images: [
      {
        url: 'https://visionaryadvance.com/Img/VaLogo_Large.png',
        width: 1200,
        height: 630,
        alt: 'Visionary Advance - Custom Websites & Business Systems',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Websites & Business Systems | Eugene, OR',
    description: 'Custom-built websites, dashboards, and business systems designed around how you work. Serving Eugene & Lane County.',
    creator: '@visionaryadvance',
    images: ['https://visionaryadvance.com/Img/VaLogo_Large.png'],
  },

  // Robots
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

  // Category
  category: 'Web Design & Development',

  // Search Engine Verification
  // Add your verification codes from Google Search Console, Bing Webmaster Tools, etc.
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || null,
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      
      <body
        className={`${instSans.variable} ${dmSansReg.variable} ${dmSansBold.variable} antialiased`}
      >
        {/* Google Ads Conversion Tracking */}
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
        {/* GA4 Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}