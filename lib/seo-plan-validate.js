// lib/seo-plan-validate.js
// Validation for Claude-written SEO plans (plan.json). Pure: no database, no Next.js,
// so it runs in the app, in seo/scripts/save-draft-plan.mjs, and in the GitHub runner.

import { getPlanTaskCap } from './seo-tiers.js';

export const PLAN_PRIORITIES = ['high', 'medium', 'low'];
export const PLAN_EFFORTS = ['small', 'medium', 'large'];
export const PLAN_CATEGORIES = ['technical', 'content', 'on-page', 'off-page', 'local', 'analytics'];

/**
 * Check a plan against the format and the site's tier cap.
 * @returns {string[]} errors (empty when valid)
 */
export function validatePlan(plan, tier) {
  const errors = [];
  if (!plan || typeof plan !== 'object') return ['plan must be a JSON object'];
  if (!plan.site_url) errors.push('site_url is required');
  if (!plan.month) errors.push('month is required (e.g. "November 2026")');
  if (!plan.summary) errors.push('summary is required');
  if (!Array.isArray(plan.tasks) || plan.tasks.length === 0) errors.push('tasks must be a non-empty array');

  (plan.tasks || []).forEach((t, i) => {
    const at = `tasks[${i}]`;
    if (!t.title) errors.push(`${at}.title is required`);
    if (!t.description) errors.push(`${at}.description is required`);
    if (!PLAN_PRIORITIES.includes(t.priority)) errors.push(`${at}.priority must be one of ${PLAN_PRIORITIES.join('/')}`);
    if (!PLAN_EFFORTS.includes(t.estimated_effort)) errors.push(`${at}.estimated_effort must be one of ${PLAN_EFFORTS.join('/')}`);
    if (!PLAN_CATEGORIES.includes(t.category)) errors.push(`${at}.category must be one of ${PLAN_CATEGORIES.join('/')}`);
    if (!Array.isArray(t.acceptance_criteria) || t.acceptance_criteria.length === 0) {
      errors.push(`${at}.acceptance_criteria must be a non-empty array`);
    }
    if (t.files_to_modify !== undefined && !Array.isArray(t.files_to_modify)) {
      errors.push(`${at}.files_to_modify must be an array`);
    }
    if ((t.files_to_modify || []).some(f => /^[a-z]:[\\/]|^\//i.test(String(f)))) {
      errors.push(`${at}.files_to_modify must use repo-relative paths (app/..., not C:/... or /...)`);
    }
  });

  if (tier !== undefined && Array.isArray(plan.tasks)) {
    const cap = getPlanTaskCap(tier);
    if (plan.tasks.length > cap) errors.push(`the ${tier} tier allows at most ${cap} tasks; plan has ${plan.tasks.length}`);
  }

  return errors;
}

/** Map plan.json tasks to seo_plan_tasks rows. */
export function toTaskRows(planId, tasks) {
  return tasks.map((t, idx) => ({
    plan_id: planId,
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
}
