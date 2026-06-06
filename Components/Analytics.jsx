'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { Suspense, useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ADS_ID = 'AW-17658795216'

// Paths where NO analytics (GA4 or Ads) should load.
function isExcludedPath(pathname) {
  if (!pathname) return true
  return (
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname.startsWith('/connect-') ||
    pathname.startsWith('/square')
  )
}

// Normalize page_path so we don't store personalized tokens in GA4.
// e.g. /proposals/abc123 -> /proposals/[token]
function normalizePath(pathname) {
  if (pathname?.startsWith('/proposals/')) return '/proposals/[token]'
  return pathname
}

function AnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const excluded = isExcludedPath(pathname)

  // Fire a page_view on every client-side navigation (App Router does not
  // do this automatically for SPA transitions).
  useEffect(() => {
    if (excluded) return
    if (typeof window === 'undefined') return

    // Define the gtag shim if the library hasn't loaded yet. Events pushed to
    // dataLayer are processed once the lazy-loaded gtag.js library executes, so
    // the initial page_view isn't lost while the script is still loading.
    window.dataLayer = window.dataLayer || []
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments)
      }
    }

    const page_path = normalizePath(pathname)
    window.gtag('event', 'page_view', {
      page_path,
      page_location: window.location.origin + page_path,
    })
  }, [pathname, searchParams, excluded])

  if (excluded) return null

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // Disable automatic page_view; we send it manually on route change
          // so SPA navigations are tracked consistently.
          gtag('config', '${ADS_ID}', { send_page_view: false });
          ${GA_ID ? `gtag('config', '${GA_ID}', { send_page_view: false });` : ''}
        `}
      </Script>
    </>
  )
}

export default function Analytics() {
  // useSearchParams() requires a Suspense boundary in Next.js App Router.
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  )
}
