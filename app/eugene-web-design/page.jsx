import Link from 'next/link'
import { CheckCircle, MapPin, Phone, Mail, ArrowRight, Globe, Search, Zap, Shield, Users, Code } from 'lucide-react'
import CTA from '@/Components/CTA'

// Local Business Schema for Eugene
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://visionaryadvance.com/#organization',
  name: 'Visionary Advance',
  description: 'Professional web design and custom business systems in Eugene, Oregon. Custom websites, dashboards, and internal systems for Lane County businesses.',
  url: 'https://visionaryadvance.com',
  telephone: '+1-541-868-7019',
  email: 'info@visionaryadvance.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Eugene',
    addressRegion: 'OR',
    postalCode: '97401',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 44.0521,
    longitude: -123.0868,
  },
  areaServed: [
    { '@type': 'City', name: 'Eugene', containedInPlace: { '@type': 'State', name: 'Oregon' } },
    { '@type': 'AdministrativeArea', name: 'Lane County' },
    { '@type': 'City', name: 'Springfield' },
    { '@type': 'State', name: 'Oregon' },
  ],
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: [],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Web Design Eugene',
  description: 'Custom web design and development services for businesses in Eugene, Lane County, and Oregon.',
  provider: {
    '@id': 'https://visionaryadvance.com/#organization',
  },
  areaServed: {
    '@type': 'City',
    name: 'Eugene',
    containedInPlace: {
      '@type': 'State',
      name: 'Oregon',
    },
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Eugene Web Design Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Website Design' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO Services' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Business Systems' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Application Development' } },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does web design cost in Eugene?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom website design in Eugene typically ranges from $3,000 to $15,000+ depending on complexity, features, and requirements. Unlike template-based solutions, custom websites are built specifically for your business and workflow. We provide detailed quotes after understanding your specific needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most custom websites take 4-8 weeks from start to launch. This includes discovery, design, development, and testing. More complex projects with custom systems or integrations may take longer. We provide a clear timeline during our initial consultation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work with businesses outside Eugene?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. While we are based in Eugene and serve many Lane County businesses, we work with clients throughout Oregon and beyond. Our process works well for both local and remote collaboration.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes your web design different from other Eugene agencies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We build everything custom — no templates, no page builders. Every website and system is designed specifically for your business and workflow. We also specialize in custom business systems like dashboards and inventory management, not just websites.',
      },
    },
  ],
}

export default function EugeneWebDesignPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen pt-20 bg-[#191E1E] text-white">
        {/* Hero Section */}
        <section className="px-4 md:px-16 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-[#008070]" />
              <span className="font-manrope text-[#008070] font-semibold">Eugene, Oregon</span>
            </div>

            <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Eugene Web Design & Development
            </h1>

            <p className="font-manrope text-xl md:text-2xl text-gray-300 max-w-3xl mb-6">
              Custom websites and business systems built for Lane County businesses. No templates. No shortcuts. Built around how you work.
            </p>

            <p className="font-manrope text-lg text-gray-400 max-w-3xl mb-8">
              We're a Eugene-based web design team that builds custom websites, dashboards, and internal systems for local businesses. Whether you need a new website that actually represents your business or custom software to streamline your operations — we build it from scratch, specifically for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-[#008070] hover:bg-[#006b5d] text-white px-6 py-3 rounded transition-colors text-center font-manrope font-semibold"
              >
                Start Your Project
              </Link>
              <Link
                href="/services"
                className="border-2 border-white text-white hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded transition-colors text-center font-manrope"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="px-4 md:px-16 py-16 md:py-24 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-manrope font-semibold text-[#008070] mb-4">What We Build</p>
              <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
                Web Design Services in Eugene
              </h2>
              <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
                From custom websites to internal business systems, we build digital solutions for Eugene and Lane County businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-[#191E1E] rounded-xl border border-white/10">
                <Globe className="w-10 h-10 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Custom Website Design</h3>
                <p className="font-manrope text-gray-300 mb-4">
                  No templates. Every website is designed and coded specifically for your Eugene business, your brand, and your goals.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Mobile-responsive design
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Fast load times
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Easy content management
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-[#191E1E] rounded-xl border border-white/10">
                <Search className="w-10 h-10 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Local SEO for Eugene</h3>
                <p className="font-manrope text-gray-300 mb-4">
                  Get found by customers searching in Eugene, Springfield, and Lane County. SEO built into every website we create.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Google Business optimization
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Local keyword targeting
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Technical SEO foundation
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-[#191E1E] rounded-xl border border-white/10">
                <Code className="w-10 h-10 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Custom Business Systems</h3>
                <p className="font-manrope text-gray-300 mb-4">
                  Dashboards, inventory systems, and internal tools built around how your Eugene business actually operates.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Custom dashboards
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Inventory management
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Workflow automation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Local Section */}
        <section className="px-4 md:px-16 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-manrope font-semibold text-[#008070] mb-4">Why Eugene</p>
                <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
                  Local Web Design, Built for Local Businesses
                </h2>
                <p className="font-manrope text-lg text-gray-300 mb-6">
                  We're based in Eugene because we believe in building relationships with the businesses we serve. When you work with us, you're working with a local team that understands the Lane County market.
                </p>
                <p className="font-manrope text-lg text-gray-300 mb-8">
                  No overseas developers. No account managers. Direct communication with the people actually building your website or system.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-anton text-lg text-white mb-1">Direct Communication</h3>
                      <p className="font-manrope text-gray-400 text-sm">Work directly with the team building your project. No middlemen.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-anton text-lg text-white mb-1">Local Market Knowledge</h3>
                      <p className="font-manrope text-gray-400 text-sm">We understand Eugene, Lane County, and the Oregon business landscape.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-anton text-lg text-white mb-1">Fast Response Times</h3>
                      <p className="font-manrope text-gray-400 text-sm">Same timezone, same community. We're here when you need us.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-8 border border-white/10">
                <h3 className="font-anton text-2xl text-white mb-6">Areas We Serve</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> Eugene
                    </p>
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> Springfield
                    </p>
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> Lane County
                    </p>
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> Cottage Grove
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> Junction City
                    </p>
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> Veneta
                    </p>
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> Creswell
                    </p>
                    <p className="font-manrope text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#008070]" /> All of Oregon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="px-4 md:px-16 py-16 md:py-24 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-manrope font-semibold text-[#008070] mb-4">Our Process</p>
              <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
                How We Work With Eugene Businesses
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#008070] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-anton text-2xl text-white">1</span>
                </div>
                <h3 className="font-anton text-lg text-white mb-2">Discovery</h3>
                <p className="font-manrope text-gray-400 text-sm">
                  We learn about your business, your goals, and how you currently operate.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#008070] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-anton text-2xl text-white">2</span>
                </div>
                <h3 className="font-anton text-lg text-white mb-2">Design</h3>
                <p className="font-manrope text-gray-400 text-sm">
                  Custom design tailored to your brand and your customers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#008070] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-anton text-2xl text-white">3</span>
                </div>
                <h3 className="font-anton text-lg text-white mb-2">Build</h3>
                <p className="font-manrope text-gray-400 text-sm">
                  Clean, efficient code with SEO and performance built in.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#008070] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-anton text-2xl text-white">4</span>
                </div>
                <h3 className="font-anton text-lg text-white mb-2">Launch</h3>
                <p className="font-manrope text-gray-400 text-sm">
                  Go live with ongoing support and optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 md:px-16 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-manrope font-semibold text-[#008070] mb-4">FAQ</p>
              <h2 className="font-anton text-3xl md:text-4xl text-white">
                Eugene Web Design Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  How much does web design cost in Eugene?
                </h3>
                <p className="font-manrope text-gray-300">
                  Custom website design in Eugene typically ranges from $3,000 to $15,000+ depending on complexity, features, and requirements. Unlike template-based solutions, custom websites are built specifically for your business and workflow. We provide detailed quotes after understanding your specific needs.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  How long does it take to build a website?
                </h3>
                <p className="font-manrope text-gray-300">
                  Most custom websites take 4-8 weeks from start to launch. This includes discovery, design, development, and testing. More complex projects with custom systems or integrations may take longer. We provide a clear timeline during our initial consultation.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  Do you work with businesses outside Eugene?
                </h3>
                <p className="font-manrope text-gray-300">
                  Yes. While we're based in Eugene and serve many Lane County businesses, we work with clients throughout Oregon and beyond. Our process works well for both local and remote collaboration.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  What makes your web design different from other Eugene agencies?
                </h3>
                <p className="font-manrope text-gray-300">
                  We build everything custom — no templates, no page builders. Every website and system is designed specifically for your business and workflow. We also specialize in custom business systems like dashboards and inventory management, not just websites.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 md:px-16 py-16 md:py-24 bg-black/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
              Ready to Start Your Eugene Web Design Project?
            </h2>
            <p className="font-manrope text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's talk about your business, your goals, and what you need. No pressure, no sales pitch — just a conversation about how we can help.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <Link
                href="/contact"
                className="bg-[#008070] hover:bg-[#006b5d] text-white px-8 py-4 rounded transition-colors font-manrope font-semibold flex items-center gap-2"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
              <a href="tel:+15418687019" className="flex items-center gap-2 hover:text-[#008070] transition-colors">
                <Phone className="w-5 h-5" />
                <span className="font-manrope">541-868-7019</span>
              </a>
              <a href="mailto:info@visionaryadvance.com" className="flex items-center gap-2 hover:text-[#008070] transition-colors">
                <Mail className="w-5 h-5" />
                <span className="font-manrope">info@visionaryadvance.com</span>
              </a>
            </div>
          </div>
        </section>

        <CTA />
      </div>
    </>
  )
}
