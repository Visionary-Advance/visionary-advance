import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.customCmsDevelopment.title,
  description: SYSTEMS_PAGE_META.customCmsDevelopment.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customCmsDevelopment.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.customCmsDevelopment.title,
    description: SYSTEMS_PAGE_META.customCmsDevelopment.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customCmsDevelopment.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.customCmsDevelopment.title,
    description: SYSTEMS_PAGE_META.customCmsDevelopment.description,
  },
}

const schema = generateServiceSchema({
  serviceName: 'Custom CMS Development',
  description: SYSTEMS_PAGE_META.customCmsDevelopment.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.customCmsDevelopment.path}`,
})

export default function CustomCmsDevelopmentPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Custom CMS Development for Internal Systems
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-4">
            If WordPress or off-the-shelf CMS platforms don&apos;t fit your workflow, we build a custom CMS tailored to your operation.
          </p>
          <p className="font-manrope text-lg text-[#008070] mb-8">
            Manage data, users, workflows, and content securely — without unnecessary complexity.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="Talk to a Developer"
            scrollTarget="lead-form"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
            What We Build
          </h2>
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Secure Admin Access</h3>
                <p className="text-gray-400">Protected dashboards with authentication and authorization built in from day one.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Role-Based Permissions</h3>
                <p className="text-gray-400">Control who sees what. Admins, editors, viewers — each with appropriate access levels.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Custom Fields + Workflows</h3>
                <p className="text-gray-400">Your CMS, your fields, your processes. Not someone else&apos;s idea of how you should work.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Audit Logs (Recommended)</h3>
                <p className="text-gray-400">Track who changed what and when. Essential for compliance and accountability.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <span className="text-[#008070] text-2xl">•</span>
              <div>
                <h3 className="font-semibold text-white mb-1">API-Ready Architecture</h3>
                <p className="text-gray-400">Built to integrate with other systems. Your CMS as a data hub, not a silo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Custom CMS Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
            Why Custom CMS?
          </h2>
          <div className="space-y-6 font-manrope text-gray-300">
            <p>
              Off-the-shelf platforms like WordPress are great for blogs and simple websites. But when you need to manage internal data, workflows, or custom content structures, they fall short.
            </p>
            <p>
              A custom CMS means you get exactly what you need — no bloated plugins, no fighting against the platform, no security headaches from outdated themes.
            </p>
            <p className="text-[#008070]">
              Just a clean, fast, secure system built around how your team actually works.
            </p>
          </div>
        </div>
      </section>

      {/* Local Trust Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
            Built in Eugene, OR
          </h2>
          <p className="font-manrope text-lg text-gray-300">
            We work with Lane County businesses who need more than WordPress can offer. Custom solutions built with modern frameworks for speed, security, and scalability.
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
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
            <Link href="/custom-dashboards-analytics" className="text-[#008070] hover:underline">
              Custom Dashboards & Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SystemsCTA
        title="Need Something Custom?"
        text="Let's discuss what you need to manage and how we can make it simple."
        buttonText="Talk to a Developer"
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
