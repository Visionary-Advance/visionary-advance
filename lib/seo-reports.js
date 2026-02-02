// lib/seo-reports.js
// SEO Report Generation with AI-Powered Recommendations

import { getAnalyticsSummary, getCachedAnalytics, getSiteById } from './search-console';
import { generateAIRecommendations } from './claude-seo';

// Lazy-load Supabase client
let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  return supabaseClient;
}

/**
 * Generate an SEO report comparing the last 2 full months
 */
export async function generateReport(siteId) {
  const site = await getSiteById(siteId);
  if (!site) throw new Error('Site not found');

  // Calculate last 2 full months
  const now = new Date();

  // Current month (last full month)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of previous month

  // Previous month (month before that)
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0); // Last day of 2 months ago
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1); // First day of 2 months ago

  // Format dates
  const currentStartDate = formatDate(currentMonthStart);
  const currentEndDate = formatDate(currentMonthEnd);
  const previousStartDate = formatDate(previousMonthStart);
  const previousEndDate = formatDate(previousMonthEnd);

  // Get month names for display
  const currentMonthName = currentMonthStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const previousMonthName = previousMonthStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  console.log(`Generating report comparing ${currentMonthName} vs ${previousMonthName}`);

  // Get data for both months
  const currentData = await getCachedAnalytics(siteId, currentStartDate, currentEndDate);
  const previousData = await getCachedAnalytics(siteId, previousStartDate, previousEndDate);

  // Calculate metrics for each month
  const currentMetrics = calculateMetrics(currentData);
  const previousMetrics = calculateMetrics(previousData);

  // Calculate changes
  const changes = calculateChanges(currentMetrics, previousMetrics);

  // Build month comparison object for AI analysis
  const monthComparisonData = {
    currentMonth: {
      name: currentMonthName,
      startDate: currentStartDate,
      endDate: currentEndDate,
      metrics: currentMetrics,
      dailyData: currentData
    },
    previousMonth: {
      name: previousMonthName,
      startDate: previousStartDate,
      endDate: previousEndDate,
      metrics: previousMetrics,
      dailyData: previousData
    }
  };

  // Generate AI-powered recommendations using Claude
  console.log('Generating AI recommendations with Claude...');
  let aiAnalysis;
  try {
    aiAnalysis = await generateAIRecommendations(
      site,
      monthComparisonData.currentMonth,
      monthComparisonData.previousMonth,
      changes
    );
  } catch (aiError) {
    console.error('Claude API error:', aiError);
    // Fallback to basic recommendations if Claude fails
    aiAnalysis = {
      summary: 'Unable to generate AI analysis. Please review the metrics manually.',
      recommendations: []
    };
  }

  const recommendations = aiAnalysis.recommendations;
  const aiSummary = aiAnalysis.summary;

  // Store report with month comparison data
  const report = await storeReport({
    siteId,
    startDate: currentStartDate,
    endDate: currentEndDate,
    metrics: currentMetrics,
    changes,
    recommendations,
    aiSummary,
    monthComparison: {
      currentMonth: {
        name: currentMonthName,
        startDate: currentStartDate,
        endDate: currentEndDate,
        metrics: currentMetrics
      },
      previousMonth: {
        name: previousMonthName,
        startDate: previousStartDate,
        endDate: previousEndDate,
        metrics: previousMetrics
      }
    }
  });

  return {
    ...report,
    site,
    currentMetrics,
    previousMetrics,
    currentMonthName,
    previousMonthName,
    changes,
    recommendations
  };
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate aggregate metrics from daily data
 */
function calculateMetrics(data) {
  if (!data || data.length === 0) {
    return { totalClicks: 0, totalImpressions: 0, avgCtr: 0, avgPosition: 0 };
  }

  const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0);
  const totalImpressions = data.reduce((sum, d) => sum + (d.impressions || 0), 0);
  const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgPosition = data.reduce((sum, d) => sum + (d.position || 0), 0) / data.length;

  return { totalClicks, totalImpressions, avgCtr, avgPosition };
}

/**
 * Calculate percentage changes between periods
 */
function calculateChanges(current, previous) {
  const calcChange = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  return {
    clicksChange: calcChange(current.totalClicks, previous.totalClicks),
    impressionsChange: calcChange(current.totalImpressions, previous.totalImpressions),
    ctrChange: current.avgCtr - previous.avgCtr,
    positionChange: previous.avgPosition - current.avgPosition // Positive = improvement (lower position is better)
  };
}

/**
 * Store generated report in database
 */
async function storeReport({ siteId, startDate, endDate, metrics, changes, recommendations, aiSummary, monthComparison }) {
  const supabase = getSupabase();

  // Store all extended data inside the recommendations JSON to avoid schema issues
  const reportData = {
    recommendations,
    ai_summary: aiSummary,
    month_comparison: monthComparison
  };

  const { data, error } = await supabase
    .from('seo_reports')
    .insert({
      site_id: siteId,
      start_date: startDate,
      end_date: endDate,
      total_clicks: metrics.totalClicks,
      total_impressions: metrics.totalImpressions,
      avg_ctr: metrics.avgCtr,
      avg_position: metrics.avgPosition,
      clicks_change: changes.clicksChange,
      impressions_change: changes.impressionsChange,
      ctr_change: changes.ctrChange,
      position_change: changes.positionChange,
      recommendations: reportData
    })
    .select()
    .single();

  if (error) throw error;

  // Return with month_comparison at top level for easy access
  return {
    ...data,
    recommendations: reportData.recommendations,
    month_comparison: reportData.month_comparison
  };
}

/**
 * Get reports for a site
 */
export async function getReports(siteId, limit = 10) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_reports')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Extract extended data from recommendations for each report
  return (data || []).map(report => {
    if (report.recommendations?.month_comparison) {
      return {
        ...report,
        month_comparison: report.recommendations.month_comparison,
        ai_summary: report.recommendations.ai_summary,
        recommendations: report.recommendations.recommendations || []
      };
    }
    return report;
  });
}

/**
 * Get a single report by ID
 */
export async function getReportById(reportId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_reports')
    .select(`
      *,
      site:seo_sites(id, site_url, display_name, google_email)
    `)
    .eq('id', reportId)
    .single();

  if (error) throw error;

  // Extract extended data from recommendations if stored together
  if (data && data.recommendations?.month_comparison) {
    data.month_comparison = data.recommendations.month_comparison;
    data.ai_summary = data.recommendations.ai_summary;
    data.recommendations = data.recommendations.recommendations || [];
  }

  return data;
}

/**
 * Mark report as sent
 */
export async function markReportSent(reportId, recipients) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('seo_reports')
    .update({
      status: 'sent',
      sent_to: recipients,
      sent_at: new Date().toISOString()
    })
    .eq('id', reportId);

  if (error) throw error;
  return true;
}

/**
 * Delete a report
 */
export async function deleteReport(reportId) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('seo_reports')
    .delete()
    .eq('id', reportId);

  if (error) throw error;
  return true;
}

// ============================================
// Report Schedules
// ============================================

/**
 * Get schedule for a site
 */
export async function getReportSchedule(siteId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_report_schedules')
    .select('*')
    .eq('site_id', siteId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
  return data;
}

/**
 * Create or update report schedule
 */
export async function upsertReportSchedule(siteId, scheduleData) {
  const supabase = getSupabase();

  const { frequency, dayOfWeek, dayOfMonth, timeUtc, recipients, isActive } = scheduleData;

  // Calculate next run time
  const nextRunAt = calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeUtc);

  const { data, error } = await supabase
    .from('seo_report_schedules')
    .upsert({
      site_id: siteId,
      frequency,
      day_of_week: dayOfWeek,
      day_of_month: dayOfMonth,
      time_utc: timeUtc,
      recipients,
      is_active: isActive !== false,
      next_run_at: nextRunAt,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'site_id,frequency'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete report schedule
 */
export async function deleteReportSchedule(scheduleId) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('seo_report_schedules')
    .delete()
    .eq('id', scheduleId);

  if (error) throw error;
  return true;
}

/**
 * Get all schedules due to run
 */
export async function getDueSchedules() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_report_schedules')
    .select(`
      *,
      site:seo_sites(id, site_url, display_name, google_email)
    `)
    .eq('is_active', true)
    .lte('next_run_at', new Date().toISOString());

  if (error) throw error;
  return data || [];
}

/**
 * Update schedule after running
 */
export async function updateScheduleAfterRun(scheduleId, frequency, dayOfWeek, dayOfMonth, timeUtc) {
  const supabase = getSupabase();

  const nextRunAt = calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeUtc);

  const { error } = await supabase
    .from('seo_report_schedules')
    .update({
      last_run_at: new Date().toISOString(),
      next_run_at: nextRunAt
    })
    .eq('id', scheduleId);

  if (error) throw error;
  return true;
}

// ============================================
// Helpers
// ============================================

function getDateString(daysOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeUtc) {
  const now = new Date();
  const [hours, minutes] = (timeUtc || '09:00').split(':').map(Number);

  let next = new Date(now);
  next.setUTCHours(hours, minutes, 0, 0);

  if (frequency === 'daily') {
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
  } else if (frequency === 'weekly') {
    const targetDay = dayOfWeek || 1; // Default to Monday
    const currentDay = next.getUTCDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0 || (daysUntil === 0 && next <= now)) {
      daysUntil += 7;
    }
    next.setDate(next.getDate() + daysUntil);
  } else if (frequency === 'monthly') {
    const targetDate = dayOfMonth || 1;
    next.setUTCDate(targetDate);
    if (next <= now) {
      next.setUTCMonth(next.getUTCMonth() + 1);
    }
  }

  return next.toISOString();
}
