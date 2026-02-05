// lib/businesses.js
// Business management functions for CRM

import { supabaseCRM as supabase } from './supabase-crm'
import { logActivity } from './crm'

// Lazy-load main Supabase client for SEO sites
let mainSupabase = null
function getMainSupabase() {
  if (!mainSupabase) {
    const { createClient } = require('@supabase/supabase-js')
    mainSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )
  }
  return mainSupabase
}

/**
 * Create a new business
 */
export async function createBusiness(data, actorName = 'System') {
  const {
    name,
    website,
    industry,
    notes,
    default_report_recipients = [],
  } = data

  if (!name) {
    throw new Error('Business name is required')
  }

  const { data: business, error } = await supabase
    .from('crm_businesses')
    .insert({
      name,
      website,
      industry,
      notes,
      default_report_recipients,
    })
    .select()
    .single()

  if (error) throw error

  return business
}

/**
 * Update a business
 */
export async function updateBusiness(businessId, data, actorName = 'System') {
  const { data: business, error } = await supabase
    .from('crm_businesses')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', businessId)
    .select()
    .single()

  if (error) throw error

  return business
}

/**
 * Delete a business
 */
export async function deleteBusiness(businessId) {
  // First unlink all leads (CRM database)
  await supabase
    .from('crm_leads')
    .update({ business_id: null })
    .eq('business_id', businessId)

  // Unlink all SEO sites (main database)
  const mainDb = getMainSupabase()
  await mainDb
    .from('seo_sites')
    .update({ business_id: null })
    .eq('business_id', businessId)

  const { error } = await supabase
    .from('crm_businesses')
    .delete()
    .eq('id', businessId)

  if (error) throw error

  return { success: true }
}

/**
 * Get a business by ID with related data
 */
export async function getBusinessById(businessId) {
  const { data: business, error } = await supabase
    .from('crm_businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (error) throw error
  if (!business) return null

  // Get linked contacts (leads that are clients) - CRM database
  const { data: contacts } = await supabase
    .from('crm_leads')
    .select('id, email, first_name, last_name, full_name, phone, is_client, stage')
    .eq('business_id', businessId)
    .order('is_client', { ascending: false })
    .order('full_name')

  // Get linked SEO sites - main database
  const mainDb = getMainSupabase()
  const { data: seoSites } = await mainDb
    .from('seo_sites')
    .select('id, site_url, display_name, is_active')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('display_name')

  return {
    ...business,
    contacts: contacts || [],
    seoSites: seoSites || [],
  }
}

/**
 * Get all businesses with optional filters
 */
export async function getBusinesses({ search, industry, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('crm_businesses')
    .select('*, contact_count:crm_leads(count)', { count: 'exact' })
    .order('name')
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,website.ilike.%${search}%`)
  }

  if (industry) {
    query = query.eq('industry', industry)
  }

  const { data, error, count } = await query

  if (error) throw error

  // Get SEO site counts from main database
  const mainDb = getMainSupabase()
  const businessIds = (data || []).map(b => b.id)

  let seoSiteCounts = {}
  if (businessIds.length > 0) {
    const { data: siteCounts } = await mainDb
      .from('seo_sites')
      .select('business_id')
      .in('business_id', businessIds)
      .eq('is_active', true)

    // Count sites per business
    seoSiteCounts = (siteCounts || []).reduce((acc, site) => {
      acc[site.business_id] = (acc[site.business_id] || 0) + 1
      return acc
    }, {})
  }

  // Transform counts from arrays to numbers
  const businesses = (data || []).map(b => ({
    ...b,
    contact_count: b.contact_count?.[0]?.count || 0,
    seo_site_count: seoSiteCounts[b.id] || 0,
  }))

  return { businesses, total: count }
}

/**
 * Link a lead/contact to a business
 */
export async function linkLeadToBusiness(leadId, businessId, actorName = 'System') {
  const { data: lead, error } = await supabase
    .from('crm_leads')
    .update({ business_id: businessId })
    .eq('id', leadId)
    .select('*, business:crm_businesses(id, name)')
    .single()

  if (error) throw error

  // Log activity
  if (businessId) {
    await logActivity({
      lead_id: leadId,
      type: 'system',
      title: `Linked to business: ${lead.business?.name}`,
      metadata: { business_id: businessId },
      actor_type: 'user',
      actor_name: actorName,
    })
  }

  return lead
}

/**
 * Unlink a lead from its business
 */
export async function unlinkLeadFromBusiness(leadId, actorName = 'System') {
  // Get current business name for logging
  const { data: currentLead } = await supabase
    .from('crm_leads')
    .select('business:crm_businesses(name)')
    .eq('id', leadId)
    .single()

  const { data: lead, error } = await supabase
    .from('crm_leads')
    .update({ business_id: null })
    .eq('id', leadId)
    .select()
    .single()

  if (error) throw error

  // Log activity
  if (currentLead?.business?.name) {
    await logActivity({
      lead_id: leadId,
      type: 'system',
      title: `Unlinked from business: ${currentLead.business.name}`,
      actor_type: 'user',
      actor_name: actorName,
    })
  }

  return lead
}

/**
 * Get contacts for a business (for report recipient selection)
 */
export async function getBusinessContacts(businessId) {
  const { data, error } = await supabase
    .from('crm_leads')
    .select('id, email, first_name, last_name, full_name, phone, is_client')
    .eq('business_id', businessId)
    .not('email', 'is', null)
    .order('is_client', { ascending: false })
    .order('full_name')

  if (error) throw error

  return data || []
}

/**
 * Update default report recipients for a business
 */
export async function updateReportRecipients(businessId, recipientEmails) {
  const { data, error } = await supabase
    .from('crm_businesses')
    .update({
      default_report_recipients: recipientEmails,
      updated_at: new Date().toISOString(),
    })
    .eq('id', businessId)
    .select()
    .single()

  if (error) throw error

  return data
}

/**
 * Get distinct industries for filtering
 */
export async function getIndustries() {
  const { data, error } = await supabase
    .from('crm_businesses')
    .select('industry')
    .not('industry', 'is', null)

  if (error) throw error

  const industries = [...new Set(data.map(d => d.industry))].filter(Boolean).sort()
  return industries
}

/**
 * Get business stats
 */
export async function getBusinessStats() {
  const { data: businesses, error } = await supabase
    .from('crm_businesses')
    .select('id')

  if (error) throw error

  const { count: totalContacts } = await supabase
    .from('crm_leads')
    .select('*', { count: 'exact', head: true })
    .not('business_id', 'is', null)

  // Get SEO site count from main database
  const mainDb = getMainSupabase()
  const { count: totalSeoSites } = await mainDb
    .from('seo_sites')
    .select('*', { count: 'exact', head: true })
    .not('business_id', 'is', null)
    .eq('is_active', true)

  return {
    totalBusinesses: businesses?.length || 0,
    linkedContacts: totalContacts || 0,
    linkedSeoSites: totalSeoSites || 0,
  }
}
