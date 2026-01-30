import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.contractorSystems.title,
  description: SYSTEMS_PAGE_META.contractorSystems.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.contractorSystems.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.contractorSystems.title,
    description: SYSTEMS_PAGE_META.contractorSystems.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.contractorSystems.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.contractorSystems.title,
    description: SYSTEMS_PAGE_META.contractorSystems.description,
  },
}

const schema = generateServiceSchema({
  serviceName: 'Custom Contractor Management Systems',
  description: SYSTEMS_PAGE_META.contractorSystems.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.contractorSystems.path}`,
})

export default function ContractorSystemsPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Custom Contractor Management Systems Built Around Your Workflow
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-4">
            Most contractor software forces you to change how you work.
          </p>
          <p className="font-manrope text-xl text-[#008070] mb-6">
            We do the opposite.
          </p>
          <p className="font-manrope text-lg text-gray-300 max-w-3xl mb-4">
            Visionary Advance builds custom contractor systems that match how your business already operates — from job tracking to inventory to reporting — all in one secure dashboard.
          </p>
          <p className="font-manrope text-lg text-gray-400 mb-8">
            Built in Eugene. Designed for real contractors.
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
          <p className="font-manrope text-lg text-gray-300 mb-6">
            Contractors come to us when:
          </p>
          <ul className="space-y-4 font-manrope text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">•</span>
              Jobs are tracked across texts, spreadsheets, and emails
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">•</span>
              Office and field teams are disconnected
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">•</span>
              Inventory runs out mid-job
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#008070] mt-1">•</span>
              There&apos;s no clear view of profitability or job status
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
            A Contractor System Designed Around Your Business
          </p>
          <p className="font-manrope text-lg text-gray-300 mb-6">
            Our contractor systems can include:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Job & Project Dashboards</h3>
              <p className="text-gray-400 text-sm">See all your jobs at a glance with real-time status updates.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Task and Labor Tracking</h3>
              <p className="text-gray-400 text-sm">Track hours, assignments, and productivity across your team.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Inventory & Materials Management</h3>
              <p className="text-gray-400 text-sm">Never run out mid-job. Track stock levels and reorder points.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Reporting & Analytics</h3>
              <p className="text-gray-400 text-sm">Understand profitability, performance, and trends at a glance.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Role-Based Access</h3>
              <p className="text-gray-400 text-sm">Office, field, and admin each see exactly what they need.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Custom CMS for Internal Updates</h3>
              <p className="text-gray-400 text-sm">Manage announcements, procedures, and documentation easily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Custom Wins Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-12 text-center">
            Why Custom Wins
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="font-anton text-xl text-gray-400 mb-4">Off-the-shelf</h3>
              <ul className="space-y-3 font-manrope text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Forces new workflows
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Monthly fees forever
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Limited reporting
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">-</span>
                  Hard to scale
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
                  Fully custom dashboards
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
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
            Local Trust
          </h2>
          <p className="font-manrope text-lg text-gray-300">
            We work with Eugene and Lane County contractors who need systems that work in the real world — not Silicon Valley demos.
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-2xl text-white mb-6">Related Services</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/custom-dashboards-analytics" className="text-[#008070] hover:underline">
              Custom Dashboards & Analytics
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/custom-cms-development" className="text-[#008070] hover:underline">
              Custom CMS Development
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/warehouse-inventory-systems" className="text-[#008070] hover:underline">
              Warehouse & Inventory Systems
            </Link>
          </div>
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
