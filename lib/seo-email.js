// lib/seo-email.js
// SEO Report Email Generation and Sending

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email - can be overridden with RESEND_FROM_EMAIL env var
const DEFAULT_FROM_EMAIL = 'SEO Reports <noreply@mail.visionaryadvance.com>';
// Reply-to email for client responses - set SEO_REPLY_TO_EMAIL in env
const DEFAULT_REPLY_TO = 'info@visionaryadvance.com';

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
  const monthComparison = report.month_comparison;
  const currentMonth = monthComparison?.currentMonth;
  const previousMonth = monthComparison?.previousMonth;

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

          <!-- Questions CTA -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6; text-align: center;">
                Have questions about this report? Just reply to this email and we'll get back to you.
              </p>
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
`;

  text += `
Have questions about this report? Just reply to this email and we'll get back to you.

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
  if (change === null || change === undefined) return '<span style="color: #6b7280;">-</span>';

  const isPositive = invertColors ? change > 0 : change > 0;
  const color = isPositive ? '#22c55e' : change < 0 ? '#ef4444' : '#6b7280';
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '';
  const suffix = isPercentagePoints ? 'pts' : '%';

  return `<span style="color: ${color}; font-weight: 600;">${arrow} ${Math.abs(change).toFixed(1)}${suffix}</span>`;
}
