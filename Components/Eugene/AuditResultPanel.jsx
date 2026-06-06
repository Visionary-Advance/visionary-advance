'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, Mail, RefreshCw } from 'lucide-react'
import { useRecaptcha } from '@/lib/useRecaptcha'
import { trackAuditEmailSubmit } from '@/lib/analytics'

function ScoreCircle({ score, label }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference

  const color = score >= 90 ? '#10b981' : score >= 50 ? '#f97316' : '#ef4444'
  const tier = score >= 90 ? 'Good' : score >= 50 ? 'Needs work' : 'Poor'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 md:w-28 md:h-28">
        <svg className="-rotate-90 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-inter-display text-2xl md:text-3xl font-bold" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <p className="mt-2 font-manrope font-semibold text-white text-sm md:text-base">{label}</p>
      <p className="font-manrope text-xs text-white/40 mt-0.5">{tier}</p>
    </div>
  )
}

export default function AuditResultPanel({ results, onReset }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const { executeRecaptcha } = useRecaptcha()
  const prefersReducedMotion = useReducedMotion()

  const avg = Math.round(
    (results.scores.performance +
      results.scores.accessibility +
      results.scores.bestPractices +
      results.scores.seo) /
      4
  )

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setEmailError(null)

    try {
      const recaptchaToken = await executeRecaptcha('audit_email')

      const response = await fetch('/api/send-audit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          url: results.url,
          results,
          conversion_page: '/eugene-web-design',
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setEmailError(data.error || 'Failed to send email')
        return
      }

      setSent(true)
      trackAuditEmailSubmit(results.url)
    } catch (err) {
      console.error(err)
      setEmailError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="audit-results"
      className="relative bg-[#050505] px-4 md:px-16 py-16 md:py-20 scroll-mt-24"
      aria-live="polite"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 p-6 md:p-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="font-manrope font-semibold text-[#008070] text-sm uppercase tracking-wider">
                Audit Complete
              </p>
              <h2 className="font-inter-display font-bold text-2xl md:text-4xl text-white mt-2 break-words">
                Results for{' '}
                <span className="text-white/60 font-medium">{results.url}</span>
              </h2>
              <p className="font-manrope text-white/60 mt-2">
                Overall score:{' '}
                <span className="font-bold text-white">{avg}/100</span>
              </p>
            </div>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 text-sm font-manrope text-white/60 hover:text-white transition-colors self-start md:self-end"
            >
              <RefreshCw className="w-4 h-4" />
              Run another audit
            </button>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 mb-8 md:mb-10">
            <ScoreCircle score={results.scores.performance} label="Performance" />
            <ScoreCircle score={results.scores.accessibility} label="Accessibility" />
            <ScoreCircle score={results.scores.bestPractices} label="Best Practices" />
            <ScoreCircle score={results.scores.seo} label="SEO" />
          </div>

          {/* Top opportunities preview */}
          {results.opportunities.performance.length > 0 && (
            <div className="mb-8">
              <h3 className="font-inter-display font-bold text-white text-lg mb-4">
                Top {Math.min(3, results.opportunities.performance.length)} fixes we'd start with
              </h3>
              <ul className="space-y-2">
                {results.opportunities.performance.slice(0, 3).map((opp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#008070]/15 text-[#008070] text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-manrope font-semibold text-white text-sm md:text-base">
                        {opp.title}
                      </p>
                      {opp.displayValue && (
                        <p className="font-manrope text-xs text-[#008070] mt-0.5">
                          Potential savings: {opp.displayValue}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Email gate */}
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="gate"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl bg-[#008070]/8 border border-[#008070]/30 p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-inter-display font-bold text-white text-xl md:text-2xl">
                      Want the full PDF report?
                    </h3>
                    <p className="font-manrope text-white/70 mt-1.5 text-sm md:text-base">
                      We'll email you the complete breakdown with every issue, why it matters, and how to fix it.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 mt-5">
                  <label htmlFor="audit-email" className="sr-only">
                    Your email
                  </label>
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    <input
                      id="audit-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourbusiness.com"
                      required
                      disabled={sending}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder:text-white/35 pl-10 pr-4 py-3 font-manrope focus:outline-none focus:border-[#008070] focus:ring-2 focus:ring-[#008070]/30 disabled:opacity-50 min-h-[48px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 bg-[#008070] hover:bg-[#009e89] disabled:bg-[#008070]/40 disabled:cursor-not-allowed text-white font-manrope font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px] whitespace-nowrap"
                  >
                    {sending ? 'Sending...' : 'Email me the report'}
                  </button>
                </form>

                {emailError && (
                  <p
                    role="alert"
                    aria-live="polite"
                    className="mt-3 text-sm text-red-400 font-manrope"
                  >
                    {emailError}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl bg-[#10b981]/10 border border-[#10b981]/40 p-6 md:p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#10b981]/20 mb-4">
                  <Check className="w-6 h-6 text-[#10b981]" />
                </div>
                <h3 className="font-inter-display font-bold text-white text-xl md:text-2xl">
                  Report on the way
                </h3>
                <p className="font-manrope text-white/70 mt-2">
                  Check{' '}
                  <strong className="text-white">{email}</strong> in the next few minutes.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
