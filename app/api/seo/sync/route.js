// app/api/seo/sync/route.js
// Sync SEO data from Search Console

import { NextResponse } from 'next/server';
import { syncSiteAnalytics, syncSitemaps, getSiteById, getSites } from '@/lib/search-console';

export async function POST(request) {
  try {
    const { siteId, type = 'all', days = 28 } = await request.json();

    // If no siteId, sync all sites
    if (!siteId) {
      const sites = await getSites();
      const results = [];

      for (const site of sites) {
        try {
          if (type === 'all' || type === 'analytics') {
            await syncSiteAnalytics(site.id, days);
          }
          if (type === 'all' || type === 'sitemaps') {
            await syncSitemaps(site.id);
          }
          results.push({ siteId: site.id, success: true });
        } catch (err) {
          results.push({ siteId: site.id, success: false, error: err.message });
        }
      }

      return NextResponse.json({ results });
    }

    // Sync specific site
    const site = await getSiteById(siteId);
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    const results = {};

    if (type === 'all' || type === 'analytics') {
      results.analytics = await syncSiteAnalytics(siteId, days);
    }

    if (type === 'all' || type === 'sitemaps') {
      results.sitemaps = await syncSitemaps(siteId);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error syncing SEO data:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
