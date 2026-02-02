// app/api/cron/seo-reports/route.js
// Cron job to run scheduled SEO reports

import { NextResponse } from 'next/server';
import { getDueSchedules, updateScheduleAfterRun, generateReport } from '@/lib/seo-reports';
import { sendReportEmail } from '@/lib/seo-email';
import { syncSiteAnalytics } from '@/lib/search-console';

export async function GET(request) {
  try {
    // Verify cron secret (for Vercel cron jobs)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Running SEO report cron job...');

    // Get all schedules that are due
    const dueSchedules = await getDueSchedules();
    console.log(`Found ${dueSchedules.length} due schedules`);

    const results = [];

    for (const schedule of dueSchedules) {
      try {
        console.log(`Processing schedule for site: ${schedule.site?.display_name}`);

        // Sync latest data first (last 2 months)
        await syncSiteAnalytics(schedule.site_id, 60);

        // Generate report (compares last 2 full months)
        const report = await generateReport(schedule.site_id);

        // Send email
        await sendReportEmail(report, schedule.recipients, schedule.site);

        // Update schedule with next run time
        await updateScheduleAfterRun(
          schedule.id,
          schedule.frequency,
          schedule.day_of_week,
          schedule.day_of_month,
          schedule.time_utc
        );

        results.push({
          scheduleId: schedule.id,
          siteName: schedule.site?.display_name,
          success: true,
          recipients: schedule.recipients
        });

        console.log(`Successfully sent report for ${schedule.site?.display_name}`);
      } catch (err) {
        console.error(`Failed to process schedule ${schedule.id}:`, err);
        results.push({
          scheduleId: schedule.id,
          siteName: schedule.site?.display_name,
          success: false,
          error: err.message
        });
      }
    }

    return NextResponse.json({
      processed: results.length,
      results
    });
  } catch (error) {
    console.error('SEO report cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
