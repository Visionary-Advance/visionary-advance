// lib/seo-email.js
// SEO Report Email Generation and Sending

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email - can be overridden with RESEND_FROM_EMAIL env var
const DEFAULT_FROM_EMAIL = 'SEO Reports <noreply@mail.visionaryadvance.com>';
// Reply-to email for client responses - set SEO_REPLY_TO_EMAIL in env
const DEFAULT_REPLY_TO = 'hello@visionaryadvance.com';

/**
 * Send SEO report via email
 */
export async function sendReportEmail(report, recipients, site) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const html = generateReportHtml(report, site);
  const text = generateReportText(report, site);
  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  // Build subject with month names if available
  const currentMonth = report.month_comparison?.currentMonth?.name;
  const previousMonth = report.month_comparison?.previousMonth?.name;
  const periodLabel = currentMonth && previousMonth
    ? `${currentMonth} vs ${previousMonth}`
    : formatDateRange(report.start_date, report.end_date);

  const replyTo = process.env.SEO_REPLY_TO_EMAIL || DEFAULT_REPLY_TO;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: recipients,
    replyTo: replyTo,
    subject: `SEO Report: ${site.display_name} - ${periodLabel}`,
    html,
    text
  });

  if (error) {
    console.error('Failed to send SEO report email:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Generate HTML email template for SEO report
 */
function generateReportHtml(report, site) {
  const recommendations = report.recommendations || [];
  const monthComparison = report.month_comparison;
  const currentMonth = monthComparison?.currentMonth;
  const previousMonth = monthComparison?.previousMonth;

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    info: '#22c55e'
  };

  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    info: 'Good News'
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">SEO Performance Report</h1>
              <p style="margin: 8px 0 0 0; color: #ccfbf1; font-size: 14px;">${site.display_name}</p>
              <p style="margin: 4px 0 0 0; color: #99f6e4; font-size: 12px;">
                ${currentMonth?.name || 'Current Month'} vs ${previousMonth?.name || 'Previous Month'}
              </p>
            </td>
          </tr>

          <!-- Month-by-Month Comparison -->
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600;">Month-by-Month Comparison</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;"></td>
                  <td style="padding: 12px; background-color: #0d9488; border: 1px solid #0d9488; text-align: center; color: white; font-weight: 600;">${currentMonth?.name || 'Current'}</td>
                  <td style="padding: 12px; background-color: #6b7280; border: 1px solid #6b7280; text-align: center; color: white; font-weight: 600;">${previousMonth?.name || 'Previous'}</td>
                  <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; text-align: center; font-weight: 600; color: #374151;">Change</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; color: #374151; font-weight: 500;">Clicks</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #111827; font-weight: 700; font-size: 18px;">${currentMonth?.metrics?.totalClicks?.toLocaleString() || 0}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${previousMonth?.metrics?.totalClicks?.toLocaleString() || 0}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${formatChangeInline(report.clicks_change)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; color: #374151; font-weight: 500;">Impressions</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #111827; font-weight: 700; font-size: 18px;">${currentMonth?.metrics?.totalImpressions?.toLocaleString() || 0}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${previousMonth?.metrics?.totalImpressions?.toLocaleString() || 0}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${formatChangeInline(report.impressions_change)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; color: #374151; font-weight: 500;">CTR</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #111827; font-weight: 700; font-size: 18px;">${((currentMonth?.metrics?.avgCtr || 0) * 100).toFixed(2)}%</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${((previousMonth?.metrics?.avgCtr || 0) * 100).toFixed(2)}%</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${formatChangeInline(report.ctr_change ? report.ctr_change * 100 : null, true)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; color: #374151; font-weight: 500;">Avg Position</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #111827; font-weight: 700; font-size: 18px;">${(currentMonth?.metrics?.avgPosition || 0).toFixed(1)}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${(previousMonth?.metrics?.avgPosition || 0).toFixed(1)}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${formatChangeInline(report.position_change, false, true)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- AI Summary -->
          ${report.ai_summary ? `
          <tr>
            <td style="padding: 24px 40px;">
              <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #134e4a; font-size: 14px; line-height: 1.6; font-style: italic;">
                  "${report.ai_summary}"
                </p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Recommendations -->
          ${recommendations.length > 0 ? `
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600;">AI-Powered Recommendations</h2>
              ${recommendations.map(rec => `
                <div style="margin-bottom: 20px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid ${priorityColors[rec.priority] || '#6b7280'};">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="background-color: ${priorityColors[rec.priority] || '#6b7280'}; color: white; font-size: 10px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 600;">${priorityLabels[rec.priority] || rec.priority}</span>
                    <span style="color: #6b7280; font-size: 12px; margin-left: 8px;">${rec.category}</span>
                  </div>
                  <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 16px; font-weight: 600;">${rec.title}</h3>
                  <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">${rec.description}</p>
                  <p style="margin: 0 0 12px 0; color: #059669; font-size: 12px; font-weight: 500;">💡 ${rec.impact}</p>
                  ${rec.actions && rec.actions.length > 0 ? `
                    <div style="margin-top: 12px;">
                      <p style="margin: 0 0 8px 0; color: #374151; font-size: 13px; font-weight: 600;">Action Items:</p>
                      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px; line-height: 1.6;">
                        ${rec.actions.slice(0, 5).map(action => `<li>${action.suggestion}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </td>
          </tr>
          ` : ''}

          <!-- We Want to Hear From You -->
          <tr>
            <td style="padding: 32px 40px;">
              <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); border: 2px solid #0d9488; border-radius: 12px; padding: 28px;">
                <h2 style="margin: 0 0 16px 0; color: #134e4a; font-size: 20px; font-weight: 700; text-align: center;">We Want to Hear From You</h2>
                <p style="margin: 0 0 24px 0; color: #115e59; font-size: 14px; line-height: 1.6; text-align: center;">
                  Your input helps us focus on what matters most to your business this month. Take a moment to reply with your thoughts:
                </p>

                <div style="background-color: white; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
                  <p style="margin: 0 0 8px 0; color: #0d9488; font-size: 14px; font-weight: 700;">1. Which recommendations above would you like us to prioritize?</p>
                  <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">Let us know which ones align best with your current goals - we'll build our action plan around your priorities.</p>
                </div>

                <div style="background-color: white; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
                  <p style="margin: 0 0 8px 0; color: #0d9488; font-size: 14px; font-weight: 700;">2. Is there anything else we should know?</p>
                  <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">Upcoming promotions, new services, seasonal priorities, specific keywords you want to target - anything that helps us help you better.</p>
                </div>

                <div style="text-align: center; margin-top: 24px;">
                  <p style="margin: 0; color: #134e4a; font-size: 15px; font-weight: 600;">Let us know what matters most to you.</p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                This report was generated by Visionary Advance.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">
                Questions? Reply to this email or visit <a href="https://visionaryadvance.com" style="color: #0d9488; text-decoration: none;">visionaryadvance.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of the report
 */
function generateReportText(report, site) {
  const recommendations = report.recommendations || [];
  const monthComparison = report.month_comparison;
  const currentMonth = monthComparison?.currentMonth;
  const previousMonth = monthComparison?.previousMonth;

  let text = `
SEO PERFORMANCE REPORT
${site.display_name}
${currentMonth?.name || 'Current Month'} vs ${previousMonth?.name || 'Previous Month'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MONTH-BY-MONTH COMPARISON

                    ${(currentMonth?.name || 'Current').padEnd(15)} ${(previousMonth?.name || 'Previous').padEnd(15)} Change
─────────────────────────────────────────────────────────
Clicks              ${String(currentMonth?.metrics?.totalClicks?.toLocaleString() || 0).padEnd(15)} ${String(previousMonth?.metrics?.totalClicks?.toLocaleString() || 0).padEnd(15)} ${formatChangeText(report.clicks_change)}
Impressions         ${String(currentMonth?.metrics?.totalImpressions?.toLocaleString() || 0).padEnd(15)} ${String(previousMonth?.metrics?.totalImpressions?.toLocaleString() || 0).padEnd(15)} ${formatChangeText(report.impressions_change)}
CTR                 ${(((currentMonth?.metrics?.avgCtr || 0) * 100).toFixed(2) + '%').padEnd(15)} ${(((previousMonth?.metrics?.avgCtr || 0) * 100).toFixed(2) + '%').padEnd(15)} ${formatChangeText(report.ctr_change ? report.ctr_change * 100 : null)}
Avg Position        ${((currentMonth?.metrics?.avgPosition || 0).toFixed(1)).padEnd(15)} ${((previousMonth?.metrics?.avgPosition || 0).toFixed(1)).padEnd(15)} ${formatChangeText(report.position_change)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${report.ai_summary ? `
EXECUTIVE SUMMARY

"${report.ai_summary}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}
AI-POWERED RECOMMENDATIONS

`;

  recommendations.forEach((rec, index) => {
    text += `
${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}
   Category: ${rec.category}

   ${rec.description}

   Impact: ${rec.impact}
`;

    if (rec.actions && rec.actions.length > 0) {
      text += `
   Action Items:`;
      rec.actions.slice(0, 5).forEach(action => {
        text += `
   • ${action.suggestion}`;
      });
    }
    text += '\n';
  });

  text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WE WANT TO HEAR FROM YOU

Your input helps us focus on what matters most to your business.
Take a moment to reply with your thoughts:

1. WHICH RECOMMENDATIONS ABOVE WOULD YOU LIKE US TO PRIORITIZE?
   Let us know which ones align best with your current goals -
   we'll build our action plan around your priorities.

2. IS THERE ANYTHING ELSE WE SHOULD KNOW?
   Upcoming promotions, new services, seasonal priorities,
   specific keywords you want to target - anything that helps
   us help you better.

Just hit reply - we read every response.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This report was generated by Visionary Advance.
Questions? Reply to this email or visit visionaryadvance.com
`;

  return text.trim();
}

/**
 * Format date range for display
 */
function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

/**
 * Format percentage change for HTML
 */
function formatChange(change, isPercentagePoints = false, invertColors = false) {
  if (change === null || change === undefined) return '';

  const isPositive = invertColors ? change > 0 : change > 0;
  const color = isPositive ? '#22c55e' : change < 0 ? '#ef4444' : '#6b7280';
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '';
  const suffix = isPercentagePoints ? 'pts' : '%';

  return `<p style="margin: 4px 0 0 0; color: ${color}; font-size: 12px;">${arrow} ${Math.abs(change).toFixed(1)}${suffix} vs prev period</p>`;
}

/**
 * Format percentage change for plain text
 */
function formatChangeText(change) {
  if (change === null || change === undefined) return 'no change';
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '';
  return `${arrow}${Math.abs(change).toFixed(1)}%`;
}

/**
 * Format percentage change inline (for table cells)
 */
function formatChangeInline(change, isPercentagePoints = false, invertColors = false) {
  if (change === null || change === undefined) return '<span style="color: #6b7280;">—</span>';

  const isPositive = invertColors ? change > 0 : change > 0;
  const color = isPositive ? '#22c55e' : change < 0 ? '#ef4444' : '#6b7280';
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '';
  const suffix = isPercentagePoints ? 'pts' : '%';

  return `<span style="color: ${color}; font-weight: 600;">${arrow} ${Math.abs(change).toFixed(1)}${suffix}</span>`;
}
