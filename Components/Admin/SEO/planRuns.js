'use client';

// Background Claude plan runs (see lib/seo-plan-runs.js). The run itself lives on GitHub;
// this provider sits in the SEO layout, so every page and the sidebar share one view of
// it and polling keeps going as you move between sites.

import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getCRMAuthClient } from '@/lib/supabase-crm-client';
import { useSEO } from './SEOContext';
import { useToast } from './ui';

export const RUN_IN_FLIGHT = ['queued', 'running'];
const POLL_MS = 10000;
const DEFAULT_WRITING_MS = 8 * 60 * 1000;
const FETCH_MS = 60 * 1000;

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

const PlanRunsContext = createContext(null);

export function PlanRunsProvider({ children }) {
  const notify = useToast();
  const { sites, loadPlanSummary } = useSEO();
  const [runs, setRuns] = useState(null);
  const [typicalMs, setTypicalMs] = useState(null);
  const latest = useRef({});
  const listeners = useRef(new Set());
  const ctx = useRef({});
  useEffect(() => { ctx.current = { notify, sites, loadPlanSummary }; });

  const apply = useCallback(next => {
    for (const [siteId, run] of Object.entries(next)) {
      if (!isRunInFlight(latest.current[siteId]) || isRunInFlight(run)) continue;
      const { notify: toast, sites: list, loadPlanSummary: reloadSummary } = ctx.current;
      const name = list?.find(s => s.id === siteId)?.display_name || 'A site';
      reloadSummary?.(siteId, { force: true });
      listeners.current.forEach(fn => fn(run));
      if (run.status === 'completed') toast?.(`${name}: the draft plan is ready to review`, 'success');
      else toast?.(`${name}: plan generation failed. ${run.error || ''}`.trim(), 'error');
    }
    latest.current = next;
    setRuns(next);
  }, []);

  const load = useCallback(async () => {
    const res = await authFetch('/api/seo/plan-runs');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load plan runs');
    if (data.typicalMs) setTypicalMs(data.typicalMs);
    apply(data.runs || {});
  }, [apply]);

  useEffect(() => { load().catch(() => setRuns(r => r || {})); }, [load]);

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

  const subscribe = useCallback(fn => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  }, []);

  return createElement(
    PlanRunsContext.Provider,
    { value: { runs, typicalMs, start, reload: load, subscribe } },
    children
  );
}

/** { runs: { [siteId]: run }, typicalMs, start, reload } */
export function usePlanRuns() {
  const value = useContext(PlanRunsContext);
  if (!value) throw new Error('usePlanRuns must be used inside PlanRunsProvider');
  return value;
}

/** Call fn(run) whenever a run ends (completed or failed) while the app is open. */
export function useRunFinished(fn) {
  const { subscribe } = usePlanRuns();
  const ref = useRef(fn);
  useEffect(() => { ref.current = fn; });
  useEffect(() => subscribe(run => ref.current(run)), [subscribe]);
}

/** Re-render every `ms` while `active` (smooth progress between polls). */
export function useTicker(active, ms = 2000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [active, ms]);
  return now;
}

/**
 * Progress for an in-flight run. Steps are reported by the workflow; the percentage
 * inside the "writing" step is an estimate from how long recent runs took.
 */
export function runProgress(run, typicalMs, now = Date.now()) {
  if (!isRunInFlight(run)) return null;
  const writingMs = typicalMs || DEFAULT_WRITING_MS;
  const stage = run.status === 'queued' ? 'queued' : run.meta?.stage || 'fetching';
  const since = new Date(run.meta?.stage_at || run.started_at || run.created_at).getTime();
  const elapsed = Math.max(0, now - since);
  const minutes = ms => Math.max(1, Math.round(ms / 60000));

  if (stage === 'queued') {
    return { step: 1, steps: 3, pct: 3, label: 'Waiting for a GitHub runner', detail: '2 sites run at a time, so this one may be waiting its turn.' };
  }
  if (stage === 'fetching') {
    const f = Math.min(1, elapsed / FETCH_MS);
    return {
      step: 2, steps: 3, pct: Math.round(5 + 15 * f), label: 'Pulling Search Console and GA4 data',
      detail: `About ${minutes(writingMs + FETCH_MS * (1 - f))} min left`,
    };
  }
  const f = elapsed / writingMs;
  return {
    step: 3, steps: 3, pct: Math.round(20 + 75 * Math.min(1, f) * 0.97),
    label: 'Claude is reading the data and code, then writing the plan',
    detail: f < 1 ? `About ${minutes(writingMs - elapsed)} min left` : 'Taking a little longer than usual',
  };
}
