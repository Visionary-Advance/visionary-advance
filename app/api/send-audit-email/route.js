// app/api/send-audit-email/route.js
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createOrUpdateLead } from '@/lib/crm'
import { getUTMFromRequest } from '@/lib/utm'
import { requireRecaptcha } from '@/lib/recaptcha'

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendUserAuditEmail(email, url, results) {
  try {
    const avgScore = Math.round(
      (results.scores.performance +
       results.scores.accessibility +
       results.scores.bestPractices +
       results.scores.seo) / 4
    )

    const getScoreColor = (score) => {
      if (score >= 90) return '#16a34a' // green
      if (score >= 50) return '#f97316' // orange
      return '#dc2626' // red
    }

    const getScoreLabel = (score) => {
      if (score >= 90) return 'Good'
      if (score >= 50) return 'Needs Improvement'
      return 'Poor'
    }

    await resend.emails.send({
      from: 'Visionary Advance <no-reply@mail.visionaryadvance.com>',
      to: [email],
      subject: `Your Website Audit Results for ${url}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #008070 0%, #005F52 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; }
            .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .score-card { background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #008070; }
            .score-number { font-size: 36px; font-weight: bold; margin: 10px 0; }
            .score-label { font-size: 14px; color: #666; font-weight: 600; }
            .metric { background: #f0f0f0; padding: 12px; margin: 8px 0; border-radius: 4px; }
            .metric strong { color: #008070; }
            .opportunity { background: #fff3cd; border-left: 4px solid #f97316; padding: 15px; margin: 10px 0; border-radius: 4px; }
            .seo-issue { background: #ffe5e5; border-left: 4px solid #dc2626; padding: 15px; margin: 10px 0; border-radius: 4px; }
            .cta { background: #008070; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Your Website Audit Results</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">${url}</p>
            </div>

            <div class="content">
              <h2 style="color: #008070; margin-top: 0;">Overall Score: ${avgScore}/100</h2>
              <p>Here's a comprehensive analysis of your website's performance, accessibility, SEO, and best practices.</p>

              <h3 style="color: #333; border-bottom: 2px solid #008070; padding-bottom: 10px;">Performance Scores</h3>
              <div class="score-grid">
                <div class="score-card">
                  <div class="score-label">Performance</div>
                  <div class="score-number" style="color: ${getScoreColor(results.scores.performance)}">${results.scores.performance}</div>
                  <div style="font-size: 12px; color: #666;">${getScoreLabel(results.scores.performance)}</div>
                </div>
                <div class="score-card">
                  <div class="score-label">Accessibility</div>
                  <div class="score-number" style="color: ${getScoreColor(results.scores.accessibility)}">${results.scores.accessibility}</div>
                  <div style="font-size: 12px; color: #666;">${getScoreLabel(results.scores.accessibility)}</div>
                </div>
                <div class="score-card">
                  <div class="score-label">Best Practices</div>
                  <div class="score-number" style="color: ${getScoreColor(results.scores.bestPractices)}">${results.scores.bestPractices}</div>
                  <div style="font-size: 12px; color: #666;">${getScoreLabel(results.scores.bestPractices)}</div>
                </div>
                <div class="score-card">
                  <div class="score-label">SEO</div>
                  <div class="score-number" style="color: ${getScoreColor(results.scores.seo)}">${results.scores.seo}</div>
                  <div style="font-size: 12px; color: #666;">${getScoreLabel(results.scores.seo)}</div>
                </div>
              </div>

              <h3 style="color: #333; border-bottom: 2px solid #008070; padding-bottom: 10px; margin-top: 30px;">Key Performance Metrics</h3>
              <div class="metric"><strong>First Contentful Paint:</strong> ${results.metrics.firstContentfulPaint}</div>
              <div class="metric"><strong>Speed Index:</strong> ${results.metrics.speedIndex}</div>
              <div class="metric"><strong>Largest Contentful Paint:</strong> ${results.metrics.largestContentfulPaint}</div>
              <div class="metric"><strong>Time to Interactive:</strong> ${results.metrics.timeToInteractive}</div>
              <div class="metric"><strong>Total Blocking Time:</strong> ${results.metrics.totalBlockingTime}</div>
              <div class="metric"><strong>Cumulative Layout Shift:</strong> ${results.metrics.cumulativeLayoutShift}</div>

              ${results.opportunities.performance.length > 0 ? `
                <h3 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 30px;">Performance Opportunities</h3>
                ${results.opportunities.performance.slice(0, 5).map(opp => `
                  <div class="opportunity">
                    <strong>${opp.title}</strong>
                    ${opp.displayValue ? `<div style="color: #f97316; font-weight: bold; margin-top: 5px;">${opp.displayValue}</div>` : ''}
                    <div style="font-size: 14px; margin-top: 5px; color: #555;">${opp.description}</div>
                  </div>
                `).join('')}
              ` : ''}

              ${results.opportunities.seo.length > 0 ? `
                <h3 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 30px;">SEO Issues to Fix</h3>
                ${results.opportunities.seo.map(issue => `
                  <div class="seo-issue">
                    <strong>${issue.title}</strong>
                    <div style="font-size: 14px; margin-top: 5px; color: #555;">${issue.description}</div>
                  </div>
                `).join('')}
              ` : ''}

              <div style="background: linear-gradient(135deg, #008070 0%, #005F52 100%); padding: 25px; border-radius: 8px; text-align: center; margin-top: 30px; color: white;">
                <h3 style="margin-top: 0; color: white;">Want Help Improving These Scores?</h3>
                <p style="font-size: 16px; margin: 15px 0;">Our team specializes in optimizing construction websites for maximum performance and lead generation.</p>
                <a href="https://visionaryadvance.com/construction-websites#contact" class="cta" style="background: white; color: #008070;">Get Expert Help</a>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0;">This audit was generated by <strong>Visionary Advance</strong></p>
              <p style="margin: 10px 0 0 0;">Professional website design and development for construction companies</p>
              <p style="margin: 10px 0 0 0;"><a href="https://visionaryadvance.com" style="color: #008070;">visionaryadvance.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    })
  } catch (err) {
    console.error('Failed to send user audit email:', err)
    throw err
  }
}

async function sendAdminNotification(email, url, results) {
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
      subject: `Lead: Audit Email Sent - ${url} (${avgScore}) - ${email}`,
      html: `
        <h2>🎯 User Requested Audit Results via Email</h2>
        <p><strong>Website:</strong> <a href="${url}">${url}</a></p>
        <p><strong>User Email:</strong> <a href="mailto:${email}">${email}</a></p>

        <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0;">
          <strong>⚡ HOT LEAD:</strong> This user just requested their audit results via email, indicating high interest!<br>
          <strong>Action:</strong> Follow up within 24 hours while they're actively thinking about their website.
        </div>

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
          <strong>Follow-up Suggestions:</strong><br>
          ${avgScore < 70 ?
            '• Emphasize the significant improvement potential<br>• Highlight specific issues found (performance, SEO)<br>• Offer free consultation to discuss solutions' :
            '• Website is in decent shape but could be optimized<br>• Focus on conversion rate optimization<br>• Discuss ongoing maintenance and SEO services'
          }
        </p>
      `,
    })
  } catch (err) {
    console.error('Failed to send admin notification:', err)
    // Don't throw - we don't want to fail the user's request if admin email fails
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, url, results } = body
    const utmParams = getUTMFromRequest(request)

    // Verify reCAPTCHA
    const recaptchaError = await requireRecaptcha(body, 'audit_email')
    if (recaptchaError) {
      return NextResponse.json(
        { error: recaptchaError.error },
        { status: recaptchaError.status }
      )
    }

    if (!email || !url || !results) {
      return NextResponse.json(
        { error: 'Email, URL, and results are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email to user
    await sendUserAuditEmail(email, url, results)

    // Send notification to admin (non-blocking)
    sendAdminNotification(email, url, results).catch(err => {
      console.error('Admin notification failed:', err)
    })

    // Create/update CRM lead with audit data (non-blocking)
    let crmResult = null
    try {
      crmResult = await createOrUpdateLead({
        email,
        website: url,
        source: 'audit_email',
        conversion_page: body.conversion_page || '/construction-websites',
        utm_source: body.utm_source || utmParams.utm_source,
        utm_medium: body.utm_medium || utmParams.utm_medium,
        utm_campaign: body.utm_campaign || utmParams.utm_campaign,
        utm_term: body.utm_term || utmParams.utm_term,
        utm_content: body.utm_content || utmParams.utm_content,
        referrer: body.referrer || utmParams.referrer,
        audit_scores: results.scores,
        form_data: {
          audit_url: url,
          audit_metrics: results.metrics,
        },
        business_type: 'construction',
      })
      console.log('CRM lead result:', crmResult.isNew ? 'New lead created' : 'Lead updated')
    } catch (crmError) {
      console.error('CRM integration failed (non-critical):', crmError)
    }

    return NextResponse.json({ success: true, lead: crmResult?.lead?.id }, { status: 200 })
  } catch (error) {
    console.error('Send Audit Email Error:', error)
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    )
  }
}
