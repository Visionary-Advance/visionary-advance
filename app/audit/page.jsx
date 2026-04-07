// app/audit/page.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRecaptcha } from '@/lib/useRecaptcha'
import SplitText from '@/Components/SplitText'
import { motion, AnimatePresence } from 'framer-motion'

const tips = [
  { title: 'Keep Your Website Updated', description: 'Outdated content tells visitors (and Google) that your business isn\'t active. Review your site at least once a month.' },
  { title: 'Make Sure Your Phone Number Is Clickable', description: 'On mobile, visitors should be able to tap your number to call instantly. A small change that drives real leads.' },
  { title: 'Add Your Business to Google Maps', description: 'A Google Business Profile is free and puts you in front of local customers searching for your services.' },
  { title: 'Use Real Photos of Your Work', description: 'Stock photos feel generic. Showing real projects builds trust and helps potential clients see what you actually deliver.' },
  { title: 'Write a Clear Description of What You Do', description: 'Visitors decide in seconds whether to stay. Make sure your homepage clearly explains who you are and what you offer.' },
  { title: 'Make Your Site Mobile-Friendly', description: 'Over 60% of web traffic is mobile. If your site is hard to use on a phone, you\'re losing customers.' },
  { title: 'Add Customer Reviews to Your Site', description: 'Social proof is powerful. Featuring real testimonials helps new visitors trust your business faster.' },
  { title: 'Include a Clear Call to Action', description: 'Every page should tell the visitor what to do next — call, fill out a form, or request a quote.' },
  { title: 'Check Your Site Speed', description: 'Slow websites lose visitors. If your site takes more than 3 seconds to load, people will leave before they see it.' },
  { title: 'Make Sure Your Contact Info Is Easy to Find', description: 'Don\'t make people hunt for your email, phone, or address. Put it in the header, footer, and on a dedicated page.' },
]

export default function AuditPage() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const { executeRecaptcha } = useRecaptcha()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const recaptchaToken = await executeRecaptcha('website_audit')

      const response = await fetch('/api/lighthouse-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, recaptchaToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to run audit')
        return
      }

      setResults(data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailSending(true)
    setEmailError(null)

    try {
      const recaptchaToken = await executeRecaptcha('audit_email')

      const response = await fetch('/api/send-audit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          url: results.url,
          results: results,
          recaptchaToken
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setEmailError(data.error || 'Failed to send email')
        return
      }

      setEmailSent(true)
    } catch (err) {
      setEmailError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setEmailSending(false)
    }
  }

  const runNewAudit = () => {
    setResults(null)
    setUrl('')
    setEmail('')
    setEmailSent(false)
    setEmailError(null)
    setError(null)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 50) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreRing = (score) => {
    if (score >= 90) return 'stroke-green-600'
    if (score >= 50) return 'stroke-orange-500'
    return 'stroke-red-500'
  }

  const ScoreCircle = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 md:w-32 md:h-32">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${getScoreRing(score)} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        </div>
        <p className="mt-3 font-manrope font-medium text-gray-500 text-center text-sm md:text-base">{label}</p>
      </div>
    )
  }

  function LoadingTips() {
    const [tipIndex, setTipIndex] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % tips.length)
      }, 8000)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#008070]"></div>
        <p className="mt-6 text-xl text-black font-inter-display font-semibold">
          Analyzing your website...
        </p>
        <p className="mt-3 text-gray-500 font-manrope">
          Running performance, SEO, accessibility, and best practices tests
        </p>
        <p className="mt-2 text-gray-400 font-manrope text-sm mb-8">
          This typically takes 30-60 seconds
        </p>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-[#008070] font-manrope font-bold text-sm uppercase tracking-wide mb-4">
            Tip {tipIndex + 1} of {tips.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-inter-display font-bold text-lg text-black mb-2">
                {tips[tipIndex].title}
              </h3>
              <p className="font-manrope text-gray-500 max-w-lg mx-auto">
                {tips[tipIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {tips.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === tipIndex ? 'bg-[#008070]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-5 pt-36 md:pt-44 pb-16 md:pb-24">
        {/* Hero */}
        <div className="text-center mb-12">
          <SplitText
            text="Website Audit"
            tag="h1"
            splitType="chars"
            duration={0.25}
            delay={30}
            ease="power3.out"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="0px"
            textAlign="center"
            className="font-inter-display font-bold text-[clamp(48px,7vw,96px)] text-black leading-none tracking-tight mb-6"
          />
          <p className="text-[clamp(1.1rem,2.5vw,1.5rem)] leading-snug font-semibold font-inter-display text-black max-w-2xl mx-auto">
            Check your website&apos;s performance, SEO, accessibility, and best practices
          </p>
        </div>

        {/* Audit Form */}
        {!results && !loading && (
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block mb-3 font-inter-display font-semibold text-black text-lg">
                  Enter your website URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com"
                  required
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl text-lg text-black bg-white font-manrope transition-all duration-300 focus:outline-none focus:border-[#008070] focus:ring-2 focus:ring-[#008070]/20 placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#008070] text-white font-manrope font-bold text-lg rounded-xl transition-all duration-300 hover:bg-[#006b5d] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,128,112,0.3)]"
              >
                Run Free Audit
              </button>
            </form>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
                <p className="font-semibold">Unable to Run Audit</p>
                <p className="text-sm mt-1 text-red-600">{error}</p>
              </div>
            )}

           
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingTips />}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center">
              <p className="text-[#008070] font-manrope font-bold mb-2">Audit Complete</p>
              <h2 className="text-2xl md:text-3xl font-inter-display font-bold text-black mb-2">Results for</h2>
              <p className="text-gray-500 font-manrope text-lg break-all">{results.url}</p>
            </div>

            {/* Score Overview */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <ScoreCircle score={results.scores.performance} label="Performance" />
                <ScoreCircle score={results.scores.accessibility} label="Accessibility" />
                <ScoreCircle score={results.scores.bestPractices} label="Best Practices" />
                <ScoreCircle score={results.scores.seo} label="SEO" />
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-inter-display font-bold text-black mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'First Contentful Paint', value: results.metrics.firstContentfulPaint },
                  { label: 'Speed Index', value: results.metrics.speedIndex },
                  { label: 'Largest Contentful Paint', value: results.metrics.largestContentfulPaint },
                  { label: 'Time to Interactive', value: results.metrics.timeToInteractive },
                  { label: 'Total Blocking Time', value: results.metrics.totalBlockingTime },
                  { label: 'Cumulative Layout Shift', value: results.metrics.cumulativeLayoutShift },
                ].map((metric, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border-l-4 border-[#008070]">
                    <p className="text-sm font-manrope text-gray-500 mb-1">{metric.label}</p>
                    <p className="text-xl font-inter-display font-bold text-black">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Opportunities */}
            {results.opportunities.performance.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-inter-display font-bold text-black mb-6">Performance Opportunities</h3>
                <div className="space-y-4">
                  {results.opportunities.performance.map((opportunity, index) => (
                    <div
                      key={index}
                      className="bg-orange-50 border border-orange-200 p-5 rounded-xl overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <h4 className="font-manrope font-bold text-orange-700">{opportunity.title}</h4>
                        {opportunity.displayValue && (
                          <span className="text-orange-500 font-manrope font-medium text-sm">
                            {opportunity.displayValue}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-manrope text-gray-500 break-words">{opportunity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Issues */}
            {results.opportunities.seo.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-inter-display font-bold text-black mb-6">SEO Issues</h3>
                <div className="space-y-4">
                  {results.opportunities.seo.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-200 p-5 rounded-xl overflow-hidden"
                    >
                      <h4 className="font-manrope font-bold text-red-700 mb-2">{issue.title}</h4>
                      <p className="text-sm font-manrope text-gray-500 break-words">{issue.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Capture */}
            {!emailSent ? (
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-[#008070]">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-inter-display font-bold text-black mb-2">Get Your Results by Email</h3>
                  <p className="font-manrope text-gray-500">
                    We&apos;ll send you a detailed copy of this audit report
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={emailSending}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-black bg-white font-manrope transition-all duration-300 focus:outline-none focus:border-[#008070] focus:ring-2 focus:ring-[#008070]/20 disabled:opacity-50 placeholder:text-gray-400"
                    />
                    <button
                      type="submit"
                      disabled={emailSending}
                      className="px-6 py-3 bg-[#008070] text-white font-manrope font-bold rounded-lg transition-all duration-300 hover:bg-[#006b5d] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {emailSending ? 'Sending...' : 'Send'}
                    </button>
                  </div>

                  {emailError && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                      {emailError}
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
                <div className="text-green-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-inter-display font-bold text-black mb-2">Results Sent!</h3>
                <p className="font-manrope text-gray-600">
                  Check your inbox at <strong className="text-black">{email}</strong>
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#008070] to-[#005a4c] rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-inter-display font-bold text-white mb-3">Need Help Improving Your Scores?</h3>
              <p className="text-lg mb-6 font-manrope text-white/90">
                We build fast, SEO-optimized websites that generate leads
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-[#008070] px-8 py-3 text-lg font-manrope font-bold rounded-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get a Free Consultation
              </Link>
            </div>

            {/* Run Another Audit */}
            <div className="text-center">
              <button
                onClick={runNewAudit}
                className="text-gray-400 hover:text-[#008070] font-manrope transition-colors underline"
              >
                Run another audit
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
