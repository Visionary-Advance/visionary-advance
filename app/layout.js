import { DM_Sans, Instrument_Sans } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/Components/ConditionalLayout";

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
    default: "Visionary Advance - Web Design & Development for Growing Businesses",
    template: "%s | Visionary Advance"
  },
  description: "Professional web design and development services specializing in high-converting websites for construction companies, contractors, and service businesses. Custom solutions that drive leads and growth.",
  keywords: "web design, web development, construction websites, contractor websites, lead generation, custom websites, responsive design, SEO optimization",
  authors: [{ name: "Visionary Advance" }],
  creator: "Visionary Advance",
  publisher: "Visionary Advance",

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionaryadvance.com',
    title: 'Visionary Advance - Web Design & Development',
    description: 'Professional web design and development services that drive results for construction companies and service businesses.',
    siteName: 'Visionary Advance',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Visionary Advance - Web Design & Development',
    description: 'Professional web design and development services for growing businesses.',
    creator: '@visionaryadvance',
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${instSans.variable} ${dmSansReg.variable} ${dmSansBold.variable} antialiased`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}