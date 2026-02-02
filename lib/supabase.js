// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Lazy-load Supabase client to avoid build-time initialization errors
let supabaseInstance = null

export const supabase = new Proxy({}, {
  get(target, prop) {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      })
    }
    return supabaseInstance[prop]
  }
})
