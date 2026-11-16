// Components/ReCaptchaBadgeControl.jsx
// Hides the Google reCAPTCHA badge on admin + login routes. The badge is
// injected into the DOM by Google's script and persists across client-side
// navigation even after ReCaptchaScript unmounts, so we hide it with CSS
// based on the current route.

'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const STYLE_ID = 'hide-grecaptcha-badge'

export default function ReCaptchaBadgeControl() {
  const pathname = usePathname()

  useEffect(() => {
    const hide = pathname?.startsWith('/admin') || pathname === '/login'
    let el = document.getElementById(STYLE_ID)

    if (hide && !el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      el.textContent =
        '.grecaptcha-badge{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}'
      document.head.appendChild(el)
    } else if (!hide && el) {
      el.remove()
    }
  }, [pathname])

  return null
}
