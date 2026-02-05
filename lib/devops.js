// lib/devops.js
// Core DevOps monitoring functions

import { supabaseCRM as supabase } from './supabase-crm'
import { sendDevOpsNotification, buildSiteDownEmbed, buildSiteUpEmbed, buildSSLWarningEmbed } from './devops-slack'
import { logActivity } from './crm'

// Status configuration
export const STATUSES = {
  healthy: { label: 'Healthy', color: '#10b981' },
  degraded: { label: 'Degraded', color: '#f59e0b' },
  down: { label: 'Down', color: '#ef4444' },
  unknown: { label: 'Unknown', color: '#6b7280' },
}

// Severity configuration
export const SEVERITIES = {
  critical: { label: 'Critical', color: '#ef4444' },
  major: { label: 'Major', color: '#f97316' },
  minor: { label: 'Minor', color: '#f59e0b' },
  info: { label: 'Info', color: '#3b82f6' },
}

// Incident statuses
export const INCIDENT_STATUSES = {
  open: { label: 'Open', color: '#ef4444' },
  investigating: { label: 'Investigating', color: '#f97316' },
  identified: { label: 'Identified', color: '#f59e0b' },
  monitoring: { label: 'Monitoring', color: '#3b82f6' },
  resolved: { label: 'Resolved', color: '#10b981' },
}

// Environment configuration
export const ENVIRONMENTS = {
  production: { label: 'Production', color: '#ef4444' },
  staging: { label: 'Staging', color: '#f59e0b' },
  development: { label: 'Development', color: '#3b82f6' },
}

/**
 * Perform a health check on a site
 */
export async function performHealthCheck(siteId) {
  // Get site details
  const { data: site, error: siteError } = await supabase
    .from('devops_sites')
    .select('*')
    .eq('id', siteId)
    .single()

  if (siteError || !site) {
    throw new Error(`Site not found: ${siteId}`)
  }

  if (!site.is_active) {
    return { skipped: true, reason: 'Site is inactive' }
  }

  const startTime = Date.now()
  let status = 'unknown'
  let httpStatusCode = null
  let responseTimeMs = null
  let healthData = null
  let databaseStatus = null
  let memoryUsageMb = null
  let uptimeSeconds = null
  let version = null
  let sslValid = null
  let sslExpiryDate = null
  let errorMessage = null

  try {
    // Build the health check URL - use custom health_url if provided, otherwise default
    let healthUrl
    if (site.health_url) {
      healthUrl = site.health_url
    } else {
      healthUrl = site.url.endsWith('/')
        ? `${site.url}api/health`
        : `${site.url}/api/health`
    }

    // Prepare headers
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'VA-DevOps-Monitor/1.0',
    }

    if (site.api_key) {
      headers['X-API-Key'] = site.api_key
    }

    // Make the request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), (site.timeout_seconds || 30) * 1000)

    const response = await fetch(healthUrl, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    responseTimeMs = Date.now() - startTime
    httpStatusCode = response.status

    if (response.ok) {
      try {
        healthData = await response.json()

        // Extract health data fields
        databaseStatus = healthData.database?.status || healthData.database || null
        memoryUsageMb = healthData.memory?.usedMb || healthData.memoryUsageMb || null
        uptimeSeconds = healthData.uptime || healthData.uptimeSeconds || null
        version = healthData.version || null

        // Determine status based on response
        if (healthData.status === 'healthy' || healthData.status === 'ok') {
          status = 'healthy'
        } else if (healthData.status === 'degraded' || healthData.status === 'warning') {
          status = 'degraded'
        } else {
          status = healthData.status || 'healthy'
        }

        // Check for degraded conditions
        if (responseTimeMs > 5000) {
          status = 'degraded'
        }
        if (databaseStatus && databaseStatus !== 'connected' && databaseStatus !== 'ok') {
          status = 'degraded'
        }
      } catch (parseError) {
        // Response was OK but not JSON - still counts as healthy
        status = 'healthy'
        healthData = { raw: await response.text().catch(() => 'Unable to parse') }
      }
    } else {
      status = httpStatusCode >= 500 ? 'down' : 'degraded'
      errorMessage = `HTTP ${httpStatusCode}`
    }

  } catch (error) {
    responseTimeMs = Date.now() - startTime
    status = 'down'

    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout'
    } else {
      errorMessage = error.message
    }
  }

  // Check SSL if enabled
  if (site.ssl_check_enabled && site.url.startsWith('https')) {
    try {
      const sslCheck = await checkSSL(site.url)
      sslValid = sslCheck.valid
      sslExpiryDate = sslCheck.expiryDate
    } catch (sslError) {
      console.error('SSL check failed:', sslError)
    }
  }

  // Save the health check result
  const { data: healthCheck, error: insertError } = await supabase
    .from('devops_health_checks')
    .insert({
      site_id: siteId,
      status,
      http_status_code: httpStatusCode,
      response_time_ms: responseTimeMs,
      ssl_valid: sslValid,
      ssl_expiry_date: sslExpiryDate,
      health_data: healthData,
      database_status: databaseStatus,
      memory_usage_mb: memoryUsageMb,
      uptime_seconds: uptimeSeconds,
      version,
      error_message: errorMessage,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Failed to save health check:', insertError)
  }

  // Get previous check to detect status changes
  const { data: previousChecks } = await supabase
    .from('devops_health_checks')
    .select('status')
    .eq('site_id', siteId)
    .order('checked_at', { ascending: false })
    .limit(2)

  const previousStatus = previousChecks?.length > 1 ? previousChecks[1].status : null

  // Handle status changes
  if (previousStatus && previousStatus !== status) {
    await handleStatusChange(site, previousStatus, status, healthCheck)
  }

  // Check SSL expiry warning
  if (sslExpiryDate) {
    const daysUntilExpiry = Math.ceil((new Date(sslExpiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry <= 14) {
      await createIncident({
        site_id: siteId,
        title: `SSL certificate expiring in ${daysUntilExpiry} days`,
        description: `SSL certificate for ${site.name} expires on ${sslExpiryDate}`,
        severity: daysUntilExpiry <= 7 ? 'major' : 'minor',
        incident_type: 'ssl_expiring',
      })
    }
  }

  return {
    site,
    healthCheck,
    statusChanged: previousStatus !== status,
    previousStatus,
  }
}

/**
 * Handle status changes (create incidents, send notifications, sync to CRM)
 */
async function handleStatusChange(site, previousStatus, newStatus, healthCheck) {
  // Update current_status and current_status_since on the site
  await supabase
    .from('devops_sites')
    .update({
      current_status: newStatus,
      current_status_since: new Date().toISOString(),
    })
    .eq('id', site.id)

  // Sync status change to CRM
  await syncDevOpsToCRM(site, 'devops_status_change', {
    previous_status: previousStatus,
    new_status: newStatus,
    response_time_ms: healthCheck.response_time_ms,
    error_message: healthCheck.error_message,
  })

  // Site went down
  if ((previousStatus === 'healthy' || previousStatus === 'degraded') && newStatus === 'down') {
    // Create incident
    await createIncident({
      site_id: site.id,
      title: `${site.name} is down`,
      description: healthCheck.error_message || 'Site is not responding',
      severity: 'critical',
      incident_type: 'downtime',
    })

    // Send Discord notification
    try {
      const embed = buildSiteDownEmbed(site, healthCheck)
      await sendDevOpsNotification({ embeds: [embed] })
    } catch (error) {
      console.error('Failed to send Discord notification:', error)
    }
  }

  // Site became degraded
  if (previousStatus === 'healthy' && newStatus === 'degraded') {
    await createIncident({
      site_id: site.id,
      title: `${site.name} is experiencing issues`,
      description: 'Site is responding slowly or with errors',
      severity: 'major',
      incident_type: 'degraded_performance',
    })
  }

  // Site recovered
  if ((previousStatus === 'down' || previousStatus === 'degraded') && newStatus === 'healthy') {
    // Auto-resolve related incidents
    await autoResolveIncidents(site.id)

    // Send recovery notification
    try {
      const embed = buildSiteUpEmbed(site, healthCheck)
      await sendDevOpsNotification({ embeds: [embed] })
    } catch (error) {
      console.error('Failed to send Discord notification:', error)
    }
  }
}

/**
 * Check SSL certificate
 */
async function checkSSL(url) {
  // For now, we'll do a basic check - in production you'd use a proper SSL checker
  // This is a simplified version that just checks if HTTPS works
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return {
      valid: response.ok,
      expiryDate: null, // Would need server-side SSL library to get actual expiry
    }
  } catch (error) {
    return {
      valid: false,
      expiryDate: null,
    }
  }
}

/**
 * Create an incident
 */
export async function createIncident({
  site_id,
  title,
  description,
  severity = 'minor',
  incident_type = 'downtime',
}) {
  // Check for existing open incident of same type
  const { data: existingIncident } = await supabase
    .from('devops_incidents')
    .select('id')
    .eq('site_id', site_id)
    .eq('incident_type', incident_type)
    .neq('status', 'resolved')
    .single()

  if (existingIncident) {
    // Don't create duplicate incident
    return { id: existingIncident.id, duplicate: true }
  }

  const { data, error } = await supabase
    .from('devops_incidents')
    .insert({
      site_id,
      title,
      description,
      severity,
      incident_type,
      status: 'open',
    })
    .select()
    .single()

  if (error) throw error

  // Get site for CRM sync
  const { data: site } = await supabase
    .from('devops_sites')
    .select('id, name, crm_lead_id')
    .eq('id', site_id)
    .single()

  // Sync incident creation to CRM
  if (site) {
    await syncDevOpsToCRM(site, 'devops_incident_created', {
      incident_id: data.id,
      title,
      description,
      severity,
      incident_type,
    })
  }

  return data
}

/**
 * Update incident status
 */
export async function updateIncidentStatus(incidentId, status, notes = null, acknowledgedBy = null) {
  const updateData = { status }

  if (notes) {
    updateData.resolution_notes = notes
  }

  if (status === 'resolved') {
    updateData.resolved_at = new Date().toISOString()
  }

  if (acknowledgedBy && !updateData.acknowledged_at) {
    updateData.acknowledged_at = new Date().toISOString()
    updateData.acknowledged_by = acknowledgedBy
  }

  const { data, error } = await supabase
    .from('devops_incidents')
    .update(updateData)
    .eq('id', incidentId)
    .select(`
      *,
      devops_sites (id, name, crm_lead_id)
    `)
    .single()

  if (error) throw error

  // Sync incident resolution to CRM
  if (status === 'resolved' && data.devops_sites) {
    await syncDevOpsToCRM(data.devops_sites, 'devops_incident_resolved', {
      incident_id: data.id,
      title: data.title,
      severity: data.severity,
      incident_type: data.incident_type,
      resolution_notes: notes,
      duration_minutes: data.started_at
        ? Math.round((new Date() - new Date(data.started_at)) / 60000)
        : null,
    })
  }

  // Remove the joined site data from return
  const { devops_sites, ...incident } = data
  return incident
}

/**
 * Auto-resolve open incidents for a site
 */
async function autoResolveIncidents(siteId) {
  const { error } = await supabase
    .from('devops_incidents')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolution_notes: 'Auto-resolved: Site recovered',
    })
    .eq('site_id', siteId)
    .neq('status', 'resolved')

  if (error) {
    console.error('Failed to auto-resolve incidents:', error)
  }
}

/**
 * Check all active sites
 */
export async function checkAllSites() {
  const { data: sites, error } = await supabase
    .from('devops_sites')
    .select('id')
    .eq('is_active', true)

  if (error) throw error

  const results = {
    total: sites.length,
    checked: 0,
    healthy: 0,
    degraded: 0,
    down: 0,
    errors: [],
  }

  for (const site of sites) {
    try {
      const result = await performHealthCheck(site.id)
      if (!result.skipped) {
        results.checked++
        if (result.healthCheck.status === 'healthy') results.healthy++
        else if (result.healthCheck.status === 'degraded') results.degraded++
        else if (result.healthCheck.status === 'down') results.down++
      }
    } catch (error) {
      results.errors.push({ siteId: site.id, error: error.message })
    }
  }

  return results
}

/**
 * Get DevOps dashboard statistics
 */
export async function getDevOpsStats() {
  // Get all active sites with their latest health check
  const { data: sites, error: sitesError } = await supabase
    .from('devops_sites')
    .select(`
      id, name, url, environment, category, is_active,
      devops_health_checks (
        status, response_time_ms, checked_at
      )
    `)
    .eq('is_active', true)
    .order('checked_at', { foreignTable: 'devops_health_checks', ascending: false })
    .limit(1, { foreignTable: 'devops_health_checks' })

  if (sitesError) throw sitesError

  // Count statuses
  const statusCounts = { healthy: 0, degraded: 0, down: 0, unknown: 0 }
  let totalResponseTime = 0
  let responseTimeCount = 0

  for (const site of sites) {
    const latestCheck = site.devops_health_checks?.[0]
    const status = latestCheck?.status || 'unknown'
    statusCounts[status] = (statusCounts[status] || 0) + 1

    if (latestCheck?.response_time_ms) {
      totalResponseTime += latestCheck.response_time_ms
      responseTimeCount++
    }
  }

  const avgResponseTime = responseTimeCount > 0
    ? Math.round(totalResponseTime / responseTimeCount)
    : 0

  // Get open incidents
  const { data: openIncidents, count: incidentCount } = await supabase
    .from('devops_incidents')
    .select('*', { count: 'exact' })
    .neq('status', 'resolved')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent health checks for timeline
  const { data: recentChecks } = await supabase
    .from('devops_health_checks')
    .select(`
      id, status, response_time_ms, checked_at,
      devops_sites (id, name)
    `)
    .order('checked_at', { ascending: false })
    .limit(20)

  // Calculate uptime percentage (last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: last24hChecks } = await supabase
    .from('devops_health_checks')
    .select('status')
    .gte('checked_at', oneDayAgo)

  const totalChecks24h = last24hChecks?.length || 0
  const healthyChecks24h = last24hChecks?.filter(c => c.status === 'healthy').length || 0
  const uptimePercent = totalChecks24h > 0
    ? Math.round((healthyChecks24h / totalChecks24h) * 100 * 10) / 10
    : 100

  return {
    overview: {
      totalSites: sites.length,
      ...statusCounts,
      avgResponseTime,
      uptimePercent,
      openIncidents: incidentCount || 0,
    },
    sites: sites.map(s => ({
      ...s,
      latestCheck: s.devops_health_checks?.[0] || null,
    })),
    incidents: openIncidents || [],
    recentChecks: recentChecks || [],
  }
}

/**
 * Get site with history
 */
export async function getSiteWithHistory(siteId, limit = 100) {
  const { data: site, error: siteError } = await supabase
    .from('devops_sites')
    .select('*')
    .eq('id', siteId)
    .single()

  if (siteError) throw siteError

  const { data: history, error: historyError } = await supabase
    .from('devops_health_checks')
    .select('*')
    .eq('site_id', siteId)
    .order('checked_at', { ascending: false })
    .limit(limit)

  if (historyError) throw historyError

  const { data: incidents } = await supabase
    .from('devops_incidents')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Count open incidents
  const openIncidentCount = incidents?.filter(i => i.status !== 'resolved').length || 0

  // Get last incident summary
  const lastIncident = incidents?.[0] || null

  return {
    ...site,
    history,
    incidents: incidents || [],
    latestCheck: history?.[0] || null,
    openIncidentCount,
    lastIncident,
  }
}

/**
 * Sync DevOps events to CRM
 * Logs activity on linked CRM lead when status changes or incidents occur
 */
export async function syncDevOpsToCRM(site, eventType, eventData) {
  // Skip if no CRM lead linked
  if (!site.crm_lead_id) {
    return { skipped: true, reason: 'No CRM lead linked' }
  }

  try {
    // Build the activity title based on event type
    let title
    switch (eventType) {
      case 'devops_status_change':
        title = `Site ${site.name}: ${eventData.previous_status} → ${eventData.new_status}`
        break
      case 'devops_incident_created':
        title = `Incident created: ${eventData.title}`
        break
      case 'devops_incident_resolved':
        title = `Incident resolved: ${eventData.title}`
        if (eventData.duration_minutes) {
          title += ` (${eventData.duration_minutes} min)`
        }
        break
      default:
        title = `DevOps event: ${eventType}`
    }

    // Log activity to CRM
    const activity = await logActivity({
      lead_id: site.crm_lead_id,
      type: eventType,
      title,
      description: eventData.description || eventData.error_message || null,
      metadata: {
        site_id: site.id,
        site_name: site.name,
        ...eventData,
      },
      actor_type: 'system',
      actor_name: 'DevOps Monitor',
    })

    return { success: true, activity }
  } catch (error) {
    console.error('Failed to sync DevOps event to CRM:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get CRM leads for linking to sites
 * Optionally filters by email match for suggestions
 */
export async function getCRMLeadsForLinking(ownerEmail = null) {
  let query = supabase
    .from('crm_leads')
    .select('id, email, full_name, company')
    .order('created_at', { ascending: false })
    .limit(50)

  if (ownerEmail) {
    // If owner email provided, get exact match first, then others
    const { data: exactMatch } = await supabase
      .from('crm_leads')
      .select('id, email, full_name, company')
      .ilike('email', ownerEmail)
      .limit(1)

    const { data: others } = await query

    // Combine with exact match first
    const combined = exactMatch?.length
      ? [exactMatch[0], ...(others?.filter(l => l.id !== exactMatch[0].id) || [])]
      : others || []

    return combined
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}
