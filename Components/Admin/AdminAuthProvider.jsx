'use client'

// Gates /admin in the browser.
//
// Opening the app must be instant and must survive bad signal, so:
//  1. We let you in from the session already saved on this device (localStorage),
//     with no network round trip on the critical path.
//  2. We confirm with the server in the background (/api/admin/me). Only a
//     definite answer — the session was rejected (401) or the email is not an
//     admin (403) — signs you out. Network errors and timeouts never do.
//  3. supabase-js keeps refreshing the token on its own; a refresh that fails
//     for network reasons keeps the saved session, and only a revoked/expired
//     refresh token fires SIGNED_OUT.

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getAuthClient, signOut } from '@/lib/admin-auth'
import { clearCache } from '@/lib/useCachedFetch'

const AdminAuthContext = createContext(null)

const PUBLIC_ROUTES = ['/login']
const STORAGE_KEY = 'va-admin-auth' // matches lib/supabase-crm-client.js

// The session as last saved on this device, read without any network call.
function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const session = parsed?.currentSession || parsed // older supabase-js nested it
    return session?.user && session?.refresh_token ? session : null
  } catch {
    return null
  }
}

function decodeJwt(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(part))
  } catch {
    return {}
  }
}

// Local MFA check: the account has a verified factor but this session never passed it.
function needsMfa(session) {
  const verified = (session.user?.factors || []).filter((f) => f.status === 'verified')
  if (verified.length === 0) return false
  return decodeJwt(session.access_token).aal !== 'aal2'
}

function mfaStatusOf(session) {
  const totp = (session?.user?.factors || []).find((f) => f.factor_type === 'totp')
  return { enabled: !!totp, verified: totp?.status === 'verified', factorId: totp?.id }
}

// Session from supabase-js (refreshes if expired); falls back to the stored copy
// when that can't finish — offline, or slower than `wait` ms.
async function loadSession(wait = 2500) {
  const supabase = getAuthClient()
  const stored = readStoredSession()
  const live = supabase.auth.getSession().then(({ data, error }) => {
    if (data?.session) return data.session
    if (error && error.name === 'AuthRetryableFetchError') return stored
    if (error && !error.status) return stored // fetch failed before any HTTP answer
    return null // definite: nothing saved, or the refresh token was rejected
  }).catch(() => stored)
  if (!stored) return live
  return Promise.race([live, new Promise((resolve) => setTimeout(() => resolve(stored), wait))])
}

export function AdminAuthProvider({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mfaStatus, setMfaStatus] = useState({ enabled: false, verified: false })
  const verifiedFor = useRef(null) // access token last confirmed by the server

  const logout = useCallback(async () => {
    verifiedFor.current = null
    clearCache()
    setUser(null)
    try { await signOut() } catch { /* already gone */ }
    router.replace('/login')
  }, [router])

  // Background server check. Signs out only on a definite 401/403.
  const verifyWithServer = useCallback(async (session) => {
    if (!session?.access_token || verifiedFor.current === session.access_token) return
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      })
      if (res.ok) {
        verifiedFor.current = session.access_token
        return
      }
      if (res.status === 403) return logout()
      if (res.status === 401) {
        // Token may simply be stale: refresh once and re-check before giving up.
        const { data, error } = await getAuthClient().auth.refreshSession()
        if (data?.session) {
          const again = await fetch('/api/admin/me', {
            headers: { Authorization: `Bearer ${data.session.access_token}` },
            cache: 'no-store',
          })
          if (again.ok) { verifiedFor.current = data.session.access_token; return }
          if (again.status === 401 || again.status === 403) return logout()
          return
        }
        if (error && error.name !== 'AuthRetryableFetchError' && error.status) return logout()
      }
      // 5xx / anything else: leave the session alone and try again next time.
    } catch {
      // Offline or the request failed: keep the user in.
    }
  }, [logout])

  const applySession = useCallback((session) => {
    if (!session) {
      setUser(null)
      return false
    }
    if (needsMfa(session)) {
      setUser(null)
      setMfaStatus(mfaStatusOf(session))
      router.replace('/login')
      return false
    }
    setUser(session.user)
    setMfaStatus(mfaStatusOf(session))
    return true
  }, [router])

  const checkAuth = useCallback(async () => {
    const session = await loadSession()
    if (applySession(session)) verifyWithServer(session)
    setLoading(false)
  }, [applySession, verifyWithServer])

  useEffect(() => {
    // Paint immediately from the saved session; the live load then confirms it.
    const stored = readStoredSession()
    if (stored && !needsMfa(stored)) {
      setUser(stored.user)
      setMfaStatus(mfaStatusOf(stored))
      setLoading(false)
    }
    checkAuth()

    // Never await a Supabase call inside this callback: it runs while supabase-js
    // holds its auth lock, and awaiting getSession() there deadlocks later calls.
    const { data } = getAuthClient().auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        verifiedFor.current = null
        clearCache()
        setUser(null)
        router.replace('/login')
      } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session) {
        setTimeout(() => {
          if (applySession(session)) verifyWithServer(session)
        }, 0)
      }
    })

    // Coming back to the app after a while: re-confirm in the background.
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        const s = readStoredSession()
        if (s) verifyWithServer(s)
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      data?.subscription?.unsubscribe()
      document.removeEventListener('visibilitychange', onVisible)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (loading) return
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname?.startsWith(route))
    if (!user && !isPublicRoute) router.replace('/login')
    else if (user && isPublicRoute) router.replace('/admin')
  }, [user, loading, pathname, router])

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname?.startsWith(route))
  if (isPublicRoute && !loading) return children

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#09090b]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2dd4bf] border-t-transparent" />
      </div>
    )
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading: false, mfaStatus, signOut: logout, refreshAuth: checkAuth }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
