import Link from 'next/link'
import SchemaJsonLd from '@/Components/SchemaJsonLd'
import SystemsCTA from '@/Components/SystemsCTA'
import SystemsLeadForm from '@/Components/SystemsLeadForm'
import { generateServiceSchema, SYSTEMS_PAGE_META } from '@/lib/seo'

export const metadata = {
  title: SYSTEMS_PAGE_META.warehouseInventorySystems.title,
  description: SYSTEMS_PAGE_META.warehouseInventorySystems.description,
  alternates: {
    canonical: `https://visionaryadvance.com${SYSTEMS_PAGE_META.warehouseInventorySystems.path}`,
  },
  openGraph: {
    title: SYSTEMS_PAGE_META.warehouseInventorySystems.title,
    description: SYSTEMS_PAGE_META.warehouseInventorySystems.description,
    url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.warehouseInventorySystems.path}`,
    siteName: 'Visionary Advance',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SYSTEMS_PAGE_META.warehouseInventorySystems.title,
    description: SYSTEMS_PAGE_META.warehouseInventorySystems.description,
  },
}

const schema = generateServiceSchema({
  serviceName: 'Custom Inventory & Warehouse Management Systems',
  description: SYSTEMS_PAGE_META.warehouseInventorySystems.description,
  url: `https://visionaryadvance.com${SYSTEMS_PAGE_META.warehouseInventorySystems.path}`,
})

export default function WarehouseInventorySystemsPage() {
  return (
    <>
      <SchemaJsonLd schema={schema} />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-32 pb-16 px-4 md:px-16 bg-gradient-to-b from-[#191E1E] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Custom Inventory & Warehouse Systems Built for Real Operations
          </h1>
          <p className="font-manrope text-xl text-gray-300 mb-6">
            Spreadsheets break when warehouses grow.
          </p>
          <p className="font-manrope text-lg text-gray-300 max-w-3xl mb-8">
            We build custom inventory and warehouse management systems that give you real-time visibility into stock, movement, and performance — all from one dashboard.
          </p>
          <SystemsCTA
            variant="hero"
            buttonText="Get a System Plan"
            scrollTarget="lead-form"
          />
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
            Warehouse Pain Points
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="font-manrope text-gray-300">Inventory counts are never accurate</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="font-manrope text-gray-300">No real-time reporting</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="font-manrope text-gray-300">Manual updates waste hours</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="font-manrope text-gray-300">No clear analytics for forecasting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl text-white mb-4">
            Custom Warehouse Systems
          </h2>
          <p className="font-manrope text-lg text-gray-300 mb-8">
            Our systems can include:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Inventory Tracking</h3>
              <p className="text-gray-400 text-sm">Real-time visibility into every item in your warehouse.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Stock Movement Logs</h3>
              <p className="text-gray-400 text-sm">Track every in and out with complete audit trails.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Low-Stock Alerts</h3>
              <p className="text-gray-400 text-sm">Automatic notifications before you run out.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Warehouse Dashboards</h3>
              <p className="text-gray-400 text-sm">Visual overview of your entire operation at a glance.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Analytics & Forecasting</h3>
              <p className="text-gray-400 text-sm">Predict demand and optimize ordering with data.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Custom CMS for Internal Updates</h3>
              <p className="text-gray-400 text-sm">Manage procedures, documentation, and team communication.</p>
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
            Designed and built in Eugene for Lane County warehouses and distributors.
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
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
            <Link href="/contractor-systems" className="text-[#008070] hover:underline">
              Contractor Systems
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SystemsCTA
        title="Replace Spreadsheets With a System That Works"
        text="Free consultation to map out your inventory needs."
        buttonText="Get a System Plan"
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
