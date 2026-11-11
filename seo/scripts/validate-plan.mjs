// Check a plan.json before it's submitted. Used by Claude inside the seo-plan-run
// GitHub Action (no database access there).
//
// Usage: node seo/scripts/validate-plan.mjs <plan.json> <input.json>
//   input.json is the run's data packet; its site.plan_tier sets the task cap.

import { readFileSync } from 'node:fs';
import { validatePlan } from '../../lib/seo-plan-validate.js';

const [planFile, inputFile] = process.argv.slice(2);
try {
  if (!planFile || !inputFile) throw new Error('Usage: validate-plan.mjs <plan.json> <input.json>');
  const plan = JSON.parse(readFileSync(planFile, 'utf8'));
  const input = JSON.parse(readFileSync(inputFile, 'utf8'));
  const errors = validatePlan(plan, input.site?.plan_tier || 'basic');
  if (input.site?.site_url && plan.site_url !== input.site.site_url) {
    errors.push(`site_url must be "${input.site.site_url}"`);
  }
  if (errors.length) throw new Error(`Plan is invalid:\n  - ${errors.join('\n  - ')}`);
  console.log(`✓ Valid: ${plan.tasks.length} tasks (cap ${input.site.task_cap}) for ${plan.month}`);
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exitCode = 1;
}
