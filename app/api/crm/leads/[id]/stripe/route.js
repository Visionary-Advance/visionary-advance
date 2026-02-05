// app/api/crm/leads/[id]/stripe/route.js
// Stripe invoice endpoints for a lead

import { NextResponse } from 'next/server'
import { supabaseCRM } from '@/lib/supabase-crm'
import { getLeadInvoicesWithSync, getLeadInvoiceTotals, formatInvoiceForDisplay } from '@/lib/stripe-crm'

// GET /api/crm/leads/[id]/stripe - Get invoices for a lead
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Get the lead's email
    const { data: lead, error: leadError } = await supabaseCRM
      .from('crm_leads')
      .select('email')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Get invoices (auto-syncs if needed)
    const invoices = await getLeadInvoicesWithSync(id, lead.email)
    const totals = await getLeadInvoiceTotals(id)

    // Format for display
    const formattedInvoices = invoices.map(formatInvoiceForDisplay)

    return NextResponse.json({
      invoices: formattedInvoices,
      totals: {
        totalInvoiced: totals.totalInvoiced,
        totalPaid: totals.totalPaid,
        outstanding: totals.outstanding,
        overdueCount: totals.overdueCount,
        openCount: totals.openCount,
        paidCount: totals.paidCount,
      },
    })
  } catch (error) {
    console.error('Error fetching Stripe data:', error)

    // If Stripe isn't configured, return empty data
    if (error.message?.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json({
        invoices: [],
        totals: {
          totalInvoiced: 0,
          totalPaid: 0,
          outstanding: 0,
          overdueCount: 0,
          openCount: 0,
          paidCount: 0,
        },
        warning: 'Stripe is not configured',
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch Stripe data' },
      { status: 500 }
    )
  }
}
