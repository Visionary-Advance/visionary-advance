// lib/seo-reports.js
// SEO Report Generation with AI-Powered Plans

import { getAnalyticsSummary, getCachedAnalytics, getSiteById } from './search-console';
import { generateAIRecommendations, generateSEOPlan, formatPlanForClaudeCode } from './claude-seo';
import { createProject } from './projects';

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

  // Generate SEO plan for the month
  console.log('Generating monthly SEO plan...');
  let seoPlan = null;
  let projectCreated = null;

  try {
    seoPlan = await generateSEOPlan(
      site,
      monthComparisonData.currentMonth,
      monthComparisonData.previousMonth,
      changes
    );
    console.log('SEO plan generated successfully:', seoPlan?.tasks?.length || 0, 'tasks');
  } catch (planError) {
    console.error('Failed to generate SEO plan with Claude:', planError);
    // Create a fallback plan based on the data we have
    seoPlan = createFallbackPlan(site, currentMonthName, currentMetrics, changes);
    console.log('Using fallback SEO plan');
  }

  // Ensure we always have a plan
  if (!seoPlan) {
    console.log('SEO plan is null, creating fallback');
    seoPlan = createFallbackPlan(site, currentMonthName, currentMetrics, changes);
  }

  // Create a CRM project if site has a linked business
  if (site.business_id && seoPlan) {
    const projectName = `${site.display_name} ${currentMonthName} SEO Plan`;
    const projectDescription = formatPlanForClaudeCode(seoPlan, site);

    try {
      // Find a client from this business to link the project to
      const { getBusinessContacts } = await import('./businesses');
      const contacts = await getBusinessContacts(site.business_id);
      const client = contacts.find(c => c.is_client) || contacts[0];

      if (client) {
        projectCreated = await createProject(client.id, {
          name: projectName,
          description: projectDescription,
          status: 'planning',
          tags: ['seo', 'monthly-plan', currentMonthName.toLowerCase().replace(' ', '-')],
          milestones: seoPlan.tasks.map((task, idx) => ({
            id: `seo-task-${Date.now()}-${idx}`,
            name: task.title,
            description: task.description,
            status: 'pending',
            due_date: null
          }))
        }, 'SEO Report System');

        console.log(`Created SEO project: ${projectName} (ID: ${projectCreated.id}) for client: ${client.id}`);
      } else {
        console.log('No contacts found in business - skipping project creation');
      }
    } catch (projectError) {
      console.error('Failed to create SEO project:', projectError);
    }
  } else if (!site.business_id) {
    console.log('Site has no linked business_id - skipping project creation');
  }

  // Store report with month comparison data
  const report = await storeReport({
    siteId,
    startDate: currentStartDate,
    endDate: currentEndDate,
    metrics: currentMetrics,
    changes,
    recommendations,
    aiSummary,
    seoPlan,
    projectId: projectCreated?.id || null,
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
    recommendations,
    seoPlan,
    project: projectCreated
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
async function storeReport({ siteId, startDate, endDate, metrics, changes, recommendations, aiSummary, seoPlan, projectId, monthComparison }) {
  const supabase = getSupabase();

  // Store all extended data inside the recommendations JSON to avoid schema issues
  const reportData = {
    recommendations,
    ai_summary: aiSummary,
    month_comparison: monthComparison,
    seo_plan: seoPlan,
    project_id: projectId
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
        seo_plan: report.recommendations.seo_plan,
        project_id: report.recommendations.project_id,
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
    data.seo_plan = data.recommendations.seo_plan;
    data.project_id = data.recommendations.project_id;
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

/**
 * Create a fallback SEO plan when Claude API fails
 */
function createFallbackPlan(site, monthName, metrics, changes) {
  const tasks = [];

  // Add tasks based on the data
  if (changes.clicksChange < 0) {
    tasks.push({
      id: 1,
      priority: 'high',
      category: 'content',
      title: 'Address Declining Clicks',
      description: `Clicks decreased by ${Math.abs(changes.clicksChange).toFixed(1)}% compared to the previous month. Review top-performing pages and identify opportunities to improve click-through rates with better meta titles and descriptions.`,
      files_to_modify: [],
      acceptance_criteria: ['Review top 10 pages by impressions', 'Update meta titles and descriptions', 'Improve CTAs in search results'],
      estimated_effort: 'medium'
    });
  }

  if (changes.impressionsChange < 0) {
    tasks.push({
      id: tasks.length + 1,
      priority: 'high',
      category: 'content',
      title: 'Improve Search Visibility',
      description: `Impressions decreased by ${Math.abs(changes.impressionsChange).toFixed(1)}%. Create new content targeting relevant keywords and update existing content to improve rankings.`,
      files_to_modify: [],
      acceptance_criteria: ['Identify 5 new keyword opportunities', 'Create or update 2-3 pieces of content', 'Monitor ranking changes'],
      estimated_effort: 'large'
    });
  }

  if (changes.positionChange < 0) {
    tasks.push({
      id: tasks.length + 1,
      priority: 'medium',
      category: 'on-page',
      title: 'Improve Search Rankings',
      description: `Average position declined by ${Math.abs(changes.positionChange).toFixed(1)} positions. Focus on on-page SEO improvements and internal linking.`,
      files_to_modify: [],
      acceptance_criteria: ['Audit on-page SEO for top pages', 'Improve internal linking structure', 'Update content freshness'],
      estimated_effort: 'medium'
    });
  }

  // Always add these baseline tasks
  tasks.push({
    id: tasks.length + 1,
    priority: 'medium',
    category: 'technical',
    title: 'Technical SEO Audit',
    description: 'Perform a technical SEO audit to identify and fix any issues affecting search performance.',
    files_to_modify: [],
    acceptance_criteria: ['Check for crawl errors', 'Verify sitemap is up to date', 'Review Core Web Vitals'],
    estimated_effort: 'small'
  });

  tasks.push({
    id: tasks.length + 1,
    priority: 'low',
    category: 'analytics',
    title: 'Review Analytics Setup',
    description: 'Ensure proper tracking is in place and review data for insights.',
    files_to_modify: [],
    acceptance_criteria: ['Verify Google Analytics tracking', 'Check Search Console for issues', 'Document key metrics baseline'],
    estimated_effort: 'small'
  });

  return {
    month: monthName,
    summary: `This month's SEO plan focuses on addressing performance changes and maintaining best practices. ${changes.clicksChange >= 0 ? 'Clicks are trending positively.' : 'Clicks need attention.'} ${changes.impressionsChange >= 0 ? 'Visibility is stable or improving.' : 'Visibility needs improvement.'}`,
    goals: [
      changes.clicksChange < 0 ? 'Reverse declining click trends' : 'Maintain or improve click-through rates',
      changes.impressionsChange < 0 ? 'Increase search visibility' : 'Expand keyword coverage',
      'Ensure technical SEO health'
    ],
    tasks,
    metrics_to_track: [
      {
        metric: 'Total Clicks',
        current_value: metrics.totalClicks?.toLocaleString() || '0',
        target_value: `${Math.round((metrics.totalClicks || 0) * 1.1).toLocaleString()} (+10%)`
      },
      {
        metric: 'Total Impressions',
        current_value: metrics.totalImpressions?.toLocaleString() || '0',
        target_value: `${Math.round((metrics.totalImpressions || 0) * 1.1).toLocaleString()} (+10%)`
      },
      {
        metric: 'Average Position',
        current_value: (metrics.avgPosition || 0).toFixed(1),
        target_value: Math.max(1, (metrics.avgPosition || 10) - 2).toFixed(1)
      }
    ]
  };
}
