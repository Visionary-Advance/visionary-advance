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
    default: "Visionary Advance - Premium Web Design That Honors Your Expertise",
    template: "%s | Visionary Advance"
  },
  description: "Premium web design and strategic SEO for professionals who refuse to settle for 'good enough.' We build websites that match the quality you deliver—custom, high-performing, and built to be found by the right clients.",
  keywords: "premium web design, professional website design, custom web development, SEO services, quality web design, construction website design, contractor web design, professional digital presence, premium SEO",
  authors: [{ name: "Visionary Advance" }],
  creator: "Visionary Advance",
  publisher: "Visionary Advance",

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionaryadvance.com',
    title: 'Visionary Advance - Premium Web Design That Honors Your Expertise',
    description: 'Your work is exceptional. Your website should reflect that. Premium web design and strategic SEO for professionals who demand quality in everything they do.',
    siteName: 'Visionary Advance',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Web Design That Honors Your Expertise',
    description: 'Web design for professionals who refuse to settle for "good enough." Built to match the quality you deliver.',
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
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17658795216"></Script>
<Script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date());

  gtag('config', 'AW-17658795216');
</Script>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}