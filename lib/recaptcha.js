// lib/recaptcha.js
// Server-side reCAPTCHA v3 verification utility

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

// Minimum score threshold (0.0 - 1.0, higher = more likely human)
// 0.5 is Google's recommended threshold for most use cases
const MIN_SCORE = 0.5

/**
 * Verify a reCAPTCHA v3 token
 * @param {string} token - The reCAPTCHA token from the client
 * @param {string} expectedAction - The expected action name (optional, for additional validation)
 * @returns {Promise<{success: boolean, score?: number, action?: string, error?: string}>}
 */
export async function verifyRecaptcha(token, expectedAction = null) {
  // If no secret key is configured, skip verification in development
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY not configured - skipping verification')
    return { success: true, score: 1.0, skipped: true }
  }

  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' }
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes'])
      return {
        success: false,
        error: 'reCAPTCHA verification failed',
        errorCodes: data['error-codes'],
      }
    }

    // Check score threshold
    if (data.score < MIN_SCORE) {
      console.warn(`reCAPTCHA score too low: ${data.score}`)
      return {
        success: false,
        score: data.score,
        error: 'Suspicious activity detected. Please try again.',
      }
    }

    // Optionally validate the action
    if (expectedAction && data.action !== expectedAction) {
      console.warn(`reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`)
      return {
        success: false,
        error: 'Invalid reCAPTCHA action',
      }
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return {
      success: false,
      error: 'Failed to verify reCAPTCHA',
    }
  }
}

/**
 * Middleware helper for API routes
 * Returns an error response if verification fails, or null if successful
 * @param {Request} request - The Next.js request object
 * @param {string} expectedAction - The expected action name
 * @returns {Promise<Response|null>}
 */
export async function requireRecaptcha(body, expectedAction = null) {
  const { recaptchaToken } = body

  const result = await verifyRecaptcha(recaptchaToken, expectedAction)

  if (!result.success && !result.skipped) {
    return {
      error: result.error || 'reCAPTCHA verification failed',
      status: 400,
    }
  }

  return null // Verification passed
}
