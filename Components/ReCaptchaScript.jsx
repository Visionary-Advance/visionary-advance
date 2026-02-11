// Components/ReCaptchaScript.jsx
// Component to load reCAPTCHA v3 script

'use client'

import Script from 'next/script'

export default function ReCaptchaScript() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY

  if (!siteKey) {
    return null
  }

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="lazyOnload"
    />
  )
}
