// lib/project-tasks.js
// Task management for projects

import { supabaseCRM as supabase } from './supabase-crm'

// ============================================
// TASK CRUD
// ============================================

export async function createTask(projectId, data) {
  
  // Get max sort order
  const { data: existing } = await supabase
    .from('crm_project_tasks')
    .select('sort_order')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const sortOrder = existing?.[0]?.sort_order ?? -1

  const { data: task, error } = await supabase
    .from('crm_project_tasks')
    .insert({
      project_id: projectId,
      title: data.title,
      description: data.description || null,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      assignee: data.assignee || null,
      due_date: data.due_date || null,
      sort_order: sortOrder + 1,
    })
    .select()
    .single()

  if (error) throw error
  return task
}

export async function updateTask(taskId, data) {
  
  const updates = {}
  if (data.title !== undefined) updates.title = data.title
  if (data.description !== undefined) updates.description = data.description
  if (data.status !== undefined) updates.status = data.status
  if (data.priority !== undefined) updates.priority = data.priority
  if (data.assignee !== undefined) updates.assignee = data.assignee
  if (data.due_date !== undefined) updates.due_date = data.due_date
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order
  if (data.completed_by !== undefined) updates.completed_by = data.completed_by

  const { data: task, error } = await supabase
    .from('crm_project_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return task
}

export async function deleteTask(taskId) {
  
  const { error } = await supabase
    .from('crm_project_tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
  return true
}

export async function getProjectTasks(projectId, options = {}) {
  
  let query = supabase
    .from('crm_project_tasks')
    .select('*')
    .eq('project_id', projectId)

  if (options.status) {
    query = query.eq('status', options.status)
  }

  if (options.assignee) {
    query = query.eq('assignee', options.assignee)
  }

  query = query.order('sort_order', { ascending: true })

  const { data: tasks, error } = await query

  if (error) throw error
  return tasks || []
}

export async function reorderTasks(projectId, taskIds) {
  
  // Update sort_order for each task
  const updates = taskIds.map((id, index) => ({
    id,
    sort_order: index,
  }))

  for (const update of updates) {
    const { error } = await supabase
      .from('crm_project_tasks')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id)
      .eq('project_id', projectId)

    if (error) throw error
  }

  return true
}

export async function completeTask(taskId, completedBy) {
  return updateTask(taskId, {
    status: 'completed',
    completed_by: completedBy,
  })
}

export async function bulkUpdateTaskStatus(taskIds, status) {
  
  const { data, error } = await supabase
    .from('crm_project_tasks')
    .update({ status })
    .in('id', taskIds)
    .select()

  if (error) throw error
  return data
}

// ============================================
// TASK QUERIES
// ============================================

export async function getOverdueTasks(projectId = null) {
  
  let query = supabase
    .from('crm_project_tasks')
    .select(`
      *,
      project:crm_projects(id, name, lead_id)
    `)
    .neq('status', 'completed')
    .lt('due_date', new Date().toISOString().split('T')[0])

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  query = query.order('due_date', { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getTasksDueSoon(days = 7, projectId = null) {
    const today = new Date()
  const future = new Date(today)
  future.setDate(future.getDate() + days)

  let query = supabase
    .from('crm_project_tasks')
    .select(`
      *,
      project:crm_projects(id, name, lead_id)
    `)
    .neq('status', 'completed')
    .gte('due_date', today.toISOString().split('T')[0])
    .lte('due_date', future.toISOString().split('T')[0])

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  query = query.order('due_date', { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getTaskSummary(projectId) {
  
  const { data, error } = await supabase
    .from('crm_project_task_summary')
    .select('*')
    .eq('project_id', projectId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}
