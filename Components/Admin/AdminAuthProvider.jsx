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
const PUBLIC_ROUTES = ['/admin/login']

export function AdminAuthProvider({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mfaStatus, setMfaStatus] = useState({ enabled: false, verified: false })

  useEffect(() => {
    let initialCheckDone = false

    // Check initial session
    checkAuth().then(() => {
      initialCheckDone = true
    })

    // Listen for auth changes (skip initial SIGNED_IN event to avoid race condition)
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (!initialCheckDone && event === 'SIGNED_IN') {
        return
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
        router.replace('/admin/login')
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkAuth()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Redirect logic based on auth state
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))

      if (!user && !isPublicRoute) {
        // Not authenticated and trying to access protected route
        router.replace('/admin/login')
      } else if (user && isPublicRoute) {
        // Authenticated but on login page, redirect to dashboard
        router.replace('/admin/crm')
      }
    }
  }, [user, loading, pathname, router])

  const checkAuth = async () => {
    try {
      const session = await getSession()

      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }

      const currentUser = await getUser()

      if (!currentUser || !isAdminEmail(currentUser.email)) {
        // Not an admin, sign out
        await signOut()
        setUser(null)
        setLoading(false)
        return
      }

      // Check MFA status
      const mfa = await getMFAStatus()
      const assurance = await getAssuranceLevel()

      // If MFA is enabled but not verified, redirect to login
      if (mfa.enabled && assurance.nextLevel === 'aal2' && assurance.currentLevel === 'aal1') {
        setUser(null)
        setMfaStatus(mfa)
        setLoading(false)
        router.replace('/admin/login')
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
    router.replace('/admin/login')
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
