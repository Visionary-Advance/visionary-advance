import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.customWebsites.title,
  description: SYSTEMS_PAGE_META.customWebsites.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customWebsites.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.customWebsites.title,
    description: SYSTEMS_PAGE_META.customWebsites.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customWebsites.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.customWebsites.title,
    description: SYSTEMS_PAGE_META.customWebsites.description,
  },
}

const schema = generateServiceSchema({
  serviceName: 'Custom Website Design & Development',
  description: SYSTEMS_PAGE_META.customWebsites.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customWebsites.path}`,
})

export default function CustomWebsitesPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Custom Websites Designed and Built Around Your Business
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-4">
            No templates. No page builders. Every site custom-coded from the ground up.
          </p>
          <p className="font-manrope text-xl text-[#008070] mb-6">
            Your business is unique. Your website should be too.
          </p>
          <p className="font-manrope text-lg text-gray-300 max-w-3xl mb-4">
            Visionary Advance builds custom websites that are fast, search-optimized, and designed to convert visitors into customers.
          </p>
          <p className="font-manrope text-lg text-gray-400 mb-8">
            Based in Eugene. Built for businesses that take their online presence seriously.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="Start Your Project"
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
          <ul className="space-y-4 font-manrope text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              Your website looks like every other business in your industry
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              Slow load times are costing you visitors and search rankings
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              Template limitations force you into workarounds and compromises
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              You&apos;re paying for a website that doesn&apos;t actually represent your business
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
            A Website Engineered for Your Business
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Custom Design & Development</h3>
              <p className="text-gray-400 text-sm">Every element designed specifically for your brand and workflow.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Mobile-First Architecture</h3>
              <p className="text-gray-400 text-sm">Flawless experience on every device, not a desktop site squeezed onto a phone.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Performance Optimized</h3>
              <p className="text-gray-400 text-sm">Sub-second load times with clean, efficient code.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">SEO Built Into the Foundation</h3>
              <p className="text-gray-400 text-sm">Structured and coded for search engines from day one.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Easy Content Management</h3>
              <p className="text-gray-400 text-sm">Update your own content without touching code.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Scalable & Future-Proof</h3>
              <p className="text-gray-400 text-sm">Built to grow with your business, not hold it back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
            What We Build
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Business Websites</h3>
              <p className="text-gray-400 text-sm">Professional online presence that converts visitors into clients.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Landing Pages</h3>
              <p className="text-gray-400 text-sm">High-converting pages designed for specific campaigns and goals.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">E-Commerce</h3>
              <p className="text-gray-400 text-sm">Secure, fast online stores built around your product workflow.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Industry-Specific Sites</h3>
              <p className="text-gray-400 text-sm">Construction, professional services, local businesses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Custom Wins Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-12 text-center">
            Why Custom Wins
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="font-anton text-xl text-gray-400 mb-4">Off-the-shelf / Templates</h3>
              <ul className="space-y-3 font-manrope text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Cookie-cutter design
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Bloated code and slow loads
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Limited SEO control
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Platform lock-in and monthly fees
                </li>
              </ul>
            </div>

            <div className="bg-[#008070]/10 border border-[#008070]/30 rounded-xl p-8">
              <h3 className="font-anton text-xl text-[#008070] mb-4">Visionary Advance</h3>
              <ul className="space-y-3 font-manrope text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  One-of-a-kind design for your brand
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Clean code and sub-second performance
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  SEO architecture built from scratch
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  You own everything we build
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
            We work with Eugene and Lane County businesses who need websites that work in the real world&mdash;not just look good in a mockup.
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-2xl text-white mb-6">Related Services</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/seo-services" className="text-[#008070] hover:underline">
              SEO Services
            </Link>
            <span className="text-gray-600">&bull;</span>
            <Link href="/hosting" className="text-[#008070] hover:underline">
              Hosting & Support
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
        title="Let&apos;s Build Something That Works"
        text="Free consultation. No pressure. Just clarity."
        buttonText="Start Your Project"
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
