import Link from 'next/link'
import { CheckCircle, MapPin, Phone, Mail, ArrowRight, Globe, Search, Zap, Shield, Users, Code, Server } from 'lucide-react'
import CTA from '@/Components/CTA'

// Local Business Schema for Eugene
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://visionaryadvance.com/#organization',
  name: 'Visionary Advance',
  description: 'Professional web design, web hosting, and custom business systems in Eugene, Oregon. Custom websites, dashboards, and internal systems for Lane County businesses.',
  url: 'https://visionaryadvance.com',
  telephone: '+1-541-321-0468',
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
  description: 'Custom web design, web hosting, and development services for businesses in Eugene, Lane County, and Oregon.',
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
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Hosting' } },
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
        text: 'We build everything custom,no templates, no page builders. Every website and system is designed specifically for your business and workflow. We also specialize in custom business systems like dashboards and inventory management, not just websites.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer web hosting in Eugene?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We provide managed web hosting for Eugene businesses with 99.9% uptime, daily backups, SSL certificates, and security monitoring. Our hosting is optimized for the custom sites we build, so your website stays fast, secure, and always online.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a web designer and a web developer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A web designer focuses on the visual layout, user experience, and branding of a website, while a web developer handles the code, functionality, and technical implementation. At Visionary Advance, we do both,every project is designed and developed in-house so your site looks great and works flawlessly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why should I hire a local Eugene web designer instead of an agency outside Oregon?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A local Eugene web designer understands the Lane County market, can meet in person, and is in your timezone for fast communication. We know the local business landscape and can tailor your website to reach customers in Eugene, Springfield, and the surrounding area.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you redesign my existing Eugene business website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. We redesign existing websites for Eugene businesses all the time. We will audit your current site, identify what is working and what is not, and build a new custom website that better represents your brand and converts more visitors into customers.',
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
              Expert Eugene Oregon Web Design & Development Services
            </h1>

            <p className="font-manrope text-xl md:text-2xl text-gray-300 max-w-3xl mb-6">
              Custom websites, <Link href="/services" className="text-[#008070] hover:underline">Eugene web hosting</Link>, and business systems built for Lane County businesses. No templates. No shortcuts. Built around how you work.
            </p>

            <p className="font-manrope text-lg text-gray-400 max-w-3xl mb-8">
              We're a Eugene, Oregon web design company that builds custom websites, hosting solutions, dashboards, and internal systems for local businesses. Whether you need a new website that actually represents your business, reliable web hosting, or custom software to streamline your operations,we build it from scratch, specifically for you.
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

            {/* Why Choose Section */}
            <div className="mt-16 pt-16 border-t border-white/10">
              <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
                Why Choose Visionary Advance for Your Eugene Web Design?
              </h2>
              <p className="font-manrope text-lg text-gray-300 mb-4">
                As a locally based Eugene, Oregon web design company, Visionary Advance understands the unique needs of businesses in the Eugene-Springfield metro area and throughout Lane County. We combine deep knowledge of the local market with modern web development expertise to deliver websites that actually drive results for your business.
              </p>
              <p className="font-manrope text-lg text-gray-300 mb-4">
                Unlike national agencies or offshore teams, we offer face-to-face collaboration, same-day communication, and a hands-on approach to every project. From local SEO strategies that put your business in front of Eugene customers to performance-optimized code that keeps your site loading fast, every detail is tailored to help you compete and grow in the Oregon market.
              </p>
              <p className="font-manrope text-lg text-gray-300">
                Whether you're a startup in the Whiteaker neighborhood, a contractor serving Lane County, or an established business on Willamette Street, our custom web design and development services are built to match your goals, your audience, and your budget. No cookie-cutter templates, no generic solutions, just expert Eugene web design crafted around how you work.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="px-4 md:px-16 py-16 md:py-24 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-manrope font-semibold text-[#008070] mb-4">What We Build</p>
              <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
                Web Design & Hosting Services in Eugene
              </h2>
              <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
                From custom websites and web hosting to internal business systems, we provide full-service web development for Eugene and Lane County businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

              <div className="p-6 bg-[#191E1E] rounded-xl border border-white/10">
                <Server className="w-10 h-10 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Eugene Web Hosting</h3>
                <p className="font-manrope text-gray-300 mb-4">
                  Managed web hosting for Eugene businesses. Fast, secure, and optimized for the custom sites we build.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    99.9% uptime guarantee
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    Daily backups
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    SSL & security monitoring
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

        {/* What Sets Us Apart Section */}
        <section className="px-4 md:px-16 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-manrope font-semibold text-[#008070] mb-4">Why Choose Us</p>
              <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
                What Sets Us Apart as a Eugene Oregon Web Design Company
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <Code className="w-8 h-8 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">100% Custom Code</h3>
                <p className="font-manrope text-gray-300">
                  Every eugene website design we deliver is hand-coded from scratch. No WordPress themes, no page builders,just clean, fast code built for your business.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <Zap className="w-8 h-8 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Built for Speed</h3>
                <p className="font-manrope text-gray-300">
                  Our oregon web design approach prioritizes performance. Your site loads fast, ranks better, and keeps visitors engaged longer than template-based alternatives.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <Search className="w-8 h-8 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">SEO From Day One</h3>
                <p className="font-manrope text-gray-300">
                  Every web design eugene oregon project includes search engine optimization from the start,proper structure, schema markup, and local SEO so customers find you.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <Server className="w-8 h-8 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Hosting You Can Trust</h3>
                <p className="font-manrope text-gray-300">
                  Our <Link href="/services" className="text-[#008070] hover:underline">Eugene web hosting</Link> is managed, monitored, and optimized. You get 99.9% uptime, daily backups, and SSL,all included so you never worry about downtime.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <Users className="w-8 h-8 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Direct Access</h3>
                <p className="font-manrope text-gray-300">
                  When you hire a web designer in Eugene through us, you talk directly to the person building your site. No ticket systems, no account managers,just real conversations.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <Globe className="w-8 h-8 text-[#008070] mb-4" />
                <h3 className="font-anton text-xl text-white mb-3">Full-Service Web Partner</h3>
                <p className="font-manrope text-gray-300">
                  As your eugene web developer, we handle everything,design, development, hosting, SEO, and ongoing maintenance. One team, one point of contact for your entire web presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 md:px-16 py-16 md:py-24 bg-black/20">
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
                  We build everything custom,no templates, no page builders. Every website and system is designed specifically for your business and workflow. We also specialize in custom business systems like dashboards and inventory management, not just websites.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  Do you offer web hosting in Eugene?
                </h3>
                <p className="font-manrope text-gray-300">
                  Yes. We provide managed web hosting for Eugene businesses with 99.9% uptime, daily backups, SSL certificates, and security monitoring. Our hosting is optimized for the custom sites we build, so your website stays fast, secure, and always online.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  What is the difference between a web designer and a web developer?
                </h3>
                <p className="font-manrope text-gray-300">
                  A web designer focuses on the visual layout, user experience, and branding of a website, while a web developer handles the code, functionality, and technical implementation. At Visionary Advance, we do both,every project is designed and developed in-house so your site looks great and works flawlessly.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  Why should I hire a local Eugene web designer instead of an agency outside Oregon?
                </h3>
                <p className="font-manrope text-gray-300">
                  A local Eugene web designer understands the Lane County market, can meet in person, and is in your timezone for fast communication. We know the local business landscape and can tailor your website to reach customers in Eugene, Springfield, and the surrounding area.
                </p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  Can you redesign my existing Eugene business website?
                </h3>
                <p className="font-manrope text-gray-300">
                  Absolutely. We redesign existing websites for Eugene businesses all the time. We'll audit your current site, identify what's working and what isn't, and build a new custom website that better represents your brand and converts more visitors into customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 md:px-16 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-anton text-3xl md:text-4xl text-white mb-6">
              Ready to Work With a Eugene Web Designer?
            </h2>
            <p className="font-manrope text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you need web design, hosting, or a custom system,let's talk about your business and your goals. No pressure, no sales pitch,just a conversation with a local Eugene web developer about how we can help.
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
              <a href="tel:+15413210468" className="flex items-center gap-2 hover:text-[#008070] transition-colors">
                <Phone className="w-5 h-5" />
                <span className="font-manrope">541-321-0468</span>
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
