import { eugenePageContent } from '@/lib/eugene-page-content'
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

export default function EugeneWebDesignPage() {
  const c = eugenePageContent

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${c.meta.canonical}#business`,
    name: 'Visionary Advance',
    image: 'https://visionaryadvance.com/Img/VaLogo_Large.png',
    url: c.meta.canonical,
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
    name: 'Eugene Web Design',
    serviceType: 'Web Design and Development',
    provider: { '@id': `${c.meta.canonical}#business` },
    areaServed: ['Eugene, OR', 'Springfield, OR', 'Lane County, OR'],
    description: c.meta.description,
    url: c.meta.canonical,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://visionaryadvance.com' },
      { '@type': 'ListItem', position: 2, name: 'Eugene Web Design', item: c.meta.canonical },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="bg-[#050505]">
        <EugeneHero content={c} />
        <LocalTrustBand stats={c.trustStats} />
        <ProblemsSolutions content={c.problemsSolutions} />
        <ServicesGrid content={c.services} />
        <ProcessTimeline content={c.process} />
        <LocalProof content={c.localProof} />
        <EugeneTestimonials />
        <EugeneFAQ faqs={c.faqs} />
        <EugeneContactSection content={c.contact} />
        <FinalCTA content={c.finalCta} />
      </main>
    </>
  )
}
