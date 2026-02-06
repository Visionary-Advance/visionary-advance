// lib/tasks.js
// CRM Task management functions

import { supabaseCRM as supabase } from './supabase-crm'

// Task type configuration
export const TASK_TYPES = {
  general: { label: 'General', icon: 'clipboard' },
  follow_up: { label: 'Follow Up', icon: 'refresh' },
  call: { label: 'Call', icon: 'phone' },
  email: { label: 'Email', icon: 'mail' },
  meeting: { label: 'Meeting', icon: 'calendar' },
  review: { label: 'Review', icon: 'eye' },
}

// Priority configuration
export const PRIORITIES = {
  low: { label: 'Low', color: '#6b7280', order: 1 },
  medium: { label: 'Medium', color: '#3b82f6', order: 2 },
  high: { label: 'High', color: '#f59e0b', order: 3 },
  urgent: { label: 'Urgent', color: '#ef4444', order: 4 },
}

// Task status configuration
export const TASK_STATUSES = {
  pending: { label: 'Pending', color: '#6b7280' },
  in_progress: { label: 'In Progress', color: '#3b82f6' },
  completed: { label: 'Completed', color: '#10b981' },
}

/**
 * Create a new task
 */
export async function createTask({
  lead_id = null,
  business_id = null,
  title,
  description = null,
  status = 'pending',
  priority = 'medium',
  task_type = 'general',
  assignee = null,
  due_date = null,
  due_time = null,
  is_auto_created = false,
  auto_task_source = null,
  sort_order = 0,
}) {
  if (!title) {
    throw new Error('Title is required to create a task')
  }

  const { data, error } = await supabase
    .from('crm_tasks')
    .insert({
      lead_id,
      business_id,
      title,
      description,
      status,
      priority,
      task_type,
      assignee,
      due_date,
      due_time,
      is_auto_created,
      auto_task_source,
      sort_order,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an existing task
 */
export async function updateTask(taskId, updates) {
  const { data, error } = await supabase
    .from('crm_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a task
 */
export async function deleteTask(taskId) {
  const { error } = await supabase
    .from('crm_tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
  return { success: true }
}

/**
 * Get a single task by ID
 */
export async function getTask(taskId) {
  const { data, error } = await supabase
    .from('crm_task_overview')
    .select('*')
    .eq('id', taskId)
    .single()

  if (error) throw error
  return data
}

/**
 * Complete a task
 */
export async function completeTask(taskId, completedBy = null) {
  const { data, error } = await supabase
    .from('crm_tasks')
    .update({
      status: 'completed',
      completed_by: completedBy,
    })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get tasks with filtering and pagination
 */
export async function getTasks({
  lead_id = null,
  business_id = null,
  status = null,
  priority = null,
  task_type = null,
  assignee = null,
  due_date_from = null,
  due_date_to = null,
  include_completed = false,
  sort_by = 'due_date',
  sort_order = 'asc',
  limit = 50,
  offset = 0,
} = {}) {
  let query = supabase
    .from('crm_task_overview')
    .select('*', { count: 'exact' })

  // Filter by lead
  if (lead_id) {
    query = query.eq('lead_id', lead_id)
  }

  // Filter by business
  if (business_id) {
    query = query.eq('business_id', business_id)
  }

  // Filter by status
  if (status) {
    const statuses = Array.isArray(status) ? status : status.split(',')
    query = query.in('status', statuses)
  } else if (!include_completed) {
    query = query.neq('status', 'completed')
  }

  // Filter by priority
  if (priority) {
    const priorities = Array.isArray(priority) ? priority : priority.split(',')
    query = query.in('priority', priorities)
  }

  // Filter by task type
  if (task_type) {
    const types = Array.isArray(task_type) ? task_type : task_type.split(',')
    query = query.in('task_type', types)
  }

  // Filter by assignee
  if (assignee) {
    query = query.eq('assignee', assignee)
  }

  // Filter by due date range
  if (due_date_from) {
    query = query.gte('due_date', due_date_from)
  }
  if (due_date_to) {
    query = query.lte('due_date', due_date_to)
  }

  // Sorting
  const validSortFields = ['due_date', 'created_at', 'updated_at', 'priority', 'title']
  const sortField = validSortFields.includes(sort_by) ? sort_by : 'due_date'

  // For priority sorting, we want urgent first (desc), for dates we typically want soonest first (asc)
  const ascending = sort_order === 'asc'
  query = query.order(sortField, { ascending, nullsFirst: false })

  // Secondary sort by priority if not primary
  if (sortField !== 'priority') {
    query = query.order('priority', { ascending: false })
  }

  // Pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  return {
    tasks: data,
    total: count,
    pagination: {
      limit,
      offset,
      total: count,
      hasMore: offset + limit < count,
    },
  }
}

/**
 * Get all tasks for a specific lead
 */
export async function getLeadTasks(leadId, includeCompleted = false) {
  let query = supabase
    .from('crm_task_overview')
    .select('*')
    .eq('lead_id', leadId)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('priority', { ascending: false })

  if (!includeCompleted) {
    query = query.neq('status', 'completed')
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get all tasks for a specific business
 */
export async function getBusinessTasks(businessId, includeCompleted = false) {
  let query = supabase
    .from('crm_task_overview')
    .select('*')
    .eq('business_id', businessId)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('priority', { ascending: false })

  if (!includeCompleted) {
    query = query.neq('status', 'completed')
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get overdue tasks
 */
export async function getOverdueTasks(limit = 10) {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('crm_task_overview')
    .select('*')
    .neq('status', 'completed')
    .lt('due_date', today)
    .order('due_date', { ascending: true })
    .order('priority', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get tasks due today
 */
export async function getTasksDueToday(limit = 10) {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('crm_task_overview')
    .select('*')
    .neq('status', 'completed')
    .eq('due_date', today)
    .order('due_time', { ascending: true, nullsFirst: false })
    .order('priority', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get tasks due soon (next 7 days, excluding today)
 */
export async function getTasksDueSoon(days = 7, limit = 10) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + days)

  const { data, error } = await supabase
    .from('crm_task_overview')
    .select('*')
    .neq('status', 'completed')
    .gte('due_date', tomorrow.toISOString().split('T')[0])
    .lte('due_date', endDate.toISOString().split('T')[0])
    .order('due_date', { ascending: true })
    .order('priority', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get task summary statistics
 */
export async function getTaskSummary() {
  const { data, error } = await supabase
    .from('crm_task_summary')
    .select('*')
    .single()

  if (error) throw error
  return data
}

/**
 * Create an auto-task for contacting a new lead
 */
export async function createLeadContactTask(lead) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const leadName = lead.full_name || lead.email || 'Unknown'

  return createTask({
    lead_id: lead.id,
    title: `Contact new lead: ${leadName}`,
    description: lead.company
      ? `Reach out to ${leadName} from ${lead.company}. Source: ${lead.source || 'Unknown'}`
      : `Reach out to new lead ${leadName}. Source: ${lead.source || 'Unknown'}`,
    priority: 'high',
    task_type: 'follow_up',
    due_date: tomorrow.toISOString().split('T')[0],
    is_auto_created: true,
    auto_task_source: 'new_lead',
  })
}

/**
 * Create a follow-up task when a lead changes stage
 */
export async function createStageFollowUpTask(lead, newStage, previousStage) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const leadName = lead.full_name || lead.email || 'Unknown'

  // Customize task based on the new stage
  const stageTaskConfig = {
    plan_audit_meeting: {
      title: `Schedule audit meeting: ${leadName}`,
      description: `Lead moved to Plan Audit Meeting stage. Schedule a website audit meeting with ${leadName}.`,
      task_type: 'meeting',
      priority: 'high',
    },
    discovery_call: {
      title: `Conduct discovery call: ${leadName}`,
      description: `Lead moved to Discovery Call stage. Prepare and conduct discovery call with ${leadName}.`,
      task_type: 'call',
      priority: 'high',
    },
    proposal: {
      title: `Send proposal: ${leadName}`,
      description: `Lead moved to Proposal stage. Prepare and send proposal to ${leadName}.`,
      task_type: 'email',
      priority: 'high',
    },
    offer: {
      title: `Follow up on offer: ${leadName}`,
      description: `Lead moved to Offer stage. Follow up with ${leadName} about the offer.`,
      task_type: 'follow_up',
      priority: 'medium',
    },
    negotiating: {
      title: `Negotiate with: ${leadName}`,
      description: `Lead is in Negotiating stage. Continue negotiations with ${leadName}.`,
      task_type: 'call',
      priority: 'high',
    },
  }

  const config = stageTaskConfig[newStage]
  if (!config) return null // No task for won/lost/contact stages

  return createTask({
    lead_id: lead.id,
    title: config.title,
    description: config.description,
    priority: config.priority,
    task_type: config.task_type,
    due_date: tomorrow.toISOString().split('T')[0],
    is_auto_created: true,
    auto_task_source: `stage_change:${previousStage}_to_${newStage}`,
  })
}

/**
 * Bulk update task status
 */
export async function bulkUpdateTaskStatus(taskIds, status, completedBy = null) {
  const updates = { status }
  if (status === 'completed' && completedBy) {
    updates.completed_by = completedBy
  }

  const { data, error } = await supabase
    .from('crm_tasks')
    .update(updates)
    .in('id', taskIds)
    .select()

  if (error) throw error
  return data
}

/**
 * Get upcoming tasks for dashboard widget
 * Returns overdue, due today, and upcoming tasks in priority order
 */
export async function getUpcomingTasks(limit = 5) {
  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const { data, error } = await supabase
    .from('crm_task_overview')
    .select('*')
    .neq('status', 'completed')
    .or(`due_date.is.null,due_date.lte.${nextWeek.toISOString().split('T')[0]}`)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('priority', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// ============================================
// SUBTASK FUNCTIONS
// ============================================

/**
 * Get all subtasks for a task
 */
export async function getSubtasks(taskId) {
  const { data, error } = await supabase
    .from('crm_task_subtasks')
    .select('*')
    .eq('task_id', taskId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Create a subtask
 */
export async function createSubtask({ task_id, title, sort_order = 0 }) {
  if (!task_id || !title) {
    throw new Error('task_id and title are required')
  }

  const { data, error } = await supabase
    .from('crm_task_subtasks')
    .insert({ task_id, title, sort_order })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a subtask
 */
export async function updateSubtask(subtaskId, updates) {
  const { data, error } = await supabase
    .from('crm_task_subtasks')
    .update(updates)
    .eq('id', subtaskId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Toggle subtask completion
 */
export async function toggleSubtask(subtaskId) {
  // First get current state
  const { data: current, error: fetchError } = await supabase
    .from('crm_task_subtasks')
    .select('is_completed')
    .eq('id', subtaskId)
    .single()

  if (fetchError) throw fetchError

  const { data, error } = await supabase
    .from('crm_task_subtasks')
    .update({ is_completed: !current.is_completed })
    .eq('id', subtaskId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a subtask
 */
export async function deleteSubtask(subtaskId) {
  const { error } = await supabase
    .from('crm_task_subtasks')
    .delete()
    .eq('id', subtaskId)

  if (error) throw error
  return { success: true }
}
