// app/api/crm/businesses/[id]/route.js
// Individual business API

import { NextResponse } from 'next/server'
import { getBusinessById, updateBusiness, deleteBusiness, getBusinessContacts, updateReportRecipients } from '@/lib/businesses'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const business = await getBusinessById(id)

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()

    // Handle recipient update separately
    if (data.default_report_recipients !== undefined && Object.keys(data).length === 1) {
      const business = await updateReportRecipients(id, data.default_report_recipients)
      return NextResponse.json({ business })
    }

    const business = await updateBusiness(id, data)

    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await deleteBusiness(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
