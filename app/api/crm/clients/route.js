// app/api/crm/clients/route.js
// POST - Create a client directly (skipping lead pipeline)

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { logActivity } from '@/lib/crm'

// POST /api/crm/clients - Create a new client directly
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check for existing lead/client by email
    const { data: existing } = await supabase
      .from('crm_leads')
      .select('id, is_client')
      .ilike('email', body.email)
      .single()

    if (existing) {
      if (existing.is_client) {
        return NextResponse.json({ error: 'A client with this email already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: 'A lead with this email already exists. Convert them to a client from the leads page.' }, { status: 409 })
    }

    const now = new Date().toISOString()
    const fullName = body.full_name ||
      (body.first_name && body.last_name ? `${body.first_name} ${body.last_name}` : body.first_name || body.last_name || null)

    // Resolve company name from business if business_id provided
    let company = body.company || null
    if (body.business_id && !company) {
      const { data: biz } = await supabase
        .from('crm_businesses')
        .select('name')
        .eq('id', body.business_id)
        .single()
      if (biz) company = biz.name
    }

    const clientRecord = {
      email: body.email.toLowerCase().trim(),
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      full_name: fullName,
      phone: body.phone || null,
      company,
      website: body.website || null,
      business_id: body.business_id || null,
      form_data: body.role ? { role: body.role } : null,
      stage: 'won',
      is_client: true,
      client_since: now,
      last_activity_at: now,
      // No score, no source — those are lead-specific
    }

    const { data: client, error: insertError } = await supabase
      .from('crm_leads')
      .insert(clientRecord)
      .select()
      .single()

    if (insertError) throw insertError

    // Log activity
    await logActivity({
      lead_id: client.id,
      type: 'system',
      title: 'Client created directly (skipped lead pipeline)',
      actor_type: 'user',
    })

    return NextResponse.json({ success: true, client }, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
