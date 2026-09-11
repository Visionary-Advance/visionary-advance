import Link from 'next/link'
import { eugeneHostingContent } from '@/lib/eugene-hosting-content'
import EugeneHero from '@/Components/Eugene/EugeneHero'
import LocalTrustBand from '@/Components/Eugene/LocalTrustBand'
import ProblemsSolutions from '@/Components/Eugene/ProblemsSolutions'
import ServicesGrid from '@/Components/Eugene/ServicesGrid'
import ProcessTimeline from '@/Components/Eugene/ProcessTimeline'
import LocalProof from '@/Components/Eugene/LocalProof'
import EugeneTestimonials from '@/Components/Eugene/EugeneTestimonials'
import EugeneFAQ from '@/Components/Eugene/EugeneFAQ'
import EugeneContactSection from '@/Components/Eugene/EugeneContactSection'
import FinalCTA from '@/Components/Eugene/FinalCTA'

export default function EugeneWebsiteHostingPage() {
  const c = eugeneHostingContent

  // Shares the #business @id with /eugene-web-design so both pages resolve to
  // one LocalBusiness entity rather than declaring two competing ones.
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://visionaryadvance.com/eugene-web-design#business',
    name: 'Visionary Advance',
    image: 'https://visionaryadvance.com/Img/VaLogo_Large.png',
    url: 'https://visionaryadvance.com/eugene-web-design',
    telephone: c.finalCta.phone,
    email: c.finalCta.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Eugene',
      addressRegion: 'OR',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'City', name: 'Eugene' },
      { '@type': 'City', name: 'Springfield' },
      { '@type': 'AdministrativeArea', name: 'Lane County' },
      { '@type': 'State', name: 'Oregon' },
    ],
    sameAs: ['https://visionaryadvance.com'],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website Hosting and Maintenance in Eugene, Oregon',
    serviceType: 'Web Hosting',
    provider: { '@id': 'https://visionaryadvance.com/eugene-web-design#business' },
    areaServed: ['Eugene, OR', 'Springfield, OR', 'Lane County, OR'],
    description: c.meta.description,
    url: c.meta.canonical,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://visionaryadvance.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Eugene Web Design',
        item: 'https://visionaryadvance.com/eugene-web-design',
      },
      { '@type': 'ListItem', position: 3, name: 'Website Hosting', item: c.meta.canonical },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  const schemas = [localBusinessSchema, serviceSchema, breadcrumbSchema, faqSchema]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="bg-[#050505]">
        <EugeneHero content={c} />
        <LocalTrustBand stats={c.trustStats} />
        <ProblemsSolutions content={c.problemsSolutions} />
        <ServicesGrid content={c.services} />
        <ProcessTimeline content={c.process} />
        <LocalProof content={c.localProof} />
        <EugeneTestimonials />
        <EugeneFAQ faqs={c.faqs} />

        {/* Sends the hub page its link back, with the anchor text each page is
            meant to own. */}
        <section className="bg-[#050505] border-t border-white/[0.06] px-4 md:px-16 py-12">
          <div className="max-w-6xl mx-auto">
            <p className="font-manrope text-sm text-white/50">
              Also for Eugene businesses:{' '}
              <Link href="/eugene-web-design" className="text-[#10b981] hover:underline">
                Eugene web design
              </Link>
              {' · '}
              <Link
                href="/affordable-small-business-website-design"
                className="text-[#10b981] hover:underline"
              >
                affordable small business websites
              </Link>
              {' · '}
              <Link href="/services/seo" className="text-[#10b981] hover:underline">
                local SEO
              </Link>
            </p>
          </div>
        </section>

        <EugeneContactSection content={c.contact} />
        <FinalCTA content={c.finalCta} />
      </main>
    </>
  )
}
