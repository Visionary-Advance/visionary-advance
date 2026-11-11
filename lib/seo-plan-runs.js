// lib/seo-plan-runs.js
// Background SEO plan generation. "Generate plan" / "Generate all" insert seo_plan_runs
// rows and start ONE seo-plan-run GitHub Action whose matrix runs 2 sites at a time.
// Each job: fetch the data packet (buildPlanInput) → Claude Code (Pro OAuth token)
// writes plan.json → POST /api/seo/plan-runs/callback → saveDraftPlan(). It runs on
// GitHub, so closing the admin page doesn't stop it. Drafts still need approval.

import { sendN8nNotification } from './n8n';
import { saveDraftPlan, PlanValidationError } from './seo-plans';

const WORKFLOW_FILE = 'seo-plan-run.yml';
const IN_FLIGHT = ['queued', 'running'];
// A run that never reported back (runner died, callback lost) stops blocking new runs.
const STALE_MS = 60 * 60 * 1000;

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

export class PlanRunError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function isStale(run) {
  return IN_FLIGHT.includes(run.status) && Date.now() - new Date(run.created_at).getTime() > STALE_MS;
}

/** What the UI sees: stale in-flight runs read as failed. */
function present(run) {
  if (!run) return null;
  if (isStale(run)) {
    return { ...run, status: 'failed', error: run.error || 'No word from GitHub for over an hour. Open the run for details, then try again.' };
  }
  return run;
}

async function notify(text) {
  try {
    await sendN8nNotification({ type: 'seo_plan_run', text });
  } catch (err) {
    console.error('SEO plan run notification failed:', err);
  }
}

/**
 * Latest run per site. With no siteIds, returns the latest run for every site.
 * @returns {Promise<Record<string, object>>} siteId → run
 */
export async function getLatestRuns(siteIds = null) {
  const supabase = getSupabase();
  let query = supabase
    .from('seo_plan_runs')
    .select('id, site_id, batch_id, status, plan_id, run_url, error, meta, created_at, started_at, finished_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(200);
  if (siteIds?.length) query = query.in('site_id', siteIds);

  const { data, error } = await query;
  if (error) throw error;

  const latest = {};
  for (const run of data || []) {
    if (!latest[run.site_id]) latest[run.site_id] = present(run);
  }
  return latest;
}

/**
 * Start plan runs for the given sites (or every site when siteIds is 'all').
 * Sites with a run already in flight are skipped, not restarted.
 */
export async function startPlanRuns(siteIds, { requestedBy } = {}) {
  const supabase = getSupabase();

  let sitesQuery = supabase.from('seo_sites').select('id, display_name, site_url');
  if (siteIds !== 'all') {
    if (!Array.isArray(siteIds) || siteIds.length === 0) throw new PlanRunError('siteIds is required');
    sitesQuery = sitesQuery.in('id', siteIds);
  }
  const { data: sites, error: sitesError } = await sitesQuery;
  if (sitesError) throw sitesError;
  if (!sites?.length) throw new PlanRunError('No matching sites', 404);

  const latest = await getLatestRuns(sites.map(s => s.id));
  const toStart = sites.filter(s => !IN_FLIGHT.includes(latest[s.id]?.status));
  const skipped = sites.filter(s => IN_FLIGHT.includes(latest[s.id]?.status)).map(s => s.id);

  if (toStart.length === 0) {
    return { runs: Object.values(latest).filter(r => sites.some(s => s.id === r.site_id)), started: 0, skipped };
  }

  const token = process.env.GITHUB_SEO_DISPATCH_TOKEN;
  if (!token) throw new PlanRunError('GITHUB_SEO_DISPATCH_TOKEN is not configured', 500);
  const repo = process.env.SEO_PLAN_RUN_REPO || 'Visionary-Advance/visionary-advance';
  const ref = process.env.SEO_PLAN_RUN_REF || 'main';

  // Close out stale rows so they don't linger as "running" in the database.
  const staleIds = sites.map(s => latest[s.id]).filter(r => r && r.status === 'failed' && r.finished_at == null).map(r => r.id);
  if (staleIds.length) {
    await supabase.from('seo_plan_runs')
      .update({ status: 'failed', error: 'Timed out', finished_at: new Date().toISOString() })
      .in('id', staleIds).in('status', IN_FLIGHT);
  }

  const batchId = crypto.randomUUID();
  const { data: runs, error: insertError } = await supabase
    .from('seo_plan_runs')
    .insert(toStart.map(s => ({ site_id: s.id, batch_id: batchId, status: 'queued', requested_by: requestedBy || null })))
    .select();
  if (insertError) throw insertError;

  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref, inputs: { run_ids: JSON.stringify(runs.map(r => r.id)) } }),
  });

  if (!res.ok) {
    const body = await res.text();
    const hint = res.status === 404
      ? ` (is .github/workflows/${WORKFLOW_FILE} pushed to ${ref} in ${repo}, and can the token see it?)`
      : '';
    const message = `GitHub dispatch failed: ${res.status} ${body.slice(0, 200)}${hint}`;
    await supabase.from('seo_plan_runs')
      .update({ status: 'failed', error: message, finished_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .in('id', runs.map(r => r.id));
    throw new PlanRunError(message, 502);
  }

  return { runs, started: runs.length, skipped, batchId };
}

/** The run row for the runner's input/callback endpoints. */
export async function getRun(runId) {
  const { data, error } = await getSupabase()
    .from('seo_plan_runs')
    .select('*, site:seo_sites(id, display_name, site_url)')
    .eq('id', runId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new PlanRunError('Run not found', 404);
  return data;
}

/**
 * Status reports from the Action: running | completed (with plan) | failed.
 * A completed report saves the plan as the site's draft; an invalid plan fails the run.
 */
export async function applyPlanRunCallback({ run_id, status, run_url, plan, error: errorText, meta }) {
  if (!run_id) throw new PlanRunError('run_id is required');
  if (!['running', 'completed', 'failed'].includes(status)) throw new PlanRunError('Invalid status');

  const supabase = getSupabase();
  const run = await getRun(run_id);
  const now = new Date().toISOString();
  const name = run.site?.display_name || run.site?.site_url || 'site';
  const update = { updated_at: now };
  if (run_url) update.run_url = run_url;
  if (meta && typeof meta === 'object') update.meta = { ...(run.meta || {}), ...meta };

  // Never move a finished run backwards (late "running" after completion, retries).
  if (['completed', 'failed'].includes(run.status) && status !== 'completed') {
    if (status === 'failed' && run.status === 'failed') {
      await supabase.from('seo_plan_runs').update(update).eq('id', run_id);
    }
    return { ...run, ...update };
  }

  if (status === 'running') {
    update.status = 'running';
    update.started_at = run.started_at || now;
  } else if (status === 'failed') {
    update.status = 'failed';
    update.error = (errorText || 'Run failed').slice(0, 1000);
    update.finished_at = now;
    await notify(`SEO plan for ${name} failed: ${update.error}${run_url ? `\n${run_url}` : ''}`);
  } else {
    try {
      const saved = await saveDraftPlan(run.site_id, plan);
      update.status = 'completed';
      update.plan_id = saved.id;
      update.error = null;
      update.finished_at = now;
      await notify(`SEO plan draft ready for ${name}: ${plan.tasks.length} tasks. Review it in /admin/seo.`);
    } catch (err) {
      const message = err instanceof PlanValidationError ? err.message : `Couldn't save the plan: ${err.message}`;
      await supabase.from('seo_plan_runs')
        .update({ ...update, status: 'failed', error: message.slice(0, 1000), finished_at: now })
        .eq('id', run_id);
      await notify(`SEO plan for ${name} failed: ${message}`);
      throw new PlanRunError(message, err instanceof PlanValidationError ? 422 : 500);
    }
  }

  const { data, error } = await supabase.from('seo_plan_runs').update(update).eq('id', run_id).select().single();
  if (error) throw error;
  return data;
}
