// Components/Admin/SettingsModal.jsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from './AdminAuthProvider'
import {
  getMFAStatus,
  enrollMFA,
  verifyMFAEnrollment,
  unenrollMFA,
} from '@/lib/admin-auth'

export default function SettingsModal({ isOpen, onClose }) {
  const { user, refreshAuth } = useAdminAuth()
  const [mfaStatus, setMfaStatus] = useState({ enabled: false, verified: false, factorId: null })
  const [loading, setLoading] = useState(true)

  // MFA enrollment state
  const [enrolling, setEnrolling] = useState(false)
  const [enrollmentData, setEnrollmentData] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Google OAuth state
  const [googleStatus, setGoogleStatus] = useState({ connected: false, loading: true })
  const [googleError, setGoogleError] = useState('')
  const [googleSuccess, setGoogleSuccess] = useState('')
  const [disconnecting, setDisconnecting] = useState(false)

  // Active tab
  const [activeTab, setActiveTab] = useState('account')

  useEffect(() => {
    if (isOpen) {
      fetchMFAStatus()
      if (user?.email) {
        fetchGoogleStatus()
      }
    }
  }, [isOpen, user?.email])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const fetchMFAStatus = async () => {
    try {
      const status = await getMFAStatus()
      setMfaStatus(status)
    } catch (err) {
      console.error('Failed to fetch MFA status:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchGoogleStatus = async () => {
    if (!user?.email) {
      setGoogleStatus({ connected: false, loading: false })
      return
    }

    try {
      const response = await fetch(`/api/auth/google/status?email=${encodeURIComponent(user.email)}`)
      const data = await response.json()
      setGoogleStatus({ ...data, loading: false })
    } catch (err) {
      console.error('Failed to fetch Google status:', err)
      setGoogleStatus({ connected: false, loading: false })
    }
  }

  const handleConnectGoogle = () => {
    // Pass admin email so the connection is linked to this account
    const adminEmail = encodeURIComponent(user?.email || '')
    window.location.href = `/api/auth/google/start?adminEmail=${adminEmail}`
  }

  const handleDisconnectGoogle = async () => {
    if (!confirm('Are you sure you want to disconnect your Google account?')) {
      return
    }

    setDisconnecting(true)
    setGoogleError('')

    try {
      const response = await fetch('/api/auth/google/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: googleStatus.email || user?.email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to disconnect')
      }

      setGoogleSuccess('Google account disconnected successfully')
      setGoogleStatus({ connected: false, loading: false })
    } catch (err) {
      setGoogleError(err.message)
    } finally {
      setDisconnecting(false)
    }
  }

  const handleEnrollMFA = async () => {
    setEnrolling(true)
    setError('')
    setSuccess('')

    try {
      const data = await enrollMFA()
      setEnrollmentData(data)
    } catch (err) {
      setError(err.message)
      setEnrolling(false)
    }
  }

  const handleVerifyEnrollment = async (e) => {
    e.preventDefault()
    setVerifying(true)
    setError('')

    try {
      await verifyMFAEnrollment(enrollmentData.id, verificationCode)
      setSuccess('MFA has been enabled successfully!')
      setEnrollmentData(null)
      setVerificationCode('')
      setEnrolling(false)
      await fetchMFAStatus()
      await refreshAuth()
    } catch (err) {
      setError(err.message)
      setVerificationCode('')
    } finally {
      setVerifying(false)
    }
  }

  const handleDisableMFA = async () => {
    if (!confirm('Are you sure you want to disable MFA? This will make your account less secure.')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      await unenrollMFA(mfaStatus.factorId)
      setSuccess('MFA has been disabled.')
      await fetchMFAStatus()
      await refreshAuth()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEnrollment = () => {
    setEnrolling(false)
    setEnrollmentData(null)
    setVerificationCode('')
    setError('')
  }

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-[#262626] bg-[#0a0a0a] shadow-2xl"
          >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#fafafa]">Settings</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa] transition-colors"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#262626] px-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#fafafa]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008070]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-[#fafafa]">Account Information</h3>
                <p className="mt-1 text-xs text-[#a1a1aa]">Your account details</p>
              </div>

              <dl className="space-y-4">
                <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                  <dt className="text-xs uppercase tracking-wider text-[#a1a1aa]">Email</dt>
                  <dd className="mt-1 text-[#fafafa]">{user?.email}</dd>
                </div>
                <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                  <dt className="text-xs uppercase tracking-wider text-[#a1a1aa]">User ID</dt>
                  <dd className="mt-1 font-mono text-sm text-[#a1a1aa]">{user?.id}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#fafafa]">Two-Factor Authentication</h3>
                  <p className="mt-1 text-xs text-[#a1a1aa]">Add an extra layer of security</p>
                </div>
                {mfaStatus.enabled && mfaStatus.verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    <CheckIcon className="h-3 w-3" />
                    Enabled
                  </span>
                )}
              </div>

              {/* Error/Success messages */}
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  {success}
                </div>
              )}

              {loading ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
                  <span className="text-sm text-[#a1a1aa]">Loading...</span>
                </div>
              ) : enrolling && enrollmentData ? (
                /* MFA Enrollment Flow */
                <div className="space-y-4">
                  <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                    <h4 className="font-medium text-[#fafafa]">Step 1: Scan QR Code</h4>
                    <p className="mt-1 text-xs text-[#a1a1aa]">
                      Scan with your authenticator app
                    </p>

                    <div className="mt-4 flex justify-center">
                      <div className="rounded-lg bg-white p-3">
                        <img
                          src={enrollmentData.qrCode}
                          alt="MFA QR Code"
                          className="h-40 w-40"
                        />
                      </div>
                    </div>

                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-[#008070] hover:underline">
                        Can't scan? Enter code manually
                      </summary>
                      <div className="mt-2 rounded-lg bg-[#0a0a0a] p-2">
                        <code className="block break-all font-mono text-xs text-[#fafafa]">
                          {enrollmentData.secret}
                        </code>
                      </div>
                    </details>
                  </div>

                  <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                    <h4 className="font-medium text-[#fafafa]">Step 2: Verify Code</h4>
                    <form onSubmit={handleVerifyEnrollment} className="mt-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-center text-xl tracking-[0.5em] text-[#fafafa] placeholder-[#404040] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                        autoComplete="one-time-code"
                      />

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEnrollment}
                          className="flex-1 rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm font-medium text-[#fafafa] transition-colors hover:bg-[#171717]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={verifying || verificationCode.length !== 6}
                          className="flex-1 rounded-lg bg-[#008070] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {verifying ? 'Verifying...' : 'Enable MFA'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : mfaStatus.enabled && mfaStatus.verified ? (
                <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                  <p className="text-sm text-[#a1a1aa]">
                    Two-factor authentication is enabled. You'll be asked for a code when you sign in.
                  </p>
                  <button
                    onClick={handleDisableMFA}
                    className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
                  >
                    Disable MFA
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                  <p className="text-sm text-[#a1a1aa]">
                    Add an extra layer of security by requiring a code from your phone when you sign in.
                  </p>
                  <button
                    onClick={handleEnrollMFA}
                    disabled={enrolling}
                    className="mt-3 rounded-lg bg-[#008070] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {enrolling ? 'Setting up...' : 'Set up MFA'}
                  </button>
                </div>
              )}

              {/* Security Tips */}
              <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                <h4 className="text-sm font-medium text-[#fafafa]">Security Tips</h4>
                <ul className="mt-3 space-y-2 text-xs text-[#a1a1aa]">
                  <li className="flex gap-2">
                    <ShieldIcon className="h-4 w-4 flex-shrink-0 text-[#008070]" />
                    <span>Use a strong, unique password</span>
                  </li>
                  <li className="flex gap-2">
                    <ShieldIcon className="h-4 w-4 flex-shrink-0 text-[#008070]" />
                    <span>Enable two-factor authentication</span>
                  </li>
                  <li className="flex gap-2">
                    <ShieldIcon className="h-4 w-4 flex-shrink-0 text-[#008070]" />
                    <span>Sign out on shared computers</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#fafafa]">Google Search Console</h3>
                  <p className="mt-1 text-xs text-[#a1a1aa]">Access Search Console data for SEO insights</p>
                </div>
                {googleStatus.connected && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    <CheckIcon className="h-3 w-3" />
                    Connected
                  </span>
                )}
              </div>

              {/* Error/Success messages */}
              {googleError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {googleError}
                </div>
              )}
              {googleSuccess && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  {googleSuccess}
                </div>
              )}

              {googleStatus.loading ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
                  <span className="text-sm text-[#a1a1aa]">Loading...</span>
                </div>
              ) : googleStatus.connected ? (
                <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-[#a1a1aa]">Connected Account</dt>
                      <dd className="mt-1 text-[#fafafa]">{googleStatus.email}</dd>
                    </div>
                    {googleStatus.lastUsed && (
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-[#a1a1aa]">Last Used</dt>
                        <dd className="mt-1 text-sm text-[#a1a1aa]">
                          {new Date(googleStatus.lastUsed).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <button
                    onClick={handleDisconnectGoogle}
                    disabled={disconnecting}
                    className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
                  <p className="text-sm text-[#a1a1aa]">
                    Connect your Google account to enable Search Console data access.
                  </p>

                  <button
                    onClick={handleConnectGoogle}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#008070] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006b5d]"
                  >
                    <GoogleIcon className="h-4 w-4" />
                    Connect Google
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  )
}

// Icons
function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
