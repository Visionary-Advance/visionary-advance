'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { X, Check } from 'lucide-react'

export default function ProblemsSolutions({ content }) {
  const prefersReducedMotion = useReducedMotion()

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  }

  return (
    <section className="relative bg-[#050505] py-20 md:py-28 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 font-manrope font-semibold text-xs text-white/70 uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#008070]" />
            {content.eyebrow}
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="font-inter-display font-semibold text-3xl md:text-5xl text-white tracking-tight mt-5"
          >
            {content.heading}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="font-manrope text-base md:text-lg text-white/60 mt-4"
          >
            {content.sub}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          {/* Problems */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 font-manrope font-semibold text-red-400/80 text-xs uppercase tracking-wider mb-6"
            >
              <span className="w-6 h-px bg-red-400/40" />
              Before
            </motion.div>
            <div className="space-y-3">
              {content.problems.map((p, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group flex items-start gap-3 p-4 md:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors"
                >
                  <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20">
                    <X className="w-4 h-4 text-red-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-inter-display font-semibold text-white text-base md:text-lg">
                      {p.title}
                    </p>
                    <p className="font-manrope text-white/55 text-sm md:text-base mt-1 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 font-manrope font-semibold text-[#10b981] text-xs uppercase tracking-wider mb-6"
            >
              <span className="w-6 h-px bg-[#10b981]/50" />
              After we're done
            </motion.div>
            <div className="space-y-3">
              {content.solutions.map((s, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group flex items-start gap-3 p-4 md:p-5 rounded-xl bg-[#008070]/[0.04] border border-[#008070]/20 hover:border-[#008070]/40 hover:bg-[#008070]/[0.08] transition-all"
                >
                  <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30">
                    <Check className="w-4 h-4 text-[#10b981]" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-inter-display font-semibold text-white text-base md:text-lg">
                      {s.title}
                    </p>
                    <p className="font-manrope text-white/65 text-sm md:text-base mt-1 leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
