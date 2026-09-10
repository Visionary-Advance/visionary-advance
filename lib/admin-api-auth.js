// lib/admin-api-auth.js
// Server-side auth guards for admin API routes.
//
// NOTE: lib/admin-auth.js is CLIENT-side only — it gates the /admin UI in the
// browser and cannot protect an API route. Admin sessions live in localStorage
// (storageKey 'va-admin-auth'), not cookies, so there is nothing for the server
// to read automatically: the browser must send the access token explicitly as
// `Authorization: Bearer <token>`.

import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean) || []

/**
 * Verify the caller is a signed-in admin.
 * Returns { ok: true, user } or { ok: false, status, error }.
 *
 * Fails CLOSED when ADMIN_EMAILS is unset — unlike the client-side
 * isAdminEmail(), which returns true for any authenticated user.
 */
export async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    return { ok: false, status: 401, error: 'Missing bearer token' }
  }

  if (ADMIN_EMAILS.length === 0) {
    console.error('ADMIN_EMAILS is not configured — denying admin API access')
    return { ok: false, status: 500, error: 'Admin access not configured' }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 500, error: 'Auth not configured' }
  }

  const client = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const { data, error } = await client.auth.getUser(token)

  if (error || !data?.user) {
    return { ok: false, status: 401, error: 'Invalid or expired session' }
  }

  const email = data.user.email?.toLowerCase()
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return { ok: false, status: 403, error: 'Not authorized' }
  }

  return { ok: true, user: data.user }
}

/**
 * Constant-time comparison of the cron Authorization header.
 * Fails closed when CRON_SECRET is unset — otherwise the interpolated string
 * becomes "Bearer undefined", which any caller can send verbatim.
 */
export function verifyCronRequest(request) {
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET is not configured — denying cron request')
    return { ok: false, status: 500, error: 'Cron secret not configured' }
  }

  const received = Buffer.from(request.headers.get('authorization') || '')
  const expected = Buffer.from(`Bearer ${cronSecret}`)

  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  return { ok: true }
}
