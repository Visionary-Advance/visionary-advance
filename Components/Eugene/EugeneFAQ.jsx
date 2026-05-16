'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function EugeneFAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative bg-[#050505] py-20 md:py-28 px-4 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <span className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 font-manrope font-semibold text-xs text-white/70 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008070]" />
            FAQ
          </span>
          <h2 className="font-inter-display font-semibold text-3xl md:text-5xl text-white tracking-tight mt-5">
            Common questions
          </h2>
          <p className="font-manrope text-white/60 mt-4 text-base md:text-lg">
            Quick answers about working with us on a Eugene web design project.
          </p>
        </div>

        <ul className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <li
                key={i}
                className="rounded-2xl bg-[#0a0a0a] border border-white/[0.08] overflow-hidden transition-colors hover:border-white/15"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 md:px-6 py-5 md:py-6 cursor-pointer"
                >
                  <span className="font-inter-display font-semibold text-white text-base md:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#008070] border-[#008070] rotate-45'
                        : 'bg-white/[0.04] border-white/15'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="font-manrope text-white/65 leading-relaxed px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
