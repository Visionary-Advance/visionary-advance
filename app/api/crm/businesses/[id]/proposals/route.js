// app/api/crm/businesses/[id]/proposals/route.js
// Proposal endpoints aggregated across all contacts in a business

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getLeadProposals } from '@/lib/proposals'

// GET /api/crm/businesses/[id]/proposals
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
      return NextResponse.json({ proposals: [] })
    }

    // Get proposals for all contacts
    const allProposals = []
    for (const contactId of contactIds) {
      const proposals = await getLeadProposals(contactId)
      const contact = contacts.find(c => c.id === contactId)
      allProposals.push(...proposals.map(p => ({
        ...p,
        contact_name: contact?.full_name || contact?.email || 'Unknown',
        contact_id: contactId,
      })))
    }

    // Sort by created_at descending
    allProposals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return NextResponse.json({ proposals: allProposals })
  } catch (error) {
    console.error('Error fetching business proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}
