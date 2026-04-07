'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  {
    title: 'Web Design',
    slug: 'web-design',
    description:
      'Every interaction, every detail, every decision is intentional. We design websites and dashboards that reflect the level of quality you deliver. No shortcuts, no recycled layouts, no compromises.',
    image: '/Img/Design.jpg',
    tags: ['Responsive', 'UI/UX', 'Branding'],
  },
  {
    title: 'SEO',
    slug: 'seo',
    description:
      "SEO isn't about traffic — it's about alignment. We build SEO into the foundation so the right clients find you first: the ones who value expertise, professionalism, and long-term partnerships.",
    image: '/Img/Clients.jpg',
    tags: ['On-Page', 'Technical', 'Local SEO'],
  },
  {
    title: 'Web Development',
    slug: 'web-design',
    description:
      'Fast, secure, and engineered for long-term performance. From modern websites to internal systems, everything we build is designed to scale as your business grows — not hold it back.',
    image: '/Img/coding.jpg',
    tags: ['Next.js', 'Performance', 'Integrations'],
  },
  {
    title: 'Systems',
    slug: 'business-systems',
    description:
      'Custom dashboards, inventory tracking, job management, and internal tools — built around your workflow, not the other way around. No bloated platforms, just solutions that fit.',
    image: '/Img/communication.jpg',
    tags: ['Dashboards', 'Automation', 'Custom Tools'],
  },
]

export default function ServicesAccordion() {
  const [expandedIndex, setExpandedIndex] = useState(-1)

  return (
    <div className="max-w-6xl mx-auto">
      {services.map((service, index) => {
        const isExpanded = expandedIndex === index
        return (
          <div key={service.title} onMouseEnter={() => setExpandedIndex(index)} onMouseLeave={() => setExpandedIndex(-1)}>
            <div className="border-t border-gray-200" />
            <Link
              href={`/services/${service.slug}`}
              className="w-full flex items-center justify-between py-6 md:py-8 cursor-pointer group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors ${
                    isExpanded
                      ? 'bg-[#008070] text-white'
                      : 'border-2 border-[#008070] text-gray-900'
                  }`}
                >
                  {isExpanded ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-anton text-3xl md:text-5xl text-gray-900 tracking-tight">
                  {service.title}
                </h3>
              </div>
            </Link>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 md:pb-12 flex flex-col md:flex-row gap-8 md:gap-12 pl-14 md:pl-17">
                    <div className="flex-1 space-y-6">
                      <p className="font-manrope text-gray-600 text-base md:text-lg leading-relaxed">
                        {service.description}
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
                    </div>
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
  )
}
