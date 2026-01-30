// lib/admin-auth.js
// Admin authentication with Supabase Auth + MFA

import { getCRMAuthClient } from './supabase-crm'

// Get the CRM auth client
export function getAuthClient() {
  return getCRMAuthClient()
}

// List of allowed admin emails (configure this in your environment or database)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || []

/**
 * Check if an email is allowed to access admin
 */
export function isAdminEmail(email) {
  if (!email) return false
  // If no admin emails configured, allow any authenticated user (for initial setup)
  if (ADMIN_EMAILS.length === 0) return true
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  const supabase = getAuthClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  // Check if user is admin
  if (!isAdminEmail(data.user?.email)) {
    await supabase.auth.signOut()
    throw new Error('Unauthorized: Admin access only')
  }

  return data
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = getAuthClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = getAuthClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  return session
}

/**
 * Get current user
 */
export async function getUser() {
  const supabase = getAuthClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

/**
 * Check if user has MFA enabled
 */
export async function getMFAStatus() {
  const supabase = getAuthClient()

  const { data, error } = await supabase.auth.mfa.listFactors()

  if (error) {
    console.error('MFA status error:', error)
    return { enabled: false, verified: false }
  }

  const totpFactor = data?.totp?.[0]

  return {
    enabled: !!totpFactor,
    verified: totpFactor?.status === 'verified',
    factorId: totpFactor?.id,
  }
}

/**
 * Enroll in MFA (TOTP)
 */
export async function enrollMFA() {
  const supabase = getAuthClient()

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Authenticator App',
  })

  if (error) throw new Error(error.message)

  return {
    id: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
  }
}

/**
 * Verify MFA enrollment with code
 */
export async function verifyMFAEnrollment(factorId, code) {
  const supabase = getAuthClient()

  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId,
  })

  if (challengeError) throw new Error(challengeError.message)

  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  })

  if (error) throw new Error(error.message)

  return data
}

/**
 * Verify MFA code during login
 */
export async function verifyMFA(factorId, code) {
  const supabase = getAuthClient()

  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId,
  })

  if (challengeError) throw new Error(challengeError.message)

  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  })

  if (error) throw new Error(error.message)

  return data
}

/**
 * Unenroll from MFA
 */
export async function unenrollMFA(factorId) {
  const supabase = getAuthClient()

  const { error } = await supabase.auth.mfa.unenroll({
    factorId,
  })

  if (error) throw new Error(error.message)
}

/**
 * Get the current assurance level
 * aal1 = password only
 * aal2 = password + MFA verified
 */
export async function getAssuranceLevel() {
  const supabase = getAuthClient()

  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  if (error) {
    console.error('Assurance level error:', error)
    return { currentLevel: null, nextLevel: null }
  }

  return {
    currentLevel: data.currentLevel,
    nextLevel: data.nextLevel,
    currentAuthenticationMethods: data.currentAuthenticationMethods,
  }
}

/**
 * Check if MFA verification is required
 */
export async function requiresMFAVerification() {
  const { currentLevel, nextLevel } = await getAssuranceLevel()

  // If next level is aal2 but current is aal1, MFA verification is needed
  return nextLevel === 'aal2' && currentLevel === 'aal1'
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback) {
  const supabase = getAuthClient()
  return supabase.auth.onAuthStateChange(callback)
}
