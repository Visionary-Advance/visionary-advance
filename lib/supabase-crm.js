// lib/supabase-crm.js
// Supabase client for CRM database (separate instance)

import { createClient } from '@supabase/supabase-js'

// Lazy-load CRM Supabase client to avoid build-time initialization errors
let supabaseCRMInstance = null

export const supabaseCRM = new Proxy({}, {
  get(target, prop) {
    if (!supabaseCRMInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_CRM_DB_URL
      const supabaseKey = process.env.SUPABASE_CRM_SERVICE_KEY || process.env.NEXT_PUBLIC_CRM_DB_ANON

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('CRM database credentials not configured. Set NEXT_PUBLIC_CRM_DB_URL and NEXT_PUBLIC_CRM_DB_ANON')
      }

      supabaseCRMInstance = createClient(supabaseUrl, supabaseKey)
    }
    return supabaseCRMInstance[prop]
  }
})

// Auth client (uses anon key for client-side auth operations)
let authClientInstance = null

export function getCRMAuthClient() {
  if (!authClientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_CRM_DB_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_CRM_DB_ANON

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('CRM database credentials not configured')
    }

    authClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  }
  return authClientInstance
}
