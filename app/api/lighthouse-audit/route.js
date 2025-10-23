// app/api/lighthouse-audit/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting map
const rateLimitMap = new Map()
const RATE_LIMIT = 200 // requests per hour
const RATE_LIMIT_WINDOW = 0 // 1 hour

function getRateLimitKey(request) {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

async function saveAuditToDatabase(url, results) {
  try {
    const { error } = await supabase
      .from('va_website_audits')
      .insert({
        url: url,
        performance_score: results.scores.performance,
        accessibility_score: results.scores.accessibility,
        best_practices_score: results.scores.bestPractices,
        seo_score: results.scores.seo,
        metrics: results.metrics,
        opportunities: results.opportunities,
        full_results: results,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
  } catch (err) {
    console.error('Failed to save to database:', err)
    throw err
  }
}

async function sendAuditNotificationEmail(url, results) {
  try {
    const avgScore = Math.round(
      (results.scores.performance +
       results.scores.accessibility +
       results.scores.bestPractices +
       results.scores.seo) / 4
    )

    await resend.emails.send({
      from: 'no-reply@mail.visionaryadvance.com',
      to: ['brandon@visionaryadvance.com'],
      subject: `New Website Audit: ${url} (Avg Score: ${avgScore})`,
      html: `
        <h2>New Website Audit Completed</h2>
        <p><strong>Website:</strong> <a href="${url}">${url}</a></p>
        <p><em>User ran audit but did not provide email yet</em></p>

        <h3>Scores</h3>
        <ul>
          <li><strong>Performance:</strong> ${results.scores.performance}/100</li>
          <li><strong>Accessibility:</strong> ${results.scores.accessibility}/100</li>
          <li><strong>Best Practices:</strong> ${results.scores.bestPractices}/100</li>
          <li><strong>SEO:</strong> ${results.scores.seo}/100</li>
          <li><strong>Average:</strong> ${avgScore}/100</li>
        </ul>

        <h3>Key Metrics</h3>
        <ul>
          <li><strong>First Contentful Paint:</strong> ${results.metrics.firstContentfulPaint}</li>
          <li><strong>Largest Contentful Paint:</strong> ${results.metrics.largestContentfulPaint}</li>
          <li><strong>Speed Index:</strong> ${results.metrics.speedIndex}</li>
          <li><strong>Time to Interactive:</strong> ${results.metrics.timeToInteractive}</li>
        </ul>

        ${results.opportunities.performance.length > 0 ? `
          <h3>Top Performance Issues</h3>
          <ul>
            ${results.opportunities.performance.slice(0, 3).map(opp =>
              `<li><strong>${opp.title}</strong> - ${opp.displayValue || 'Fix recommended'}</li>`
            ).join('')}
          </ul>
        ` : ''}

        <p style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-left: 4px solid #008070;">
          <strong>Potential Lead:</strong> Someone is interested in their website performance.
          ${avgScore < 70 ? 'Their low scores indicate significant room for improvement!' : 'They may benefit from optimization services.'}
          <br><em>Watch for email request follow-up notification</em>
        </p>

        <p style="margin-top: 20px;">
          <a href="https://visionaryadvance.com/construction-websites" style="background-color: #008070; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Audit Dashboard</a>
        </p>
      `,
    })
  } catch (err) {
    console.error('Failed to send notification email:', err)
    throw err
  }
}

function checkRateLimit(key) {
  const now = Date.now()
  const userRequests = rateLimitMap.get(key) || []

  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW)

  if (recentRequests.length >= RATE_LIMIT) {
    return false
  }

  recentRequests.push(now)
  rateLimitMap.set(key, recentRequests)
  return true
}

export async function POST(request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate and format URL
    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    // Validate URL format
    try {
      new URL(formattedUrl)
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Check rate limit
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in an hour.' },
        { status: 429 }
      )
    }

    // Build API URL with optional API key
    let apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(formattedUrl)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`

    // Add API key if available in environment variables
    if (process.env.PAGESPEED_API_KEY) {
      apiUrl += `&key=${process.env.PAGESPEED_API_KEY}`
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to run audit'

      try {
        const errorData = await response.json()

        // Handle quota exceeded error specifically
        if (response.status === 429 || errorData.error?.message?.includes('Quota exceeded')) {
          errorMessage = 'Daily quota exceeded. Please contact us directly for a free website audit.'
        } else {
          errorMessage = errorData.error?.message || errorMessage
        }
      } catch (e) {
        // If we can't parse the error, use default message
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract the key metrics we want to display
    const lighthouseResult = data.lighthouseResult
    const categories = lighthouseResult.categories
    const audits = lighthouseResult.audits

    const results = {
      url: formattedUrl,
      scores: {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100),
      },
      metrics: {
        firstContentfulPaint: audits['first-contentful-paint']?.displayValue || 'N/A',
        speedIndex: audits['speed-index']?.displayValue || 'N/A',
        largestContentfulPaint: audits['largest-contentful-paint']?.displayValue || 'N/A',
        timeToInteractive: audits['interactive']?.displayValue || 'N/A',
        totalBlockingTime: audits['total-blocking-time']?.displayValue || 'N/A',
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      },
      opportunities: {
        performance: categories.performance.auditRefs
          .filter(ref => audits[ref.id]?.details?.type === 'opportunity')
          .slice(0, 5)
          .map(ref => ({
            title: audits[ref.id].title,
            description: audits[ref.id].description,
            displayValue: audits[ref.id].displayValue,
          })),
        seo: categories.seo.auditRefs
          .filter(ref => audits[ref.id]?.score !== null && audits[ref.id]?.score < 1)
          .slice(0, 3)
          .map(ref => ({
            title: audits[ref.id].title,
            description: audits[ref.id].description,
          })),
      },
      fetchTime: lighthouseResult.fetchTime,
    }

    // Save to database (non-blocking, don't wait for it)
    saveAuditToDatabase(formattedUrl, results).catch(err => {
      console.error('Failed to save audit to database:', err)
    })

    // Send email notification to admin (non-blocking)
    sendAuditNotificationEmail(formattedUrl, results).catch(err => {
      console.error('Failed to send audit notification:', err)
    })

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error('Lighthouse API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later or contact us for a manual audit.' },
      { status: 500 }
    )
  }
}
