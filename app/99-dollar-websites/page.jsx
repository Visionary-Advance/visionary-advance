import { ninetyNineData } from '@/lib/ninety-nine-data'
import { landingPageMetadata } from '@/lib/seo'
import LandingHero from '@/Components/Landing/LandingHero'
import PainPoints from '@/Components/Landing/PainPoints'
import WhyUs from '@/Components/Landing/WhyUs'
import WhatChanges from '@/Components/Landing/NinetyNine/WhatChanges'
import HowFast from '@/Components/Landing/NinetyNine/HowFast'
import PriceCard from '@/Components/Landing/NinetyNine/PriceCard'
import FinalCTA from '@/Components/Landing/NinetyNine/FinalCTA'
import TestimonialsCarousel from '@/Components/Home/TestimonialsCarousel'
import FAQ from '@/Components/FAQ'

const {
  meta,
  hero,
  painPoints,
  whatChanges,
  howFast,
  whyUs,
  pricing,
  faqs,
  finalCta,
} = ninetyNineData

export const metadata = landingPageMetadata(meta)

// This page is deliberately NOT built on LandingPageTemplate. That template's
// spine is a "what's included" checklist plus the $1,000/$2,500 project pricing
// block — both of which work against a page whose entire job is to sell the
// outcome of a $99/mo subscription. Shared section components are reused where
// their shape fits; the rest live in Components/Landing/NinetyNine/.

// Product/Offer is the schema that matters on a price-anchored URL — it's what
// lets the $99 surface in rich results. The `buildSchemas` helper inside
// LandingPageTemplate isn't exported, so its shape is mirrored here rather than
// refactoring a file five live pages depend on.
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '$99/month Small Business Website',
  description:
    'A professionally built and maintained small business website for $99 per month, with no setup fee and no contract.',
  brand: { '@type': 'Brand', name: 'Visionary Advance' },
  url: meta.canonical,
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: meta.canonical,
    seller: { '@id': 'https://visionaryadvance.com/#organization' },
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '99',
      priceCurrency: 'USD',
      billingDuration: 1,
      billingIncrement: 1,
      unitCode: 'MON',
    },
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://visionaryadvance.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '$99 Websites',
      item: meta.canonical,
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

const schemas = [productSchema, breadcrumbSchema, faqSchema]

export default function NinetyNineDollarWebsitesPage() {
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

      <WhatChanges
        heading={whatChanges.heading}
        intro={whatChanges.intro}
        items={whatChanges.items}
      />

      <HowFast
        heading={howFast.heading}
        intro={howFast.intro}
        steps={howFast.steps}
      />

      <WhyUs heading={whyUs.heading} items={whyUs.items} />

      <div id="pricing">
        <PriceCard {...pricing} />
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

      <FinalCTA {...finalCta} />
    </main>
  )
}
