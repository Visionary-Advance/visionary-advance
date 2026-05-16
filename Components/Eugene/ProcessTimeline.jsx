'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function ProcessTimeline({ content }) {
  const containerRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 60%'],
  })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="relative bg-[#070707] py-20 md:py-28 px-4 md:px-16 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <span className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 font-manrope font-semibold text-xs text-white/70 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008070]" />
            {content.eyebrow}
          </span>
          <h2 className="font-inter-display font-semibold text-3xl md:text-5xl text-white tracking-tight mt-5">
            {content.heading}
          </h2>
          <p className="font-manrope text-base md:text-lg text-white/60 mt-4">
            {content.sub}
          </p>
        </div>

        <div ref={containerRef} className="relative">
          {/* Desktop track */}
          <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-white/10" aria-hidden="true">
            <motion.div
              className="h-full bg-gradient-to-r from-[#008070] to-[#7c3aed]"
              style={prefersReducedMotion ? { width: '100%' } : { width: progressWidth }}
            />
          </div>

          {/* Mobile track */}
          <div className="md:hidden absolute top-0 bottom-0 left-7 w-px bg-white/10" aria-hidden="true">
            <motion.div
              className="w-full bg-gradient-to-b from-[#008070] to-[#7c3aed]"
              style={prefersReducedMotion ? { height: '100%' } : { height: progressHeight }}
            />
          </div>

          <ol className="grid md:grid-cols-4 gap-10 md:gap-6 list-none">
            {content.steps.map((step, i) => (
              <motion.li
                key={i}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
                className="relative pl-20 md:pl-0 md:text-left"
              >
                <div className="absolute md:relative md:mx-0 left-0 top-0 md:top-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#050505] border-2 border-[#008070] font-inter-display font-bold text-white text-sm">
                  {step.number}
                </div>
                <div className="md:mt-6">
                  <h3 className="font-inter-display font-semibold text-lg md:text-xl text-white">
                    {step.title}
                  </h3>
                  <p className="font-manrope text-white/60 text-sm md:text-base mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
