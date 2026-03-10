import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.hosting.title,
  description: SYSTEMS_PAGE_META.hosting.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.hosting.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.hosting.title,
    description: SYSTEMS_PAGE_META.hosting.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.hosting.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.hosting.title,
    description: SYSTEMS_PAGE_META.hosting.description,
  },
}

const schema = generateServiceSchema({
  serviceName: 'Managed Web Hosting & Support',
  description: SYSTEMS_PAGE_META.hosting.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.hosting.path}`,
})

export default function HostingPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Managed Hosting and Support You Never Have to Think About
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-4">
            Your website should just work.
          </p>
          <p className="font-manrope text-xl text-[#008070] mb-6">
            Fast, secure, and always online&mdash;without you worrying about the technical details.
          </p>
          <p className="font-manrope text-lg text-gray-300 max-w-3xl mb-4">
            Visionary Advance handles your hosting infrastructure so you can focus on running your business. Reliable uptime, proactive monitoring, and real support when you need it.
          </p>
          <p className="font-manrope text-lg text-gray-400 mb-8">
            Based in Eugene. Real support from real people.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="Get Reliable Hosting"
            scrollTarget="lead-form"
          />
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
            The Problem
          </h2>
          <p className="font-manrope text-lg text-gray-300 mb-6">
            Businesses come to us when:
          </p>
          <ul className="space-y-4 font-manrope text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              Your website loads slowly and you&apos;re not sure why
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              You have no idea if your site is secure or backed up
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              When something breaks, you&apos;re on hold with a call center
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              You&apos;re spending time on server management instead of running your business
            </li>
          </ul>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-4">
            The Solution
          </h2>
          <p className="font-manrope text-xl text-[#008070] mb-8">
            Hosting Infrastructure Built for Performance and Peace of Mind
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">99.9% Uptime Guarantee</h3>
              <p className="text-gray-400 text-sm">Your website stays online and available when your clients need it.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Security & SSL</h3>
              <p className="text-gray-400 text-sm">Advanced security monitoring, firewalls, and free SSL certificates.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Daily Automated Backups</h3>
              <p className="text-gray-400 text-sm">Your data is safe, secure, and recoverable at any point.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Performance Monitoring</h3>
              <p className="text-gray-400 text-sm">Proactive monitoring catches issues before they affect your visitors.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Software Updates</h3>
              <p className="text-gray-400 text-sm">Core updates handled by our team so nothing falls behind.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Priority Technical Support</h3>
              <p className="text-gray-400 text-sm">Direct access to our Eugene-based team when you need help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
            What You Get
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">SSD Hosting</h3>
              <p className="text-gray-400 text-sm">High-performance solid-state hosting for fast load times.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Security Scans</h3>
              <p className="text-gray-400 text-sm">Continuous threat detection and malware prevention.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Performance Audits</h3>
              <p className="text-gray-400 text-sm">Regular speed and optimization reviews.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Dedicated Support</h3>
              <p className="text-gray-400 text-sm">Priority access to our local technical team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Managed Hosting Wins Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-12 text-center">
            Why Managed Hosting Wins
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="font-anton text-xl text-gray-400 mb-4">Shared Hosting / DIY</h3>
              <ul className="space-y-3 font-manrope text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Slow servers shared with hundreds of sites
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Generic support from overseas call centers
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  You manage updates and security yourself
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  No monitoring until something breaks
                </li>
              </ul>
            </div>

            <div className="bg-[#008070]/10 border border-[#008070]/30 rounded-xl p-8">
              <h3 className="font-anton text-xl text-[#008070] mb-4">Visionary Advance</h3>
              <ul className="space-y-3 font-manrope text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Dedicated resources for consistent performance
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Local Eugene team you can actually talk to
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  We handle all updates and security proactively
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  24/7 monitoring catches problems before you notice
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Local Trust Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
            Local Trust
          </h2>
          <p className="font-manrope text-lg text-gray-300">
            Real human support from a team in Eugene&mdash;not a ticket number at a faceless corporation. When you need help, you talk to the people who actually manage your hosting.
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-2xl text-white mb-6">Related Services</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/custom-websites" className="text-[#008070] hover:underline">
              Custom Websites
            </Link>
            <span className="text-gray-600">&bull;</span>
            <Link href="/seo-services" className="text-[#008070] hover:underline">
              SEO Services
            </Link>
            <span className="text-gray-600">&bull;</span>
            <Link href="/custom-business-systems" className="text-[#008070] hover:underline">
              Custom Business Systems
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SystemsCTA
        title="Let&apos;s Keep Your Site Running Right"
        text="Free hosting consultation. No pressure. Just clarity."
        buttonText="Get Reliable Hosting"
        scrollTarget="lead-form"
      />

      {/* Lead Form */}
      <SystemsLeadForm />

      {/* Footer Link */}
      <section className="py-8 px-4 md:px-16 text-center">
        <p className="font-manrope text-gray-400">
          Have questions? <Link href="/contact" className="text-[#008070] hover:underline">Contact us directly</Link>
        </p>
      </section>
    </>
  )
}
