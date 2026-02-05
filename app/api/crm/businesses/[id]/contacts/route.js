// app/api/crm/businesses/[id]/contacts/route.js
// Business contacts management

import { NextResponse } from 'next/server'
import { getBusinessContacts, linkLeadToBusiness, unlinkLeadFromBusiness } from '@/lib/businesses'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const contacts = await getBusinessContacts(id)

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching business contacts:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const { leadId } = await request.json()

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const lead = await linkLeadToBusiness(leadId, id)

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Error linking contact to business:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const lead = await unlinkLeadFromBusiness(leadId)

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Error unlinking contact from business:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
