// lib/crm.js
// Core CRM functions for lead management

import { supabaseCRM as supabase } from './supabase-crm'
import { sendDiscordNotification, buildNewLeadEmbed, buildStageChangeEmbed } from './discord'
import { handleContactFormSubmission } from './hubspot'
import { createLeadContactTask } from './tasks'

// Stage configuration
export const STAGES = {
  contact: { label: 'Contact', order: 1, color: '#6b7280' },
  plan_audit_meeting: { label: 'Plan Audit Meeting', order: 2, color: '#8b5cf6' },
  discovery_call: { label: 'Discovery Call', order: 3, color: '#3b82f6' },
  proposal: { label: 'Proposal', order: 4, color: '#f59e0b' },
  offer: { label: 'Offer', order: 5, color: '#ec4899' },
  negotiating: { label: 'Negotiating', order: 6, color: '#f97316' },
  won: { label: 'Won', order: 7, color: '#10b981' },
  lost: { label: 'Lost', order: 8, color: '#ef4444' },
}

// Source configuration
export const SOURCES = {
  website_audit: { label: 'Website Audit', icon: 'search' },
  systems_form: { label: 'Systems Form', icon: 'settings' },
  contact_form: { label: 'Contact Form', icon: 'mail' },
  audit_email: { label: 'Audit Email', icon: 'inbox' },
  manual: { label: 'Manual Entry', icon: 'edit' },
}

// Scoring weights
const SCORE_WEIGHTS = {
  needs: 30,
  company_size: 20,
  budget: 30,
  timeline: 20,
}

/**
 * Calculate lead score based on various factors
 */
export function calculateLeadScore(leadData) {
  const breakdown = {
    needs: 0,
    company_size: 0,
    budget: 0,
    timeline: 0,
  }

  // Needs scoring (0-100, weighted to 30%)
  if (leadData.source === 'website_audit') {
    // Website audit with poor scores indicates high need
    const auditScores = leadData.audit_scores
    if (auditScores) {
      const avgScore = (
        (auditScores.performance || 0) +
        (auditScores.accessibility || 0) +
        (auditScores.bestPractices || 0) +
        (auditScores.seo || 0)
      ) / 4
      // Poor website = high need
      if (avgScore < 50) breakdown.needs = 85
      else if (avgScore < 70) breakdown.needs = 60
      else breakdown.needs = 30
    } else {
      breakdown.needs = 50 // Default for audit without scores
    }
  } else if (leadData.source === 'systems_form') {
    // Systems form indicates engaged prospect
    breakdown.needs = 70
  } else if (leadData.source === 'audit_email') {
    breakdown.needs = 65
  } else if (leadData.source === 'contact_form') {
    breakdown.needs = 40
  } else {
    breakdown.needs = 30
  }

  // Company size scoring (based on form data or company name)
  const company = leadData.company?.toLowerCase() || ''
  const businessType = leadData.business_type?.toLowerCase() || ''

  if (company.includes('construction') || company.includes('contractors') || businessType.includes('construction')) {
    breakdown.company_size = 70 // Target industry
  } else if (company.includes('llc') || company.includes('inc') || company.includes('corp')) {
    breakdown.company_size = 60
  } else if (company) {
    breakdown.company_size = 40
  } else {
    breakdown.company_size = 20
  }

  // Budget scoring
  const budgetRange = leadData.budget_range?.toLowerCase() || ''
  if (budgetRange.includes('10k') || budgetRange.includes('15k') || budgetRange.includes('20k')) {
    breakdown.budget = 90
  } else if (budgetRange.includes('5k') || budgetRange.includes('7k')) {
    breakdown.budget = 70
  } else if (budgetRange.includes('3k')) {
    breakdown.budget = 50
  } else {
    breakdown.budget = 30 // Unknown budget
  }

  // Timeline scoring
  const timeline = leadData.timeline?.toLowerCase() || ''
  if (timeline.includes('asap') || timeline.includes('urgent') || timeline.includes('immediately')) {
    breakdown.timeline = 100
  } else if (timeline.includes('1 month') || timeline.includes('2 month')) {
    breakdown.timeline = 80
  } else if (timeline.includes('3 month') || timeline.includes('quarter')) {
    breakdown.timeline = 60
  } else if (timeline.includes('6 month')) {
    breakdown.timeline = 40
  } else {
    breakdown.timeline = 30 // Unknown/flexible
  }

  // Calculate total weighted score
  const totalScore = Math.round(
    (breakdown.needs * SCORE_WEIGHTS.needs +
      breakdown.company_size * SCORE_WEIGHTS.company_size +
      breakdown.budget * SCORE_WEIGHTS.budget +
      breakdown.timeline * SCORE_WEIGHTS.timeline) / 100
  )

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown,
  }
}

/**
 * Create or update a lead in the CRM
 * Main entry point for all lead sources
 */
export async function createOrUpdateLead(leadData) {
  const {
    email,
    first_name,
    last_name,
    full_name,
    phone,
    company,
    website,
    source,
    source_url,
    conversion_page,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    form_data = {},
    business_type,
    project_type,
    budget_range,
    timeline,
    audit_id,
    audit_scores,
    tags = [],
  } = leadData

  if (!email) {
    throw new Error('Email is required to create a lead')
  }

  if (!source) {
    throw new Error('Source is required to create a lead')
  }

  // Check for existing lead by email
  const { data: existingLead } = await supabase
    .from('crm_leads')
    .select('*')
    .ilike('email', email)
    .single()

  // Calculate lead score
  const scoreData = calculateLeadScore({
    source,
    audit_scores,
    company,
    business_type,
    budget_range,
    timeline,
  })

  // Build full name if not provided
  const computedFullName = full_name ||
    (first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null)

  const leadRecord = {
    email: email.toLowerCase().trim(),
    first_name,
    last_name,
    full_name: computedFullName,
    phone,
    company,
    website,
    source,
    source_url,
    conversion_page,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    form_data,
    business_type,
    project_type,
    budget_range,
    timeline,
    audit_id,
    audit_scores,
    score: scoreData.score,
    score_breakdown: scoreData.breakdown,
    tags,
    last_activity_at: new Date().toISOString(),
  }

  let lead
  let isNew = false

  if (existingLead) {
    // Update existing lead - merge data, don't overwrite with nulls
    const updateData = {}
    for (const [key, value] of Object.entries(leadRecord)) {
      if (value !== null && value !== undefined) {
        // For form_data, merge with existing
        if (key === 'form_data' && existingLead.form_data) {
          updateData[key] = { ...existingLead.form_data, ...value }
        }
        // For tags, merge arrays
        else if (key === 'tags' && existingLead.tags) {
          updateData[key] = [...new Set([...existingLead.tags, ...value])]
        }
        // For audit data, only update if new
        else if ((key === 'audit_id' || key === 'audit_scores') && existingLead[key]) {
          // Keep existing audit data unless new is provided
          if (value) updateData[key] = value
        }
        // For score, only update if higher
        else if (key === 'score') {
          updateData[key] = Math.max(existingLead.score || 0, value)
        }
        else {
          updateData[key] = value
        }
      }
    }

    const { data, error } = await supabase
      .from('crm_leads')
      .update(updateData)
      .eq('id', existingLead.id)
      .select()
      .single()

    if (error) throw error
    lead = data

    // Log activity for returning lead
    await logActivity({
      lead_id: lead.id,
      type: 'form_submission',
      title: `Returning lead from ${SOURCES[source]?.label || source}`,
      description: conversion_page ? `Submitted form on ${conversion_page}` : null,
      metadata: { source, form_data },
    })
  } else {
    // Create new lead
    isNew = true
    const { data, error } = await supabase
      .from('crm_leads')
      .insert(leadRecord)
      .select()
      .single()

    if (error) throw error
    lead = data

    // Log activity for new lead
    await logActivity({
      lead_id: lead.id,
      type: 'form_submission',
      title: `New lead from ${SOURCES[source]?.label || source}`,
      description: conversion_page ? `Submitted form on ${conversion_page}` : null,
      metadata: { source, form_data },
    })

    // Send Discord notification for new leads
    try {
      const embed = buildNewLeadEmbed(lead)
      await sendDiscordNotification({ embeds: [embed] })
    } catch (error) {
      console.error('Failed to send Discord notification:', error)
    }

    // Create auto-task for contacting new lead
    try {
      await createLeadContactTask(lead)
    } catch (error) {
      console.error('Failed to create contact task:', error)
    }
  }

  // Sync to HubSpot in background (non-blocking)
  syncToHubSpot(lead).catch(err => {
    console.error('HubSpot sync failed:', err)
  })

  return { lead, isNew }
}

/**
 * Update a lead's pipeline stage
 */
export async function updateLeadStage(leadId, newStage, actorName = 'System') {
  // Validate stage
  if (!STAGES[newStage]) {
    throw new Error(`Invalid stage: ${newStage}`)
  }

  // Get current lead
  const { data: lead, error: fetchError } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (fetchError || !lead) {
    throw new Error('Lead not found')
  }

  const previousStage = lead.stage

  // Don't update if same stage
  if (previousStage === newStage) {
    return lead
  }

  // Build update data
  const updateData = {
    stage: newStage,
    stage_changed_at: new Date().toISOString(),
  }

  // Automatically convert to client when stage changes to "won"
  if (newStage === 'won' && !lead.is_client) {
    updateData.is_client = true
    updateData.client_since = new Date().toISOString()
    // Clear lead-specific fields on conversion to client
    updateData.score = null
    updateData.score_breakdown = null
    updateData.source = null
  }

  // Update the lead
  const { data: updatedLead, error: updateError } = await supabase
    .from('crm_leads')
    .update(updateData)
    .eq('id', leadId)
    .select()
    .single()

  if (updateError) throw updateError

  // Log activity
  await logActivity({
    lead_id: leadId,
    type: 'stage_change',
    title: `Stage changed: ${STAGES[previousStage]?.label} → ${STAGES[newStage]?.label}`,
    previous_stage: previousStage,
    new_stage: newStage,
    actor_type: 'user',
    actor_name: actorName,
  })

  // Send Discord notification for stage changes
  try {
    const embed = buildStageChangeEmbed(updatedLead, previousStage)
    await sendDiscordNotification({ embeds: [embed] })
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
  }

  return updatedLead
}

/**
 * Log an activity for a lead
 */
export async function logActivity({
  lead_id,
  type,
  title,
  description = null,
  metadata = {},
  previous_stage = null,
  new_stage = null,
  actor_type = 'system',
  actor_name = null,
}) {
  const { data, error } = await supabase
    .from('crm_activities')
    .insert({
      lead_id,
      type,
      title,
      description,
      metadata,
      previous_stage,
      new_stage,
      actor_type,
      actor_name,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to log activity:', error)
    throw error
  }

  return data
}

/**
 * Sync lead to HubSpot
 * Non-blocking background operation
 */
export async function syncToHubSpot(lead) {
  try {
    // Skip if already synced recently (within 1 hour)
    if (lead.hubspot_synced_at) {
      const lastSync = new Date(lead.hubspot_synced_at)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      if (lastSync > oneHourAgo) {
        return { skipped: true, reason: 'Recently synced' }
      }
    }

    // Build HubSpot form data
    const hubspotData = {
      name: lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      website: lead.website,
      message: lead.form_data?.message || lead.form_data?.challenge || null,
    }

    // Call existing HubSpot integration
    const result = await handleContactFormSubmission(hubspotData)

    if (result.success) {
      // Update lead with HubSpot IDs
      await supabase
        .from('crm_leads')
        .update({
          hubspot_contact_id: result.contactId,
          hubspot_deal_id: result.dealId,
          hubspot_synced_at: new Date().toISOString(),
          hubspot_sync_status: 'synced',
        })
        .eq('id', lead.id)

      // Log activity
      await logActivity({
        lead_id: lead.id,
        type: 'hubspot_sync',
        title: 'Synced to HubSpot',
        metadata: {
          contactId: result.contactId,
          dealId: result.dealId,
          companyId: result.companyId,
        },
      })

      return { success: true, ...result }
    } else {
      // Update status to failed
      await supabase
        .from('crm_leads')
        .update({
          hubspot_sync_status: 'failed',
        })
        .eq('id', lead.id)

      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('HubSpot sync error:', error)

    // Update status to failed
    await supabase
      .from('crm_leads')
      .update({
        hubspot_sync_status: 'failed',
      })
      .eq('id', lead.id)

    return { success: false, error: error.message }
  }
}

/**
 * Get pipeline statistics
 */
export async function getPipelineStats() {
  // Exclude clients from pipeline stats - they're tracked separately
  const { data, error } = await supabase
    .from('crm_leads')
    .select('stage, score, created_at, is_client')
    .not('status', 'in', '("archived","unqualified")')
    .or('is_client.is.null,is_client.eq.false')

  if (error) throw error

  const stats = {}
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  for (const stage of Object.keys(STAGES)) {
    const stageLeads = data.filter(l => l.stage === stage)
    stats[stage] = {
      count: stageLeads.length,
      newThisWeek: stageLeads.filter(l => new Date(l.created_at) > oneWeekAgo).length,
      avgScore: stageLeads.length > 0
        ? Math.round(stageLeads.reduce((sum, l) => sum + (l.score || 0), 0) / stageLeads.length)
        : 0,
    }
  }

  return stats
}

/**
 * Search leads
 */
export async function searchLeads(query, { limit = 20, offset = 0 } = {}) {
  const searchPattern = `%${query}%`

  const { data, error, count } = await supabase
    .from('crm_leads')
    .select('*', { count: 'exact' })
    .or(`email.ilike.${searchPattern},full_name.ilike.${searchPattern},company.ilike.${searchPattern},phone.ilike.${searchPattern}`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return { leads: data, total: count }
}

/**
 * Get lead with activities (pinned items first)
 */
export async function getLeadWithActivities(leadId) {
  const { data: lead, error: leadError } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (leadError) throw leadError

  // Get pinned activities first
  const { data: pinnedActivities, error: pinnedError } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('lead_id', leadId)
    .eq('is_pinned', true)
    .order('pinned_at', { ascending: false })

  if (pinnedError) throw pinnedError

  // Get non-pinned activities
  const { data: regularActivities, error: activitiesError } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('lead_id', leadId)
    .or('is_pinned.is.null,is_pinned.eq.false')
    .order('created_at', { ascending: false })

  if (activitiesError) throw activitiesError

  // Combine: pinned first, then regular
  const activities = [...(pinnedActivities || []), ...(regularActivities || [])]

  return { ...lead, activities }
}

/**
 * Toggle pin status on an activity
 * Only notes and emails can be pinned
 * Max 5 pinned per lead
 */
export async function toggleActivityPin(activityId, isPinned, actorName = 'System') {
  // Get the activity first
  const { data: activity, error: fetchError } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('id', activityId)
    .single()

  if (fetchError || !activity) {
    throw new Error('Activity not found')
  }

  // Only allow pinning notes and emails
  const pinnableTypes = ['note', 'email_sent', 'email_received']
  if (!pinnableTypes.includes(activity.type)) {
    throw new Error('Only notes and emails can be pinned')
  }

  // If pinning, check the limit (max 5 per lead)
  if (isPinned) {
    const { count, error: countError } = await supabase
      .from('crm_activities')
      .select('*', { count: 'exact', head: true })
      .eq('lead_id', activity.lead_id)
      .eq('is_pinned', true)

    if (countError) throw countError

    if (count >= 5) {
      throw new Error('Maximum of 5 pinned items allowed per lead')
    }
  }

  // Update the pin status
  const updateData = {
    is_pinned: isPinned,
    pinned_at: isPinned ? new Date().toISOString() : null,
    pinned_by: isPinned ? actorName : null,
  }

  const { data: updated, error: updateError } = await supabase
    .from('crm_activities')
    .update(updateData)
    .eq('id', activityId)
    .select()
    .single()

  if (updateError) throw updateError

  return updated
}
