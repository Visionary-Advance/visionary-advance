// Number, date and period formatting shared by the SEO dashboard.

export function fmtInt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Math.round(n).toLocaleString('en-US');
}

// 1,284 / 12.9K / 4.2M — for stat tiles and axis ticks, not table columns.
export function fmtCompact(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (abs >= 10_000) return `${trim(n / 1_000)}K`;
  return Math.round(n).toLocaleString('en-US');
}

function trim(v) {
  return v.toFixed(1).replace(/\.0$/, '');
}

// ratio 0.0342 -> "3.42%"
export function fmtPct(ratio, digits = 2) {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return '—';
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function fmtPos(p) {
  if (p === null || p === undefined || Number.isNaN(p) || p === 0) return '—';
  return p.toFixed(1);
}

// Percent change from prev to cur, or null when there's no baseline.
export function pctChange(cur, prev) {
  if (prev === null || prev === undefined || cur === null || cur === undefined) return null;
  if (prev === 0) return cur === 0 ? 0 : null;
  return ((cur - prev) / prev) * 100;
}

export function timeAgo(dateString) {
  if (!dateString) return null;
  const diffMins = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDate(dateString);
}

export function fmtDate(dateString, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', opts);
}

export function fmtDateTime(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export function fmtDateRange(start, end) {
  const o = { month: 'short', day: 'numeric' };
  return `${fmtDate(start, o)} – ${fmtDate(end, o)}`;
}

// "May 2026 vs April 2026", falling back to the date range.
export function reportPeriod(report) {
  const cur = report?.month_comparison?.currentMonth?.name;
  const prev = report?.month_comparison?.previousMonth?.name;
  if (cur && prev) return `${cur} vs ${prev}`;
  return fmtDateRange(report?.start_date, report?.end_date);
}

export function pagePath(url) {
  try {
    return new URL(url).pathname || '/';
  } catch {
    return url;
  }
}

export function hostOf(siteUrl) {
  if (!siteUrl) return '';
  if (siteUrl.startsWith('sc-domain:')) return siteUrl.slice('sc-domain:'.length);
  try {
    return new URL(siteUrl).host;
  } catch {
    return siteUrl;
  }
}

export function siteHref(siteUrl) {
  const host = hostOf(siteUrl);
  return host ? `https://${host}` : null;
}
