'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const defaultFaqs = [
  {
    question: 'What is your design process like?',
    answer:
      'We start with a discovery call to understand your business, goals, and target audience. From there, we create wireframes, then move into full design mockups before development begins.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Most projects take 4–8 weeks from kickoff to launch, depending on complexity. We provide a detailed timeline during the proposal phase.',
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer:
      'Yes — we offer maintenance plans that include updates, performance monitoring, and priority support so your site stays fast and secure.',
  },
  {
    question: 'Can you redesign my existing website?',
    answer:
      'Absolutely. We regularly take existing sites and reimagine them with modern design, better performance, and improved conversion rates.',
  },
  {
    question: 'Do you work on websites you didn\'t build?',
    answer:
      'Yes — we work on all sites, even if we didn\'t build them. If you love your site and just want more eyes on it, we can help with SEO, performance improvements, and ongoing support.',
  },
]

export default function FAQ({ faqs = defaultFaqs }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 font-manrope font-bold text-sm text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008070]" />
            FAQ
          </span>
        </div>

        <h2 className="font-inter-display text-3xl font-bold text-black md:text-[40px] md:leading-tight mb-10">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Left — questions */}
          <div className="flex flex-1 flex-col gap-3">
            {faqs.map((faq, i) => {
              const isActive = i === activeIndex
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-[10px] px-5 py-4 text-left transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#008070] text-white'
                      : 'border border-black/30 bg-white text-black hover:border-[#008070]/50'
                  }`}
                >
                  <span className="font-inter-display text-base font-semibold md:text-lg">
                    {i + 1}. {faq.question}
                  </span>
                  <span
                    className={`ml-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-2xl font-light ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-black/5 text-black'
                    }`}
                  >
                    {isActive ? '\u2212' : '+'}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right — answer panel */}
          <div className="flex-shrink-0 rounded-[10px] border border-black/30 bg-white p-8 lg:w-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="font-inter-display text-2xl font-bold text-black md:text-[28px]">
                  Question Answer:
                </h3>
                <div className="my-5 h-px bg-black/15" />
                <p className="text-base leading-relaxed text-black/60">
                  {faqs[activeIndex].answer}
                </p>
                <Link
                  href="/about"
                  className="mt-10 inline-flex items-center justify-center rounded-lg bg-[#008070] px-8 py-4 font-manrope text-base font-bold text-white transition-colors hover:bg-[#006b5d]"
                >
                  Learn More About Us
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
