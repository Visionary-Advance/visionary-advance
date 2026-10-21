// lib/trial.js
// Free-trial spots for the /free-trial ad page. Server only.
//
// A spot is taken when someone submits the form (build started, or the
// "not on Google" form). Past TRIAL_SPOTS they join the waitlist instead.
// Schema: supabase/migrations/20261021_trial_signups.sql

import { createClient } from '@supabase/supabase-js'

export const TRIAL_SPOTS = 10
// Free until this date, then $99 a month if they keep it
export const TRIAL_ENDS_LABEL = 'January 1'

// Lazy-load Supabase client to avoid build-time initialization errors
let supabase = null
function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
    )
  }
  return supabase
}

/** Spots still open, or null if the count couldn't be read (the page then hides the banner). */
export async function getTrialSpotsLeft() {
  const { count, error } = await getSupabaseClient()
    .from('trial_signups')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'trial')

  if (error || count == null) {
    console.error('[trial] spot count failed:', error)
    return null
  }
  return Math.max(0, TRIAL_SPOTS - count)
}

/**
 * Take a spot, or join the waitlist once they're gone. Returns 'trial',
 * 'waitlist', or null if the database couldn't be reached. The same email
 * always gets its first answer back, so a second build never takes a second spot.
 */
export async function claimTrialSpot({ email, name, phone, businessName, placeId }) {
  const { data, error } = await getSupabaseClient().rpc('claim_trial_spot', {
    p_email: email,
    p_name: name || null,
    p_phone: phone || null,
    p_business_name: businessName || null,
    p_place_id: placeId || null,
    p_spots: TRIAL_SPOTS,
  })

  if (error) {
    console.error('[trial] claim failed:', error)
    return null
  }
  return data
}
