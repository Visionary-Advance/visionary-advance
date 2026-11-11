'use client';

// Background Claude plan runs (see lib/seo-plan-runs.js). The run lives on GitHub, so
// these helpers only start runs and poll their status; leaving the page loses nothing.

import { useCallback, useEffect, useRef, useState } from 'react';
import { getCRMAuthClient } from '@/lib/supabase-crm-client';

export const RUN_IN_FLIGHT = ['queued', 'running'];
const POLL_MS = 15000;

// Admin sessions live in localStorage, so admin-only routes need the bearer token.
export async function authFetch(url, options = {}) {
  const { data } = await getCRMAuthClient().auth.getSession();
  const token = data?.session?.access_token;
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export function isRunInFlight(run) {
  return !!run && RUN_IN_FLIGHT.includes(run.status);
}

/**
 * Latest plan run per site, polled every 15s while any is in flight.
 * @param {string|null} siteId - one site, or null for every site
 * @param {{ onFinish?: (run) => void }} options - called when a run this page saw in flight ends
 */
export function usePlanRuns(siteId, { onFinish } = {}) {
  const [runs, setRuns] = useState(null);
  const latest = useRef({});
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; });

  const apply = useCallback(next => {
    for (const [id, run] of Object.entries(next)) {
      if (isRunInFlight(latest.current[id]) && !isRunInFlight(run)) onFinishRef.current?.(run);
    }
    latest.current = next;
    setRuns(next);
  }, []);

  const load = useCallback(async () => {
    const res = await authFetch(`/api/seo/plan-runs${siteId ? `?siteId=${siteId}` : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load plan runs');
    apply(data.runs || {});
  }, [siteId, apply]);

  useEffect(() => {
    latest.current = {};
    load().catch(() => setRuns({}));
  }, [load]);

  const anyInFlight = !!runs && Object.values(runs).some(isRunInFlight);
  useEffect(() => {
    if (!anyInFlight) return;
    const id = setInterval(() => load().catch(() => {}), POLL_MS);
    return () => clearInterval(id);
  }, [anyInFlight, load]);

  /** Start runs for siteIds (array) or 'all'. Resolves with { started, skipped }. */
  const start = useCallback(async siteIds => {
    const res = await authFetch('/api/seo/plan-runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteIds === 'all' ? { all: true } : { siteIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start plan generation');
    const merged = { ...latest.current };
    for (const run of data.runs || []) merged[run.site_id] = run;
    latest.current = merged;
    setRuns(merged);
    return data;
  }, []);

  return { runs, start, reload: load };
}
