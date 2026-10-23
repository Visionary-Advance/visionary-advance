#!/usr/bin/env node
/**
 * Manage client websites that send leads into Jobber
 * (see lib/jobber-leads.js and /api/integrations/jobber/lead).
 *
 * Usage:
 *   node scripts/jobber-site.mjs create <slug> "<Business Name>"
 *       New site: prints its secret key (put it in the client site's env as
 *       JOBBER_LEAD_KEY) and a one-time connect link for the contractor.
 *   node scripts/jobber-site.mjs invite <slug>
 *       New connect link (e.g. the old one expired, or they want to switch
 *       Jobber accounts). Leads keep flowing to the current account until used.
 *   node scripts/jobber-site.mjs rotate-key <slug>
 *       New secret key; the old one stops working immediately.
 *   node scripts/jobber-site.mjs status [slug]
 *
 * Secrets are printed once and only their hashes are stored.
 * Reads NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SITE_URL
 * from .env.local.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function loadEnv() {
  const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
  }
  return env
}

const INVITE_TTL_DAYS = 14

const env = await loadEnv()
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const siteUrl = (env.NEXT_PUBLIC_SITE_URL || 'https://visionaryadvance.com').replace(/\/$/, '')

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex')
const newKey = () => `vajl_${crypto.randomBytes(32).toString('base64url')}`
const newInvite = () => crypto.randomBytes(24).toString('base64url')

function inviteFields() {
  const invite = newInvite()
  return {
    invite,
    fields: {
      connect_token_hash: hash(invite),
      connect_token_expires_at: new Date(Date.now() + INVITE_TTL_DAYS * 864e5).toISOString(),
    },
  }
}

const connectLink = (slug, invite) =>
  `${siteUrl}/connect-jobber?${new URLSearchParams({ site: slug, invite })}`

function fail(message) {
  console.error(message)
  process.exit(1)
}

const [command, slug, name] = process.argv.slice(2)

if (command === 'create') {
  if (!slug || !name) fail('Usage: create <slug> "<Business Name>"')
  const key = newKey()
  const { invite, fields } = inviteFields()
  const { error } = await db.from('jobber_lead_sites').insert({ slug, name, key_hash: hash(key), ...fields })
  if (error) fail(`Could not create site: ${error.message}`)
  console.log(`Created ${name} (${slug})\n`)
  console.log(`JOBBER_LEAD_KEY=${key}\n`)
  console.log(`Connect link for the contractor (valid ${INVITE_TTL_DAYS} days, single use):\n${connectLink(slug, invite)}`)
} else if (command === 'invite') {
  if (!slug) fail('Usage: invite <slug>')
  const { invite, fields } = inviteFields()
  const { data, error } = await db.from('jobber_lead_sites').update(fields).eq('slug', slug).select('id')
  if (error || !data?.length) fail(`Could not update site: ${error?.message || 'not found'}`)
  console.log(`Connect link (valid ${INVITE_TTL_DAYS} days, single use):\n${connectLink(slug, invite)}`)
} else if (command === 'rotate-key') {
  if (!slug) fail('Usage: rotate-key <slug>')
  const key = newKey()
  const { data, error } = await db.from('jobber_lead_sites').update({ key_hash: hash(key) }).eq('slug', slug).select('id')
  if (error || !data?.length) fail(`Could not update site: ${error?.message || 'not found'}`)
  console.log(`JOBBER_LEAD_KEY=${key}\n\nThe previous key no longer works — update the site's env and redeploy.`)
} else if (command === 'status') {
  let query = db
    .from('jobber_lead_sites')
    .select('slug, name, active, jobber_account_id, connected_at, last_lead_at, connect_token_expires_at')
  if (slug) query = query.eq('slug', slug)
  const { data, error } = await query.order('created_at')
  if (error) fail(error.message)
  for (const site of data) {
    console.log(`${site.slug} — ${site.name}${site.active ? '' : ' (inactive)'}`)
    console.log(`  Jobber:    ${site.jobber_account_id ? `connected ${site.connected_at}` : 'not connected'}`)
    console.log(`  Last lead: ${site.last_lead_at || 'never'}`)
    if (site.connect_token_expires_at) console.log(`  Open invite expires ${site.connect_token_expires_at}`)
  }
  if (!data.length) console.log('No sites.')
} else {
  fail('Commands: create <slug> "<Name>" | invite <slug> | rotate-key <slug> | status [slug]')
}
