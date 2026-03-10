import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

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

const schema = generateServiceSchema({
  serviceName: 'Custom Business Systems',
  description: SYSTEMS_PAGE_META.customBusinessSystems.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customBusinessSystems.path}`,
})

export default function CustomBusinessSystemsPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Custom Business Systems Built Around How You Actually Work
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-4">
            Most software forces you to change your workflow. We build systems that match it&mdash;dashboards, inventory tracking, job management, and internal tools designed for your operation.
          </p>
          <p className="font-manrope text-lg text-[#008070] mb-8">
            Based in Eugene. Designed for businesses that outgrew spreadsheets.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="Map My Workflow"
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
              Your team juggles five different tools that don&apos;t talk to each other
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              Critical data lives in spreadsheets that only one person understands
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              You have no real-time visibility into operations or profitability
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">&bull;</span>
              You&apos;re paying for bloated software with features you&apos;ll never use
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
            One System. Your Workflow. Zero Compromise.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Custom Dashboards</h3>
              <p className="text-gray-400 text-sm">Real-time visibility into the metrics that matter to your business.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Inventory &amp; Warehouse Systems</h3>
              <p className="text-gray-400 text-sm">Track stock, orders, and logistics with precision.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Job Tracking &amp; Management</h3>
              <p className="text-gray-400 text-sm">Monitor projects, tasks, and team performance in one place.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Client Portals</h3>
              <p className="text-gray-400 text-sm">Give your clients secure access to project status, documents, and communication.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">API Integrations</h3>
              <p className="text-gray-400 text-sm">Connect your existing tools into one unified system.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Role-Based Access</h3>
              <p className="text-gray-400 text-sm">Each team member sees exactly what they need, nothing more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Types Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-12 text-center">
            Explore Our Systems
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/contractor-systems" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-2xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Contractor Systems
                </h3>
                <p className="font-manrope text-gray-400 mb-4">
                  Job tracking, labor management, inventory, and reporting built for contractors.
                </p>
                <span className="font-manrope text-[#008070] font-semibold">Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/warehouse-inventory-systems" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-2xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Warehouse &amp; Inventory Systems
                </h3>
                <p className="font-manrope text-gray-400 mb-4">
                  Real-time inventory dashboards and warehouse management.
                </p>
                <span className="font-manrope text-[#008070] font-semibold">Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/custom-dashboards-analytics" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-2xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Custom Dashboards &amp; Analytics
                </h3>
                <p className="font-manrope text-gray-400 mb-4">
                  Role-based analytics and KPI tracking for your operation.
                </p>
                <span className="font-manrope text-[#008070] font-semibold">Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/custom-cms-development" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 h-full hover:border-[#008070]/50 transition-colors">
                <h3 className="font-anton text-2xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                  Custom CMS Development
                </h3>
                <p className="font-manrope text-gray-400 mb-4">
                  Internal content management with custom fields and permissions.
                </p>
                <span className="font-manrope text-[#008070] font-semibold">Learn More &rarr;</span>
              </div>
            </Link>
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
              <h3 className="font-anton text-xl text-gray-400 mb-4">Off-the-shelf SaaS</h3>
              <ul className="space-y-3 font-manrope text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Forces new workflows on your team
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Monthly fees for features you don&apos;t use
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Limited customization and reporting
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Your data lives on someone else&apos;s terms
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
                  One system replaces five disconnected tools
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#008070]">+</span>
                  Fully custom dashboards and reporting
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
            We work with Eugene and Lane County businesses who need systems that work in the real world. If your operation has outgrown spreadsheets and generic software, we build what comes next&mdash;custom tools designed for how your team actually works.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <SystemsCTA
        title="Let&apos;s Map Your Workflow"
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
