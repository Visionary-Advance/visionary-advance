// app/api/seo/plans/route.js
// SEO Plan endpoints - list plans and generate new plans

import { NextResponse } from 'next/server';
import { getPlans, getActivePlan, createPlan } from '@/lib/seo-plans';
import { getSiteById, getCachedAnalytics, getDetailedAnalytics } from '@/lib/search-console';
import { generateSEOPlan } from '@/lib/claude-seo';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    if (activeOnly) {
      const plan = await getActivePlan(siteId);
      return NextResponse.json({ plan });
    }

    const plans = await getPlans(siteId);
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { siteId } = await request.json();

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    const site = await getSiteById(siteId);
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Calculate date ranges for last 2 full months
    const now = new Date();
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const fmt = d => d.toISOString().split('T')[0];
    const currentStartDate = fmt(currentMonthStart);
    const currentEndDate = fmt(currentMonthEnd);
    const previousStartDate = fmt(previousMonthStart);
    const previousEndDate = fmt(previousMonthEnd);

    const currentMonthName = currentMonthStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const previousMonthName = previousMonthStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Get cached data for both months
    const currentData = await getCachedAnalytics(siteId, currentStartDate, currentEndDate);
    const previousData = await getCachedAnalytics(siteId, previousStartDate, previousEndDate);

    // Get detailed analytics for richer Claude analysis
    const currentDetailed = await getDetailedAnalytics(siteId, currentStartDate, currentEndDate);
    const previousDetailed = await getDetailedAnalytics(siteId, previousStartDate, previousEndDate);

    // Attach previous queries for movement analysis
    if (currentDetailed && previousDetailed) {
      currentDetailed.previousQueries = previousDetailed.queries;
    }

    // Calculate metrics
    const calcMetrics = (data) => {
      if (!data || data.length === 0) return { totalClicks: 0, totalImpressions: 0, avgCtr: 0, avgPosition: 0 };
      const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0);
      const totalImpressions = data.reduce((sum, d) => sum + (d.impressions || 0), 0);
      return {
        totalClicks,
        totalImpressions,
        avgCtr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
        avgPosition: data.reduce((sum, d) => sum + (d.position || 0), 0) / data.length
      };
    };

    const currentMetrics = calcMetrics(currentData);
    const previousMetrics = calcMetrics(previousData);

    const calcChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    const changes = {
      clicksChange: calcChange(currentMetrics.totalClicks, previousMetrics.totalClicks),
      impressionsChange: calcChange(currentMetrics.totalImpressions, previousMetrics.totalImpressions),
      ctrChange: currentMetrics.avgCtr - previousMetrics.avgCtr,
      positionChange: previousMetrics.avgPosition - currentMetrics.avgPosition
    };

    // Generate plan with Claude
    const planData = await generateSEOPlan(
      site,
      { name: currentMonthName, metrics: currentMetrics, dailyData: currentData },
      { name: previousMonthName, metrics: previousMetrics, dailyData: previousData },
      changes,
      { detailedAnalytics: currentDetailed }
    );

    // Persist the plan
    const plan = await createPlan(siteId, planData);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
