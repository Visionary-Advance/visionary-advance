// lib/proposals.js
// Proposal management functions for CRM

import { supabaseCRM as supabase } from './supabase-crm'
import { logActivity } from './crm'
import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Proposal status configuration
export const PROPOSAL_STATUS = {
  draft: { label: 'Draft', color: '#6b7280', icon: 'edit' },
  sent: { label: 'Sent', color: '#3b82f6', icon: 'send' },
  viewed: { label: 'Viewed', color: '#8b5cf6', icon: 'eye' },
  accepted: { label: 'Accepted', color: '#10b981', icon: 'check' },
  rejected: { label: 'Rejected', color: '#ef4444', icon: 'x' },
  expired: { label: 'Expired', color: '#f59e0b', icon: 'clock' },
}

/**
 * Generate a unique public token for proposal viewing
 */
function generatePublicToken() {
  return crypto.randomUUID()
}

/**
 * Create a new proposal for a lead
 */
export async function createProposal(leadId, data, actorName = 'System') {
  const {
    title,
    project_id,
    content_json,
    content_html,
    total_amount,
    currency = 'USD',
    line_items = [],
    valid_until,
  } = data

  if (!title) {
    throw new Error('Proposal title is required')
  }

  const public_token = generatePublicToken()

  const { data: proposal, error } = await supabase
    .from('crm_proposals')
    .insert({
      lead_id: leadId,
      project_id,
      title,
      content_json,
      content_html,
      total_amount,
      currency,
      line_items,
      valid_until,
      public_token,
      created_by: actorName,
    })
    .select()
    .single()

  if (error) throw error

  // Log activity
  await logActivity({
    lead_id: leadId,
    type: 'system',
    title: `Proposal created: ${title}`,
    description: total_amount ? `Amount: ${formatCurrency(total_amount, currency)}` : null,
    metadata: {
      proposal_id: proposal.id,
      proposal_number: proposal.proposal_number,
      total_amount,
      currency,
    },
    actor_type: 'user',
    actor_name: actorName,
  })

  return proposal
}

/**
 * Update a proposal
 */
export async function updateProposal(proposalId, data, actorName = 'System') {
  const { data: currentProposal, error: fetchError } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('id', proposalId)
    .single()

  if (fetchError || !currentProposal) {
    throw new Error('Proposal not found')
  }

  // Don't allow editing sent/accepted/rejected proposals (except status)
  if (
    ['sent', 'viewed', 'accepted', 'rejected'].includes(currentProposal.status) &&
    !data.status &&
    Object.keys(data).length > 1
  ) {
    throw new Error('Cannot edit a proposal that has been sent')
  }

  const { data: proposal, error } = await supabase
    .from('crm_proposals')
    .update(data)
    .eq('id', proposalId)
    .select()
    .single()

  if (error) throw error

  return proposal
}

/**
 * Update proposal status with activity logging
 */
export async function updateProposalStatus(proposalId, status, actorName = 'System') {
  const { data: currentProposal, error: fetchError } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('id', proposalId)
    .single()

  if (fetchError || !currentProposal) {
    throw new Error('Proposal not found')
  }

  const updateData = { status }

  // Add timestamps based on status
  if (status === 'sent' && !currentProposal.sent_at) {
    updateData.sent_at = new Date().toISOString()
  } else if (status === 'viewed' && !currentProposal.viewed_at) {
    updateData.viewed_at = new Date().toISOString()
  } else if (['accepted', 'rejected'].includes(status)) {
    updateData.responded_at = new Date().toISOString()
  }

  const { data: proposal, error } = await supabase
    .from('crm_proposals')
    .update(updateData)
    .eq('id', proposalId)
    .select()
    .single()

  if (error) throw error

  // Log activity for significant status changes
  if (currentProposal.status !== status) {
    await logActivity({
      lead_id: proposal.lead_id,
      type: status === 'accepted' || status === 'rejected' ? 'system' : 'system',
      title: `Proposal ${PROPOSAL_STATUS[status]?.label || status}: ${proposal.title}`,
      metadata: {
        proposal_id: proposal.id,
        proposal_number: proposal.proposal_number,
        previous_status: currentProposal.status,
        new_status: status,
      },
      actor_type: ['accepted', 'rejected'].includes(status) ? 'user' : 'system',
      actor_name: actorName,
    })
  }

  return proposal
}

/**
 * Delete a proposal
 */
export async function deleteProposal(proposalId, actorName = 'System') {
  const { data: proposal, error: fetchError } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('id', proposalId)
    .single()

  if (fetchError || !proposal) {
    throw new Error('Proposal not found')
  }

  // Don't allow deleting accepted proposals
  if (proposal.status === 'accepted') {
    throw new Error('Cannot delete an accepted proposal')
  }

  const { error } = await supabase
    .from('crm_proposals')
    .delete()
    .eq('id', proposalId)

  if (error) throw error

  // Log activity
  await logActivity({
    lead_id: proposal.lead_id,
    type: 'system',
    title: `Proposal deleted: ${proposal.title}`,
    metadata: {
      proposal_id: proposalId,
      proposal_number: proposal.proposal_number,
    },
    actor_type: 'user',
    actor_name: actorName,
  })

  return { success: true }
}

/**
 * Get a proposal by ID
 */
export async function getProposal(proposalId) {
  const { data, error } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('id', proposalId)
    .single()

  if (error) throw error

  return data
}

/**
 * Get proposal by public token (for public viewing)
 */
export async function getProposalByToken(token) {
  const { data, error } = await supabase
    .from('crm_proposals')
    .select(`
      *,
      lead:crm_leads(full_name, company, email)
    `)
    .eq('public_token', token)
    .single()

  if (error) throw error

  return data
}

/**
 * Track proposal view (increment view count and update status)
 */
export async function trackProposalView(token) {
  const { data: proposal, error: fetchError } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('public_token', token)
    .single()

  if (fetchError || !proposal) {
    throw new Error('Proposal not found')
  }

  const updateData = {
    view_count: (proposal.view_count || 0) + 1,
  }

  // Update status to 'viewed' if it was 'sent'
  if (proposal.status === 'sent') {
    updateData.status = 'viewed'
    updateData.viewed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('crm_proposals')
    .update(updateData)
    .eq('id', proposal.id)
    .select()
    .single()

  if (error) throw error

  // Log first view
  if (proposal.view_count === 0) {
    await logActivity({
      lead_id: proposal.lead_id,
      type: 'system',
      title: `Proposal viewed: ${proposal.title}`,
      metadata: {
        proposal_id: proposal.id,
        proposal_number: proposal.proposal_number,
      },
    })
  }

  return data
}

/**
 * Handle proposal response (accept/reject)
 */
export async function respondToProposal(token, response, clientName = null) {
  if (!['accepted', 'rejected'].includes(response)) {
    throw new Error('Invalid response. Must be "accepted" or "rejected"')
  }

  const { data: proposal, error: fetchError } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('public_token', token)
    .single()

  if (fetchError || !proposal) {
    throw new Error('Proposal not found')
  }

  // Check if already responded
  if (['accepted', 'rejected'].includes(proposal.status)) {
    throw new Error('Proposal has already been responded to')
  }

  // Check if expired
  if (proposal.valid_until && new Date(proposal.valid_until) < new Date()) {
    throw new Error('Proposal has expired')
  }

  const { data, error } = await supabase
    .from('crm_proposals')
    .update({
      status: response,
      responded_at: new Date().toISOString(),
    })
    .eq('id', proposal.id)
    .select()
    .single()

  if (error) throw error

  // Log activity
  await logActivity({
    lead_id: proposal.lead_id,
    type: 'system',
    title: `Proposal ${response}: ${proposal.title}`,
    description: clientName ? `Responded by: ${clientName}` : null,
    metadata: {
      proposal_id: proposal.id,
      proposal_number: proposal.proposal_number,
      response,
      client_name: clientName,
    },
  })

  return data
}

/**
 * Get all proposals for a lead
 */
export async function getLeadProposals(leadId) {
  const { data, error } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

/**
 * Send proposal via email
 */
export async function sendProposalEmail(proposalId, recipientEmail, customMessage = null, actorName = 'System') {
  const { data: proposal, error: fetchError } = await supabase
    .from('crm_proposals')
    .select(`
      *,
      lead:crm_leads(full_name, company, email)
    `)
    .eq('id', proposalId)
    .single()

  if (fetchError || !proposal) {
    throw new Error('Proposal not found')
  }

  // Generate the public URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://visionaryadvance.com'
  const proposalUrl = `${baseUrl}/proposals/${proposal.public_token}`

  const leadName = proposal.lead?.full_name || 'there'
  const companyName = proposal.lead?.company || ''

  try {
    await resend.emails.send({
      from: 'Visionary Advance <proposals@visionaryadvance.com>',
      to: recipientEmail,
      subject: `Proposal: ${proposal.title}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #008070;">Your Proposal is Ready</h1>
          <p>Hi ${leadName},</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>We've prepared a proposal for ${companyName ? `${companyName}` : 'your project'}:</p>
          <p><strong>${proposal.title}</strong></p>
          ${proposal.total_amount ? `<p>Total: ${formatCurrency(proposal.total_amount, proposal.currency)}</p>` : ''}
          ${proposal.valid_until ? `<p style="color: #666;">Valid until: ${new Date(proposal.valid_until).toLocaleDateString()}</p>` : ''}
          <p style="margin: 30px 0;">
            <a href="${proposalUrl}" style="background-color: #008070; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Proposal
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            If you have any questions, please don't hesitate to reach out.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            Visionary Advance - Premium Web Design & Development
          </p>
        </div>
      `,
    })

    // Update proposal status to sent
    await updateProposalStatus(proposalId, 'sent', actorName)

    // Log activity
    await logActivity({
      lead_id: proposal.lead_id,
      type: 'email_sent',
      title: `Proposal sent: ${proposal.title}`,
      description: `Sent to ${recipientEmail}`,
      metadata: {
        proposal_id: proposal.id,
        proposal_number: proposal.proposal_number,
        recipient: recipientEmail,
        proposal_url: proposalUrl,
      },
      actor_type: 'user',
      actor_name: actorName,
    })

    return { success: true, proposalUrl }
  } catch (emailError) {
    console.error('Failed to send proposal email:', emailError)
    throw new Error('Failed to send proposal email')
  }
}

/**
 * Render TipTap JSON content to HTML
 */
export function renderProposalHTML(contentJson) {
  if (!contentJson) return ''

  // This is a simplified renderer - TipTap JSON is complex
  // For production, you'd want to use TipTap's generateHTML utility
  try {
    const content = typeof contentJson === 'string' ? JSON.parse(contentJson) : contentJson

    if (content.type === 'doc' && content.content) {
      return renderNodes(content.content)
    }

    return ''
  } catch (e) {
    console.error('Failed to render proposal HTML:', e)
    return ''
  }
}

function renderNodes(nodes) {
  return nodes.map(renderNode).join('')
}

function renderNode(node) {
  switch (node.type) {
    case 'paragraph':
      return `<p>${node.content ? renderNodes(node.content) : ''}</p>`
    case 'heading':
      const level = node.attrs?.level || 1
      return `<h${level}>${node.content ? renderNodes(node.content) : ''}</h${level}>`
    case 'bulletList':
      return `<ul>${node.content ? renderNodes(node.content) : ''}</ul>`
    case 'orderedList':
      return `<ol>${node.content ? renderNodes(node.content) : ''}</ol>`
    case 'listItem':
      return `<li>${node.content ? renderNodes(node.content) : ''}</li>`
    case 'blockquote':
      return `<blockquote>${node.content ? renderNodes(node.content) : ''}</blockquote>`
    case 'codeBlock':
      return `<pre><code>${node.content ? renderNodes(node.content) : ''}</code></pre>`
    case 'horizontalRule':
      return '<hr />'
    case 'text':
      let text = node.text || ''
      if (node.marks) {
        node.marks.forEach(mark => {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`
              break
            case 'italic':
              text = `<em>${text}</em>`
              break
            case 'underline':
              text = `<u>${text}</u>`
              break
            case 'link':
              text = `<a href="${mark.attrs?.href || '#'}">${text}</a>`
              break
          }
        })
      }
      return text
    case 'image':
      return `<img src="${node.attrs?.src || ''}" alt="${node.attrs?.alt || ''}" />`
    case 'table':
      return `<table>${node.content ? renderNodes(node.content) : ''}</table>`
    case 'tableRow':
      return `<tr>${node.content ? renderNodes(node.content) : ''}</tr>`
    case 'tableCell':
      return `<td>${node.content ? renderNodes(node.content) : ''}</td>`
    case 'tableHeader':
      return `<th>${node.content ? renderNodes(node.content) : ''}</th>`
    default:
      if (node.content) {
        return renderNodes(node.content)
      }
      return node.text || ''
  }
}

/**
 * Check and update expired proposals
 */
export async function checkExpiredProposals() {
  const { data, error } = await supabase
    .from('crm_proposals')
    .update({ status: 'expired' })
    .lt('valid_until', new Date().toISOString())
    .in('status', ['draft', 'sent', 'viewed'])
    .select()

  if (error) throw error

  return data || []
}

/**
 * Format currency for display
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Get proposal statistics for a lead
 */
export async function getLeadProposalStats(leadId) {
  const { data: proposals, error } = await supabase
    .from('crm_proposals')
    .select('*')
    .eq('lead_id', leadId)

  if (error) throw error

  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'draft').length,
    sent: proposals.filter(p => p.status === 'sent').length,
    viewed: proposals.filter(p => p.status === 'viewed').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    expired: proposals.filter(p => p.status === 'expired').length,
    totalValue: proposals.reduce((sum, p) => sum + (parseFloat(p.total_amount) || 0), 0),
    acceptedValue: proposals
      .filter(p => p.status === 'accepted')
      .reduce((sum, p) => sum + (parseFloat(p.total_amount) || 0), 0),
  }

  return stats
}
