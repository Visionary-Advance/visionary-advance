// lib/supabase-crm.js
// Server-side Supabase client for backend operations
// NOTE: This file is for SERVER-SIDE use only (API routes, server components)
// For client-side auth, use ./supabase-crm-client.js

import { createClient } from '@supabase/supabase-js'

// Lazy-load Supabase client to avoid build-time initialization errors
let supabaseCRMInstance = null

export const supabaseCRM = new Proxy({}, {
  get(target, prop) {
    if (!supabaseCRMInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Database credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
      }

      supabaseCRMInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      })
    }
    return supabaseCRMInstance[prop]
  }
})
