'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Palette, Search, Workflow, Check } from 'lucide-react'

const iconMap = {
  0: Palette,
  1: Search,
  2: Workflow,
}

export default function ServicesGrid({ content }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative bg-[#050505] py-20 md:py-28 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
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

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {content.items.map((service, i) => {
            const Icon = iconMap[i] || Palette
            const isPurple = service.accent === 'purple'
            const accentFrom = isPurple ? '#7c3aed' : '#008070'
            const accentTo = isPurple ? '#a855f7' : '#10b981'

            return (
              <motion.article
                key={i}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                className="group relative rounded-2xl bg-[#0a0a0a] p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Animated gradient border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${accentFrom}40, transparent 50%, ${accentTo}30)`,
                    padding: '1px',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                  aria-hidden="true"
                />
                {/* Soft glow behind card on hover */}
                <div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl pointer-events-none -z-10"
                  style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
                  aria-hidden="true"
                />

                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                  style={{
                    background: `${accentFrom}18`,
                    border: `1px solid ${accentFrom}40`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: accentFrom }} />
                </div>

                <h3 className="font-inter-display font-semibold text-xl md:text-2xl text-white tracking-tight">
                  {service.title}
                </h3>
                <p className="font-manrope text-white/60 mt-3 leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {service.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm font-manrope text-white/75">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: accentFrom }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
