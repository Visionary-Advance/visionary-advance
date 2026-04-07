'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Minus, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SplitText from '@/Components/SplitText'

const services = [
  {
    title: 'Web Design',
    slug: 'web-design',
    snippet:
      'Every detail is intentional. We design websites that reflect the level of quality you deliver — no templates, no recycled layouts, no shortcuts.',
    tags: ['Custom Design', 'UI/UX', 'Mobile-First', 'Branding'],
    image: '/Img/Design.jpg',
  },
  {
    title: 'SEO & Visibility',
    slug: 'seo',
    snippet:
      "SEO isn't about traffic — it's about alignment. We build search visibility that puts you in front of the right clients: the ones who value expertise over the lowest price.",
    tags: ['Local SEO', 'Technical SEO', 'Google Business', 'Content'],
    image: '/Img/Clients.jpg',
  },
  {
    title: 'Web Development',
    slug: 'web-design',
    snippet:
      'Fast, secure, and engineered for long-term performance. From marketing sites to fully custom web apps, everything we build is designed to scale.',
    tags: ['Next.js', 'Performance', 'CMS', 'Integrations'],
    image: '/Img/coding.jpg',
  },
  {
    title: 'Business Systems',
    slug: 'business-systems',
    snippet:
      'Custom dashboards, inventory tools, job tracking, and client portals — built around how your business actually operates, not the other way around.',
    tags: ['Dashboards', 'Automation', 'Custom Tools', 'APIs'],
    image: '/Img/communication.jpg',
  },
]

const stats = [
  { value: '<2s', label: 'Load Times' },
  { value: '100%', label: 'Custom built — no templates' },
  { value: '4 wk', label: 'Avg. launch time' },
  { value: '5★', label: 'Client satisfaction' },
]

export default function ServicesPage() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="bg-white min-h-screen">

      {/* ===== HERO ===== */}
      <section className="px-4 md:px-16 pt-36 md:pt-44 pb-20 md:pb-28">
        <span className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 font-manrope font-bold text-sm text-gray-700 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-[#008070]" />
          What We Do
        </span>
        <SplitText
          text="Built for how you actually work"
          tag="h1"
          splitType="chars"
          duration={0.25}
          delay={30}
          ease="power3.out"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
          rootMargin="0px"
          textAlign="left"
          className="font-inter-display font-bold text-[clamp(48px,7vw,96px)] text-black leading-none tracking-tight mb-6"
        />
        <p className="max-w-7xl text-[clamp(1.1rem,2.5vw,2rem)] leading-snug font-semibold font-inter-display text-black">
          At Visionary Advance, our web development process is built around your business — not the other way around. As an experienced website designer, we craft custom business systems, high-performance websites, and internal tools that streamline your operations and strengthen your online presence.
        </p>
      </section>

      {/* ===== STATS ROW ===== */}
      <section className="px-4 md:px-16 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-gray-100 py-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-inter-display font-bold text-[clamp(32px,4vw,48px)] text-black leading-none">
                {stat.value}
              </p>
              <p className="font-manrope text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES ACCORDION ===== */}
      <section className="px-4 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          {services.map((service, index) => {
            const isOpen = openIndex === index
            return (
              <div key={service.title}>
                <div className="border-t border-gray-200" />
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between py-6 md:py-8 cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#008070] text-white'
                          : 'border-2 border-[#008070] text-gray-900'
                      }`}
                    >
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                    <h2 className="font-anton text-3xl md:text-5xl text-gray-900 tracking-tight">
                      {service.title}
                    </h2>
                  </div>
                  <span className={`font-manrope text-sm font-bold transition-colors hidden md:block ${isOpen ? 'text-[#008070]' : 'text-gray-400 group-hover:text-[#008070]'}`}>
                    {isOpen ? 'Close' : 'Expand'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 md:pb-14 flex flex-col md:flex-row gap-8 md:gap-12 pl-14 md:pl-[68px]">
                        {/* Text + tags + CTA */}
                        <div className="flex-1 space-y-6">
                          <p className="font-manrope text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
                            {service.snippet}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#008070] text-white font-manrope font-bold text-sm px-5 py-2 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-flex items-center gap-2 font-manrope font-bold text-[#008070] hover:text-[#006b5d] transition-colors"
                          >
                            View full service <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                        {/* Image */}
                        <div className="relative w-full md:w-80 h-56 md:h-64 flex-shrink-0">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="rounded-xl object-cover"
                            sizes="(max-width: 768px) 100vw, 320px"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
          <div className="border-t border-gray-200" />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-4 md:px-16 py-20 md:py-28 bg-[#050505]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="font-manrope font-bold text-[#008070] mb-3">Ready to build?</p>
            <h2 className="font-inter-display font-bold text-[clamp(36px,5vw,64px)] text-white leading-tight max-w-xl">
              Let's talk about what you actually need
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold text-lg px-8 py-4 rounded-lg transition-colors"
            >
              Contact Now
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-manrope font-bold text-lg px-8 py-4 rounded-lg transition-colors"
            >
              Free Website Audit
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
