// lib/stripe-crm.js
// Stripe integration for CRM invoices

import Stripe from 'stripe'
import { supabaseCRM as supabase } from './supabase-crm'
import { logActivity } from './crm'

// Initialize Stripe
let stripeInstance = null

function getStripe() {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  }
  return stripeInstance
}

/**
 * Find a Stripe customer by email
 */
export async function findStripeCustomerByEmail(email) {
  const stripe = getStripe()

  try {
    const customers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    })

    return customers.data[0] || null
  } catch (error) {
    console.error('Error finding Stripe customer:', error)
    throw error
  }
}

/**
 * Sync Stripe invoices for a lead
 */
export async function syncStripeInvoices(leadId, email) {
  const stripe = getStripe()

  // Find Stripe customer by email
  const customer = await findStripeCustomerByEmail(email)

  if (!customer) {
    return { synced: 0, customer: null }
  }

  // Upsert the customer record
  const { data: customerRecord, error: customerError } = await supabase
    .from('crm_stripe_customers')
    .upsert({
      lead_id: leadId,
      stripe_customer_id: customer.id,
      customer_email: customer.email,
      customer_name: customer.name,
      balance: customer.balance,
      currency: customer.currency || 'usd',
      last_synced_at: new Date().toISOString(),
    }, {
      onConflict: 'stripe_customer_id',
    })
    .select()
    .single()

  if (customerError) {
    console.error('Error upserting Stripe customer:', customerError)
  }

  // Fetch invoices from Stripe
  const invoices = await stripe.invoices.list({
    customer: customer.id,
    limit: 100,
  })

  let syncedCount = 0

  for (const invoice of invoices.data) {
    const invoiceData = {
      stripe_customer_id: customer.id,
      stripe_invoice_id: invoice.id,
      lead_id: leadId,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      invoice_number: invoice.number,
      description: invoice.description,
      invoice_pdf_url: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      paid_at: invoice.status_transitions?.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        : null,
      created_in_stripe: new Date(invoice.created * 1000).toISOString(),
      last_synced_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('crm_stripe_invoices')
      .upsert(invoiceData, {
        onConflict: 'stripe_invoice_id',
      })

    if (!error) {
      syncedCount++
    }
  }

  return {
    synced: syncedCount,
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    },
  }
}

/**
 * Get cached invoices for a lead
 */
export async function getLeadInvoices(leadId) {
  const { data: invoices, error } = await supabase
    .from('crm_stripe_invoices')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_in_stripe', { ascending: false })

  if (error) throw error

  return invoices || []
}

/**
 * Get Stripe customer for a lead
 */
export async function getLeadStripeCustomer(leadId) {
  const { data, error } = await supabase
    .from('crm_stripe_customers')
    .select('*')
    .eq('lead_id', leadId)
    .single()

  if (error && error.code !== 'PGRST116') throw error

  return data
}

/**
 * Check if invoices need to be re-synced (older than 1 hour)
 */
export async function needsSync(leadId) {
  const customer = await getLeadStripeCustomer(leadId)

  if (!customer) return true

  const lastSync = new Date(customer.last_synced_at)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  return lastSync < oneHourAgo
}

/**
 * Get invoices with auto-sync if needed
 */
export async function getLeadInvoicesWithSync(leadId, email) {
  // Check if we need to sync
  const shouldSync = await needsSync(leadId)

  if (shouldSync && email) {
    await syncStripeInvoices(leadId, email)
  }

  return getLeadInvoices(leadId)
}

/**
 * Format invoice for display
 */
export function formatInvoiceForDisplay(invoice) {
  return {
    id: invoice.id,
    stripeId: invoice.stripe_invoice_id,
    number: invoice.invoice_number,
    description: invoice.description,
    status: invoice.status,
    amountDue: formatCurrency(invoice.amount_due / 100, invoice.currency),
    amountPaid: formatCurrency(invoice.amount_paid / 100, invoice.currency),
    amountDueRaw: invoice.amount_due / 100,
    amountPaidRaw: invoice.amount_paid / 100,
    currency: invoice.currency,
    dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : null,
    paidAt: invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : null,
    createdAt: new Date(invoice.created_in_stripe).toLocaleDateString(),
    pdfUrl: invoice.invoice_pdf_url,
    hostedUrl: invoice.hosted_invoice_url,
    statusColor: getStatusColor(invoice.status),
  }
}

/**
 * Get status color for invoice
 */
function getStatusColor(status) {
  switch (status) {
    case 'paid':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20' }
    case 'open':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20' }
    case 'draft':
      return { bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' }
    case 'void':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' }
    case 'uncollectible':
      return { bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20' }
    default:
      return { bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' }
  }
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

/**
 * Calculate invoice totals for a lead
 */
export async function getLeadInvoiceTotals(leadId) {
  const invoices = await getLeadInvoices(leadId)

  const totals = {
    totalInvoiced: 0,
    totalPaid: 0,
    outstanding: 0,
    overdueCount: 0,
    openCount: 0,
    paidCount: 0,
  }

  const now = new Date()

  for (const invoice of invoices) {
    const amountDue = (invoice.amount_due || 0) / 100
    const amountPaid = (invoice.amount_paid || 0) / 100

    totals.totalInvoiced += amountDue

    if (invoice.status === 'paid') {
      totals.totalPaid += amountPaid
      totals.paidCount++
    } else if (invoice.status === 'open') {
      totals.outstanding += amountDue - amountPaid
      totals.openCount++

      if (invoice.due_date && new Date(invoice.due_date) < now) {
        totals.overdueCount++
      }
    }
  }

  return totals
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event) {
  const stripe = getStripe()

  switch (event.type) {
    case 'invoice.created':
    case 'invoice.updated':
    case 'invoice.paid':
    case 'invoice.payment_failed':
    case 'invoice.voided': {
      const invoice = event.data.object

      // Find the lead by customer email
      const customer = await stripe.customers.retrieve(invoice.customer)

      if (customer.email) {
        const { data: lead } = await supabase
          .from('crm_leads')
          .select('id')
          .ilike('email', customer.email)
          .single()

        if (lead) {
          // Sync this specific invoice
          const invoiceData = {
            stripe_customer_id: invoice.customer,
            stripe_invoice_id: invoice.id,
            lead_id: lead.id,
            amount_due: invoice.amount_due,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status,
            invoice_number: invoice.number,
            description: invoice.description,
            invoice_pdf_url: invoice.invoice_pdf,
            hosted_invoice_url: invoice.hosted_invoice_url,
            due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
            paid_at: invoice.status_transitions?.paid_at
              ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
              : null,
            created_in_stripe: new Date(invoice.created * 1000).toISOString(),
            last_synced_at: new Date().toISOString(),
          }

          await supabase
            .from('crm_stripe_invoices')
            .upsert(invoiceData, {
              onConflict: 'stripe_invoice_id',
            })

          // Log activity for paid invoices
          if (event.type === 'invoice.paid') {
            await logActivity({
              lead_id: lead.id,
              type: 'system',
              title: `Invoice paid: ${invoice.number || invoice.id}`,
              description: `Amount: ${formatCurrency(invoice.amount_paid / 100, invoice.currency)}`,
              metadata: {
                stripe_invoice_id: invoice.id,
                amount: invoice.amount_paid / 100,
                currency: invoice.currency,
              },
            })
          }
        }
      }
      break
    }

    case 'customer.created':
    case 'customer.updated': {
      const customer = event.data.object

      if (customer.email) {
        // Find matching lead
        const { data: lead } = await supabase
          .from('crm_leads')
          .select('id')
          .ilike('email', customer.email)
          .single()

        if (lead) {
          await supabase
            .from('crm_stripe_customers')
            .upsert({
              lead_id: lead.id,
              stripe_customer_id: customer.id,
              customer_email: customer.email,
              customer_name: customer.name,
              balance: customer.balance,
              currency: customer.currency || 'usd',
              last_synced_at: new Date().toISOString(),
            }, {
              onConflict: 'stripe_customer_id',
            })
        }
      }
      break
    }
  }

  return { received: true }
}

/**
 * Create a new invoice in Stripe (optional - for creating invoices from CRM)
 */
export async function createStripeInvoice(leadId, items, dueDate = null) {
  const stripe = getStripe()

  // Get or create Stripe customer
  const { data: lead } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (!lead) {
    throw new Error('Lead not found')
  }

  let customer = await findStripeCustomerByEmail(lead.email)

  if (!customer) {
    // Create new customer
    customer = await stripe.customers.create({
      email: lead.email,
      name: lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
      metadata: {
        crm_lead_id: leadId,
      },
    })

    // Save to our database
    await supabase
      .from('crm_stripe_customers')
      .insert({
        lead_id: leadId,
        stripe_customer_id: customer.id,
        customer_email: customer.email,
        customer_name: customer.name,
      })
  }

  // Create invoice
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: 'send_invoice',
    days_until_due: dueDate ? Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 30,
    auto_advance: true,
  })

  // Add invoice items
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      description: item.description,
      amount: Math.round(item.amount * 100), // Convert to cents
      currency: item.currency || 'usd',
    })
  }

  // Finalize the invoice
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

  // Sync to our database
  await syncStripeInvoices(leadId, lead.email)

  // Log activity
  await logActivity({
    lead_id: leadId,
    type: 'system',
    title: `Invoice created: ${finalizedInvoice.number || finalizedInvoice.id}`,
    description: `Amount: ${formatCurrency(finalizedInvoice.amount_due / 100, finalizedInvoice.currency)}`,
    metadata: {
      stripe_invoice_id: finalizedInvoice.id,
      amount: finalizedInvoice.amount_due / 100,
    },
  })

  return finalizedInvoice
}
