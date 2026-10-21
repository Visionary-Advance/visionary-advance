// lib/ga4.js
// Google Analytics 4 integration for the monthly SEO report.
// Uses the same Google connection as Search Console (needs the
// analytics.readonly scope — reconnect Google if it was granted before that).

import { getValidGoogleToken } from './google-auth';

const ADMIN_API = 'https://analyticsadmin.googleapis.com/v1beta';
const DATA_API = 'https://analyticsdata.googleapis.com/v1beta';

const TRAFFIC_METRICS = ['sessions', 'totalUsers', 'newUsers', 'engagementRate'];

async function ga4Request(email, url, options = {}) {
  const token = await getValidGoogleToken(email);
  if (!token) {
    throw new Error('No valid Google token available');
  }

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
    const message = error.error?.message || error.error || `GA4 request failed: ${response.status}`;
    if (response.status === 403 && /scope/i.test(message)) {
      throw new Error('Google connection is missing Analytics access. Reconnect Google to grant it.');
    }
    throw new Error(message);
  }

  return response.json();
}

/**
 * Strip a "properties/" prefix so we store and pass just the numeric ID.
 */
export function normalizePropertyId(value) {
  const id = String(value || '').trim().replace(/^properties\//, '');
  return /^\d+$/.test(id) ? id : null;
}

/**
 * List every GA4 property the connected Google account can read.
 */
export async function listGa4Properties(email) {
  const properties = [];
  let pageToken;

  do {
    const params = new URLSearchParams({ pageSize: '200' });
    if (pageToken) params.set('pageToken', pageToken);
    const data = await ga4Request(email, `${ADMIN_API}/accountSummaries?${params}`);

    for (const account of data.accountSummaries || []) {
      for (const property of account.propertySummaries || []) {
        properties.push({
          id: normalizePropertyId(property.property),
          name: property.displayName,
          account: account.displayName
        });
      }
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return properties;
}

/**
 * Pull the report's GA4 numbers for both months in one batch request.
 *
 * @param {string} email - Google connection to use
 * @param {string} propertyId - numeric GA4 property ID
 * @param {{current: {startDate, endDate}, previous: {startDate, endDate}}} ranges
 */
export async function getGa4MonthlyData(email, propertyId, ranges) {
  const dateRanges = [
    { ...ranges.current, name: 'current' },
    { ...ranges.previous, name: 'previous' }
  ];
  const metric = (name) => ({ name });
  const batch = (requests) => ga4Request(email, `${DATA_API}/properties/${propertyId}:batchRunReports`, {
    method: 'POST',
    body: JSON.stringify({ requests })
  });

  // GA4's own keyEvents metric only counts events from after they were marked
  // as key events, so a lead form marked mid-month reads as 0 for everything
  // before that. Instead, count every occurrence of the events that are key
  // events today.
  const keyEventNames = await listKeyEventNames(email, propertyId);
  const onlyKeyEvents = {
    filter: { fieldName: 'eventName', inListFilter: { values: keyEventNames } }
  };
  const keyEventCounts = (dimension) => ({
    dateRanges,
    dimensions: [{ name: dimension }],
    metrics: [metric('eventCount')],
    dimensionFilter: onlyKeyEvents,
    limit: 100
  });

  const [traffic, conversions] = await Promise.all([
    batch([
      // Totals
      { dateRanges, metrics: TRAFFIC_METRICS.map(metric) },
      // Traffic by channel
      {
        dateRanges,
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [metric('sessions')],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 40
      },
      // Top landing pages
      {
        dateRanges,
        dimensions: [{ name: 'landingPage' }],
        metrics: [metric('sessions')],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 50
      }
    ]),
    keyEventNames.length > 0
      ? batch([
        keyEventCounts('eventName'),
        keyEventCounts('sessionDefaultChannelGroup'),
        keyEventCounts('landingPage')
      ])
      : { reports: [] }
  ]);

  const [totalsReport, channelReport, pageReport] = traffic.reports || [];
  const [eventReport, channelConversions, pageConversions] = conversions.reports || [];

  const totals = { current: emptyTotals(), previous: emptyTotals() };
  for (const row of totalsReport?.rows || []) {
    const range = rangeOf(row);
    if (!totals[range]) continue;
    TRAFFIC_METRICS.forEach((name, i) => {
      totals[range][name] = Number(row.metricValues[i]?.value || 0);
    });
  }

  const keyEvents = pivot(eventReport, ['keyEvents']);
  for (const range of ['current', 'previous']) {
    totals[range].keyEvents = keyEvents.reduce((sum, e) => sum + e[range].keyEvents, 0);
  }

  return {
    propertyId,
    current: totals.current,
    previous: totals.previous,
    changes: {
      sessionsChange: percentChange(totals.current.sessions, totals.previous.sessions),
      usersChange: percentChange(totals.current.totalUsers, totals.previous.totalUsers),
      keyEventsChange: percentChange(totals.current.keyEvents, totals.previous.keyEvents)
    },
    keyEventNames,
    channels: withKeyEvents(pivot(channelReport, ['sessions']), channelConversions).slice(0, 8),
    landingPages: withKeyEvents(pivot(pageReport, ['sessions']), pageConversions).slice(0, 5),
    keyEvents: keyEvents.slice(0, 10)
  };
}

/**
 * Names of the events currently marked as key events (conversions) in the property.
 */
async function listKeyEventNames(email, propertyId) {
  const names = [];
  let pageToken;
  do {
    const params = new URLSearchParams({ pageSize: '200' });
    if (pageToken) params.set('pageToken', pageToken);
    const data = await ga4Request(email, `${ADMIN_API}/properties/${propertyId}/keyEvents?${params}`);
    names.push(...(data.keyEvents || []).map((k) => k.eventName));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return names;
}

// Attach per-row key event counts (from a separate eventCount report) to traffic rows
function withKeyEvents(rows, conversionReport) {
  const counts = new Map(pivot(conversionReport, ['keyEvents']).map((e) => [e.name, e]));
  return rows.map((row) => ({
    name: row.name,
    current: { ...row.current, keyEvents: counts.get(row.name)?.current.keyEvents || 0 },
    previous: { ...row.previous, keyEvents: counts.get(row.name)?.previous.keyEvents || 0 }
  }));
}

function emptyTotals() {
  return { ...Object.fromEntries(TRAFFIC_METRICS.map((name) => [name, 0])), keyEvents: 0 };
}

// With multiple date ranges GA4 adds a trailing "dateRange" dimension to each row
function rangeOf(row) {
  const values = row.dimensionValues || [];
  return values[values.length - 1]?.value;
}

/**
 * Fold rows of (dimension, dateRange) into one entry per dimension value with
 * current/previous metrics, sorted by the current month's first metric.
 */
function pivot(report, metricNames) {
  const byName = new Map();
  for (const row of report?.rows || []) {
    const name = row.dimensionValues[0]?.value || '(not set)';
    const range = rangeOf(row);
    if (range !== 'current' && range !== 'previous') continue;

    const entry = byName.get(name) || {
      name,
      current: Object.fromEntries(metricNames.map((m) => [m, 0])),
      previous: Object.fromEntries(metricNames.map((m) => [m, 0]))
    };
    metricNames.forEach((m, i) => {
      entry[range][m] = Number(row.metricValues[i]?.value || 0);
    });
    byName.set(name, entry);
  }

  const sortKey = metricNames[0];
  return [...byName.values()].sort((a, b) => b.current[sortKey] - a.current[sortKey]);
}

// null when there's no previous baseline (e.g. the property started collecting
// this month) — the report shows "—" rather than a meaningless +100%
function percentChange(curr, prev) {
  if (prev === 0) return curr > 0 ? null : 0;
  return ((curr - prev) / prev) * 100;
}
