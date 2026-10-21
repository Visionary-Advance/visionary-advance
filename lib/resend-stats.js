// lib/resend-stats.js
// Counts the emails each client site sent through Resend, for the monthly SEO report.
//
// Client sites all send from mail.visionaryadvance.com, so emails are matched to a
// site by *recipient*: an address in the site's notification_emails, or any
// address on the site's own domain.
//
// Resend only lists ~30 days of history and has no date or recipient filter, so
// a daily cron (/api/cron/resend-counts) pages through what Resend has and
// snapshots per-site daily counts into seo_email_daily_counts. Reports read
// from that table.

import { Resend } from 'resend';

const PAGE_SIZE = 100;
const MAX_PAGES = 100; // 10,000 emails — stop paging past this
const PAGE_DELAY_MS = 550; // Resend's default rate limit is 2 req/s

const DELIVERED_EVENTS = new Set(['delivered', 'opened', 'clicked']);
const FAILED_EVENTS = new Set(['bounced', 'failed', 'complained', 'canceled']);

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
 * Turn a Search Console property into a bare domain.
 * "sc-domain:example.com" / "https://www.example.com/" → "example.com"
 */
export function domainFromSiteUrl(siteUrl) {
  if (!siteUrl) return null;
  let host = siteUrl.startsWith('sc-domain:') ? siteUrl.slice('sc-domain:'.length) : siteUrl;
  try {
    if (host.includes('://')) host = new URL(host).hostname;
  } catch {
    return null;
  }
  return host.replace(/^www\./, '').replace(/\/.*$/, '').toLowerCase() || null;
}

/**
 * Normalize a list of addresses: trimmed, lowercased, deduped, valid-looking only.
 */
export function normalizeEmailList(list) {
  const items = Array.isArray(list) ? list : String(list || '').split(/[\s,;]+/);
  return [...new Set(items.map((e) => String(e).trim().toLowerCase()).filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)))];
}

function bareAddress(recipient) {
  const match = String(recipient || '').match(/<([^>]+)>/);
  return (match ? match[1] : String(recipient || '')).trim().toLowerCase();
}

function siteMatcher(site) {
  const addresses = new Set(normalizeEmailList(site.notification_emails));
  const domain = domainFromSiteUrl(site.site_url);
  return (recipient) => {
    if (addresses.has(recipient)) return true;
    const recipientDomain = recipient.split('@')[1];
    return !!domain && !!recipientDomain && (recipientDomain === domain || recipientDomain.endsWith(`.${domain}`));
  };
}

function dayOf(timestamp) {
  return String(timestamp).slice(0, 10);
}

function addDays(day, n) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Pull the last `days` days of sent emails from Resend and upsert per-site daily
 * counts. Every (site, day) in the covered window gets a row — zeros included —
 * so the table also records which days were counted.
 *
 * Listing emails needs a full-access key; set RESEND_READ_API_KEY when the
 * RESEND_API_KEY used for sending is restricted to "Sending access".
 */
export async function syncEmailCounts({ days = 31 } = {}) {
  const apiKey = process.env.RESEND_READ_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_READ_API_KEY not configured');

  const supabase = getSupabase();
  const { data: sites, error: sitesError } = await supabase
    .from('seo_sites')
    .select('id, site_url, notification_emails')
    .eq('is_active', true);
  if (sitesError) throw sitesError;

  const today = new Date().toISOString().slice(0, 10);
  const cutoff = addDays(today, -days);
  const matchers = sites.map((site) => ({ id: site.id, matches: siteMatcher(site) }));
  const counts = new Map(); // `${siteId}|${day}` → { sent, delivered, failed }

  const resend = new Resend(apiKey);
  let after;
  let scanned = 0;
  let oldestSeen = null;
  let historyExhausted = false;

  for (let page = 0; page < MAX_PAGES; page++) {
    if (page > 0) await new Promise((r) => setTimeout(r, PAGE_DELAY_MS));

    const { data, error } = await resend.emails.list({ limit: PAGE_SIZE, ...(after ? { after } : {}) });
    if (error) throw new Error(`Resend list failed: ${error.message}`);

    const emails = data?.data || [];
    for (const email of emails) {
      const day = dayOf(email.created_at);
      if (day < cutoff) continue;
      scanned++;
      oldestSeen = day;

      const recipients = [...(email.to || []), ...(email.cc || []), ...(email.bcc || [])].map(bareAddress);
      for (const { id, matches } of matchers) {
        if (!recipients.some(matches)) continue;
        const key = `${id}|${day}`;
        const bucket = counts.get(key) || { sent: 0, delivered: 0, failed: 0 };
        bucket.sent++;
        if (DELIVERED_EVENTS.has(email.last_event)) bucket.delivered++;
        else if (FAILED_EVENTS.has(email.last_event)) bucket.failed++;
        counts.set(key, bucket);
      }
    }

    const oldest = emails[emails.length - 1];
    if (!data?.has_more || !oldest) {
      historyExhausted = true;
      break;
    }
    if (dayOf(oldest.created_at) < cutoff) break;
    after = oldest.id;
  }

  // If we ran out of Resend history before the cutoff, the oldest day we saw is
  // only partly retained (the API keeps ~28 days, rolling). Save it only when
  // that day has no row yet, so a partial count never overwrites a full one
  // from an earlier sync.
  const partialDay = historyExhausted && oldestSeen && oldestSeen > cutoff ? oldestSeen : null;
  const coveredFrom = partialDay || cutoff;

  const fullRows = [];
  const partialRows = [];
  const now = new Date().toISOString();
  for (let day = coveredFrom; day <= today; day = addDays(day, 1)) {
    for (const { id } of matchers) {
      const bucket = counts.get(`${id}|${day}`) || { sent: 0, delivered: 0, failed: 0 };
      (day === partialDay ? partialRows : fullRows).push({ site_id: id, date: day, ...bucket, updated_at: now });
    }
  }

  if (fullRows.length > 0) {
    const { error } = await supabase
      .from('seo_email_daily_counts')
      .upsert(fullRows, { onConflict: 'site_id,date' });
    if (error) throw error;
  }
  if (partialRows.length > 0) {
    const { error } = await supabase
      .from('seo_email_daily_counts')
      .upsert(partialRows, { onConflict: 'site_id,date', ignoreDuplicates: true });
    if (error) throw error;
  }

  return { scanned, sites: sites.length, coveredFrom, coveredTo: today, rows: fullRows.length + partialRows.length };
}

/**
 * Sum a site's saved daily counts over each date range.
 *
 * @param {string} siteId
 * @param {Object<string, {startDate: string, endDate: string}>} ranges - inclusive YYYY-MM-DD (UTC)
 * @returns {Promise<Object<string, {sent, delivered, failed, countedFrom: string|null, complete: boolean}>>}
 *   countedFrom is the first day with a saved count; complete is false when
 *   counting started after the range began.
 */
export async function getEmailCountsForSite(siteId, ranges) {
  const starts = Object.values(ranges).map((r) => r.startDate).sort();
  const ends = Object.values(ranges).map((r) => r.endDate).sort();

  const { data, error } = await getSupabase()
    .from('seo_email_daily_counts')
    .select('date, sent, delivered, failed')
    .eq('site_id', siteId)
    .gte('date', starts[0])
    .lte('date', ends[ends.length - 1]);
  if (error) throw error;

  const result = {};
  for (const [key, range] of Object.entries(ranges)) {
    const days = (data || []).filter((row) => row.date >= range.startDate && row.date <= range.endDate);
    const countedFrom = days.length > 0 ? days.map((row) => row.date).sort()[0] : null;
    result[key] = {
      sent: days.reduce((sum, row) => sum + row.sent, 0),
      delivered: days.reduce((sum, row) => sum + row.delivered, 0),
      failed: days.reduce((sum, row) => sum + row.failed, 0),
      countedFrom,
      complete: countedFrom === range.startDate
    };
  }
  return result;
}
