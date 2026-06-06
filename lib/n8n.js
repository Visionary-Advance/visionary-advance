// lib/n8n.js
// n8n webhook notifications (e.g. Telegram-to-phone) for new CRM leads.
// Mirrors the lib/discord.js pattern: non-blocking, no-op if unconfigured.

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

/**
 * POST a JSON payload to the configured n8n webhook.
 * Safe to call without the env var set — it just skips.
 */
export async function sendN8nNotification(payload) {
  if (!N8N_WEBHOOK_URL) {
    console.warn('N8N_WEBHOOK_URL not configured - skipping n8n notification')
    return { success: false, reason: 'No webhook URL configured' }
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('n8n webhook error:', response.status, errorText)
      return { success: false, error: errorText }
    }

    return { success: true }
  } catch (error) {
    console.error('n8n webhook failed:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Build a Telegram-friendly notification payload from a CRM lead.
 * Includes both structured fields (for branching/formatting in n8n) and a
 * ready-to-send `text` string you can drop straight into the Telegram node.
 */
export function buildLeadNotification(lead, { isNew = true } = {}) {
  const message = lead.form_data?.message || lead.form_data?.challenge || null

  const text = [
    `🔔 ${isNew ? 'New lead' : 'Returning lead'}: ${lead.full_name || lead.email}`,
    lead.company ? `🏢 ${lead.company}` : null,
    `✉️ ${lead.email}`,
    lead.phone ? `📞 ${lead.phone}` : null,
    lead.source ? `📍 ${lead.source}${lead.conversion_page ? ` · ${lead.conversion_page}` : ''}` : null,
    lead.project_type ? `🛠️ ${lead.project_type}` : null,
    `⭐ Score: ${lead.score ?? 0}/100`,
    message ? `💬 ${message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return {
    event: isNew ? 'new_lead' : 'returning_lead',
    name: lead.full_name || lead.email,
    email: lead.email,
    phone: lead.phone || null,
    company: lead.company || null,
    source: lead.source || null,
    conversion_page: lead.conversion_page || null,
    project_type: lead.project_type || null,
    score: lead.score ?? null,
    message,
    lead_id: lead.id,
    text,
    timestamp: new Date().toISOString(),
  }
}
