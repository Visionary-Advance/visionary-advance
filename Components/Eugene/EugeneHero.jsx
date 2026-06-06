'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import { useRecaptcha } from '@/lib/useRecaptcha'
import { trackAuditSubmit } from '@/lib/analytics'
import AuditResultPanel from './AuditResultPanel'

const DarkVeil = dynamic(() => import('@/Components/DarkVeil'), {
  ssr: false,
  loading: () => null,
})

export default function EugeneHero({ content }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const { executeRecaptcha } = useRecaptcha()
  const prefersReducedMotion = useReducedMotion()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const recaptchaToken = await executeRecaptcha('website_audit')

      const response = await fetch('/api/lighthouse-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, recaptchaToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to run audit')
        return
      }

      setResults(data)
      trackAuditSubmit(url)
      requestAnimationFrame(() => {
        document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fadeUp = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }

  return (
    <>
      <section
        id="audit"
        className="relative overflow-hidden bg-[#050505] pt-32 md:pt-40 pb-20 md:pb-28"
      >
        {/* WebGL veil */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none">
            <DarkVeil
              hueShift={170}
              speed={0.35}
              warpAmount={0.4}
              noiseIntensity={0.02}
              baseColor={[0.02, 0.05, 0.05]}
            />
          </div>
        )}

        {/* Grid + gradient overlay (existing brand pattern) */}
        <div className="hero-pattern opacity-50" />

        {/* Floating teal orbs */}
        <div className="circle circle1" aria-hidden="true" />
        <div className="circle circle2" aria-hidden="true" />

        {/* Bottom fade into next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050505] z-[1] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-16">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="inline-flex items-center gap-2 bg-[#008070]/15 border border-[#008070]/40 backdrop-blur rounded-full px-4 py-1.5 font-manrope font-semibold text-xs md:text-sm text-white mb-6">
                <MapPin className="w-3.5 h-3.5 text-[#008070]" />
                {content.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
              className="font-inter-display font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight"
            >
              {content.hero.headline.split(' ').map((word, i, arr) => {
                const isAccent = i >= arr.length - 2
                return (
                  <span key={i} className={isAccent ? 'bg-gradient-to-r from-[#008070] to-[#7c3aed] bg-clip-text text-transparent' : ''}>
                    {word}
                    {i < arr.length - 1 ? ' ' : ''}
                  </span>
                )
              })}
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
              className="font-manrope text-base md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed mt-6"
            >
              <span className="text-white">{content.hero.subheadlineLead}</span>
              {content.hero.subheadlineRest}
            </motion.p>

            {/* Audit form */}
            <motion.form
              {...fadeUp}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
              onSubmit={handleSubmit}
              className="mt-10 max-w-2xl mx-auto"
              aria-label="Free website audit"
            >
              <label htmlFor="audit-url" className="sr-only">
                Your website URL
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#008070] to-[#7c3aed] rounded-2xl blur opacity-40 group-focus-within:opacity-70 transition-opacity duration-300" />
                <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-white/40 pointer-events-none" />
                    <input
                      id="audit-url"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={content.hero.placeholder}
                      required
                      disabled={loading}
                      className="w-full bg-transparent text-white placeholder:text-white/35 pl-11 pr-4 py-3.5 font-manrope text-base focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="inline-flex items-center justify-center gap-2 bg-[#008070] hover:bg-[#009e89] active:bg-[#006b5d] disabled:bg-[#008070]/40 disabled:cursor-not-allowed text-white font-manrope font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 min-h-[48px] whitespace-nowrap"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Auditing...
                      </>
                    ) : (
                      <>
                        {content.hero.ctaLabel}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="mt-3 text-sm text-red-400 font-manrope text-left px-2"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-xs md:text-sm font-manrope text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  {content.hero.microProof}
                </span>
                <Link
                  href={content.hero.secondaryCtaHref}
                  className="text-white/70 hover:text-white underline-offset-4 hover:underline transition-colors"
                >
                  {content.hero.secondaryCtaLabel} →
                </Link>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {results && (
        <AuditResultPanel
          results={results}
          onReset={() => {
            setResults(null)
            setUrl('')
            setError(null)
          }}
        />
      )}
    </>
  )
}
