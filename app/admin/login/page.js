// app/admin/login/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  signIn,
  getSession,
  getMFAStatus,
  verifyMFA,
  getAssuranceLevel,
} from '@/lib/admin-auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // MFA state
  const [needsMFA, setNeedsMFA] = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState(null)

  useEffect(() => {
    checkExistingSession()
  }, [])

  const checkExistingSession = async () => {
    try {
      const session = await getSession()
      if (session) {
        // Check if MFA is needed
        const { currentLevel, nextLevel } = await getAssuranceLevel()
        if (nextLevel === 'aal2' && currentLevel === 'aal1') {
          // Need MFA verification
          const mfaStatus = await getMFAStatus()
          if (mfaStatus.factorId) {
            setNeedsMFA(true)
            setMfaFactorId(mfaStatus.factorId)
          }
        } else {
          // Fully authenticated, redirect
          router.replace('/admin/crm')
        }
      }
    } catch (err) {
      console.error('Session check error:', err)
    } finally {
      setCheckingSession(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)

      // Check if MFA is required
      const mfaStatus = await getMFAStatus()
      const { currentLevel, nextLevel } = await getAssuranceLevel()

      if (mfaStatus.enabled && nextLevel === 'aal2' && currentLevel === 'aal1') {
        // User has MFA, need to verify
        setNeedsMFA(true)
        setMfaFactorId(mfaStatus.factorId)
      } else {
        // No MFA or already verified, redirect
        router.replace('/admin/crm')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMFAVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await verifyMFA(mfaFactorId, mfaCode)
      router.replace('/admin/crm')
    } catch (err) {
      setError(err.message)
      setMfaCode('')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#000000]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#008070]">
            <span className="text-lg font-bold text-white">VA</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-[#fafafa]">Admin Login</h1>
          <p className="mt-2 text-sm text-[#a1a1aa]">
            {needsMFA ? 'Enter your authenticator code' : 'Sign in to access the dashboard'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {needsMFA ? (
          /* MFA Verification Form */
          <form onSubmit={handleMFAVerify} className="space-y-4">
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-medium text-[#a1a1aa]">
                Authenticator Code
              </label>
              <input
                id="mfaCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="mt-2 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#fafafa] placeholder-[#404040] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                autoFocus
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={loading || mfaCode.length !== 6}
              className="w-full rounded-lg bg-[#008070] py-3 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </span>
              ) : (
                'Verify'
              )}
            </button>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a1a1aa]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-2 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-[#fafafa] placeholder-[#404040] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                autoFocus
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a1a1aa]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-[#fafafa] placeholder-[#404040] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-lg bg-[#008070] py-3 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* Back to site */}
        <p className="mt-8 text-center text-sm text-[#a1a1aa]">
          <a href="/" className="text-[#008070] hover:underline">
            Back to main site
          </a>
        </p>
      </div>
    </div>
  )
}
