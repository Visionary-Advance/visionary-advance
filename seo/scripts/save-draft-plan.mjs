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
import { validatePlan, toTaskRows } from '../../lib/seo-plan-validate.js';

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
const errors = validatePlan(plan);
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

const rows = toTaskRows(saved.id, plan.tasks);

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
