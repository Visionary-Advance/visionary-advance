// lib/seo-plans.js
// SEO Plan and Task CRUD operations

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
 * Create a plan and its tasks from a generated SEO plan object
 */
export async function createPlan(siteId, planData) {
  const supabase = getSupabase();

  // Archive any existing active plan for this site
  await supabase
    .from('seo_plans')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('site_id', siteId)
    .eq('status', 'active');

  // Insert the plan
  const { data: plan, error: planError } = await supabase
    .from('seo_plans')
    .insert({
      site_id: siteId,
      month: planData.month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      summary: planData.summary || '',
      goals: planData.goals || [],
      metrics_to_track: planData.metrics_to_track || [],
      keyword_strategy: planData.keyword_strategy || null,
      status: 'active'
    })
    .select()
    .single();

  if (planError) throw planError;

  // Insert tasks
  const tasks = (planData.tasks || []).map((task, idx) => ({
    plan_id: plan.id,
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    category: task.category || 'technical',
    estimated_effort: task.estimated_effort || 'medium',
    files_to_modify: task.files_to_modify || [],
    acceptance_criteria: task.acceptance_criteria || [],
    target_keywords: task.target_keywords || [],
    claude_code_prompt: task.claude_code_prompt || null,
    status: 'pending',
    sort_order: idx
  }));

  if (tasks.length > 0) {
    const { error: tasksError } = await supabase
      .from('seo_plan_tasks')
      .insert(tasks);

    if (tasksError) throw tasksError;
  }

  // Return plan with tasks
  const planTasks = await getPlanTasks(plan.id);
  return { ...plan, tasks: planTasks };
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
