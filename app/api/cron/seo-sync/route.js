// app/api/cron/seo-sync/route.js
// Pulls fresh Search Console data for every tracked site twice a day, so the
// SEO dashboard is current without anyone pressing Sync.

import { NextResponse } from 'next/server'
import { verifyCronRequest } from '@/lib/admin-api-auth'
import { autoSyncSiteAnalytics, syncSitemaps, getSites } from '@/lib/search-console'

export const maxDuration = 300

export async function GET(request) {
  const auth = verifyCronRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const sites = await getSites()
    const results = []

    // One site at a time keeps us well under Search Console's rate limits
    for (const site of sites) {
      try {
        const analytics = await autoSyncSiteAnalytics(site.id)
        await syncSitemaps(site.id).catch(err =>
          console.error(`Sitemap sync failed for ${site.site_url}:`, err)
        )
        results.push({ siteId: site.id, site: site.display_name || site.site_url, success: true, ...analytics })
      } catch (err) {
        console.error(`SEO sync failed for ${site.site_url}:`, err)
        results.push({ siteId: site.id, site: site.display_name || site.site_url, success: false, error: err.message })
      }
    }

    console.log('SEO sync completed:', results)
    return NextResponse.json({ success: true, results, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('SEO sync cron error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
