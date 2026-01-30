import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.customDashboardsAnalytics.title,
  description: SYSTEMS_PAGE_META.customDashboardsAnalytics.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customDashboardsAnalytics.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.customDashboardsAnalytics.title,
    description: SYSTEMS_PAGE_META.customDashboardsAnalytics.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customDashboardsAnalytics.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.customDashboardsAnalytics.title,
    description: SYSTEMS_PAGE_META.customDashboardsAnalytics.description,
  },
}

const schema = generateServiceSchema({
  serviceName: 'Custom Analytics Dashboards',
  description: SYSTEMS_PAGE_META.customDashboardsAnalytics.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customDashboardsAnalytics.path}`,
})

export default function CustomDashboardsAnalyticsPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Custom Dashboards & Analytics Built for Your Business
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-4">
            We build dashboards that show what matters — job status, inventory, performance, and ROI — in one place.
          </p>
          <p className="font-manrope text-xl text-[#008070] mb-8">
            No guessing. No spreadsheet chaos. Just clarity.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="See a Dashboard Example"
            scrollTarget="lead-form"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
            What You Get
          </h2>
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Role-Based Dashboards</h3>
                <p className="text-gray-400">Each team member sees exactly what they need — owners get the big picture, managers get operational details, staff get their tasks.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Real-Time Reporting</h3>
                <p className="text-gray-400">No more waiting for weekly reports. See your data as it happens.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">KPI Tracking</h3>
                <p className="text-gray-400">Define what success looks like and track it automatically.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Marketing + Operations Attribution</h3>
                <p className="text-gray-400">Understand which marketing efforts drive real business results (where applicable).</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Owner-Ready Reports</h3>
                <p className="text-gray-400">Clean, professional reports ready for stakeholders, investors, or your own peace of mind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Trust Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
            Built in Eugene, OR
          </h2>
          <p className="font-manrope text-lg text-gray-300">
            We serve Lane County businesses who want clarity without complexity. Custom dashboards that fit your workflow, not the other way around.
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-2xl text-white mb-6">Related Services</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/contractor-systems" className="text-[#008070] hover:underline">
              Contractor Systems
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/warehouse-inventory-systems" className="text-[#008070] hover:underline">
              Warehouse & Inventory Systems
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/custom-cms-development" className="text-[#008070] hover:underline">
              Custom CMS Development
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SystemsCTA
        title="Ready for Real Visibility?"
        text="Let's talk about what you need to see to run your business better."
        buttonText="See a Dashboard Example"
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
