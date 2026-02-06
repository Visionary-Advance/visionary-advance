// app/api/crm/businesses/[id]/invoices/route.js
// Stripe invoice endpoints aggregated across all contacts in a business

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'
import { getLeadInvoicesWithSync, getLeadInvoiceTotals, formatInvoiceForDisplay } from '@/lib/stripe-crm'

// GET /api/crm/businesses/[id]/invoices
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Get all contacts for this business
    const { data: contacts, error: contactsError } = await supabase
      .from('crm_leads')
      .select('id, email, full_name')
      .eq('business_id', id)

    if (contactsError) throw contactsError

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({
        invoices: [],
        totals: { totalInvoiced: 0, totalPaid: 0, outstanding: 0, overdueCount: 0, openCount: 0, paidCount: 0 },
      })
    }

    // Aggregate invoices from all contacts
    const allInvoices = []
    const aggregateTotals = {
      totalInvoiced: 0,
      totalPaid: 0,
      outstanding: 0,
      overdueCount: 0,
      openCount: 0,
      paidCount: 0,
    }

    for (const contact of contacts) {
      const invoices = await getLeadInvoicesWithSync(contact.id, contact.email)
      const totals = await getLeadInvoiceTotals(contact.id)

      const formatted = invoices.map(inv => ({
        ...formatInvoiceForDisplay(inv),
        contact_name: contact.full_name || contact.email || 'Unknown',
        contact_id: contact.id,
      }))

      allInvoices.push(...formatted)

      aggregateTotals.totalInvoiced += totals.totalInvoiced || 0
      aggregateTotals.totalPaid += totals.totalPaid || 0
      aggregateTotals.outstanding += totals.outstanding || 0
      aggregateTotals.overdueCount += totals.overdueCount || 0
      aggregateTotals.openCount += totals.openCount || 0
      aggregateTotals.paidCount += totals.paidCount || 0
    }

    // Sort by date descending
    allInvoices.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))

    return NextResponse.json({
      invoices: allInvoices,
      totals: aggregateTotals,
    })
  } catch (error) {
    console.error('Error fetching business invoices:', error)

    if (error.message?.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json({
        invoices: [],
        totals: { totalInvoiced: 0, totalPaid: 0, outstanding: 0, overdueCount: 0, openCount: 0, paidCount: 0 },
        warning: 'Stripe is not configured',
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}
