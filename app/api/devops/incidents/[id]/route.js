// app/api/devops/incidents/[id]/route.js
// GET, PATCH single incident

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { updateIncidentStatus } from '@/lib/devops'

// GET /api/devops/incidents/[id] - Get incident details
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('devops_incidents')
      .select(`
        *,
        devops_sites (
          id, name, url, environment, category
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
    }

    return NextResponse.json({ incident: data })
  } catch (error) {
    console.error('Error fetching incident:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/devops/incidents/[id] - Update incident
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { status, resolution_notes, acknowledged_by, severity, title, description } = body

    // If updating status, use the dedicated function
    if (status) {
      const incident = await updateIncidentStatus(id, status, resolution_notes, acknowledged_by)
      return NextResponse.json({ incident })
    }

    // Otherwise, update other fields
    const updateData = {}
    if (severity) updateData.severity = severity
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('devops_incidents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ incident: data })
  } catch (error) {
    console.error('Error updating incident:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
