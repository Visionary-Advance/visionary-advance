// lib/seo-page-checks.js
// Live checks on a site's own top pages for a Claude plan run (seo-plan-input.js):
// the on-page tags as Google sees them (covers Sanity-driven sites, where the repo
// doesn't show the content) and PageSpeed / Core Web Vitals.

const UA = 'Mozilla/5.0 (compatible; VisionaryAdvanceSEO/1.0; +https://visionaryadvance.com)';
const MAX_HTML = 1_500_000;

/** Host a GSC property covers: sc-domain:example.com → example.com (and subdomains). */
export function propertyHost(siteUrl) {
  if (siteUrl.startsWith('sc-domain:')) return siteUrl.slice('sc-domain:'.length).toLowerCase();
  try { return new URL(siteUrl).hostname.toLowerCase().replace(/^www\./, ''); } catch { return null; }
}

/** Only fetch https pages on the client's own domain (URLs come from Search Console). */
export function isOwnPage(url, host) {
  try {
    const u = new URL(url);
    const h = u.hostname.toLowerCase();
    return u.protocol === 'https:' && !!host && (h === host || h.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

function decode(text) {
  return text
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? decode(m[2] ?? m[3] ?? '') : null;
}

function metaContent(html, key, value) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if ((attr(tag, key) || '').toLowerCase() === value) return attr(tag, 'content');
  }
  return null;
}

/** Title, meta description, H1s, canonical, robots, schema types and rough word count. */
export function parsePage(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => decode(m[1].replace(/<[^>]+>/g, ' '))).filter(Boolean);
  const canonicalTag = (html.match(/<link\b[^>]*>/gi) || []).find(t => (attr(t, 'rel') || '').toLowerCase() === 'canonical');
  const schemaTypes = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const title_text = title ? decode(title[1]) : null;
  const description = metaContent(html, 'name', 'description');
  return {
    title: title_text,
    title_length: title_text?.length ?? 0,
    meta_description: description,
    meta_description_length: description?.length ?? 0,
    h1: h1s.slice(0, 3),
    canonical: canonicalTag ? attr(canonicalTag, 'href') : null,
    robots: metaContent(html, 'name', 'robots'),
    schema_types: [...new Set(schemaTypes)].slice(0, 10),
    word_count: decode(body).split(' ').filter(w => w.length > 1).length,
  };
}

async function fetchWithTimeout(url, ms, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function checkPage(url) {
  try {
    const res = await fetchWithTimeout(url, 10000, { headers: { 'User-Agent': UA, Accept: 'text/html' }, redirect: 'follow' });
    const result = { url, status: res.status };
    if (res.url && res.url !== url) result.final_url = res.url;
    if (!res.ok || !(res.headers.get('content-type') || '').includes('html')) return result;
    const html = (await res.text()).slice(0, MAX_HTML);
    return { ...result, ...parsePage(html) };
  } catch (err) {
    return { url, error: err.name === 'AbortError' ? 'Timed out after 10s' : err.message };
  }
}

/** Map with a concurrency cap. */
export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }));
  return out;
}

/** Mobile PageSpeed: lab score + metrics, and real-user (CrUX) field data when Google has it. */
export async function pageSpeed(url) {
  const params = new URLSearchParams({ url, strategy: 'mobile', category: 'performance' });
  if (process.env.PAGESPEED_API_KEY) params.set('key', process.env.PAGESPEED_API_KEY);
  try {
    const res = await fetchWithTimeout(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, 90000);
    const data = await res.json();
    if (!res.ok) return { url, error: data.error?.message || `PageSpeed ${res.status}` };
    const audits = data.lighthouseResult?.audits || {};
    const lab = id => audits[id]?.displayValue || null;
    const field = data.loadingExperience?.metrics || {};
    const fieldMetric = id => field[id] ? { p75: field[id].percentile, rating: field[id].category } : null;
    return {
      url,
      strategy: 'mobile',
      performance_score: Math.round((data.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
      lab: {
        lcp: lab('largest-contentful-paint'),
        cls: lab('cumulative-layout-shift'),
        tbt: lab('total-blocking-time'),
        fcp: lab('first-contentful-paint'),
      },
      field: data.loadingExperience?.metrics
        ? {
            overall: data.loadingExperience.overall_category || null,
            lcp_ms: fieldMetric('LARGEST_CONTENTFUL_PAINT_MS'),
            inp_ms: fieldMetric('INTERACTION_TO_NEXT_PAINT'),
            cls: fieldMetric('CUMULATIVE_LAYOUT_SHIFT_SCORE'),
          }
        : null,
      top_opportunities: Object.values(audits)
        .filter(a => a.details?.type === 'opportunity' && (a.details.overallSavingsMs || 0) >= 300)
        .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
        .slice(0, 4)
        .map(a => `${a.title} (~${Math.round(a.details.overallSavingsMs)}ms)`),
    };
  } catch (err) {
    return { url, error: err.name === 'AbortError' ? 'PageSpeed timed out after 90s' : err.message };
  }
}
