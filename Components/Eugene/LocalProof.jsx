'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function LocalProof({ content }) {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505] overflow-hidden py-20 md:py-28 px-4 md:px-16"
    >
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Copy */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 font-manrope font-semibold text-xs text-white/70 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008070]" />
            {content.eyebrow}
          </span>
          <h2 className="font-inter-display font-semibold text-3xl md:text-5xl text-white tracking-tight mt-5 leading-[1.1]">
            {content.heading}
          </h2>
          <p className="font-manrope text-base md:text-lg text-white/65 mt-5 leading-relaxed">
            {content.body}
          </p>
          <ul className="mt-7 space-y-3">
            {content.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 font-manrope text-white/80 text-sm md:text-base">
                <Check className="w-5 h-5 flex-shrink-0 text-[#008070] mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Image with parallax */}
        <div className="relative aspect-[4/5] md:aspect-[4/4] rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
          <motion.div
            style={prefersReducedMotion ? {} : { y: imageY }}
            className="absolute inset-0 -top-[8%] -bottom-[8%]"
          >
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          {/* Top + bottom fade for legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0) 25%, rgba(5,5,5,0) 75%, rgba(5,5,5,0.8) 100%)',
            }}
          />
          {/* Credit */}
          <p className="absolute bottom-3 right-4 text-[10px] font-manrope text-white/40 uppercase tracking-wider">
            {content.imageCredit}
          </p>
          {/* Floating tag */}
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-black/60 backdrop-blur border border-white/15 rounded-full px-3 py-1.5 text-xs font-manrope font-semibold text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            Eugene, Oregon
          </div>
        </div>
      </div>
    </section>
  )
}
