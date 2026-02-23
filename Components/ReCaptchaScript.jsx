// Components/ReCaptchaScript.jsx
// Component to load reCAPTCHA v3 script (skipped on admin pages)

'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

export default function ReCaptchaScript() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY
  const pathname = usePathname()

  if (!siteKey || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="lazyOnload"
    />
  )
}
