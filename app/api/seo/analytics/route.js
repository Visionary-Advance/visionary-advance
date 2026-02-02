// app/api/seo/analytics/route.js
// Get SEO analytics data

import { NextResponse } from 'next/server';
import { getAnalyticsSummary, getCachedAnalytics, getSiteById } from '@/lib/search-console';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const days = parseInt(searchParams.get('days') || '28', 10);
    const detailed = searchParams.get('detailed') === 'true';

    if (!siteId) {
      return NextResponse.json(
        { error: 'siteId query parameter is required' },
        { status: 400 }
      );
    }

    // Verify site exists
    const site = await getSiteById(siteId);
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    if (detailed) {
      // Return raw cached data
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 1);

      const data = await getCachedAnalytics(
        siteId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      return NextResponse.json({ site, data });
    }

    // Return aggregated summary
    const summary = await getAnalyticsSummary(siteId, days);

    return NextResponse.json({ site, ...summary });
  } catch (error) {
    console.error('Error fetching SEO analytics:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
