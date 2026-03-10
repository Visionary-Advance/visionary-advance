import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.seoServices.title,
  description: SYSTEMS_PAGE_META.seoServices.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.seoServices.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.seoServices.title,
    description: SYSTEMS_PAGE_META.seoServices.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.seoServices.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.seoServices.title,
    description: SYSTEMS_PAGE_META.seoServices.description,
  },
}

const schema = generateServiceSchema({
  serviceName: 'SEO Services',
  description: SYSTEMS_PAGE_META.seoServices.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.seoServices.path}`,
})

export default function SeoServicesPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Strategic SEO That Brings the Right Clients to You
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-4">
            Most SEO companies chase vanity metrics.
          </p>
          <p className="font-manrope text-xl text-[#008070] mb-6">
            We focus on positioning you in front of people searching for quality and expertise.
          </p>
          <p className="font-manrope text-lg text-gray-300 max-w-3xl mb-4">
            Visionary Advance builds SEO strategies that drive real leads&mdash;not just traffic. Local SEO, technical optimization, and content strategy designed for businesses that want to be found by the right audience.
          </p>
          <p className="font-manrope text-lg text-gray-400 mb-8">
            Based in Eugene. Built for businesses that want to dominate their market.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="Get Your SEO Strategy"
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
              Your competitors show up on Google. You don&apos;t.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              You&apos;re spending money on ads but getting no organic traffic
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              Your website exists, but nobody can find it
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              Cheap SEO packages promised results and delivered nothing
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
            SEO Built on Strategy, Not Shortcuts
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Local SEO</h3>
              <p className="text-gray-400 text-sm">Dominate Eugene, Lane County, and Oregon searches with targeted local optimization.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Technical SEO</h3>
              <p className="text-gray-400 text-sm">Fast load times, clean code structure, proper indexing, and crawlability.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Content Strategy</h3>
              <p className="text-gray-400 text-sm">Strategic content that answers what your ideal clients are searching for.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Google Business Optimization</h3>
              <p className="text-gray-400 text-sm">Maximize your visibility in map packs and local search results.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">On-Page Optimization</h3>
              <p className="text-gray-400 text-sm">Meta tags, headings, internal linking, and keyword placement done right.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Ongoing Improvements</h3>
              <p className="text-gray-400 text-sm">SEO isn&apos;t a one-time project. We monitor, adapt, and improve continuously.</p>
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
              <h3 className="font-semibold text-white mb-2">Keyword Research</h3>
              <p className="text-gray-400 text-sm">High-intent search terms specific to your industry and location.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Monthly Reporting</h3>
              <p className="text-gray-400 text-sm">Transparent insights into rankings, traffic, and lead generation.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">SEO Audits</h3>
              <p className="text-gray-400 text-sm">Comprehensive technical audits to uncover and fix performance issues.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Dedicated Support</h3>
              <p className="text-gray-400 text-sm">Direct access to the people doing the work, not an account manager.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Strategic SEO Wins Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-12 text-center">
            Why Strategic SEO Wins
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="font-anton text-xl text-gray-400 mb-4">Cheap SEO Packages</h3>
              <ul className="space-y-3 font-manrope text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Black-hat tactics that risk penalties
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Generic keyword stuffing
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Set-it-and-forget-it approach
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  No transparency or reporting
                </li>
              </ul>
            </div>

            <div className="bg-[#008070]/10 border border-[#008070]/30 rounded-xl p-8">
              <h3 className="font-anton text-xl text-[#008070] mb-4">Visionary Advance</h3>
              <ul className="space-y-3 font-manrope text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  White-hat strategies built for long-term growth
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Natural keyword integration with real content
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Continuous monitoring and adaptation
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Clear monthly reporting and direct communication
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
            We understand the Eugene market and local search trends. As a local business ourselves, we know what it takes to connect with customers in Lane County and across Oregon.
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
        title="Let&apos;s Get You Found"
        text="Free SEO consultation. No pressure. Just clarity."
        buttonText="Get Your SEO Strategy"
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
