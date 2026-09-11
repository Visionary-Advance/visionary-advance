// lib/pocket.js
// Pocket (HeyPocket) integration — turns recording summaries into CRM activity.
//
// Flow: Pocket fires `summary.completed` -> /api/crm/pocket/webhook verifies the
// HMAC signature -> we store the recording in `pocket_recordings` -> if a tag
// resolves to a lead we log an activity, create tasks from the action items and
// ping n8n. Unresolved recordings sit in the inbox at /admin/crm/pocket.
//
// Tagging convention (set the tag in the Pocket app before/after the call):
//   brandon@example.com   -> matched against crm_leads.email
//   lead:<uuid>           -> matched against crm_leads.id
//   crm:<email-or-uuid>   -> same, explicit prefix
//
// Env: POCKET_API_KEY, POCKET_WEBHOOK_SECRET

import crypto from 'crypto'
import { supabaseCRM as supabase } from './supabase-crm'
import { logActivity } from './crm'
import { createTask } from './tasks'
import { sendN8nNotification } from './n8n'

const POCKET_API_BASE = 'https://public.heypocketai.com/api/v1'

// Reject webhooks whose timestamp is further than this from now (replay guard).
const SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000

// Events that carry a finished summary worth writing to the CRM.
const SUMMARY_EVENTS = new Set([
  'summary.completed',
  'summary.regenerated',
  'summary.updated',
  'action_items.regenerated',
  'action_items.updated',
])

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* -------------------------------------------------------------------------- */
/* API client                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Call the Pocket Public API. Returns parsed JSON, throws on non-2xx.
 */
async function pocketApi(path, { method = 'GET', body = null, params = null } = {}) {
  const apiKey = process.env.POCKET_API_KEY
  if (!apiKey) {
    throw new Error('POCKET_API_KEY is not configured')
  }

  const url = new URL(`${POCKET_API_BASE}${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Pocket API ${method} ${path} failed (${response.status}): ${text}`)
  }

  return response.json()
}

/**
 * GET /public/recordings - paginated list, optionally filtered by tag or date.
 */
export async function listRecordings({
  start_date = null,
  end_date = null,
  tag_ids = null,
  page = 1,
  limit = 20,
} = {}) {
  return pocketApi('/public/recordings', {
    params: {
      start_date,
      end_date,
      tag_ids: Array.isArray(tag_ids) ? tag_ids.join(',') : tag_ids,
      page,
      limit: Math.min(limit, 100),
    },
  })
}

/**
 * GET /public/recordings/{id} - full detail including tags, transcript, summary.
 */
export async function getRecording(id, { transcript = true, summarizations = true } = {}) {
  return pocketApi(`/public/recordings/${id}`, {
    params: {
      include_transcript: transcript,
      include_summarizations: summarizations,
    },
  })
}

/**
 * GET /tags - the tag vocabulary, useful for building the tagging convention.
 */
export async function listTags() {
  return pocketApi('/tags')
}

/**
 * POST /search - semantic search across recordings.
 */
export async function searchRecordings(query, extra = {}) {
  return pocketApi('/search', { method: 'POST', body: { query, ...extra } })
}

/* -------------------------------------------------------------------------- */
/* Webhook signature                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Verify the X-HeyPocket-Signature header.
 * Pocket signs `{timestamp}.{rawBody}` with HMAC-SHA256, hex encoded — so the
 * caller must pass the RAW request text, never a re-serialized object.
 */
export function verifyPocketSignature(rawBody, signature, timestamp) {
  const secret = process.env.POCKET_WEBHOOK_SECRET
  if (!secret) {
    return { valid: false, reason: 'POCKET_WEBHOOK_SECRET is not configured' }
  }
  if (!signature || !timestamp) {
    return { valid: false, reason: 'Missing signature headers' }
  }

  const sentAt = Number(timestamp)
  if (!Number.isFinite(sentAt) || Math.abs(Date.now() - sentAt) > SIGNATURE_TOLERANCE_MS) {
    return { valid: false, reason: 'Signature timestamp outside tolerance' }
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')

  const expectedBuf = Buffer.from(expected)
  const receivedBuf = Buffer.from(signature)

  if (expectedBuf.length !== receivedBuf.length) {
    return { valid: false, reason: 'Signature mismatch' }
  }
  if (!crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    return { valid: false, reason: 'Signature mismatch' }
  }

  return { valid: true }
}

/* -------------------------------------------------------------------------- */
/* Payload parsing                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Pull the newest v2 summary out of the nested `summarizations` map:
 *   summarizations: { <sumId>: { v2: { summary: {...}, actionItems: {...} } } }
 */
function extractSummary(summarizations) {
  if (!summarizations || typeof summarizations !== 'object') {
    return { title: null, markdown: null, actionItems: [] }
  }

  for (const entry of Object.values(summarizations)) {
    const v2 = entry?.v2 || entry
    if (!v2) continue

    const summary = v2.summary || {}
    const rawItems = v2.actionItems?.actionItems || v2.actionItems || []

    return {
      title: summary.title || null,
      markdown: summary.markdown || summary.text || null,
      actionItems: normalizeActionItems(rawItems),
    }
  }

  return { title: null, markdown: null, actionItems: [] }
}

/**
 * Action items come through in a few shapes (bare strings or objects with
 * varying key names), so flatten them to { title, assignee, due_date }.
 */
function normalizeActionItems(items) {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => {
      if (typeof item === 'string') {
        return { title: item.trim(), assignee: null, due_date: null }
      }
      if (!item || typeof item !== 'object') return null

      const title = item.title || item.text || item.task || item.description || item.content
      if (!title) return null

      const due = item.dueDate || item.due_date || item.due || null

      return {
        title: String(title).trim(),
        assignee: item.assignee || item.owner || item.assignedTo || null,
        due_date: normalizeDueDate(due),
      }
    })
    .filter((item) => item && item.title)
}

/** Coerce whatever Pocket sends into a YYYY-MM-DD date, or null. */
function normalizeDueDate(value) {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().slice(0, 10)
}

/**
 * Flatten a webhook or API payload into the shape we store.
 */
export function parseRecordingPayload(payload) {
  const recording = payload.recording || payload.data || payload || {}
  const summary = extractSummary(payload.summarizations || recording.summarizations)

  return {
    pocket_recording_id: recording.id,
    title: recording.title || null,
    recorded_at: recording.recording_at || recording.createdAt || recording.created_at || null,
    duration_seconds: Number.isFinite(recording.duration) ? Math.round(recording.duration) : null,
    language: recording.language || null,
    tags: Array.isArray(recording.tags) ? recording.tags : [],
    summary_title: summary.title,
    summary_markdown: summary.markdown,
    action_items: summary.actionItems,
    transcript: Array.isArray(payload.transcript) ? payload.transcript : (recording.transcript || []),
  }
}

/* -------------------------------------------------------------------------- */
/* Lead resolution                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Resolve a lead from the recording's Pocket tags.
 * Returns { lead, match_method } or { lead: null }.
 */
export async function resolveLeadFromTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return { lead: null, match_method: null }
  }

  for (const tag of tags) {
    const raw = (typeof tag === 'string' ? tag : tag?.name) || ''
    const value = raw.trim().replace(/^(lead|crm):/i, '').trim()
    if (!value) continue

    if (UUID_RE.test(value)) {
      const { data } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('id', value)
        .maybeSingle()
      if (data) return { lead: data, match_method: 'tag_lead_id' }
    }

    if (EMAIL_RE.test(value)) {
      const { data } = await supabase
        .from('crm_leads')
        .select('*')
        .ilike('email', value)
        .maybeSingle()
      if (data) return { lead: data, match_method: 'tag_email' }
    }
  }

  return { lead: null, match_method: null }
}

/* -------------------------------------------------------------------------- */
/* CRM writes                                                                  */
/* -------------------------------------------------------------------------- */

function formatDuration(seconds) {
  if (!seconds) return null
  const mins = Math.round(seconds / 60)
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

/**
 * Write the summary to the lead timeline and turn action items into tasks.
 * Idempotent: re-running for the same recording updates the existing activity
 * and never duplicates tasks.
 */
export async function attachRecordingToLead(record, lead, { match_method = 'manual' } = {}) {
  const duration = formatDuration(record.duration_seconds)
  const title = record.summary_title || record.title || 'Pocket recording'

  const description = [
    record.summary_markdown,
    duration ? `\n_Recording: ${duration}_` : null,
  ]
    .filter(Boolean)
    .join('\n')

  // --- Activity -----------------------------------------------------------
  let activityId = record.activity_id

  if (activityId) {
    await supabase
      .from('crm_activities')
      .update({ title: `Call summary: ${title}`, description })
      .eq('id', activityId)
  } else {
    const activity = await logActivity({
      lead_id: lead.id,
      type: 'call_summary',
      title: `Call summary: ${title}`,
      description,
      metadata: {
        source: 'pocket',
        pocket_recording_id: record.pocket_recording_id,
        duration_seconds: record.duration_seconds,
        language: record.language,
        action_item_count: record.action_items?.length || 0,
      },
      actor_type: 'system',
      actor_name: 'Pocket',
    })
    activityId = activity?.id || null
  }

  // --- Tasks from action items -------------------------------------------
  // Only create tasks the first time we attach; later edits in Pocket
  // shouldn't spawn duplicates of tasks you may have already completed.
  const taskIds = Array.isArray(record.task_ids) ? [...record.task_ids] : []

  if (taskIds.length === 0 && record.action_items?.length) {
    for (const item of record.action_items) {
      try {
        const task = await createTask({
          lead_id: lead.id,
          title: item.title,
          description: `From Pocket recording "${title}"${item.assignee ? ` · assigned to ${item.assignee}` : ''}`,
          task_type: 'follow_up',
          priority: 'medium',
          due_date: item.due_date,
          assignee: item.assignee,
          is_auto_created: true,
          auto_task_source: 'pocket',
        })
        if (task?.id) taskIds.push(task.id)
      } catch (error) {
        console.error('Pocket: failed to create task from action item:', error)
      }
    }
  }

  // --- Update the inbox row ----------------------------------------------
  const { data: updated, error } = await supabase
    .from('pocket_recordings')
    .update({
      lead_id: lead.id,
      status: 'matched',
      match_method,
      activity_id: activityId,
      task_ids: taskIds,
      updated_at: new Date().toISOString(),
    })
    .eq('id', record.id)
    .select()
    .single()

  if (error) throw error

  // --- Phone ping (non-blocking) -----------------------------------------
  await notifyRecordingLinked(updated, lead, title, duration)

  return { record: updated, activity_id: activityId, task_ids: taskIds }
}

async function notifyRecordingLinked(record, lead, title, duration) {
  try {
    const items = record.action_items || []
    const text = [
      `🎙️ Call summary: ${title}`,
      `👤 ${lead.full_name || lead.email}${lead.company ? ` · ${lead.company}` : ''}`,
      duration ? `⏱️ ${duration}` : null,
      items.length ? `✅ ${items.length} action item${items.length === 1 ? '' : 's'}` : null,
      ...items.slice(0, 5).map((item) => `   • ${item.title}`),
    ]
      .filter(Boolean)
      .join('\n')

    await sendN8nNotification({
      event: 'pocket_call_summary',
      lead_id: lead.id,
      name: lead.full_name || lead.email,
      email: lead.email,
      company: lead.company || null,
      recording_id: record.pocket_recording_id,
      title,
      action_items: items.map((item) => item.title),
      text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Pocket: n8n notification failed:', error)
  }
}

/* -------------------------------------------------------------------------- */
/* Webhook orchestration                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Main entry point for the webhook route. Stores the recording, resolves a
 * lead from its tags, and attaches it when there's a match.
 */
export async function handlePocketWebhook(payload) {
  const event = payload.event

  if (event === 'recording.deleted') {
    await supabase
      .from('pocket_recordings')
      .update({ status: 'dismissed', last_event: event, updated_at: new Date().toISOString() })
      .eq('pocket_recording_id', payload.recording?.id)
    return { handled: true, action: 'dismissed' }
  }

  if (!SUMMARY_EVENTS.has(event)) {
    return { handled: false, reason: `Ignoring event ${event}` }
  }

  let parsed = parseRecordingPayload(payload)
  if (!parsed.pocket_recording_id) {
    return { handled: false, reason: 'Payload has no recording id' }
  }

  // The webhook payload doesn't reliably carry tags, and tags are how we find
  // the lead — so fall back to the API when they're absent.
  if (parsed.tags.length === 0 && process.env.POCKET_API_KEY) {
    try {
      const detail = await getRecording(parsed.pocket_recording_id)
      const fromApi = parseRecordingPayload(detail.data || detail)
      parsed = {
        ...parsed,
        tags: fromApi.tags,
        summary_title: parsed.summary_title || fromApi.summary_title,
        summary_markdown: parsed.summary_markdown || fromApi.summary_markdown,
        action_items: parsed.action_items?.length ? parsed.action_items : fromApi.action_items,
        transcript: parsed.transcript?.length ? parsed.transcript : fromApi.transcript,
      }
    } catch (error) {
      console.error('Pocket: could not fetch recording detail:', error.message)
    }
  }

  return ingestParsedRecording(parsed, { event, raw_payload: payload })
}

/**
 * Upsert a parsed recording and attach it to a lead if its tags resolve to one.
 * Shared by the webhook and the tag resync sweep.
 */
async function ingestParsedRecording(parsed, { event = 'sync', raw_payload = null } = {}) {
  const existing = await getRecordingByPocketId(parsed.pocket_recording_id)

  // Don't drag a dismissed recording back into the inbox on a resync.
  if (existing?.status === 'dismissed' && event === 'sync') {
    return { handled: true, action: 'skipped', reason: 'Recording was dismissed' }
  }

  const row = {
    ...parsed,
    last_event: event,
    ...(raw_payload ? { raw_payload } : {}),
    updated_at: new Date().toISOString(),
  }

  const { data: record, error } = await supabase
    .from('pocket_recordings')
    .upsert(
      existing ? { ...row, id: existing.id } : row,
      { onConflict: 'pocket_recording_id' }
    )
    .select()
    .single()

  if (error) throw error

  // Already assigned by hand — refresh the summary, don't re-resolve.
  if (record.lead_id) {
    const { data: lead } = await supabase
      .from('crm_leads')
      .select('*')
      .eq('id', record.lead_id)
      .maybeSingle()
    if (lead) {
      await attachRecordingToLead(record, lead, { match_method: record.match_method || 'manual' })
      return { handled: true, action: 'updated', lead_id: lead.id }
    }
  }

  const { lead, match_method } = await resolveLeadFromTags(record.tags)

  if (!lead) {
    return { handled: true, action: 'inbox', reason: 'No tag matched a lead' }
  }

  await attachRecordingToLead(record, lead, { match_method })
  return { handled: true, action: 'attached', lead_id: lead.id }
}

/* -------------------------------------------------------------------------- */
/* Inbox queries                                                               */
/* -------------------------------------------------------------------------- */

export async function getRecordingByPocketId(pocketRecordingId) {
  const { data, error } = await supabase
    .from('pocket_recordings')
    .select('*')
    .eq('pocket_recording_id', pocketRecordingId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getPocketRecordings({ status = null, lead_id = null, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('pocket_recordings')
    .select('*, lead:crm_leads(id, full_name, email, company, is_client)', { count: 'exact' })
    .order('recorded_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (lead_id) query = query.eq('lead_id', lead_id)

  const { data, error, count } = await query
  if (error) throw error

  return { recordings: data || [], total: count || 0 }
}

/**
 * Manually assign an inbox recording to a lead (used by the admin inbox).
 */
export async function assignRecordingToLead(recordingId, leadId) {
  const { data: record, error: recordError } = await supabase
    .from('pocket_recordings')
    .select('*')
    .eq('id', recordingId)
    .single()
  if (recordError) throw recordError

  const { data: lead, error: leadError } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('id', leadId)
    .single()
  if (leadError) throw leadError

  return attachRecordingToLead(record, lead, { match_method: 'manual' })
}

/* -------------------------------------------------------------------------- */
/* Tag resync                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Re-fetch one recording from Pocket and re-run tag resolution.
 * This is how a recording tagged AFTER its summary finished gets picked up —
 * Pocket has no `tags.updated` webhook event, so nothing fires when you add a
 * tag later and we have to go look.
 */
export async function resyncRecording(pocketRecordingId) {
  const detail = await getRecording(pocketRecordingId)
  const parsed = parseRecordingPayload(detail.data || detail)

  if (!parsed.pocket_recording_id) {
    return { handled: false, reason: 'Recording not found' }
  }

  return ingestParsedRecording(parsed, { event: 'sync' })
}

/**
 * Sweep for recordings that should be in the CRM but aren't:
 *   1. rows sitting unmatched in the inbox (you may have tagged them since)
 *   2. recordings Pocket never successfully webhooked us about
 *
 * Runs on a cron so late tagging still lands automatically.
 */
export async function resyncUnmatchedRecordings({ lookbackDays = 7 } = {}) {
  if (!process.env.POCKET_API_KEY) {
    return { skipped: true, reason: 'POCKET_API_KEY not configured' }
  }

  const results = { checked: 0, attached: 0, discovered: 0, errors: [] }

  // --- 1. Re-check tags on everything still unmatched ----------------------
  const { data: unmatched, error } = await supabase
    .from('pocket_recordings')
    .select('pocket_recording_id')
    .eq('status', 'unmatched')
  if (error) throw error

  const seen = new Set()

  for (const row of unmatched || []) {
    seen.add(row.pocket_recording_id)
    results.checked++
    try {
      const result = await resyncRecording(row.pocket_recording_id)
      if (result.action === 'attached') results.attached++
    } catch (err) {
      results.errors.push(`${row.pocket_recording_id}: ${err.message}`)
    }
  }

  // --- 2. Catch recordings the webhook never delivered ---------------------
  const since = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  try {
    const list = await listRecordings({ start_date: since, limit: 100 })

    for (const recording of list.data || []) {
      if (!recording.id || seen.has(recording.id)) continue
      if (await getRecordingByPocketId(recording.id)) continue

      results.discovered++
      try {
        const result = await resyncRecording(recording.id)
        if (result.action === 'attached') results.attached++
      } catch (err) {
        results.errors.push(`${recording.id}: ${err.message}`)
      }
    }
  } catch (err) {
    results.errors.push(`list: ${err.message}`)
  }

  return results
}

export async function dismissRecording(recordingId) {
  const { data, error } = await supabase
    .from('pocket_recordings')
    .update({ status: 'dismissed', updated_at: new Date().toISOString() })
    .eq('id', recordingId)
    .select()
    .single()

  if (error) throw error
  return data
}
