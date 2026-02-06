// app/api/crm/businesses/[id]/projects/route.js
// Project endpoints aggregated across all contacts in a business

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getLeadProjects, createProject } from '@/lib/projects'

// GET /api/crm/businesses/[id]/projects
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Get all contact IDs for this business
    const { data: contacts, error: contactsError } = await supabase
      .from('crm_leads')
      .select('id, full_name, email')
      .eq('business_id', id)

    if (contactsError) throw contactsError

    const contactIds = (contacts || []).map(c => c.id)

    if (contactIds.length === 0) {
      return NextResponse.json({ projects: [] })
    }

    // Get projects for all contacts
    const allProjects = []
    for (const contactId of contactIds) {
      const projects = await getLeadProjects(contactId)
      const contact = contacts.find(c => c.id === contactId)
      allProjects.push(...projects.map(p => ({
        ...p,
        contact_name: contact?.full_name || contact?.email || 'Unknown',
        contact_id: contactId,
      })))
    }

    // Sort by created_at descending
    allProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return NextResponse.json({ projects: allProjects })
  } catch (error) {
    console.error('Error fetching business projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/crm/businesses/[id]/projects
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      contact_id,
      name,
      description,
      status,
      budget,
      start_date,
      target_end_date,
      milestones,
      devops_site_ids,
      tags,
      actor_name = 'Admin',
    } = body

    if (!contact_id) {
      return NextResponse.json(
        { error: 'contact_id is required' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // Verify the contact belongs to this business
    const { data: contact, error: contactError } = await supabase
      .from('crm_leads')
      .select('id')
      .eq('id', contact_id)
      .eq('business_id', id)
      .single()

    if (contactError || !contact) {
      return NextResponse.json(
        { error: 'Contact not found in this business' },
        { status: 400 }
      )
    }

    const project = await createProject(contact_id, {
      name,
      description,
      status,
      budget,
      start_date,
      target_end_date,
      milestones,
      devops_site_ids,
      tags,
    }, actor_name)

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    )
  }
}
