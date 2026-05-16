'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

function AnimatedNumber({ value, decimal = false, suffix = '' }) {
  const [display, setDisplay] = useState(decimal ? '0.0' : '0')
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(decimal ? value.toFixed(1) : String(value))
      return
    }

    const node = ref.current
    if (!node) return

    let raf
    let started = false

    const start = () => {
      if (started) return
      started = true
      const duration = 1400
      const t0 = performance.now()
      const animate = (now) => {
        const t = Math.min(1, (now - t0) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        const current = value * eased
        setDisplay(decimal ? current.toFixed(1) : String(Math.round(current)))
        if (t < 1) raf = requestAnimationFrame(animate)
      }
      raf = requestAnimationFrame(animate)
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && start())
      },
      { threshold: 0.3 }
    )
    io.observe(node)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [value, decimal, prefersReducedMotion])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

export default function LocalTrustBand({ stats }) {
  return (
    <section className="relative bg-[#050505] border-y border-white/[0.06] py-10 md:py-14 px-4 md:px-16 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #008070 0%, transparent 35%), radial-gradient(circle at 80% 50%, #7c3aed 0%, transparent 35%)',
        }}
      />
      <div className="relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
        {stats.map((s, i) => (
          <div key={i} className="text-center md:text-left flex flex-col items-center md:items-start">
            <p className="font-inter-display font-bold text-3xl md:text-5xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-none">
              <AnimatedNumber value={s.value} decimal={s.decimal} suffix={s.suffix || ''} />
            </p>
            <p className="font-manrope text-white/55 text-xs md:text-sm mt-2 max-w-[140px] md:max-w-none">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
