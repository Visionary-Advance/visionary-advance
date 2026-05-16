'use client'

import Link from 'next/link'
import { Phone, Mail, ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export default function FinalCTA({ content }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative bg-[#050505] overflow-hidden py-20 md:py-28 px-4 md:px-16">
      <div className="hero-pattern opacity-60" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <h2 className="font-inter-display font-semibold text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
          {content.heading}
        </h2>
        <p className="font-manrope text-white/70 text-base md:text-xl mt-5 max-w-2xl mx-auto leading-relaxed">
          {content.sub}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
          <Link
            href={content.primaryHref}
            className="inline-flex items-center justify-center gap-2 bg-[#008070] hover:bg-[#009e89] text-white font-manrope font-semibold px-7 py-4 rounded-xl transition-colors min-h-[48px] w-full sm:w-auto"
          >
            {content.primaryLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.06] backdrop-blur border border-white/15 hover:bg-white/[0.12] text-white font-manrope font-semibold px-7 py-4 rounded-xl transition-colors min-h-[48px] w-full sm:w-auto"
          >
            Or send a message
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-10 pt-8 border-t border-white/10">
          <a
            href={content.phoneHref}
            className="group inline-flex items-center gap-2.5 font-manrope text-white/80 hover:text-white transition-colors"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#008070]/15 border border-[#008070]/30 group-hover:bg-[#008070]/25 transition-colors">
              <Phone className="w-4 h-4 text-[#008070]" />
            </span>
            <span className="font-semibold tracking-wide">{content.phone}</span>
          </a>
          <a
            href={content.emailHref}
            className="group inline-flex items-center gap-2.5 font-manrope text-white/80 hover:text-white transition-colors"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#008070]/15 border border-[#008070]/30 group-hover:bg-[#008070]/25 transition-colors">
              <Mail className="w-4 h-4 text-[#008070]" />
            </span>
            <span className="font-semibold">{content.email}</span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
