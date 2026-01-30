import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateLocalBusinessSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.customBusinessSystems.title,
  description: SYSTEMS_PAGE_META.customBusinessSystems.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customBusinessSystems.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.customBusinessSystems.title,
    description: SYSTEMS_PAGE_META.customBusinessSystems.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customBusinessSystems.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.customBusinessSystems.title,
    description: SYSTEMS_PAGE_META.customBusinessSystems.description,
  },
}

const schema = generateLocalBusinessSchema({
  pageName: 'Custom Business Systems',
  pageUrl: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customBusinessSystems.path}`,
})

export default function CustomBusinessSystemsPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Custom Business Systems Built Around Your Workflow
          </h1>
          <p className="font-manrope text-xl md:text-2xl text-[#008070] mb-6">
            Custom systems built around your workflow — not platforms you have to adapt to.
          </p>
          <p className="font-manrope text-lg text-gray-300 max-w-3xl mb-8">
            We design custom dashboards, inventory systems, and internal software that fits your business — not the other way around. Built in Eugene, serving Lane County and Oregon.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="Map My Workflow"
            scrollTarget="lead-form"
          />
        </div>
      </section>

      {/* What We Build Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-12 text-center">
            What We Build
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/contractor-systems" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Contractor Systems
                </h3>
                <p className="font-manrope text-gray-400 text-sm">
                  Job tracking, labor management, inventory, and reporting designed for contractors.
                </p>
              </div>
            </Link>

            <Link href="/warehouse-inventory-systems" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Warehouse & Inventory
                </h3>
                <p className="font-manrope text-gray-400 text-sm">
                  Real-time inventory tracking, stock alerts, and warehouse dashboards.
                </p>
              </div>
            </Link>

            <Link href="/custom-dashboards-analytics" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Custom Dashboards
                </h3>
                <p className="font-manrope text-gray-400 text-sm">
                  Analytics and reporting dashboards that show exactly what matters to you.
                </p>
              </div>
            </Link>

            <Link href="/custom-cms-development" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Custom CMS
                </h3>
                <p className="font-manrope text-gray-400 text-sm">
                  Secure, scalable content management systems tailored to your workflow.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Custom Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-12 text-center">
            Why Custom Wins
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="font-anton text-xl text-gray-400 mb-4">Off-the-shelf Software</h3>
              <ul className="space-y-3 font-manrope text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Forces you into new workflows
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Monthly fees that never end
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Limited customization options
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Hard to scale with your business
                </li>
              </ul>
            </div>

            <div className="bg-[#008070]/10 border border-[#008070]/30 rounded-xl p-8">
              <h3 className="font-anton text-xl text-[#008070] mb-4">Visionary Advance</h3>
              <ul className="space-y-3 font-manrope text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Built around your existing process
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  One system, not five tools
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Fully custom dashboards and reports
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Scales as you grow
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
            Built in Eugene, Designed for Real Business
          </h2>
          <p className="font-manrope text-lg text-gray-300 mb-8">
            We work with Eugene and Lane County businesses who need systems that work in the real world. Modern frameworks, custom code, secure dashboards — all built with SEO in mind so your clients can find you.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <SystemsCTA
        title="Ready to Simplify Your Operations?"
        text="Free system consultation. No pressure. Just clarity."
        buttonText="Map My Workflow"
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
