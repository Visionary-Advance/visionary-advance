// lib/useRecaptcha.js
// React hook for reCAPTCHA v3 client-side token generation

'use client'

import { useCallback, useEffect, useState } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_KEY

/**
 * Hook to use reCAPTCHA v3
 * @returns {{ executeRecaptcha: (action: string) => Promise<string|null>, isReady: boolean }}
 */
export function useRecaptcha() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if grecaptcha is already loaded
    if (typeof window !== 'undefined' && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true)
      })
      return
    }

    // Wait for script to load
    const checkReady = setInterval(() => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsReady(true)
          clearInterval(checkReady)
        })
      }
    }, 100)

    // Cleanup after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkReady)
    }, 10000)

    return () => {
      clearInterval(checkReady)
      clearTimeout(timeout)
    }
  }, [])

  const executeRecaptcha = useCallback(async (action) => {
    if (!SITE_KEY) {
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured')
      return null
    }

    if (!isReady || typeof window === 'undefined' || !window.grecaptcha) {
      console.warn('reCAPTCHA not ready')
      return null
    }

    try {
      const token = await window.grecaptcha.execute(SITE_KEY, { action })
      return token
    } catch (error) {
      console.error('reCAPTCHA execute error:', error)
      return null
    }
  }, [isReady])

  return { executeRecaptcha, isReady }
}

export default useRecaptcha
