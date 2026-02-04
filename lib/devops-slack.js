// lib/devops-slack.js
// Slack webhook notifications for DevOps monitoring

const SLACK_WEBHOOK_URL = process.env.SLACK_DEVOPS_WEBHOOK_URL

/**
 * Send a Slack webhook notification for DevOps
 */
export async function sendDevOpsNotification(payload) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('Slack DevOps webhook URL not configured - skipping notification')
    return { success: false, reason: 'No webhook URL configured' }
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Slack DevOps webhook error:', response.status, errorText)
      return { success: false, error: errorText }
    }

    return { success: true }
  } catch (error) {
    console.error('Slack DevOps webhook failed:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Build Slack message for site down notification
 */
export function buildSiteDownEmbed(site, healthCheck) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Site Down',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${site.name}* is not responding`,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Environment:*\n${site.environment || 'production'}`,
        },
        {
          type: 'mrkdwn',
          text: `*URL:*\n${site.url}`,
        },
      ],
    },
  ]

  if (healthCheck.http_status_code || healthCheck.error_message) {
    const detailFields = []
    if (healthCheck.http_status_code) {
      detailFields.push({
        type: 'mrkdwn',
        text: `*HTTP Status:*\n${healthCheck.http_status_code}`,
      })
    }
    if (healthCheck.response_time_ms) {
      detailFields.push({
        type: 'mrkdwn',
        text: `*Response Time:*\n${healthCheck.response_time_ms}ms`,
      })
    }
    if (detailFields.length > 0) {
      blocks.push({
        type: 'section',
        fields: detailFields,
      })
    }
    if (healthCheck.error_message) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Error:*\n\`${healthCheck.error_message.substring(0, 200)}\``,
        },
      })
    }
  }

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `VA DevOps Monitor | ${new Date().toISOString()}`,
      },
    ],
  })

  return {
    attachments: [
      {
        color: '#ef4444', // Red
        blocks,
      },
    ],
  }
}

/**
 * Build Slack message for site recovery notification
 */
export function buildSiteUpEmbed(site, healthCheck) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Site Recovered',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${site.name}* is back online`,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Environment:*\n${site.environment || 'production'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Response Time:*\n${healthCheck.response_time_ms || 0}ms`,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `VA DevOps Monitor | ${new Date().toISOString()}`,
        },
      ],
    },
  ]

  return {
    attachments: [
      {
        color: '#10b981', // Green
        blocks,
      },
    ],
  }
}

/**
 * Build Slack message for SSL expiry warning
 */
export function buildSSLWarningEmbed(site, daysUntilExpiry, expiryDate) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'SSL Certificate Warning',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `SSL certificate for *${site.name}* expires in *${daysUntilExpiry} days*`,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*URL:*\n${site.url}`,
        },
        {
          type: 'mrkdwn',
          text: `*Expiry Date:*\n${expiryDate}`,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `VA DevOps Monitor | ${new Date().toISOString()}`,
        },
      ],
    },
  ]

  return {
    attachments: [
      {
        color: daysUntilExpiry <= 7 ? '#ef4444' : '#f59e0b', // Red or Amber
        blocks,
      },
    ],
  }
}

/**
 * Build Slack message for incident notification
 */
export function buildIncidentEmbed(incident, site) {
  const severityColors = {
    critical: '#ef4444',
    major: '#f97316',
    minor: '#f59e0b',
    info: '#3b82f6',
  }

  const severityEmojis = {
    critical: ':rotating_light:',
    major: ':warning:',
    minor: ':information_source:',
    info: ':bulb:',
  }

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${severityEmojis[incident.severity] || ''} ${incident.title}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Site:*\n${site?.name || 'Unknown'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Severity:*\n${incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}`,
        },
        {
          type: 'mrkdwn',
          text: `*Status:*\n${incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}`,
        },
      ],
    },
  ]

  if (incident.description) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Description:*\n${incident.description.substring(0, 500)}`,
      },
    })
  }

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Incident ID: ${incident.id} | ${new Date().toISOString()}`,
      },
    ],
  })

  return {
    attachments: [
      {
        color: severityColors[incident.severity] || '#3b82f6',
        blocks,
      },
    ],
  }
}

/**
 * Send a simple text notification
 */
export async function sendSimpleDevOpsNotification(text) {
  return sendDevOpsNotification({ text })
}
