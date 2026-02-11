// app/audit/page.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRecaptcha } from '@/lib/useRecaptcha'

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
    if (score >= 90) return 'text-green-500'
    if (score >= 50) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreRing = (score) => {
    if (score >= 90) return 'stroke-green-500'
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
              className="text-gray-700"
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
        <p className="mt-3 font-medium text-gray-300 text-center text-sm md:text-base">{label}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-5 py-1 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity" aria-label="Visionary Advance - Go to homepage">
            <Image
              src="/Img/VA_Logo_Long.png"
              alt="Visionary Advance"
              width={240}
              height={60}
              className="h-20 w-auto"
              priority
            />
          </Link>
          <Link
            href="/construction-websites"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Get a Professional Website
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-5 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Free Website Audit
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Check your website&apos;s performance, SEO, accessibility, and best practices using Google Lighthouse
          </p>
        </div>

        {/* Audit Form */}
        {!results && !loading && (
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block mb-3 font-semibold text-white text-lg">
                  Enter your website URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com"
                  required
                  className="w-full px-5 py-4 border-2 border-gray-700 rounded-xl text-lg text-white bg-gray-800 transition-all duration-300 focus:outline-none focus:border-[#008070] focus:shadow-[0_0_0_3px_rgba(0,128,112,0.2)] placeholder:text-gray-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#008070] text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:bg-[#006a5c] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,128,112,0.4)]"
              >
                Run Free Audit
              </button>
            </form>

            {error && (
              <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 px-5 py-4 rounded-xl">
                <p className="font-semibold">Unable to Run Audit</p>
                <p className="text-sm mt-1 text-red-300">{error}</p>
              </div>
            )}

            <p className="text-center text-gray-500 text-sm mt-6">
              Powered by Google PageSpeed Insights
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-[#008070]"></div>
            <p className="mt-6 text-xl text-gray-300 font-medium">
              Analyzing your website...
            </p>
            <p className="mt-3 text-gray-500">
              Running performance, SEO, accessibility, and best practices tests
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              This typically takes 30-60 seconds
            </p>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-8 animate-fadeIn">
            {/* Results Header */}
            <div className="text-center">
              <p className="text-[#008070] font-medium mb-2">Audit Complete</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Results for</h2>
              <p className="text-gray-400 text-lg break-all">{results.url}</p>
            </div>

            {/* Score Overview */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <ScoreCircle score={results.scores.performance} label="Performance" />
                <ScoreCircle score={results.scores.accessibility} label="Accessibility" />
                <ScoreCircle score={results.scores.bestPractices} label="Best Practices" />
                <ScoreCircle score={results.scores.seo} label="SEO" />
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'First Contentful Paint', value: results.metrics.firstContentfulPaint },
                  { label: 'Speed Index', value: results.metrics.speedIndex },
                  { label: 'Largest Contentful Paint', value: results.metrics.largestContentfulPaint },
                  { label: 'Time to Interactive', value: results.metrics.timeToInteractive },
                  { label: 'Total Blocking Time', value: results.metrics.totalBlockingTime },
                  { label: 'Cumulative Layout Shift', value: results.metrics.cumulativeLayoutShift },
                ].map((metric, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-xl border-l-4 border-[#008070]">
                    <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-xl font-bold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Opportunities */}
            {results.opportunities.performance.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <h3 className="text-xl font-bold mb-6">Performance Opportunities</h3>
                <div className="space-y-4">
                  {results.opportunities.performance.map((opportunity, index) => (
                    <div
                      key={index}
                      className="bg-orange-900/30 border border-orange-800/50 p-5 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <h4 className="font-semibold text-orange-200">{opportunity.title}</h4>
                        {opportunity.displayValue && (
                          <span className="text-orange-400 font-medium text-sm">
                            {opportunity.displayValue}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{opportunity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Issues */}
            {results.opportunities.seo.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <h3 className="text-xl font-bold mb-6">SEO Issues</h3>
                <div className="space-y-4">
                  {results.opportunities.seo.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-red-900/30 border border-red-800/50 p-5 rounded-xl"
                    >
                      <h4 className="font-semibold text-red-200 mb-2">{issue.title}</h4>
                      <p className="text-sm text-gray-400">{issue.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Capture */}
            {!emailSent ? (
              <div className="bg-gray-900 rounded-2xl p-8 border-2 border-[#008070]">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Get Your Results by Email</h3>
                  <p className="text-gray-400">
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
                      className="flex-1 px-4 py-3 border-2 border-gray-700 rounded-lg text-white bg-gray-800 transition-all duration-300 focus:outline-none focus:border-[#008070] disabled:opacity-50 placeholder:text-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={emailSending}
                      className="px-6 py-3 bg-[#008070] text-white font-semibold rounded-lg transition-all duration-300 hover:bg-[#006a5c] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {emailSending ? 'Sending...' : 'Send'}
                    </button>
                  </div>

                  {emailError && (
                    <div className="mt-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                      {emailError}
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-green-900/30 border-2 border-green-700 rounded-2xl p-8 text-center">
                <div className="text-green-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Results Sent!</h3>
                <p className="text-gray-300">
                  Check your inbox at <strong className="text-white">{email}</strong>
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#008070] to-[#005a4c] rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Need Help Improving Your Scores?</h3>
              <p className="text-lg mb-6 text-white/90">
                We build fast, SEO-optimized websites that generate leads
              </p>
              <Link
                href="/construction-websites#contact"
                className="inline-block bg-white text-[#008070] px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get a Free Consultation
              </Link>
            </div>

            {/* Run Another Audit */}
            <div className="text-center">
              <button
                onClick={runNewAudit}
                className="text-gray-400 hover:text-white transition-colors underline"
              >
                Run another audit
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-5 py-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Visionary Advance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
