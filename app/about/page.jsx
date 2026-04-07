'use client'


import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import SplitText from '@/Components/SplitText'
import ServicesAccordion from '@/Components/Home/ServicesAccordion'

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  },
})

const slideFrom = (x, delay = 0) => ({
  hidden: { opacity: 0, x },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay },
  },
})

const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

// ─── Services accordion data ──────────────────────────────────────────────────


// ─── Placeholder image component ─────────────────────────────────────────────

function Placeholder({ className = '' }) {
  return (
    <div className={`bg-[#d9d9d9] rounded-xl ${className}`} />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {


  return (
    <div className="bg-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="px-4 md:px-16 pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="max-w-6xl mx-auto text-center">
          <SplitText
            text="About Us"
            tag="h1"
            splitType="chars"
            duration={0.4}
            delay={30}
            ease="power3.out"
            from={{ opacity: 0, y: 60 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="0px"
            textAlign="center"
            className="font-inter-display font-bold text-7xl md:text-8xl lg:text-[9rem] text-black leading-none tracking-tight"
          />
          <motion.p
            variants={fadeUp(0.18)}
            initial="hidden"
            animate="show"
            className="font-inter-display font-semibold text-xl md:text-2xl text-black max-w-3xl mx-auto mt-8 leading-relaxed"
          >
            At Visionary Advance, our process is built around your business — not the other
            way around. We craft custom websites, business systems, and internal tools that
            streamline your operations and strengthen your online presence.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FULL-WIDTH BANNER IMAGE
      ═══════════════════════════════════════════ */}
      <section className="px-4 md:px-16 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <img className="w-full h-56 md:h-[407px] object-cover rounded-xl" src="/Img/Eugene_2.jpg" alt="Eugene, Oregon" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SPLIT — IMAGE LEFT / TEXT RIGHT
      ═══════════════════════════════════════════ */}
      <section className="px-4 md:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <img className="w-full h-72 md:h-[420px] object-cover rounded-lg" src="/Img/Brandon_Headshot_Square.jpg" alt="Brandon Crites" />
          </motion.div>

          <motion.div
            variants={slideFrom(60)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-5"
          >
            <h2 className="font-inter-display font-bold text-2xl md:text-[32px] text-black leading-snug">
              Built by someone who's been in the trenches
            </h2>
            <p className="font-inter-display text-lg md:text-xl text-black/75 leading-relaxed">
              Visionary Advance was founded on a simple belief: businesses that do great work
              deserve a digital presence that reflects it. As a designer and developer who's
              worked with local businesses across Oregon, I understand the gap between what
              most agencies deliver and what business owners actually need.
            </p>
            <p className="font-inter-display text-lg md:text-xl text-black/75 leading-relaxed">
              Every project is personal. You get direct collaboration, real craftsmanship,
              and a partner who cares about your results as much as you do.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SPLIT — TEXT LEFT / IMAGE RIGHT
      ═══════════════════════════════════════════ */}
      <section className="px-4 md:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            variants={slideFrom(-60)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-5 order-2 md:order-1"
          >
            <h2 className="font-inter-display font-bold text-2xl md:text-[32px] text-black leading-snug text-center md:text-left">
              Our mission is simple
            </h2>
            <p className="font-inter-display text-lg md:text-xl text-black/75 leading-relaxed text-right md:text-left">
              Help serious businesses build a digital presence that matches the quality of
              their work. No templates, no shortcuts, no overcomplicated pitches. Just clean
              design, solid code, and strategy built around how you actually operate.
            </p>
            <p className="font-inter-display text-lg md:text-xl text-black/75 leading-relaxed text-right md:text-left">
              We work with a focused roster of clients so every engagement gets the attention
              it deserves. If you're looking for a partner who treats your business like it
              matters — you've found the right place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
            className="order-1 md:order-2"
          >
            <img className="w-full h-72 md:h-[420px] object-cover rounded-lg" src="/Img/Eugene_BG.jpg" alt="Eugene, Oregon" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES BADGE + BLURB
      ═══════════════════════════════════════════ */}
      <section className="px-4 md:px-16 pt-20 pb-6 md:pt-28 md:pb-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-5">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <span className="inline-flex items-center gap-2 border border-[#008070] rounded-full px-5 py-2 font-manrope font-bold text-base text-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008070]" />
              Services
            </span>
          </motion.div>
          <motion.p
            variants={fadeUp(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="font-inter-display font-semibold text-lg md:text-xl text-black max-w-lg"
          >
            We build custom websites and business systems for professionals who take their
            operations seriously.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES ACCORDION
      ═══════════════════════════════════════════ */}
      <section className="px-4 md:px-16 pb-24 md:pb-36">
        <ServicesAccordion />
      </section>

    </div>
  )
}
