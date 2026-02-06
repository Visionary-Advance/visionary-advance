// app/api/crm/leads/[id]/route.js
// GET, PATCH, DELETE for individual lead

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getLeadWithActivities, logActivity, STAGES } from '@/lib/crm'

// GET /api/crm/leads/[id] - Get single lead with activities
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const lead = await getLeadWithActivities(id)

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Get stage history
    const { data: stageHistory } = await supabase
      .from('crm_stage_history')
      .select('*')
      .eq('lead_id', id)
      .order('entered_at', { ascending: false })

    return NextResponse.json({
      ...lead,
      stage_history: stageHistory || [],
      stage_config: STAGES,
    })
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/crm/leads/[id] - Update lead fields
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Fields that can be updated
    const allowedFields = [
      'email', 'first_name', 'last_name', 'full_name', 'phone', 'company', 'website',
      'status', 'source', 'business_type', 'project_type', 'budget_range', 'timeline',
      'tags', 'score', 'score_breakdown', 'form_data',
      'hubspot_contact_id', 'hubspot_deal_id', 'hubspot_sync_status',
      'last_contacted_at', 'is_duplicate',
      'has_website', 'hosting_start_date', 'hosting_expiry_date',
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

    // Check if lead exists
    const { data: existingLead, error: fetchError } = await supabase
      .from('crm_leads')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Update the lead
    const { data: lead, error: updateError } = await supabase
      .from('crm_leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // Log activity if significant changes
    if (updateData.status) {
      await logActivity({
        lead_id: id,
        type: 'system',
        title: `Status changed to ${updateData.status}`,
        actor_type: 'user',
      })
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/crm/leads/[id] - Delete a lead (or archive)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    // Check if lead exists
    const { data: existingLead, error: fetchError } = await supabase
      .from('crm_leads')
      .select('id, email')
      .eq('id', id)
      .single()

    if (fetchError || !existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    if (permanent) {
      // Permanently delete (cascades to activities and stage_history)
      const { error: deleteError } = await supabase
        .from('crm_leads')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      return NextResponse.json({ success: true, action: 'deleted' })
    } else {
      // Soft delete (archive)
      const { error: archiveError } = await supabase
        .from('crm_leads')
        .update({ status: 'archived' })
        .eq('id', id)

      if (archiveError) throw archiveError

      await logActivity({
        lead_id: id,
        type: 'system',
        title: 'Lead archived',
        actor_type: 'user',
      })

      return NextResponse.json({ success: true, action: 'archived' })
    }
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
