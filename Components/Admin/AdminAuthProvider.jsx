'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  getSession,
  getUser,
  getMFAStatus,
  getAssuranceLevel,
  onAuthStateChange,
  signOut,
  isAdminEmail,
} from '@/lib/admin-auth'

const AdminAuthContext = createContext(null)

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login']

export function AdminAuthProvider({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mfaStatus, setMfaStatus] = useState({ enabled: false, verified: false })

  useEffect(() => {
    let initialCheckDone = false
    let subscription = null

    // Check initial session with timeout to prevent stalling
    const initAuth = async () => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth check timeout')), 10000)
      )

      try {
        await Promise.race([checkAuth(), timeoutPromise])
      } catch (err) {
        console.error('Initial auth check failed:', err)
        setUser(null)
        setLoading(false)
      }
      initialCheckDone = true
    }

    initAuth()

    // Listen for auth changes (skip initial SIGNED_IN event to avoid race condition)
    try {
      const { data } = onAuthStateChange(async (event, session) => {
        if (!initialCheckDone && event === 'SIGNED_IN') {
          return
        }
        if (event === 'SIGNED_OUT') {
          setUser(null)
          router.replace('/login')
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkAuth()
        }
      })
      subscription = data?.subscription
    } catch (err) {
      console.error('Auth state change listener failed:', err)
    }

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    // Redirect logic based on auth state
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))

      if (!user && !isPublicRoute) {
        // Not authenticated and trying to access protected route
        router.replace('/login')
      } else if (user && isPublicRoute) {
        // Authenticated but on login page, redirect to dashboard
        router.replace('/admin')
      }
    }
  }, [user, loading, pathname, router])

  const checkAuth = async () => {
    try {
      let session
      try {
        session = await getSession()
      } catch (sessionErr) {
        console.error('Failed to get session:', sessionErr)
        setUser(null)
        return
      }

      if (!session) {
        setUser(null)
        return
      }

      let currentUser
      try {
        currentUser = await getUser()
      } catch (userErr) {
        console.error('Failed to get user:', userErr)
        setUser(null)
        return
      }

      if (!currentUser || !isAdminEmail(currentUser.email)) {
        // Not an admin, sign out
        try {
          await signOut()
        } catch (signOutErr) {
          console.error('Sign out failed:', signOutErr)
        }
        setUser(null)
        return
      }

      // Check MFA status
      let mfa = { enabled: false, verified: false }
      let assurance = { currentLevel: null, nextLevel: null }

      try {
        mfa = await getMFAStatus()
        assurance = await getAssuranceLevel()
      } catch (mfaErr) {
        console.error('MFA check failed:', mfaErr)
      }

      // If MFA is enabled but not verified, redirect to login
      if (mfa.enabled && assurance.nextLevel === 'aal2' && assurance.currentLevel === 'aal1') {
        setUser(null)
        setMfaStatus(mfa)
        router.replace('/login')
        return
      }

      setUser(currentUser)
      setMfaStatus(mfa)
    } catch (err) {
      console.error('Auth check error:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.replace('/login')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#000000]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  // For public routes (login), just render children
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))
  if (isPublicRoute) {
    return children
  }

  // For protected routes, require authentication
  if (!user) {
    // Will redirect in useEffect, show loading
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#000000]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  return (
    <AdminAuthContext.Provider value={{ user, mfaStatus, signOut: handleSignOut, refreshAuth: checkAuth }}>
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
