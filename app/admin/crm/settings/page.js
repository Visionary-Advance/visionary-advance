// app/admin/crm/settings/page.js
'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider'
import {
  getMFAStatus,
  enrollMFA,
  verifyMFAEnrollment,
  unenrollMFA,
} from '@/lib/admin-auth'

export default function SettingsPage() {
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

  useEffect(() => {
    fetchMFAStatus()
  }, [])

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#fafafa]">Settings</h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">Manage your account and security settings</p>
      </div>

      {/* Account Info */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-medium text-[#fafafa]">Account</h2>
        <p className="mt-1 text-sm text-[#a1a1aa]">Your account information</p>

        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-xs uppercase tracking-wider text-[#a1a1aa]">Email</dt>
            <dd className="mt-1 text-[#fafafa]">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-[#a1a1aa]">User ID</dt>
            <dd className="mt-1 font-mono text-sm text-[#a1a1aa]">{user?.id}</dd>
          </div>
        </dl>
      </div>

      {/* MFA Section */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#fafafa]">Two-Factor Authentication</h2>
            <p className="mt-1 text-sm text-[#a1a1aa]">
              Add an extra layer of security to your account
            </p>
          </div>
          {mfaStatus.enabled && mfaStatus.verified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <CheckIcon className="h-3.5 w-3.5" />
              Enabled
            </span>
          )}
        </div>

        {/* Error/Success messages */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {loading ? (
          <div className="mt-6 flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
            <span className="text-sm text-[#a1a1aa]">Loading...</span>
          </div>
        ) : enrolling && enrollmentData ? (
          /* MFA Enrollment Flow */
          <div className="mt-6 space-y-6">
            <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
              <h3 className="font-medium text-[#fafafa]">Step 1: Scan QR Code</h3>
              <p className="mt-1 text-sm text-[#a1a1aa]">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
              </p>

              <div className="mt-4 flex justify-center">
                <div className="rounded-lg bg-white p-4">
                  {/* QR Code */}
                  <img
                    src={enrollmentData.qrCode}
                    alt="MFA QR Code"
                    className="h-48 w-48"
                  />
                </div>
              </div>

              {/* Manual entry option */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-[#008070] hover:underline">
                  Can't scan? Enter code manually
                </summary>
                <div className="mt-2 rounded-lg bg-[#0a0a0a] p-3">
                  <p className="text-xs text-[#a1a1aa]">Secret key:</p>
                  <code className="mt-1 block break-all font-mono text-sm text-[#fafafa]">
                    {enrollmentData.secret}
                  </code>
                </div>
              </details>
            </div>

            <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
              <h3 className="font-medium text-[#fafafa]">Step 2: Verify Code</h3>
              <p className="mt-1 text-sm text-[#a1a1aa]">
                Enter the 6-digit code from your authenticator app
              </p>

              <form onSubmit={handleVerifyEnrollment} className="mt-4">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#fafafa] placeholder-[#404040] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                  autoComplete="one-time-code"
                />

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEnrollment}
                    className="flex-1 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-[#fafafa] transition-colors hover:bg-[#171717]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifying || verificationCode.length !== 6}
                    className="flex-1 rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {verifying ? 'Verifying...' : 'Enable MFA'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : mfaStatus.enabled && mfaStatus.verified ? (
          /* MFA Enabled */
          <div className="mt-6">
            <p className="text-sm text-[#a1a1aa]">
              Two-factor authentication is enabled. You'll be asked for a code from your
              authenticator app when you sign in.
            </p>

            <button
              onClick={handleDisableMFA}
              className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              Disable MFA
            </button>
          </div>
        ) : (
          /* MFA Not Enabled */
          <div className="mt-6">
            <p className="text-sm text-[#a1a1aa]">
              Two-factor authentication adds an extra layer of security by requiring a code
              from your phone when you sign in.
            </p>

            <button
              onClick={handleEnrollMFA}
              disabled={enrolling}
              className="mt-4 rounded-lg bg-[#008070] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enrolling ? 'Setting up...' : 'Set up MFA'}
            </button>
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-medium text-[#fafafa]">Security Tips</h2>
        <ul className="mt-4 space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <ShieldIcon className="h-5 w-5 flex-shrink-0 text-[#008070]" />
            <span>Use a strong, unique password for your admin account</span>
          </li>
          <li className="flex gap-3">
            <ShieldIcon className="h-5 w-5 flex-shrink-0 text-[#008070]" />
            <span>Enable two-factor authentication for additional security</span>
          </li>
          <li className="flex gap-3">
            <ShieldIcon className="h-5 w-5 flex-shrink-0 text-[#008070]" />
            <span>Sign out when using shared computers</span>
          </li>
          <li className="flex gap-3">
            <ShieldIcon className="h-5 w-5 flex-shrink-0 text-[#008070]" />
            <span>Store your MFA backup codes in a secure location</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Icons
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
