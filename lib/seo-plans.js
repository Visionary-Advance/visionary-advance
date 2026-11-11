// lib/seo-plans.js
// SEO Plan and Task CRUD operations.
// Plans are written by Claude (the seo-monthly-run skill locally, or the seo-plan-run
// GitHub Action behind the Generate button) and always land as drafts.

import { validatePlan, toTaskRows } from './seo-plan-validate.js';

export class PlanValidationError extends Error {}

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  return supabaseClient;
}

/**
 * Save a Claude-written plan (plan.json shape) as the site's DRAFT.
 * Replaces any older draft; never touches the active plan. Brandon approves in /admin/seo.
 * Throws PlanValidationError when the plan is malformed or over the tier cap.
 */
export async function saveDraftPlan(siteId, plan) {
  const supabase = getSupabase();

  const { data: site, error: siteError } = await supabase
    .from('seo_sites')
    .select('id, site_url, plan_tier')
    .eq('id', siteId)
    .maybeSingle();
  if (siteError) throw siteError;
  if (!site) throw new PlanValidationError('Site not found');

  const errors = validatePlan(plan, site.plan_tier || 'basic');
  if (plan?.site_url && plan.site_url !== site.site_url) {
    errors.push(`site_url ${plan.site_url} does not match this run's site (${site.site_url})`);
  }
  if (errors.length) throw new PlanValidationError(`Plan is invalid: ${errors.join('; ')}`);

  const { error: delError } = await supabase
    .from('seo_plans')
    .delete()
    .eq('site_id', siteId)
    .eq('status', 'draft');
  if (delError) throw delError;

  const { data: saved, error: planError } = await supabase
    .from('seo_plans')
    .insert({
      site_id: siteId,
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
  if (planError) throw planError;

  const { error: taskError } = await supabase.from('seo_plan_tasks').insert(toTaskRows(saved.id, plan.tasks));
  if (taskError) {
    await supabase.from('seo_plans').delete().eq('id', saved.id);
    throw taskError;
  }

  return saved;
}

/**
 * Get the active plan for a site
 */
export async function getActivePlan(siteId) {
  const supabase = getSupabase();

  const { data: plan, error } = await supabase
    .from('seo_plans')
    .select('*')
    .eq('site_id', siteId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!plan) return null;

  const tasks = await getPlanTasks(plan.id);
  return { ...plan, tasks };
}

/**
 * Get all plans for a site
 */
export async function getPlans(siteId, limit = 20) {
  const supabase = getSupabase();

  const { data: plans, error } = await supabase
    .from('seo_plans')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  if (!plans || plans.length === 0) return [];

  // Fetch tasks for each plan
  const planIds = plans.map(p => p.id);
  const { data: allTasks, error: tasksError } = await supabase
    .from('seo_plan_tasks')
    .select('*')
    .in('plan_id', planIds)
    .order('sort_order');

  if (tasksError) throw tasksError;

  // Group tasks by plan_id
  const tasksByPlan = {};
  (allTasks || []).forEach(task => {
    if (!tasksByPlan[task.plan_id]) tasksByPlan[task.plan_id] = [];
    tasksByPlan[task.plan_id].push(task);
  });

  return plans.map(plan => ({
    ...plan,
    tasks: tasksByPlan[plan.id] || []
  }));
}

/**
 * Get tasks for a specific plan
 */
export async function getPlanTasks(planId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_plan_tasks')
    .select('*')
    .eq('plan_id', planId)
    .order('sort_order');

  if (error) throw error;
  return data || [];
}

/**
 * Approve a draft plan: archive the site's active plan, then promote the draft.
 */
export async function approveDraftPlan(planId) {
  const supabase = getSupabase();

  const { data: draft, error: findError } = await supabase
    .from('seo_plans')
    .select('id, site_id, status')
    .eq('id', planId)
    .maybeSingle();

  if (findError) throw findError;
  if (!draft) throw new Error('Plan not found');
  if (draft.status !== 'draft') throw new Error('Only draft plans can be approved');

  const now = new Date().toISOString();

  const { error: archiveError } = await supabase
    .from('seo_plans')
    .update({ status: 'archived', updated_at: now })
    .eq('site_id', draft.site_id)
    .eq('status', 'active');

  if (archiveError) throw archiveError;

  const { data: plan, error } = await supabase
    .from('seo_plans')
    .update({ status: 'active', updated_at: now })
    .eq('id', planId)
    .eq('status', 'draft')
    .select()
    .single();

  if (error) throw error;
  return plan;
}

/**
 * Discard a draft plan (its tasks are removed by ON DELETE CASCADE).
 */
export async function discardDraftPlan(planId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_plans')
    .delete()
    .eq('id', planId)
    .eq('status', 'draft')
    .select('id');

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Draft plan not found');
  return data[0];
}

/**
 * Archive a plan
 */
export async function archivePlan(planId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('seo_plans')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', planId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a task's status and/or notes
 */
export async function updateTask(taskId, updates) {
  const supabase = getSupabase();

  const updateData = {};

  if (updates.status !== undefined) {
    updateData.status = updates.status;
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    } else {
      updateData.completed_at = null;
    }
  }

  if (updates.notes !== undefined) {
    updateData.notes = updates.notes;
  }

  const { data: task, error } = await supabase
    .from('seo_plan_tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;

  // Check if all tasks in the plan are complete -> auto-archive
  if (updates.status === 'completed') {
    const { data: allTasks } = await supabase
      .from('seo_plan_tasks')
      .select('status')
      .eq('plan_id', task.plan_id);

    const allComplete = allTasks?.every(t => t.status === 'completed');
    if (allComplete) {
      await supabase
        .from('seo_plans')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', task.plan_id);
    }
  }

  return task;
}
