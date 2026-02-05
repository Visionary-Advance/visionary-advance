// app/api/crm/leads/[id]/activities/route.js
// GET, POST for lead activities

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { logActivity } from '@/lib/crm'

// GET /api/crm/leads/[id]/activities - Get all activities for a lead
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Optional type filter
    const type = searchParams.get('type')

    // Check if lead exists
    const { data: lead, error: leadError } = await supabase
      .from('crm_leads')
      .select('id')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Build query
    let query = supabase
      .from('crm_activities')
      .select('*', { count: 'exact' })
      .eq('lead_id', id)
      .order('created_at', { ascending: false })

    if (type) {
      const types = type.split(',')
      query = query.in('type', types)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: activities, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/crm/leads/[id]/activities - Add a note or activity
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Default type is 'note'
    const type = body.type || 'note'

    // Validate type
    const validTypes = [
      'note', 'email_sent', 'email_received', 'call', 'meeting', 'visit', 'task',
      'stage_change', 'form_submission', 'audit_completed', 'hubspot_sync', 'system',
    ]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid activity type: ${type}. Valid types: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if lead exists
    const { data: lead, error: leadError } = await supabase
      .from('crm_leads')
      .select('id')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Create the activity
    const activity = await logActivity({
      lead_id: id,
      type,
      title: body.title,
      description: body.description || null,
      metadata: body.metadata || {},
      actor_type: body.actor_type || 'user',
      actor_name: body.actor_name || null,
    })

    // If this is an email_sent activity, update last_contacted_at
    if (type === 'email_sent' || type === 'call') {
      await supabase
        .from('crm_leads')
        .update({ last_contacted_at: new Date().toISOString() })
        .eq('id', id)
    }

    return NextResponse.json({ success: true, activity }, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
