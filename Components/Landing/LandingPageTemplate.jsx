import { Check } from 'lucide-react'
import Link from 'next/link'
import LandingHero from '@/Components/Landing/LandingHero'
import PainPoints from '@/Components/Landing/PainPoints'
import WhyUs from '@/Components/Landing/WhyUs'
import FAQ from '@/Components/FAQ'
import TestimonialsCarousel from '@/Components/Home/TestimonialsCarousel'
import PricingSection from '@/Components/Home/PricingSection'

function IncludedSection({ heading, items }) {
  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-black leading-tight mb-12">
          {heading}
        </h2>
        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-4">
              <Check className="w-6 h-6 text-[#008070] mt-1 flex-shrink-0" />
              <span className="font-inter-display font-semibold text-lg md:text-xl text-black leading-snug">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProcessSection({ heading, steps }) {
  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-black leading-tight mb-12">
          {heading}
        </h2>
        <ol className="space-y-8 md:space-y-10">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-5 md:gap-8">
              <span className="font-inter-display font-bold text-2xl md:text-3xl text-[#008070] leading-none flex-shrink-0 w-12">
                0{i + 1}
              </span>
              <div className="flex-1 border-b border-gray-200 pb-8 md:pb-10">
                <h3 className="font-inter-display font-bold text-xl md:text-2xl text-black mb-2">
                  {step.title}
                </h3>
                <p className="font-manrope text-base md:text-lg text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FinalCTA({ headline, primaryCtaLabel, primaryCtaHref }) {
  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-5xl mx-auto bg-[#050505] rounded-3xl px-6 md:px-16 py-16 md:py-20 text-center relative overflow-hidden">
        <div className="hero-pattern opacity-50" />
        <div className="relative z-10">
          <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-white leading-tight mb-6 max-w-3xl mx-auto">
            {headline}
          </h2>
          <p className="font-manrope text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Tell us about your business and we'll send back a fixed-price plan within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryCtaHref}
              className="bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto transition-colors text-center text-lg"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href="/audit"
              className="bg-white/10 backdrop-blur border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto hover:bg-white/20 transition-colors text-center text-lg"
            >
              Run a Free Audit
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function buildSchemas(config) {
  const url = config.meta.canonical
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.serviceSchema.name,
    description: config.serviceSchema.description,
    serviceType: config.serviceSchema.serviceType,
    provider: { '@id': 'https://visionaryadvance.com/#organization' },
    areaServed: { '@type': 'Country', name: 'United States' },
    url,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://visionaryadvance.com' },
      { '@type': 'ListItem', position: 2, name: config.breadcrumbName, item: url },
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
  return [serviceSchema, breadcrumbSchema, faqSchema]
}

export default function LandingPageTemplate({ config }) {
  const { hero, painPoints, included, whyUs, process: processConfig, faqs, breadcrumbName } = config
  const schemas = buildSchemas(config)

  return (
    <main className="bg-white">
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LandingHero {...hero} />
      <PainPoints heading={painPoints.heading} items={painPoints.items} />
      <IncludedSection heading={included.heading} items={included.items} />
      <WhyUs heading={whyUs.heading} items={whyUs.items} />
      <ProcessSection heading={processConfig.heading} steps={processConfig.steps} />
      <div id="pricing">
        <PricingSection />
      </div>
      <section className="bg-white py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 font-manrope font-bold text-sm text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008070]" />
            Testimonials
          </span>
        </div>
        <TestimonialsCarousel />
      </section>
      <FAQ faqs={faqs} />
      <FinalCTA
        headline={`Ready to start your ${breadcrumbName.toLowerCase()} project?`}
        primaryCtaLabel={hero.primaryCtaLabel}
        primaryCtaHref="/contact"
      />
    </main>
  )
}
