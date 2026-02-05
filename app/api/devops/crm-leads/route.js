// app/api/devops/crm-leads/route.js
// GET CRM leads for linking to DevOps sites

import { NextResponse } from 'next/server'
import { getCRMLeadsForLinking } from '@/lib/devops'

// GET /api/devops/crm-leads - Get CRM leads for site linking
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerEmail = searchParams.get('owner_email')

    const leads = await getCRMLeadsForLinking(ownerEmail)

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching CRM leads:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
