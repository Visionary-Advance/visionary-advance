// lib/seo-plan-input.js
// Builds the data packet a background Claude plan run works from (seo-plan-run Action).
// The server pulls Search Console and GA4 through the app's own Google connection
// (seo_sites.google_email), so the GitHub runner needs no Google credentials.
// Data is condensed here (current vs previous merged, cannibalization pre-grouped)
// to keep Claude's token use, and so Pro-plan usage, down.

import { getSearchAnalytics, inspectUrl } from './search-console';
import { getGa4PlanData } from './ga4';
import { getPlanTaskCap } from './seo-tiers';

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
    );
  }
  return supabaseClient;
}

const DAY = 24 * 60 * 60 * 1000;
const fmt = d => d.toISOString().slice(0, 10);

/** GSC lags ~3 days: current = 28 days ending 3 days ago, previous = the 28 before. */
export function planWindows(now = new Date()) {
  const end = new Date(now.getTime() - 3 * DAY);
  const start = new Date(end.getTime() - 27 * DAY);
  const prevEnd = new Date(start.getTime() - DAY);
  const prevStart = new Date(prevEnd.getTime() - 27 * DAY);
  return {
    current: [fmt(start), fmt(end)],
    previous: [fmt(prevStart), fmt(prevEnd)],
  };
}

const round = (n, dp) => Math.round((n || 0) * 10 ** dp) / 10 ** dp;

/** Merge current and previous GSC rows keyed by their first dimension. */
function mergeWindows(current, previous) {
  const prev = new Map((previous || []).map(r => [r.keys[0], r]));
  const rows = (current || []).map(r => {
    const p = prev.get(r.keys[0]);
    prev.delete(r.keys[0]);
    return [r.keys[0], r.clicks, r.impressions, round(r.ctr, 4), round(r.position, 1),
      p ? p.clicks : null, p ? p.impressions : null, p ? round(p.position, 1) : null];
  });
  // Keep rows that only existed last window (lost rankings), capped.
  const lost = [...prev.values()]
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 50)
    .map(p => [p.keys[0], 0, 0, null, null, p.clicks, p.impressions, round(p.position, 1)]);
  return rows.concat(lost);
}

const MERGED_COLUMNS = (key) => [key, 'clicks', 'impressions', 'ctr', 'position', 'prev_clicks', 'prev_impressions', 'prev_position'];

/** Queries where 2+ pages get impressions: the R2 cannibalization candidates. */
function cannibalization(queryPageRows) {
  const byQuery = new Map();
  for (const r of queryPageRows || []) {
    const [query, page] = r.keys;
    if (!byQuery.has(query)) byQuery.set(query, []);
    byQuery.get(query).push([page, r.clicks, r.impressions, round(r.position, 1)]);
  }
  return [...byQuery.entries()]
    .filter(([, pages]) => pages.length >= 2)
    .map(([query, pages]) => ({ query, pages: pages.sort((a, b) => b[2] - a[2]) }))
    .sort((a, b) => b.pages.reduce((s, p) => s + p[2], 0) - a.pages.reduce((s, p) => s + p[2], 0))
    .slice(0, 40);
}

function summarizeInspection(result) {
  const s = result?.inspectionResult?.indexStatusResult || {};
  return {
    verdict: s.verdict, coverage_state: s.coverageState, indexing_state: s.indexingState,
    page_fetch_state: s.pageFetchState, robots_txt_state: s.robotsTxtState,
    last_crawl_time: s.lastCrawlTime, google_canonical: s.googleCanonical, user_canonical: s.userCanonical,
  };
}

/**
 * Everything one plan run needs for one site. Each source fails independently and
 * is recorded in `gaps`, so a GA4 outage still produces a (thinner) plan.
 */
export async function buildPlanInput(siteId) {
  const supabase = getSupabase();
  const gaps = [];

  const { data: site, error } = await supabase
    .from('seo_sites')
    .select('*')
    .eq('id', siteId)
    .maybeSingle();
  if (error) throw error;
  if (!site) throw new Error('Site not found');

  // No FK between seo_sites.business_id and crm_businesses, so look it up directly.
  if (site.business_id) {
    const { data: business } = await supabase
      .from('crm_businesses')
      .select('name, website, industry')
      .eq('id', site.business_id)
      .maybeSingle();
    site.business = business || null;
  }

  const windows = planWindows();
  const [curStart, curEnd] = windows.current;
  const [prevStart, prevEnd] = windows.previous;
  const leadEvents = Array.isArray(site.lead_events) ? site.lead_events : [];

  const [{ data: keywords }, { data: recentPlans }] = await Promise.all([
    supabase.from('seo_site_keywords').select('keyword, target_position').eq('site_id', siteId),
    supabase
      .from('seo_plans')
      .select('month, status, generated_by, created_at, tasks:seo_plan_tasks(title, status, completed_at)')
      .eq('site_id', siteId)
      .in('status', ['active', 'archived'])
      .order('created_at', { ascending: false })
      .limit(2),
  ]);

  // ---- Search Console ----
  let gsc = null;
  let inspections = [];
  if (!site.google_email) {
    gaps.push('No Google account linked to this site (seo_sites.google_email), so no Search Console data.');
  } else {
    try {
      const q = (startDate, endDate, dimensions, rowLimit) =>
        getSearchAnalytics(site.google_email, site.site_url, { startDate, endDate, dimensions, rowLimit })
          .then(r => r.rows || []);
      const [qCur, qPrev, pCur, pPrev, qp] = await Promise.all([
        q(curStart, curEnd, ['query'], 500),
        q(prevStart, prevEnd, ['query'], 500),
        q(curStart, curEnd, ['page'], 200),
        q(prevStart, prevEnd, ['page'], 200),
        q(curStart, curEnd, ['query', 'page'], 500),
      ]);
      const totals = (rows) => rows.reduce((t, r) => ({ clicks: t.clicks + r.clicks, impressions: t.impressions + r.impressions }), { clicks: 0, impressions: 0 });
      gsc = {
        note: 'Totals are sums of the returned rows (top 500 queries / 200 pages), not the property total.',
        totals: { current: totals(pCur), previous: totals(pPrev) },
        queries: { columns: MERGED_COLUMNS('query'), rows: mergeWindows(qCur, qPrev) },
        pages: { columns: MERGED_COLUMNS('page'), rows: mergeWindows(pCur, pPrev) },
        cannibalization: { columns: ['page', 'clicks', 'impressions', 'position'], groups: cannibalization(qp) },
      };
      if (totals(qCur).impressions < 100) gaps.push('Under 100 impressions in the current window; skip rules that need volume.');

      // R4: inspect up to 5 pages that lost >= 30% and >= 5 clicks.
      const drops = gsc.pages.rows
        .filter(([, c, , , , pc]) => pc != null && pc - c >= 5 && (pc - c) / pc >= 0.3)
        .sort((a, b) => (b[5] - b[1]) - (a[5] - a[1]))
        .slice(0, 5);
      inspections = await Promise.all(drops.map(async ([url, c, , , , pc]) => {
        try {
          return { url, clicks: c, prev_clicks: pc, ...summarizeInspection(await inspectUrl(site.google_email, site.site_url, url)) };
        } catch (err) {
          return { url, clicks: c, prev_clicks: pc, error: err.message };
        }
      }));
    } catch (err) {
      gaps.push(`Search Console failed: ${err.message}`);
    }
  }

  // ---- GA4 ----
  let ga4 = null;
  if (!site.ga4_property_id) {
    gaps.push('No GA4 property set (seo_sites.ga4_property_id).');
  } else if (!site.google_email) {
    gaps.push('No Google account linked, so no GA4 data.');
  } else {
    try {
      ga4 = await getGa4PlanData(site.google_email, site.ga4_property_id, { startDate: curStart, endDate: curEnd }, leadEvents);
    } catch (err) {
      gaps.push(`GA4 failed: ${err.message}`);
    }
  }
  if (leadEvents.length === 0) gaps.push('seo_sites.lead_events is empty, so R5 (traffic, no leads) cannot run.');

  return {
    generated_at: new Date().toISOString(),
    windows,
    site: {
      id: site.id,
      site_url: site.site_url,
      display_name: site.display_name,
      plan_tier: site.plan_tier || 'basic',
      task_cap: getPlanTaskCap(site.plan_tier || 'basic'),
      ga4_property_id: site.ga4_property_id,
      gbp_location: site.gbp_location,
      competitors: site.competitors || [],
      lead_events: leadEvents,
      seo_notes: site.seo_notes,
      github_repo: site.github_repo,
      github_default_branch: site.github_default_branch || 'main',
      business: site.business || null,
    },
    tracked_keywords: keywords || [],
    recent_plans: recentPlans || [],
    gsc,
    url_inspections: inspections,
    ga4,
    gaps,
  };
}
