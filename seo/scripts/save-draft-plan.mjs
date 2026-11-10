// Save a seo-monthly-run plan to the SEO CRM as a DRAFT (never active).
//
// Usage (from the repo root):
//   node --env-file=.env.local seo/scripts/save-draft-plan.mjs <plan.json> [--dry-run]
//
// - Validates the plan and enforces the tier task cap from lib/seo-tiers.js.
// - Replaces any existing draft for the site (one draft per site).
// - Never touches the active plan. Brandon approves drafts in /admin/seo.

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { getPlanTaskCap } from '../../lib/seo-tiers.js';

const PRIORITIES = ['high', 'medium', 'low'];
const EFFORTS = ['small', 'medium', 'large'];
const CATEGORIES = ['technical', 'content', 'on-page', 'off-page', 'local', 'analytics'];

class Fail extends Error {}
function fail(msg) {
  throw new Fail(msg);
}

async function main() {

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const file = args.find(a => !a.startsWith('--'));
if (!file) fail('Usage: save-draft-plan.mjs <plan.json> [--dry-run]');

let plan;
try {
  plan = JSON.parse(readFileSync(file, 'utf8'));
} catch (err) {
  fail(`Could not read ${file}: ${err.message}`);
}

// ---- validate ----
const errors = [];
if (!plan.site_url) errors.push('site_url is required');
if (!plan.month) errors.push('month is required (e.g. "November 2026")');
if (!plan.summary) errors.push('summary is required');
if (!Array.isArray(plan.tasks) || plan.tasks.length === 0) errors.push('tasks must be a non-empty array');

(plan.tasks || []).forEach((t, i) => {
  const at = `tasks[${i}]`;
  if (!t.title) errors.push(`${at}.title is required`);
  if (!t.description) errors.push(`${at}.description is required`);
  if (!PRIORITIES.includes(t.priority)) errors.push(`${at}.priority must be one of ${PRIORITIES.join('/')}`);
  if (!EFFORTS.includes(t.estimated_effort)) errors.push(`${at}.estimated_effort must be one of ${EFFORTS.join('/')}`);
  if (!CATEGORIES.includes(t.category)) errors.push(`${at}.category must be one of ${CATEGORIES.join('/')}`);
  if (!Array.isArray(t.acceptance_criteria) || t.acceptance_criteria.length === 0) {
    errors.push(`${at}.acceptance_criteria must be a non-empty array`);
  }
});
if (errors.length) fail(`Plan is invalid:\n  - ${errors.join('\n  - ')}`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) fail('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env.local)');

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: site, error: siteError } = await supabase
  .from('seo_sites')
  .select('id, site_url, display_name, plan_tier')
  .eq('site_url', plan.site_url)
  .maybeSingle();

if (siteError) fail(siteError.message);
if (!site) fail(`No seo_sites row for ${plan.site_url}`);

const cap = getPlanTaskCap(site.plan_tier);
if (plan.tasks.length > cap) {
  fail(`${site.display_name} is on the ${site.plan_tier} tier: max ${cap} tasks, plan has ${plan.tasks.length}`);
}

console.log(`✓ Valid: ${site.display_name} (${site.plan_tier}, cap ${cap}) — ${plan.tasks.length} tasks for ${plan.month}`);
if (dryRun) {
  console.log('Dry run: nothing written.');
  return;
}

// ---- replace existing draft, insert new one ----
const { error: delError } = await supabase
  .from('seo_plans')
  .delete()
  .eq('site_id', site.id)
  .eq('status', 'draft');
if (delError) fail(`Could not clear old draft: ${delError.message}`);

const { data: saved, error: planError } = await supabase
  .from('seo_plans')
  .insert({
    site_id: site.id,
    month: plan.month,
    summary: plan.summary,
    goals: plan.goals || [],
    metrics_to_track: plan.metrics_to_track || [],
    keyword_strategy: plan.keyword_strategy || null,
    run_meta: plan.run_meta || {},
    generated_by: 'claude',
    status: 'draft',
  })
  .select('id')
  .single();
if (planError) fail(`Could not save plan: ${planError.message}`);

const rows = plan.tasks.map((t, idx) => ({
  plan_id: saved.id,
  title: t.title,
  description: t.description,
  priority: t.priority,
  category: t.category,
  estimated_effort: t.estimated_effort,
  files_to_modify: t.files_to_modify || [],
  acceptance_criteria: t.acceptance_criteria,
  target_keywords: t.target_keywords || [],
  claude_code_prompt: t.claude_code_prompt || null,
  status: 'pending',
  sort_order: idx,
}));

const { error: taskError } = await supabase.from('seo_plan_tasks').insert(rows);
if (taskError) {
  await supabase.from('seo_plans').delete().eq('id', saved.id);
  fail(`Could not save tasks (draft rolled back): ${taskError.message}`);
}

console.log(`✓ Draft saved: plan ${saved.id}. Review it in /admin/seo → ${site.display_name} → Plan.`);
}

// Set exitCode instead of process.exit(): exiting with open fetch handles trips a libuv assertion on Windows.
try {
  await main();
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exitCode = 1;
}
