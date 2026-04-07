'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import Link from 'next/link'

const projectPlans = [
  {
    name: 'Launch',
    price: '$1,000',
    priceSub: 'Starting at',
    delivery: 'One-Time | 2-3 Week Delivery',
    features: [
      'Up to 5 Pages',
      'Mobile Responsive Design',
      'Contact Form with Email Notification',
      'Basic On-Page SEO (Meta, Titles, OG Tags)',
      'Domain + Hosting Assistance',
      '1 Round of Revisions',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$2,500',
    priceSub: 'Starting at',
    delivery: 'One-Time | 4-5 Week Delivery',
    features: [
      'Everything in Launch',
      'Up to 10 Pages',
      'Custom Design (Figma Mockup Review)',
      'CMS Integration for Blog or Menu Updates',
      'Lead Capture + CRM or Email Tool Hookup',
      'Core Web Vitals + Speed Optimization',
      'Schema Markup (LocalBusiness, Services)',
      '2 Rounds of Revisions',
      '30-Day Post-Launch Support',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlight: false,
  },
  {
    name: 'Custom',
    price: "Let's Talk",
    priceSub: 'Project based pricing',
    delivery: 'Timeline Scoped per Project',
    features: [
      'Everything in Growth',
      'E-Commerce or Booking Systems',
      'Square, Jobber, or 3rd-Party Integrations',
      'Multi-Location or Multi-Language Support',
      'Custom Database or Backend Logic',
      'Advanced Automations & Workflows',
      'Unlimited Revisions Within Scope',
      '60-Day Post-Launch Support',
    ],
    cta: 'Schedule a Call',
    ctaHref: '/contact',
    highlight: false,
    showArrow: true,
  },
]

const seoPlans = [
  {
    name: 'Starter',
    price: '$300',
    period: '/ month',
    delivery: 'Up to 7-day turnaround',
    highlight: false,
    sections: [
      {
        label: 'Local SEO',
        features: [
          'Google Business Profile management',
          'On-page SEO',
          '20 keyword rankings tracked',
          'Technical SEO monitoring',
          'Monthly performance report',
        ],
      },
      {
        label: 'Maintenance',
        features: [
          'Plugin & CMS updates',
          'Uptime monitoring',
          'Minor content edits (up to 5hr/mo) with up to 7-day turnaround',
          'Monthly 30-minute strategy meeting',
        ],
      },
    ],
    cta: 'Get started',
    ctaHref: '/contact',
    showArrow: true,
  },
  {
    name: 'Growth',
    price: '$500',
    period: '/ month',
    delivery: '5-day turnaround',
    highlight: true,
    sections: [
      {
        label: 'Local SEO',
        features: [
          'Everything in Starter',
          'Citation building & cleanup',
          'On-page SEO: up to 10 pages',
          '40 keyword rankings tracked',
          '1 SEO blog post per month',
          'Backlink monitoring',
          '2-competitor tracking',
          'Schema markup implementation',
        ],
      },
      {
        label: 'Maintenance',
        features: [
          'Security updates & backups',
          'Speed optimization (quarterly)',
          'Up to 10hr/mo content edits',
          'Monthly 1-hour strategy meeting',
        ],
      },
    ],
    cta: 'Get started',
    ctaHref: '/contact',
    showArrow: true,
  },
  {
    name: 'Authority',
    price: '$1,000',
    period: '/ month',
    delivery: '24–48 hour turnaround',
    highlight: false,
    sections: [
      {
        label: 'Local SEO',
        features: [
          'Everything in Growth',
          'Unlimited on-page SEO',
          '100 keyword rankings tracked',
          '2–4 SEO blog posts per month',
          'Local link building outreach',
          'Quarterly technical SEO audit',
          '5-competitor tracking',
        ],
      },
      {
        label: 'Maintenance',
        features: [
          'Priority dev fixes included',
          'Unlimited minor content edits',
          'Bi-weekly 1-hour strategy meetings',
        ],
      },
    ],
    cta: 'Get started',
    ctaHref: '/contact',
    showArrow: true,
  },
]

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState('projects')
  const [direction, setDirection] = useState(1)
  const plans = activeTab === 'projects' ? projectPlans : seoPlans

  function handleTabChange(tab) {
    setDirection(tab === 'seo' ? 1 : -1)
    setActiveTab(tab)
  }

  return (
    <section className="relative pt-20 pb-10 md:pt-32 md:pb-13 px-4 md:px-16 bg-[#050505]">
      {/* Wave from Figma design */}
      <div className="absolute -bottom-10 lg:-bottom-30 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 540"
          preserveAspectRatio="none"
          className="w-full block"
          fill="none"
        >
          <path
            d="M1440 0L0 286.493V475.989C0 475.989 177.183 408.99 718.748 503.988C1260.31 598.986 1440 475.989 1440 475.989V0Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="720" y1="540" x2="720" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2C2C2C" />
              <stop offset="0.548077" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* PRICING watermark */}
      <p className="absolute top-8 left-1/2 -translate-x-1/2 font-inter-dispaly font-bold text-[26vw] text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent whitespace-nowrap select-none pointer-events-none leading-none">
        PRICING
      </p>

      <div className="relative max-w-6xl mx-auto">
        {/* Pill badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#008070] border border-[#008070] rounded-full px-5 py-2 font-manrope font-bold text-sm text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            Our Plans
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-anton text-4xl md:text-6xl text-white text-center leading-tight tracking-tight mb-4">
          Plans to fit{'\n'}your business needs
        </h2>
        <p className="font-manrope text-center text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10">
          We keep our pricing transparent so you know what you&apos;re getting
          before talking to us
        </p>

        {/* Tab toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl lg:ms-10 gap-4 overflow-hidden">
            <button
              onClick={() => handleTabChange('projects')}
              className={`px-6 py-3 font-manrope font-bold text-lg transition-colors rounded-xl cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#008070] text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => handleTabChange('seo')}
              className={`px-6 py-3 font-manrope font-bold text-lg transition-colors rounded-xl cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-[#008070] text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              SEO Packages
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeTab}
          custom={direction}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -50 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-6 md:p-8 flex flex-col relative h-full ${
                plan.highlight
                  ? 'bg-[#008070]'
                  : 'bg-[#1e1e1e]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#008070] font-manrope font-bold text-xs px-4 py-1 rounded-full whitespace-nowrap">
                  Most popular
                </div>
              )}

              <p className={`font-manrope font-bold text-xl mb-1 ${plan.highlight ? 'text-white' : 'text-white/50'}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-1">
                <p className="font-anton text-4xl text-white leading-none">
                  {plan.price}
                </p>
                {plan.period && (
                  <p className={`font-manrope text-sm mb-1 ${plan.highlight ? 'text-white/80' : 'text-white/50'}`}>
                    {plan.period}
                  </p>
                )}
              </div>
              <p className={`font-manrope text-sm mb-4 ${plan.highlight ? 'text-white/80' : 'text-white/50'}`}>
                {plan.delivery}
              </p>

              <div className={`border-t my-4 ${plan.highlight ? 'border-white/30' : 'border-white/10'}`} />

              {/* Sectioned features (SEO plans) */}
              {plan.sections ? (
                <div className="space-y-5 flex-1 mb-8">
                  {plan.sections.map((section) => (
                    <div key={section.label}>
                      <p className={`font-manrope font-bold text-xs uppercase tracking-widest mb-3 ${plan.highlight ? 'text-white/70' : 'text-white/40'}`}>
                        {section.label}
                      </p>
                      <ul className="space-y-2">
                        {section.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 font-manrope text-sm text-white">
                            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-[#008070]'}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                /* Flat features (Project plans) */
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 font-manrope text-sm text-white">
                      <Check className="w-4 h-4 text-[#008070] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={plan.ctaHref}
                className={`inline-flex items-center justify-center gap-2 font-manrope font-bold text-lg px-6 py-3 rounded-lg transition-colors w-full text-center ${
                  plan.highlight
                    ? 'bg-white text-[#008070] hover:bg-gray-100'
                    : 'bg-[#008070] hover:bg-[#006b5d] text-white'
                }`}
              >
                {plan.cta}
                {plan.showArrow && <ArrowUpRight className="w-5 h-5" />}
              </Link>
            </div>
          ))}
        </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
