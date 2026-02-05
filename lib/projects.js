// lib/projects.js
// Project management functions for CRM

import { supabaseCRM as supabase } from './supabase-crm'
import { logActivity } from './crm'

// Project status configuration
export const PROJECT_STATUS = {
  planning: { label: 'Planning', color: '#6b7280', icon: 'clipboard' },
  active: { label: 'Active', color: '#3b82f6', icon: 'play' },
  on_hold: { label: 'On Hold', color: '#f59e0b', icon: 'pause' },
  completed: { label: 'Completed', color: '#10b981', icon: 'check' },
  cancelled: { label: 'Cancelled', color: '#ef4444', icon: 'x' },
}

/**
 * Create a new project for a lead
 */
export async function createProject(leadId, data, actorName = 'System') {
  const {
    name,
    description,
    status = 'planning',
    budget,
    start_date,
    target_end_date,
    milestones = [],
    devops_site_ids = [],
    tags = [],
  } = data

  if (!name) {
    throw new Error('Project name is required')
  }

  const { data: project, error } = await supabase
    .from('crm_projects')
    .insert({
      lead_id: leadId,
      name,
      description,
      status,
      budget,
      start_date,
      target_end_date,
      milestones,
      devops_site_ids,
      tags,
    })
    .select()
    .single()

  if (error) throw error

  // Log activity
  await logActivity({
    lead_id: leadId,
    type: 'system',
    title: `Project created: ${name}`,
    description: description || null,
    metadata: { project_id: project.id, budget, status },
    actor_type: 'user',
    actor_name: actorName,
  })

  return project
}

/**
 * Update an existing project
 */
export async function updateProject(projectId, data, actorName = 'System') {
  // Get current project first
  const { data: currentProject, error: fetchError } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !currentProject) {
    throw new Error('Project not found')
  }

  const { data: project, error } = await supabase
    .from('crm_projects')
    .update(data)
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error

  // Track status changes
  if (data.status && data.status !== currentProject.status) {
    await logActivity({
      lead_id: project.lead_id,
      type: 'system',
      title: `Project status changed: ${currentProject.name}`,
      description: `${PROJECT_STATUS[currentProject.status]?.label || currentProject.status} → ${PROJECT_STATUS[data.status]?.label || data.status}`,
      metadata: {
        project_id: project.id,
        previous_status: currentProject.status,
        new_status: data.status,
      },
      actor_type: 'user',
      actor_name: actorName,
    })

    // If completed, set actual_end_date
    if (data.status === 'completed' && !data.actual_end_date) {
      await supabase
        .from('crm_projects')
        .update({ actual_end_date: new Date().toISOString().split('T')[0] })
        .eq('id', projectId)
    }
  }

  return project
}

/**
 * Delete a project
 */
export async function deleteProject(projectId, actorName = 'System') {
  // Get project first for logging
  const { data: project, error: fetchError } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    throw new Error('Project not found')
  }

  const { error } = await supabase
    .from('crm_projects')
    .delete()
    .eq('id', projectId)

  if (error) throw error

  // Log activity
  await logActivity({
    lead_id: project.lead_id,
    type: 'system',
    title: `Project deleted: ${project.name}`,
    metadata: { project_id: projectId },
    actor_type: 'user',
    actor_name: actorName,
  })

  return { success: true }
}

/**
 * Get a project with all related details
 */
export async function getProjectWithDetails(projectId) {
  const { data: project, error } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) throw error

  // Get related proposals
  const { data: proposals } = await supabase
    .from('crm_proposals')
    .select('id, title, proposal_number, total_amount, status, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  // Get invoices for the lead
  const { data: invoices } = await supabase
    .from('crm_stripe_invoices')
    .select('*')
    .eq('lead_id', project.lead_id)
    .order('created_in_stripe', { ascending: false })

  // Get DevOps sites if any linked
  let devopsSites = []
  if (project.devops_site_ids && project.devops_site_ids.length > 0) {
    const { data: sites } = await supabase
      .from('devops_sites')
      .select('id, name, url, status')
      .in('id', project.devops_site_ids)

    devopsSites = sites || []
  }

  return {
    ...project,
    proposals: proposals || [],
    invoices: invoices || [],
    devopsSites,
  }
}

/**
 * Get all projects for a lead
 */
export async function getLeadProjects(leadId) {
  const { data, error } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

/**
 * Link DevOps sites to a project
 */
export async function linkDevOpsSites(projectId, siteIds, actorName = 'System') {
  const { data: project, error: fetchError } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    throw new Error('Project not found')
  }

  // Merge with existing site IDs, removing duplicates
  const existingIds = project.devops_site_ids || []
  const newIds = [...new Set([...existingIds, ...siteIds])]

  const { data, error } = await supabase
    .from('crm_projects')
    .update({ devops_site_ids: newIds })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error

  // Log activity
  await logActivity({
    lead_id: project.lead_id,
    type: 'system',
    title: `DevOps sites linked to ${project.name}`,
    metadata: { project_id: projectId, site_ids: siteIds },
    actor_type: 'user',
    actor_name: actorName,
  })

  return data
}

/**
 * Unlink DevOps sites from a project
 */
export async function unlinkDevOpsSites(projectId, siteIds, actorName = 'System') {
  const { data: project, error: fetchError } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    throw new Error('Project not found')
  }

  // Remove specified site IDs
  const existingIds = project.devops_site_ids || []
  const newIds = existingIds.filter(id => !siteIds.includes(id))

  const { data, error } = await supabase
    .from('crm_projects')
    .update({ devops_site_ids: newIds })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error

  return data
}

/**
 * Update project milestones
 */
export async function updateMilestones(projectId, milestones, actorName = 'System') {
  const { data: project, error: fetchError } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    throw new Error('Project not found')
  }

  // Validate milestone structure
  const validatedMilestones = milestones.map((m, index) => ({
    id: m.id || `milestone-${Date.now()}-${index}`,
    name: m.name,
    due_date: m.due_date || null,
    completed_at: m.completed_at || null,
    status: m.status || 'pending',
    description: m.description || null,
  }))

  const { data, error } = await supabase
    .from('crm_projects')
    .update({ milestones: validatedMilestones })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error

  // Check if any milestones were completed in this update
  const oldMilestones = project.milestones || []
  const newlyCompleted = validatedMilestones.filter(m => {
    const oldMilestone = oldMilestones.find(om => om.id === m.id)
    return m.status === 'completed' && (!oldMilestone || oldMilestone.status !== 'completed')
  })

  if (newlyCompleted.length > 0) {
    await logActivity({
      lead_id: project.lead_id,
      type: 'system',
      title: `Milestone completed: ${newlyCompleted.map(m => m.name).join(', ')}`,
      metadata: {
        project_id: projectId,
        project_name: project.name,
        completed_milestones: newlyCompleted,
      },
      actor_type: 'user',
      actor_name: actorName,
    })
  }

  return data
}

/**
 * Add a single milestone to a project
 */
export async function addMilestone(projectId, milestone, actorName = 'System') {
  const { data: project, error: fetchError } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    throw new Error('Project not found')
  }

  const newMilestone = {
    id: `milestone-${Date.now()}`,
    name: milestone.name,
    due_date: milestone.due_date || null,
    completed_at: null,
    status: 'pending',
    description: milestone.description || null,
  }

  const updatedMilestones = [...(project.milestones || []), newMilestone]

  const { data, error } = await supabase
    .from('crm_projects')
    .update({ milestones: updatedMilestones })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error

  return data
}

/**
 * Complete a milestone
 */
export async function completeMilestone(projectId, milestoneId, actorName = 'System') {
  const { data: project, error: fetchError } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    throw new Error('Project not found')
  }

  const milestones = project.milestones || []
  const milestoneIndex = milestones.findIndex(m => m.id === milestoneId)

  if (milestoneIndex === -1) {
    throw new Error('Milestone not found')
  }

  milestones[milestoneIndex] = {
    ...milestones[milestoneIndex],
    status: 'completed',
    completed_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('crm_projects')
    .update({ milestones })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error

  // Log activity
  await logActivity({
    lead_id: project.lead_id,
    type: 'system',
    title: `Milestone completed: ${milestones[milestoneIndex].name}`,
    metadata: {
      project_id: projectId,
      project_name: project.name,
      milestone_id: milestoneId,
    },
    actor_type: 'user',
    actor_name: actorName,
  })

  return data
}

/**
 * Calculate project progress based on milestones
 */
export function calculateProjectProgress(project) {
  const milestones = project.milestones || []

  if (milestones.length === 0) {
    // No milestones, use status-based progress
    switch (project.status) {
      case 'planning': return 10
      case 'active': return 50
      case 'on_hold': return 50
      case 'completed': return 100
      case 'cancelled': return 0
      default: return 0
    }
  }

  const completed = milestones.filter(m => m.status === 'completed').length
  return Math.round((completed / milestones.length) * 100)
}

/**
 * Get project statistics for a lead
 */
export async function getLeadProjectStats(leadId) {
  const { data: projects, error } = await supabase
    .from('crm_projects')
    .select('*')
    .eq('lead_id', leadId)

  if (error) throw error

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0),
    totalInvoiced: projects.reduce((sum, p) => sum + (parseFloat(p.amount_invoiced) || 0), 0),
    totalPaid: projects.reduce((sum, p) => sum + (parseFloat(p.amount_paid) || 0), 0),
  }

  return stats
}
