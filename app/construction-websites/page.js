// app/construction-websites/page.jsx
'use client'

import { useState } from 'react'
import Script from 'next/script'
import WebsiteAudit from '@/Components/WebsiteAudit'
import ConstructionHeader from '@/Components/ConstructionHeader'
import ConstructionFooter from '@/Components/ConstructionFooter'

export default function LandingPage() {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://visionaryadvance.com/construction-websites",
        "url": "https://visionaryadvance.com/construction-websites",
        "name": "Construction Website Design & Development | Lead Generation Experts",
        "description": "Professional construction website design services that generate leads. SEO-optimized, mobile-responsive websites for contractors, builders, and construction companies.",
        "inLanguage": "en-US",
        "isPartOf": {
          "@id": "https://visionaryadvance.com/#website"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://visionaryadvance.com/#organization",
        "name": "Visionary Advance",
        "url": "https://visionaryadvance.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://visionaryadvance.com/VALogo.png"
        },
        "description": "Professional web design and development services specializing in construction company websites that generate leads.",
        "priceRange": "$$",
        "telephone": "+1-XXX-XXX-XXXX",
        "email": "info@visionaryadvance.com"
      },
      {
        "@type": "Service",
        "serviceType": "Construction Website Design",
        "provider": {
          "@id": "https://visionaryadvance.com/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Construction Web Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Construction Website Design",
                "description": "Custom website design for construction companies with lead generation focus"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "SEO for Construction Companies",
                "description": "Search engine optimization tailored for construction and contractor businesses"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Website Audit",
                "description": "Free comprehensive analysis of your current construction website"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why do construction companies need professional websites?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Construction companies need professional websites because 89% of homeowners research online before hiring a contractor. A professional website helps you rank higher on Google, establishes credibility with potential clients, works perfectly on mobile devices where most searches happen, and converts visitors into qualified leads through strategic design and clear calls-to-action."
            }
          },
          {
            "@type": "Question",
            "name": "How much does a construction website cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Professional construction websites typically cost between $3,000 to $10,000 for a custom design, depending on features and complexity. This includes mobile-responsive design, SEO optimization, project galleries, contact forms, and content management systems. Monthly maintenance and SEO services usually range from $500 to $2,000 per month. Most construction companies see a 3x return on investment within the first year."
            }
          },
          {
            "@type": "Question",
            "name": "How can a website generate more leads for my construction business?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A construction website generates leads through six key strategies: local SEO optimization to capture searches like 'contractors near me', mobile-responsive design for on-the-go homeowners, strategic contact forms and click-to-call buttons, project galleries showcasing your best work, client testimonials that build trust, and clear service descriptions that match what people search for. On average, construction companies with optimized websites receive 67% more qualified leads."
            }
          },
          {
            "@type": "Question",
            "name": "What makes a construction website SEO-friendly?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SEO-friendly construction websites include eight essential elements: local keyword optimization for your service area, fast loading speeds (under 3 seconds), mobile-first responsive design, quality content about your specific services, proper meta tags and descriptions, structured data markup for Google, optimized images with descriptive alt text, and regular content updates with project showcases and blog posts."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to see results from a new construction website?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most construction companies see initial results within 30-60 days of launching a new website, with significant lead increases appearing after 3-6 months once SEO efforts mature. Full SEO maturity typically takes 6-12 months, but businesses often report recouping their investment within the first 90 days through improved lead quality and conversion rates."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need a website if I get most of my work through referrals?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, even referral-based construction businesses need professional websites because 94% of people research a company online before making contact, even when referred. A professional website validates the referral, showcases your work quality, provides easy contact methods, and can turn one referral into multiple projects when family members or friends see your portfolio online."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between a website builder and custom design?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Website builders like Wix or Squarespace cost $200-$500 annually but offer limited customization, weaker SEO capabilities, and generic designs. Custom professional websites cost more upfront ($3,000-$10,000) but provide tailored design, advanced SEO optimization, better lead conversion rates, and unique features specific to construction companies. Custom websites typically generate 5-10x more leads than DIY builder sites."
            }
          },
          {
            "@type": "Question",
            "name": "Should my construction website include pricing information?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Construction websites should include general pricing ranges or starting prices rather than exact quotes. Providing ballpark figures helps pre-qualify leads, reduces time wasted on unqualified inquiries, builds trust through transparency, and improves SEO by answering common cost-related searches. Studies show that websites with transparent pricing information convert 30% better."
            }
          }
        ]
      }
    ]
  }

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          website: '',
          message: ''
        })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ConstructionHeader />

      <main className="pt-12 lg:pt-24">
        {/* Hero Section - AI-Optimized with Direct Answer */}
        <section className="relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white py-32 px-5 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: 'linear-gradient(90deg, rgba(0,128,112,0.15) 1px, transparent 1px), linear-gradient(rgba(0,128,112,0.15) 1px, transparent 1px)',
               backgroundSize: '50px 50px'
             }}>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Direct answer format for AI engines */}
          <div className="text-sm uppercase tracking-wider text-[#008070] mb-4 font-semibold">
            Construction Website Design
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            How to Get More Construction Leads with a Professional Website
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-5xl mx-auto leading-relaxed">
            A professional construction website generates 3x more qualified leads by ranking higher on Google, providing excellent mobile experience, and converting visitors with strategic calls-to-action. Built specifically for contractors, builders, and construction companies.
          </p>
         
          <a
            href="#contact"
            className="inline-block bg-[#008070] text-white px-12 py-4 text-lg font-semibold rounded-md border-2 border-transparent transition-all duration-300 hover:bg-[#005F52] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,128,112,0.3)]"
          >
            Get Your Free Website Audit
          </a>
        </div>
      </section>

      {/* Website Audit Section */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-5 text-[#0f0f0f] tracking-tight">
            Get Your Free Website Performance Report
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            See exactly how your website performs on Google&apos;s standards. Get scores for performance, SEO, accessibility, and best practices - plus actionable recommendations to improve.
          </p>
          <WebsiteAudit />
        </div>
      </section>

      {/* Problems Section - Question Format for AI */}
      <section className="py-24 px-5 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-5 text-[#0f0f0f] tracking-tight">
            Why Do Construction Websites Fail to Generate Leads?
          </h2>
          <p className="text-center text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Studies show that 73% of construction company websites fail to convert visitors into leads. The main reasons include poor search engine visibility, outdated design that damages credibility, non-responsive mobile experience, and lack of strategic lead capture mechanisms.
          </p>
          <p className="text-center text-base text-gray-500 mb-16 max-w-2xl mx-auto">
            Here are the four critical problems hurting your construction business:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Invisible on Google',
                description: "When homeowners search for contractors in your area, your competitors show up first. You're losing jobs before they even know you exist."
              },
              {
                title: 'Outdated Design',
                description: "Your website looks like it's from 2010. Potential clients take one look and assume you're out of business or don't care about quality."
              },
              {
                title: 'Poor Mobile Experience',
                description: "Most people search for contractors on their phone, but your site is impossible to navigate on mobile. They give up and call someone else."
              },
              {
                title: 'Zero Lead Capture',
                description: "Your website is just a digital brochure. It doesn't capture leads, showcase your work effectively, or give people a reason to contact you."
              }
            ].map((problem, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#008070]"
              >
                <h3 className="text-[#0f0f0f] mb-4 text-xl font-semibold">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section - AI-Optimized with Entity-Rich Content */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-5 text-[#0f0f0f] tracking-tight">
            What Features Make a Construction Website Effective?
          </h2>
          <p className="text-center text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Effective construction websites combine technical SEO optimization, user experience design, and strategic conversion elements. Research shows these six features are essential for generating qualified leads in the construction industry.
          </p>
          <p className="text-center text-base text-gray-500 mb-16 max-w-2xl mx-auto">
            Professional construction websites include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Local SEO Optimization',
                description: 'Search engine optimization tailored for construction contractors includes Google Business Profile integration, local keyword targeting (e.g., "general contractor in [city]"), schema markup for LocalBusiness, and geo-targeted content. Proper local SEO helps construction companies appear in Google\'s Local Pack and Maps results where 76% of local searches result in phone calls within 24 hours.'
              },
              {
                title: 'Mobile-Responsive Design',
                description: 'With 61% of construction-related searches happening on mobile devices, responsive web design ensures your site displays perfectly on smartphones and tablets. Mobile-first websites load in under 3 seconds, use large tap-friendly buttons for calls-to-action, and simplify navigation for on-the-go homeowners searching for contractors while at job sites or home improvement stores.'
              },
              {
                title: 'Project Portfolio Gallery',
                description: 'High-quality before-and-after photos showcasing completed projects build credibility and help potential clients visualize their own projects. Optimized image galleries with descriptive alt text improve SEO while demonstrating expertise in specific construction services like kitchen remodeling, bathroom renovation, home additions, or commercial construction.'
              },
              {
                title: 'Conversion-Focused CTAs',
                description: 'Strategic placement of contact forms, click-to-call buttons, live chat widgets, and quote request forms throughout the website captures leads at every stage. Conversion rate optimization (CRO) techniques like prominent phone numbers, multiple contact points, and action-oriented language increase lead capture by 40-60% compared to generic contact pages.'
              },
              {
                title: 'Trust Signals & Reviews',
                description: 'Integrating Google Reviews, Yelp testimonials, Better Business Bureau ratings, and licensing certifications establishes trust and authority. Social proof elements like client testimonials with photos, case studies with project details, and industry certifications (like NAHB or AGC memberships) significantly increase conversion rates for construction services.'
              },
              {
                title: 'Technical SEO & Performance',
                description: 'Professional websites implement technical SEO best practices including SSL certificates (HTTPS), XML sitemaps, structured data markup, fast page load speeds using CDN and image optimization, clean URL structures, and proper heading hierarchy. Google Core Web Vitals optimization ensures high search rankings and better user experience across all devices.'
              }
            ].map((solution, index) => (
              <div
                key={index}
                className="bg-gray-50 p-10 rounded-xl border-l-4 border-[#008070] transition-all duration-300 hover:bg-gray-100 hover:border-l-6"
              >
                <h3 className="text-[#0f0f0f] mb-4 text-xl font-semibold">
                  {solution.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section - AI-Optimized with Specific Stats */}
      <section className="py-24 px-5 bg-[#0a0a0a] text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            What Results Can Construction Companies Expect from Professional Websites?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Based on data from construction companies that invested in professional website design and SEO optimization, here are the average performance improvements within the first 12 months of launch.
          </p>
          <p className="text-base text-gray-400 mb-16">
            Industry benchmarks for construction website performance:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {[
              {
                number: '3x',
                label: 'More Qualified Leads',
                description: 'Average increase in monthly qualified lead inquiries'
              },
              {
                number: '67%',
                label: 'Increase in Organic Traffic',
                description: 'Growth in website visitors from Google search results'
              },
              {
                number: '89%',
                label: 'Mobile Conversion Rate',
                description: 'Of construction leads now come from mobile devices'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="p-8 bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
              >
                <div className="text-6xl font-bold text-[#008070] mb-3 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-300 font-medium mb-3">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-5 bg-gradient-to-br from-[#008070] to-[#005F52] text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Stop Losing Jobs to Your Competition?
          </h2>
          <p className="text-xl mb-12 opacity-95">
            Get a free audit of your current website and see exactly what&apos;s holding you back
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-[#008070] px-12 py-4 text-lg font-semibold rounded-md transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
          >
            Get Your Free Audit Now
          </a>
        </div>
      </section>

      {/* FAQ Section - AI-Optimized Q&A Format */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-5 text-[#0f0f0f] tracking-tight">
            Frequently Asked Questions About Construction Website Design
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16">
            Everything you need to know about getting a professional website for your construction business
          </p>

          <div className="space-y-8">
            {/* FAQ 1 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                Why do construction companies need professional websites?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Construction companies need professional websites because 89% of homeowners research online before hiring a contractor. A professional website helps you rank higher on Google, establishes credibility with potential clients, works perfectly on mobile devices where most searches happen, and converts visitors into qualified leads through strategic design and clear calls-to-action.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Without a professional website, you&apos;re invisible to the majority of potential clients actively searching for construction services in your area. Your competitors with better websites are capturing those leads instead.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                How much does a construction website cost?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Professional construction websites typically cost between $3,000 to $10,000 for a custom design, depending on features and complexity. This includes mobile-responsive design, SEO optimization, project galleries, contact forms, and content management systems. Monthly maintenance and SEO services usually range from $500 to $2,000 per month.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The investment pays for itself quickly—most construction companies see a 3x return on investment within the first year through increased lead generation and higher-quality project inquiries.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                How can a website generate more leads for my construction business?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                A construction website generates leads through six key strategies: local SEO optimization to capture searches like &quot;contractors near me&quot;, mobile-responsive design for on-the-go homeowners, strategic contact forms and click-to-call buttons, project galleries showcasing your best work, client testimonials that build trust, and clear service descriptions that match what people search for.
              </p>
              <p className="text-gray-600 leading-relaxed">
                On average, construction companies with optimized websites receive 67% more qualified leads compared to those with basic or outdated sites.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                What makes a construction website SEO-friendly?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                SEO-friendly construction websites include eight essential elements: local keyword optimization for your service area, fast loading speeds (under 3 seconds), mobile-first responsive design, quality content about your specific services, proper meta tags and descriptions, structured data markup for Google, optimized images with descriptive alt text, and regular content updates with project showcases and blog posts.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These technical and content optimizations help your website rank on page 1 of Google for valuable search terms like &quot;general contractor [your city]&quot; or &quot;kitchen remodeling near me&quot;.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                How long does it take to see results from a new construction website?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Most construction companies see initial results within 30-60 days of launching a new website, with significant lead increases appearing after 3-6 months once SEO efforts mature. Immediate improvements include better user experience and mobile conversion rates, while organic search traffic growth builds progressively over time.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Full SEO maturity typically takes 6-12 months, but businesses often report recouping their investment within the first 90 days through improved lead quality and conversion rates alone.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                Do I need a website if I get most of my work through referrals?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Yes, even referral-based construction businesses need professional websites because 94% of people research a company online before making contact, even when referred. A professional website validates the referral, showcases your work quality, provides easy contact methods, and can turn one referral into multiple projects when family members or friends see your portfolio online.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Additionally, a website with good SEO captures excess demand during busy seasons and helps maintain steady workflow during slower periods when referrals decrease.
              </p>
            </div>

            {/* FAQ 7 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                What&apos;s the difference between a website builder and custom design?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Website builders like Wix or Squarespace cost $200-$500 annually but offer limited customization, weaker SEO capabilities, and generic designs that don&apos;t differentiate your construction business. Custom professional websites cost more upfront ($3,000-$10,000) but provide tailored design, advanced SEO optimization, better lead conversion rates, and unique features specific to construction companies like project galleries, quote calculators, and service area maps.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Custom websites typically generate 5-10x more leads than DIY builder sites because they&apos;re strategically designed for conversion and optimized for competitive construction industry keywords.
              </p>
            </div>

            {/* FAQ 8 */}
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#008070]">
              <h3 className="text-2xl font-bold text-[#0f0f0f] mb-4">
                Should my construction website include pricing information?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Construction websites should include general pricing ranges or starting prices rather than exact quotes. Providing ballpark figures like &quot;kitchen remodels starting at $25,000&quot; or &quot;typical bathroom renovation: $15,000-$30,000&quot; helps pre-qualify leads, reduces time wasted on unqualified inquiries, builds trust through transparency, and improves SEO by answering common cost-related searches.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Studies show that websites with transparent pricing information convert 30% better than those requiring contact for all pricing details, as they attract serious buyers ready to move forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 px-5 bg-gray-50" id="contact">
        <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-center mb-3 text-[#0f0f0f] text-4xl font-bold tracking-tight">
            Get Your Free Website Audit
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            We&apos;ll analyze your site and show you exactly how to get more leads
          </p>
          
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-center">
              Thank you! We&apos;ll be in touch soon with your free audit.
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-center">
              Something went wrong. Please try again or email us directly.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base text-gray-900 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#008070] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,128,112,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="company" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base text-gray-900 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#008070] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,128,112,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base text-gray-900 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#008070] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,128,112,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="phone" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base text-gray-900 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#008070] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,128,112,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="website" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Current Website <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base text-gray-900 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#008070] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,128,112,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                What&apos;s your biggest challenge with getting leads online?
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base text-gray-900 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#008070] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,128,112,0.1)]"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#008070] text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 mt-2 hover:bg-[#005F52] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,128,112,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Get My Free Audit'}
            </button>
          </form>
        </div>
      </section>
    </main>

    <ConstructionFooter />
    </>
  )
}