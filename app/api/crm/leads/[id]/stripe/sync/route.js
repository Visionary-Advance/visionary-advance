// app/api/crm/leads/[id]/stripe/sync/route.js
// Force sync Stripe invoices for a lead

import { NextResponse } from 'next/server'
import { supabaseCRM } from '@/lib/supabase-crm'
import { syncStripeInvoices, getLeadInvoices, getLeadInvoiceTotals, formatInvoiceForDisplay } from '@/lib/stripe-crm'

// POST /api/crm/leads/[id]/stripe/sync - Force re-sync from Stripe
export async function POST(request, { params }) {
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

    if (!lead.email) {
      return NextResponse.json(
        { error: 'Lead has no email address' },
        { status: 400 }
      )
    }

    // Force sync
    const syncResult = await syncStripeInvoices(id, lead.email)

    // Get updated data
    const invoices = await getLeadInvoices(id)
    const totals = await getLeadInvoiceTotals(id)
    const formattedInvoices = invoices.map(formatInvoiceForDisplay)

    return NextResponse.json({
      synced: syncResult.synced,
      customer: syncResult.customer,
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
    console.error('Error syncing Stripe data:', error)

    if (error.message?.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to sync Stripe data' },
      { status: 500 }
    )
  }
}
