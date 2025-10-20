// Components/WebsiteAudit.js
'use client'

import { useState } from 'react'

export default function WebsiteAudit() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/lighthouse-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
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

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 50) return 'text-orange-500'
    return 'text-red-600'
  }

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 50) return 'bg-orange-100'
    return 'bg-red-100'
  }

  const getScoreBorderColor = (score) => {
    if (score >= 90) return 'border-green-500'
    if (score >= 50) return 'border-orange-500'
    return 'border-red-500'
  }

  const getScoreRing = (score) => {
    if (score >= 90) return 'stroke-green-600'
    if (score >= 50) return 'stroke-orange-500'
    return 'stroke-red-600'
  }

  const ScoreCircle = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
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
        <p className="mt-3 font-semibold text-gray-700 text-center">{label}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Audit Form */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="audit-url" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
              Enter Your Website URL
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="audit-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                required
                disabled={loading}
                className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base text-gray-900 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#008070] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,128,112,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-[#008070] text-white font-semibold rounded-lg transition-all duration-300 hover:bg-[#005F52] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,128,112,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Analyzing...' : 'Run Audit'}
              </button>
            </div>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-lg">
            <p className="font-semibold">Unable to Run Audit</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-sm mt-3">
              No problem! Fill out our{' '}
              <a href="#contact" className="underline font-semibold hover:text-red-900">
                contact form below
              </a>{' '}
              and we'll send you a detailed audit within 24 hours.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#008070]"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Running comprehensive audit using Google Lighthouse...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              This performs a real performance test and typically takes 30-60 seconds
            </p>
            <p className="mt-1 text-sm text-gray-400">
              We're checking performance, SEO, accessibility, and best practices
            </p>
          </div>
        )}
      </div>

      {/* Results Display */}
      {results && !loading && (
        <div className="mt-12 space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-[#0f0f0f] mb-2">
              Audit Results
            </h3>
            <p className="text-gray-600">for {results.url}</p>
            {results.cached && (
              <p className="text-sm text-gray-500 mt-1">
                Cached results from {results.cacheAge} minute{results.cacheAge !== 1 ? 's' : ''} ago
              </p>
            )}
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            <ScoreCircle score={results.scores.performance} label="Performance" />
            <ScoreCircle score={results.scores.accessibility} label="Accessibility" />
            <ScoreCircle score={results.scores.bestPractices} label="Best Practices" />
            <ScoreCircle score={results.scores.seo} label="SEO" />
          </div>

          {/* Metrics */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <h4 className="text-2xl font-bold text-[#0f0f0f] mb-6">Performance Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'First Contentful Paint', value: results.metrics.firstContentfulPaint },
                { label: 'Speed Index', value: results.metrics.speedIndex },
                { label: 'Largest Contentful Paint', value: results.metrics.largestContentfulPaint },
                { label: 'Time to Interactive', value: results.metrics.timeToInteractive },
                { label: 'Total Blocking Time', value: results.metrics.totalBlockingTime },
                { label: 'Cumulative Layout Shift', value: results.metrics.cumulativeLayoutShift },
              ].map((metric, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#008070]">
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-[#0f0f0f]">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Opportunities */}
          {results.opportunities.performance.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-[#0f0f0f] mb-6">
                Performance Opportunities
              </h4>
              <div className="space-y-4">
                {results.opportunities.performance.map((opportunity, index) => (
                  <div
                    key={index}
                    className="bg-orange-50 border border-orange-200 p-5 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-[#0f0f0f]">{opportunity.title}</h5>
                      {opportunity.displayValue && (
                        <span className="text-orange-600 font-semibold text-sm">
                          {opportunity.displayValue}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{opportunity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Issues */}
          {results.opportunities.seo.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-[#0f0f0f] mb-6">SEO Issues to Fix</h4>
              <div className="space-y-4">
                {results.opportunities.seo.map((issue, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 p-5 rounded-lg"
                  >
                    <h5 className="font-semibold text-[#0f0f0f] mb-2">{issue.title}</h5>
                    <p className="text-sm text-gray-700">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#008070] to-[#005F52] rounded-xl p-8 text-white text-center shadow-lg">
            <h4 className="text-2xl font-bold mb-3">Want Help Fixing These Issues?</h4>
            <p className="text-lg mb-6 opacity-95">
              Our team specializes in optimizing construction websites for maximum performance and lead generation.
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-[#008070] px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              Get Expert Help
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
