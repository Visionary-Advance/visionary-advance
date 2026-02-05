// lib/time-tracking.js
// Time tracking for projects

import { supabaseCRM as supabase } from './supabase-crm'

// ============================================
// TIME ENTRY CRUD
// ============================================

export async function createTimeEntry(projectId, data) {
  
  const { data: entry, error } = await supabase
    .from('crm_time_entries')
    .insert({
      project_id: projectId,
      task_id: data.task_id || null,
      description: data.description || null,
      duration_minutes: data.duration_minutes,
      entry_date: data.entry_date || new Date().toISOString().split('T')[0],
      user_name: data.user_name,
      billable: data.billable !== false,
      hourly_rate: data.hourly_rate || null,
    })
    .select(`
      *,
      task:crm_project_tasks(id, title)
    `)
    .single()

  if (error) throw error
  return entry
}

export async function updateTimeEntry(entryId, data) {
  
  const updates = {}
  if (data.task_id !== undefined) updates.task_id = data.task_id
  if (data.description !== undefined) updates.description = data.description
  if (data.duration_minutes !== undefined) updates.duration_minutes = data.duration_minutes
  if (data.entry_date !== undefined) updates.entry_date = data.entry_date
  if (data.user_name !== undefined) updates.user_name = data.user_name
  if (data.billable !== undefined) updates.billable = data.billable
  if (data.hourly_rate !== undefined) updates.hourly_rate = data.hourly_rate

  const { data: entry, error } = await supabase
    .from('crm_time_entries')
    .update(updates)
    .eq('id', entryId)
    .select(`
      *,
      task:crm_project_tasks(id, title)
    `)
    .single()

  if (error) throw error
  return entry
}

export async function deleteTimeEntry(entryId) {
  
  const { error } = await supabase
    .from('crm_time_entries')
    .delete()
    .eq('id', entryId)

  if (error) throw error
  return true
}

export async function getProjectTimeEntries(projectId, options = {}) {
  
  let query = supabase
    .from('crm_time_entries')
    .select(`
      *,
      task:crm_project_tasks(id, title)
    `)
    .eq('project_id', projectId)

  if (options.startDate) {
    query = query.gte('entry_date', options.startDate)
  }

  if (options.endDate) {
    query = query.lte('entry_date', options.endDate)
  }

  if (options.taskId) {
    query = query.eq('task_id', options.taskId)
  }

  if (options.userName) {
    query = query.eq('user_name', options.userName)
  }

  if (options.billable !== undefined) {
    query = query.eq('billable', options.billable)
  }

  query = query.order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data: entries, error } = await query

  if (error) throw error
  return entries || []
}

// ============================================
// TIME SUMMARIES
// ============================================

export async function getProjectTimeSummary(projectId) {
  
  const { data, error } = await supabase
    .from('crm_project_time_summary')
    .select('*')
    .eq('project_id', projectId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getTimeByTask(projectId) {
  
  const { data, error } = await supabase
    .from('crm_time_entries')
    .select(`
      task_id,
      task:crm_project_tasks(id, title, status),
      duration_minutes
    `)
    .eq('project_id', projectId)

  if (error) throw error

  // Aggregate by task
  const byTask = {}
  for (const entry of data || []) {
    const taskId = entry.task_id || 'unassigned'
    if (!byTask[taskId]) {
      byTask[taskId] = {
        task_id: entry.task_id,
        task: entry.task,
        total_minutes: 0,
        entry_count: 0,
      }
    }
    byTask[taskId].total_minutes += entry.duration_minutes
    byTask[taskId].entry_count += 1
  }

  return Object.values(byTask).map(t => ({
    ...t,
    total_hours: Math.round((t.total_minutes / 60) * 100) / 100,
  }))
}

export async function getTimeByDate(projectId, startDate, endDate) {
  
  const { data, error } = await supabase
    .from('crm_time_entries')
    .select('entry_date, duration_minutes, billable')
    .eq('project_id', projectId)
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .order('entry_date', { ascending: true })

  if (error) throw error

  // Aggregate by date
  const byDate = {}
  for (const entry of data || []) {
    if (!byDate[entry.entry_date]) {
      byDate[entry.entry_date] = {
        date: entry.entry_date,
        total_minutes: 0,
        billable_minutes: 0,
      }
    }
    byDate[entry.entry_date].total_minutes += entry.duration_minutes
    if (entry.billable) {
      byDate[entry.entry_date].billable_minutes += entry.duration_minutes
    }
  }

  return Object.values(byDate).map(d => ({
    ...d,
    total_hours: Math.round((d.total_minutes / 60) * 100) / 100,
    billable_hours: Math.round((d.billable_minutes / 60) * 100) / 100,
  }))
}

export async function getTimeByUser(projectId) {
  
  const { data, error } = await supabase
    .from('crm_time_entries')
    .select('user_name, duration_minutes, billable')
    .eq('project_id', projectId)

  if (error) throw error

  // Aggregate by user
  const byUser = {}
  for (const entry of data || []) {
    if (!byUser[entry.user_name]) {
      byUser[entry.user_name] = {
        user_name: entry.user_name,
        total_minutes: 0,
        billable_minutes: 0,
        entry_count: 0,
      }
    }
    byUser[entry.user_name].total_minutes += entry.duration_minutes
    if (entry.billable) {
      byUser[entry.user_name].billable_minutes += entry.duration_minutes
    }
    byUser[entry.user_name].entry_count += 1
  }

  return Object.values(byUser).map(u => ({
    ...u,
    total_hours: Math.round((u.total_minutes / 60) * 100) / 100,
    billable_hours: Math.round((u.billable_minutes / 60) * 100) / 100,
  }))
}

// ============================================
// HELPERS
// ============================================

export function formatDuration(minutes) {
  if (!minutes) return '0h'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function parseDuration(input) {
  // Accepts formats: "1h 30m", "1.5h", "90m", "1:30"
  if (!input) return 0

  const str = input.toString().toLowerCase().trim()

  // Format: 1:30 (hours:minutes)
  if (str.includes(':')) {
    const [hours, minutes] = str.split(':').map(n => parseInt(n) || 0)
    return hours * 60 + minutes
  }

  // Format: 1h 30m or 1h30m
  const hourMatch = str.match(/(\d+(?:\.\d+)?)\s*h/)
  const minMatch = str.match(/(\d+)\s*m/)

  let totalMinutes = 0

  if (hourMatch) {
    totalMinutes += parseFloat(hourMatch[1]) * 60
  }

  if (minMatch) {
    totalMinutes += parseInt(minMatch[1])
  }

  // If no unit specified, assume hours if decimal, minutes if integer
  if (!hourMatch && !minMatch) {
    const num = parseFloat(str)
    if (!isNaN(num)) {
      totalMinutes = str.includes('.') ? num * 60 : num
    }
  }

  return Math.round(totalMinutes)
}

export function calculateBurnRate(totalHours, estimatedHours) {
  if (!estimatedHours || estimatedHours === 0) return null
  return Math.round((totalHours / estimatedHours) * 100)
}
