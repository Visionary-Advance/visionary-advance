import { DM_Sans, Instrument_Sans } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/Components/ConditionalLayout";
import ReCaptchaScript from "@/Components/ReCaptchaScript";
import AEOStructuredData from "@/Components/AEOStructuredData";
import Analytics from "@/Components/Analytics";

const dmSansReg = DM_Sans({
  variable: 'dm-sans-regular',
  subsets:['latin'],
  weight:['400'],
  style:['normal', 'italic'],
  display: 'swap',
})
const dmSansBold = DM_Sans({
  variable:'dm-sans-bold',
  subsets:['latin'],
  weight:['700'],
  style:['normal', 'italic'],
  display: 'swap',
})
const instSans = Instrument_Sans({
  variable:'inst-sans',
  subsets:['latin'],
  weight:['700'],
  style:['normal', 'italic'],
  display: 'swap',
})


export const metadata = {
  metadataBase: new URL('https://visionaryadvance.com'),
  // NOTE: do NOT set a global `alternates.canonical` here. Next.js propagates it
  // to every route that doesn't override it, which forces unrelated pages
  // (e.g. /works, /works/[slug]) to canonicalize to the homepage. Each page
  // sets its own self-referential canonical instead.
  title: {
    default: "Visionary Advance | Custom Business Systems & SEO Web Design | Eugene, OR",
    template: "%s | Visionary Advance"
  },
  description: "Expert web development, custom business systems & website design in Eugene, OR. Build a high-performing online presence. Free consultation available.",
  keywords: "custom business systems, Eugene web design, contractor management systems, warehouse inventory systems, custom dashboards, custom CMS, Lane County web development, Oregon web design, SEO services",
  authors: [{ name: "Visionary Advance" }],
  creator: "Visionary Advance",
  publisher: "Visionary Advance",

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionaryadvance.com',
    title: 'Visionary Advance | Custom Business Systems & SEO Web Design | Eugene, OR',
    description: 'Expert web development, custom business systems & website design in Eugene, OR. Build a high-performing online presence. Free consultation available.',
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
    title: 'Visionary Advance | Custom Business Systems & SEO Web Design | Eugene, OR',
    description: 'Expert web development, custom business systems & website design in Eugene, OR. Build a high-performing online presence. Free consultation available.',
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
      <head>
        <AEOStructuredData />
      </head>
      <body
        className={`${instSans.variable} ${dmSansReg.variable} ${dmSansBold.variable} antialiased`}
      >
        {/* Google Ads + GA4 — gated to public pages only (see Components/Analytics.jsx) */}
        <Analytics />
        <ReCaptchaScript />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}