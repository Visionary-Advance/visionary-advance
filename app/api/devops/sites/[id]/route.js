// app/api/devops/sites/[id]/route.js
// GET, PATCH, DELETE single site

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getSiteWithHistory } from '@/lib/devops'

// GET /api/devops/sites/[id] - Get site details with history
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const site = await getSiteWithHistory(id)

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Error fetching site:', error)
    if (error.message?.includes('not found')) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/devops/sites/[id] - Update site
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const allowedFields = [
      'name',
      'url',
      'api_key',
      'environment',
      'category',
      'owner_email',
      'check_interval_minutes',
      'timeout_seconds',
      'is_active',
      'ssl_check_enabled',
      'health_url',
      'monitor_link',
      'sla_target',
      'crm_lead_id',
    ]

    // Filter to only allowed fields
    const updateData = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Validate URL if provided
    if (updateData.url) {
      try {
        new URL(updateData.url)
      } catch {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        )
      }
    }

    // Validate health_url if provided
    if (updateData.health_url) {
      try {
        new URL(updateData.health_url)
      } catch {
        return NextResponse.json(
          { error: 'Invalid health URL format' },
          { status: 400 }
        )
      }
    }

    // Validate monitor_link if provided
    if (updateData.monitor_link) {
      try {
        new URL(updateData.monitor_link)
      } catch {
        return NextResponse.json(
          { error: 'Invalid monitor link format' },
          { status: 400 }
        )
      }
    }

    // Parse sla_target as float if provided
    if (updateData.sla_target !== undefined) {
      updateData.sla_target = parseFloat(updateData.sla_target) || 99.9
    }

    // Handle null values for optional fields
    if (updateData.health_url === '') updateData.health_url = null
    if (updateData.monitor_link === '') updateData.monitor_link = null
    if (updateData.crm_lead_id === '') updateData.crm_lead_id = null

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('devops_sites')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    return NextResponse.json({ site: data })
  } catch (error) {
    console.error('Error updating site:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/devops/sites/[id] - Delete site
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // First delete related health checks
    await supabase
      .from('devops_health_checks')
      .delete()
      .eq('site_id', id)

    // Delete related incidents
    await supabase
      .from('devops_incidents')
      .delete()
      .eq('site_id', id)

    // Delete the site
    const { error } = await supabase
      .from('devops_sites')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting site:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
