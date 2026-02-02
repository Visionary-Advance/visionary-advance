// lib/search-console.js
// Google Search Console API integration

import { getValidGoogleToken } from './google-auth';

const SEARCH_CONSOLE_API = 'https://www.googleapis.com/webmasters/v3';
const SEARCH_ANALYTICS_API = 'https://searchconsole.googleapis.com/webmasters/v3';

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
 * Make authenticated request to Search Console API
 */
async function searchConsoleRequest(email, endpoint, options = {}) {
  const token = await getValidGoogleToken(email);
  if (!token) {
    throw new Error('No valid Google token available');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${SEARCH_ANALYTICS_API}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error?.message || error.error || `API request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * List all sites the user has access to in Search Console
 */
export async function listSearchConsoleSites(email) {
  const data = await searchConsoleRequest(email, '/sites');
  return data.siteEntry || [];
}

/**
 * Get search analytics data for a site
 * @param {string} email - Google account email
 * @param {string} siteUrl - Site URL (e.g., 'sc-domain:example.com' or 'https://example.com/')
 * @param {object} options - Query options
 */
export async function getSearchAnalytics(email, siteUrl, options = {}) {
  const {
    startDate = getDateString(-28), // Default to last 28 days
    endDate = getDateString(-1), // Yesterday (today's data is incomplete)
    dimensions = ['query'], // query, page, country, device, date
    rowLimit = 1000,
    startRow = 0,
    dimensionFilterGroups = []
  } = options;

  const requestBody = {
    startDate,
    endDate,
    dimensions,
    rowLimit,
    startRow
  };

  if (dimensionFilterGroups.length > 0) {
    requestBody.dimensionFilterGroups = dimensionFilterGroups;
  }

  const encodedSiteUrl = encodeURIComponent(siteUrl);
  return searchConsoleRequest(
    email,
    `/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }
  );
}

/**
 * Get sitemaps for a site
 */
export async function getSitemaps(email, siteUrl) {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const data = await searchConsoleRequest(email, `/sites/${encodedSiteUrl}/sitemaps`);
  return data.sitemap || [];
}

/**
 * Get URL inspection data (limited to 600 requests/minute)
 */
export async function inspectUrl(email, siteUrl, inspectionUrl) {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  return searchConsoleRequest(
    email,
    `/sites/${encodedSiteUrl}/urlInspection/index:inspect`,
    {
      method: 'POST',
      body: JSON.stringify({
        inspectionUrl,
        siteUrl
      })
    }
  );
}

// ============================================
// Database Operations
// ============================================

/**
 * Add a new site to track
 */
export async function addSite(siteUrl, googleEmail, displayName = null) {
  const supabase = getSupabase();

  // Verify the site exists in Search Console
  const sites = await listSearchConsoleSites(googleEmail);
  const site = sites.find(s => s.siteUrl === siteUrl);

  if (!site) {
    throw new Error('Site not found in Search Console. Please add it to Search Console first.');
  }

  const { data, error } = await supabase
    .from('seo_sites')
    .upsert({
      site_url: siteUrl,
      display_name: displayName || extractDomain(siteUrl),
      google_email: googleEmail,
      permission_level: site.permissionLevel,
      is_active: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'site_url'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all tracked sites
 */
export async function getSites(googleEmail = null) {
  const supabase = getSupabase();

  let query = supabase
    .from('seo_sites')
    .select('*')
    .eq('is_active', true)
    .order('display_name');

  if (googleEmail) {
    query = query.eq('google_email', googleEmail);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Get a single site by ID
 */
export async function getSiteById(siteId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_sites')
    .select('*')
    .eq('id', siteId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a site from tracking
 */
export async function removeSite(siteId) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('seo_sites')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', siteId);

  if (error) throw error;
  return true;
}

/**
 * Sync analytics data for a site
 */
export async function syncSiteAnalytics(siteId, days = 28) {
  const supabase = getSupabase();

  // Get site info
  const site = await getSiteById(siteId);
  if (!site) throw new Error('Site not found');

  const results = [];

  // Fetch daily data for the date range
  for (let i = 1; i <= days; i++) {
    const date = getDateString(-i);

    try {
      // Get aggregate metrics
      const analytics = await getSearchAnalytics(site.google_email, site.site_url, {
        startDate: date,
        endDate: date,
        dimensions: ['date'],
        rowLimit: 1
      });

      const row = analytics.rows?.[0] || {};

      // Get top queries for the day
      const queriesData = await getSearchAnalytics(site.google_email, site.site_url, {
        startDate: date,
        endDate: date,
        dimensions: ['query'],
        rowLimit: 10
      });

      // Get top pages for the day
      const pagesData = await getSearchAnalytics(site.google_email, site.site_url, {
        startDate: date,
        endDate: date,
        dimensions: ['page'],
        rowLimit: 10
      });

      // Get device breakdown
      const devicesData = await getSearchAnalytics(site.google_email, site.site_url, {
        startDate: date,
        endDate: date,
        dimensions: ['device'],
        rowLimit: 5
      });

      // Get country breakdown
      const countriesData = await getSearchAnalytics(site.google_email, site.site_url, {
        startDate: date,
        endDate: date,
        dimensions: ['country'],
        rowLimit: 10
      });

      // Store in cache
      const { error } = await supabase
        .from('seo_analytics_cache')
        .upsert({
          site_id: siteId,
          date: date,
          clicks: row.clicks || 0,
          impressions: row.impressions || 0,
          ctr: row.ctr || 0,
          position: row.position || 0,
          queries: queriesData.rows || [],
          pages: pagesData.rows || [],
          devices: devicesData.rows || [],
          countries: countriesData.rows || []
        }, {
          onConflict: 'site_id,date'
        });

      if (error) console.error(`Error caching data for ${date}:`, error);
      results.push({ date, success: !error });

    } catch (err) {
      console.error(`Error fetching data for ${date}:`, err);
      results.push({ date, success: false, error: err.message });
    }
  }

  // Update last sync time
  await supabase
    .from('seo_sites')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', siteId);

  return results;
}

/**
 * Sync sitemap data for a site
 */
export async function syncSitemaps(siteId) {
  const supabase = getSupabase();

  const site = await getSiteById(siteId);
  if (!site) throw new Error('Site not found');

  const sitemaps = await getSitemaps(site.google_email, site.site_url);

  for (const sitemap of sitemaps) {
    const { error } = await supabase
      .from('seo_sitemaps')
      .upsert({
        site_id: siteId,
        path: sitemap.path,
        type: sitemap.type,
        is_pending: sitemap.isPending || false,
        is_sitemaps_index: sitemap.isSitemapsIndex || false,
        last_submitted: sitemap.lastSubmitted,
        last_downloaded: sitemap.lastDownloaded,
        warnings: sitemap.warnings || 0,
        errors: sitemap.errors || 0,
        contents: sitemap.contents || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'site_id,path'
      });

    if (error) console.error('Error syncing sitemap:', error);
  }

  return sitemaps;
}

/**
 * Get cached analytics for a site
 */
export async function getCachedAnalytics(siteId, startDate, endDate) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_analytics_cache')
    .select('*')
    .eq('site_id', siteId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get aggregated analytics summary
 */
export async function getAnalyticsSummary(siteId, days = 28) {
  const startDate = getDateString(-days);
  const endDate = getDateString(-1);

  const cached = await getCachedAnalytics(siteId, startDate, endDate);

  if (cached.length === 0) {
    return {
      totalClicks: 0,
      totalImpressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      topQueries: [],
      topPages: [],
      dailyData: []
    };
  }

  // Aggregate metrics
  const totalClicks = cached.reduce((sum, d) => sum + (d.clicks || 0), 0);
  const totalImpressions = cached.reduce((sum, d) => sum + (d.impressions || 0), 0);
  const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgPosition = cached.reduce((sum, d) => sum + (d.position || 0), 0) / cached.length;

  // Aggregate top queries
  const queryMap = new Map();
  cached.forEach(day => {
    (day.queries || []).forEach(q => {
      const key = q.keys?.[0] || q.query;
      if (!key) return;
      const existing = queryMap.get(key) || { clicks: 0, impressions: 0 };
      queryMap.set(key, {
        clicks: existing.clicks + (q.clicks || 0),
        impressions: existing.impressions + (q.impressions || 0)
      });
    });
  });
  const topQueries = Array.from(queryMap.entries())
    .map(([query, data]) => ({ query, ...data }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Aggregate top pages
  const pageMap = new Map();
  cached.forEach(day => {
    (day.pages || []).forEach(p => {
      const key = p.keys?.[0] || p.page;
      if (!key) return;
      const existing = pageMap.get(key) || { clicks: 0, impressions: 0 };
      pageMap.set(key, {
        clicks: existing.clicks + (p.clicks || 0),
        impressions: existing.impressions + (p.impressions || 0)
      });
    });
  });
  const topPages = Array.from(pageMap.entries())
    .map(([page, data]) => ({ page, ...data }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  return {
    totalClicks,
    totalImpressions,
    avgCtr,
    avgPosition,
    topQueries,
    topPages,
    dailyData: cached.map(d => ({
      date: d.date,
      clicks: d.clicks,
      impressions: d.impressions,
      ctr: d.ctr,
      position: d.position
    })).sort((a, b) => new Date(a.date) - new Date(b.date))
  };
}

// ============================================
// Dashboard Widgets
// ============================================

/**
 * Get dashboard widgets for a user
 */
export async function getDashboardWidgets(userEmail) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_dashboard_widgets')
    .select(`
      *,
      site:seo_sites(id, site_url, display_name)
    `)
    .eq('user_email', userEmail)
    .eq('is_visible', true)
    .order('position');

  if (error) throw error;
  return data || [];
}

/**
 * Add a dashboard widget
 */
export async function addDashboardWidget(userEmail, widgetType, siteId = null, config = {}) {
  const supabase = getSupabase();

  // Get max position
  const { data: existing } = await supabase
    .from('seo_dashboard_widgets')
    .select('position')
    .eq('user_email', userEmail)
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = (existing?.[0]?.position || 0) + 1;

  const { data, error } = await supabase
    .from('seo_dashboard_widgets')
    .insert({
      user_email: userEmail,
      widget_type: widgetType,
      site_id: siteId,
      config,
      position: nextPosition
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a dashboard widget
 */
export async function removeDashboardWidget(widgetId, userEmail) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('seo_dashboard_widgets')
    .delete()
    .eq('id', widgetId)
    .eq('user_email', userEmail);

  if (error) throw error;
  return true;
}

/**
 * Update widget positions
 */
export async function updateWidgetPositions(userEmail, widgetOrder) {
  const supabase = getSupabase();

  const updates = widgetOrder.map((id, index) => ({
    id,
    position: index,
    user_email: userEmail
  }));

  for (const update of updates) {
    await supabase
      .from('seo_dashboard_widgets')
      .update({ position: update.position })
      .eq('id', update.id)
      .eq('user_email', userEmail);
  }

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

function extractDomain(siteUrl) {
  if (siteUrl.startsWith('sc-domain:')) {
    return siteUrl.replace('sc-domain:', '');
  }
  try {
    const url = new URL(siteUrl);
    return url.hostname;
  } catch {
    return siteUrl;
  }
}
