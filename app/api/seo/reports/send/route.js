// app/api/seo/reports/send/route.js
// Send SEO report via email

import { NextResponse } from 'next/server';
import { getReportById, markReportSent } from '@/lib/seo-reports';
import { sendReportEmail } from '@/lib/seo-email';

export async function POST(request) {
  try {
    const { reportId, recipients } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: 'reportId is required' }, { status: 400 });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'recipients array is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return NextResponse.json({
        error: `Invalid email addresses: ${invalidEmails.join(', ')}`
      }, { status: 400 });
    }

    // Get the report
    const report = await getReportById(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Send email
    console.log(`Sending SEO report ${reportId} to: ${recipients.join(', ')}`);
    const result = await sendReportEmail(report, recipients, report.site);

    // Mark as sent
    await markReportSent(reportId, recipients);

    return NextResponse.json({
      success: true,
      messageId: result.id,
      sentTo: recipients
    });
  } catch (error) {
    console.error('Error sending report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
