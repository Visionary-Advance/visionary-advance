// lib/discord.js
// Discord webhook notifications for CRM events

const DISCORD_WEBHOOK_URL = process.env.DISCORD_CRM_WEBHOOK_URL

// Brand color for embeds
const BRAND_COLOR = 0x008070 // Teal

// Stage colors
const STAGE_COLORS = {
  contact: 0x6b7280,        // Gray
  plan_audit_meeting: 0x8b5cf6, // Purple
  discovery_call: 0x3b82f6,  // Blue
  proposal: 0xf59e0b,        // Amber
  offer: 0xec4899,           // Pink
  negotiating: 0xf97316,     // Orange
  won: 0x10b981,             // Green
  lost: 0xef4444,            // Red
}

// Source labels
const SOURCE_LABELS = {
  website_audit: 'Website Audit',
  systems_form: 'Systems Form',
  contact_form: 'Contact Form',
  audit_email: 'Audit Email',
  manual: 'Manual Entry',
}

// Stage labels
const STAGE_LABELS = {
  contact: 'Contact',
  plan_audit_meeting: 'Plan Audit Meeting',
  discovery_call: 'Discovery Call',
  proposal: 'Proposal',
  offer: 'Offer',
  negotiating: 'Negotiating',
  won: 'Won',
  lost: 'Lost',
}

/**
 * Send a Discord webhook notification
 */
export async function sendDiscordNotification(payload) {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured - skipping notification')
    return { success: false, reason: 'No webhook URL configured' }
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'VA CRM',
        ...payload,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Discord webhook error:', response.status, errorText)
      return { success: false, error: errorText }
    }

    return { success: true }
  } catch (error) {
    console.error('Discord webhook failed:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Build Discord embed for new lead notification
 */
export function buildNewLeadEmbed(lead) {
  // Build contact info string
  const contactParts = []
  if (lead.full_name) contactParts.push(lead.full_name)
  if (lead.company) contactParts.push(lead.company)
  contactParts.push(lead.email)
  if (lead.phone) contactParts.push(lead.phone)

  // Build source info
  const sourceParts = [SOURCE_LABELS[lead.source] || lead.source]
  if (lead.conversion_page) sourceParts.push(lead.conversion_page)

  // Build fields array
  const fields = [
    {
      name: 'Contact',
      value: contactParts.join('\n'),
      inline: true,
    },
    {
      name: 'Source',
      value: sourceParts.join('\n'),
      inline: true,
    },
    {
      name: 'Score',
      value: `${lead.score || 0}/100`,
      inline: true,
    },
  ]

  // Add UTM info if available
  const utmParts = []
  if (lead.utm_source) utmParts.push(`Source: ${lead.utm_source}`)
  if (lead.utm_medium) utmParts.push(`Medium: ${lead.utm_medium}`)
  if (lead.utm_campaign) utmParts.push(`Campaign: ${lead.utm_campaign}`)

  if (utmParts.length > 0) {
    fields.push({
      name: 'Attribution',
      value: utmParts.join('\n'),
      inline: false,
    })
  }

  // Add form message/challenge if available
  const message = lead.form_data?.message || lead.form_data?.challenge || lead.form_data?.biggestChallenge
  if (message) {
    fields.push({
      name: 'Message',
      value: message.length > 200 ? message.substring(0, 200) + '...' : message,
      inline: false,
    })
  }

  // Add website if available
  if (lead.website) {
    fields.push({
      name: 'Website',
      value: lead.website,
      inline: false,
    })
  }

  return {
    title: 'New Lead',
    color: BRAND_COLOR,
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: `Lead ID: ${lead.id}`,
    },
  }
}

/**
 * Build Discord embed for stage change notification
 */
export function buildStageChangeEmbed(lead, previousStage) {
  const fields = [
    {
      name: 'Contact',
      value: [
        lead.full_name || lead.email,
        lead.company,
      ].filter(Boolean).join('\n'),
      inline: true,
    },
    {
      name: 'Stage Change',
      value: `${STAGE_LABELS[previousStage] || previousStage} → ${STAGE_LABELS[lead.stage] || lead.stage}`,
      inline: true,
    },
    {
      name: 'Score',
      value: `${lead.score || 0}/100`,
      inline: true,
    },
  ]

  // Determine if this is a "win" or "loss"
  const isWon = lead.stage === 'won'
  const isLost = lead.stage === 'lost'

  let title = 'Stage Updated'
  if (isWon) title = 'Deal Won!'
  if (isLost) title = 'Deal Lost'

  return {
    title,
    color: STAGE_COLORS[lead.stage] || BRAND_COLOR,
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: `Lead ID: ${lead.id}`,
    },
  }
}

/**
 * Build Discord embed for audit completed notification
 */
export function buildAuditCompletedEmbed(lead, auditScores) {
  const avgScore = Math.round(
    (auditScores.performance + auditScores.accessibility + auditScores.bestPractices + auditScores.seo) / 4
  )

  // Emoji based on score
  let scoreEmoji = ''
  if (avgScore >= 80) scoreEmoji = ''
  else if (avgScore >= 50) scoreEmoji = ''
  else scoreEmoji = ''

  const fields = [
    {
      name: 'Contact',
      value: [lead.full_name || lead.email, lead.company].filter(Boolean).join('\n'),
      inline: true,
    },
    {
      name: `${scoreEmoji} Audit Scores`,
      value: [
        `Performance: ${auditScores.performance}`,
        `Accessibility: ${auditScores.accessibility}`,
        `Best Practices: ${auditScores.bestPractices}`,
        `SEO: ${auditScores.seo}`,
      ].join('\n'),
      inline: true,
    },
    {
      name: 'Average',
      value: `${avgScore}/100`,
      inline: true,
    },
  ]

  if (lead.website) {
    fields.push({
      name: 'Website',
      value: lead.website,
      inline: false,
    })
  }

  return {
    title: 'Website Audit Completed',
    color: avgScore >= 80 ? 0x10b981 : avgScore >= 50 ? 0xf59e0b : 0xef4444,
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: `Lead ID: ${lead.id}`,
    },
  }
}

/**
 * Send a simple text notification
 */
export async function sendSimpleNotification(content) {
  return sendDiscordNotification({ content })
}
