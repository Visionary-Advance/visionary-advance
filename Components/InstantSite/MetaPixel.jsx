'use client'

import Script from 'next/script'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

/**
 * Meta Pixel, loaded on the ad landing page only — the rest of the site has
 * no reason to report to Meta. Inert when NEXT_PUBLIC_META_PIXEL_ID is unset.
 */
export default function MetaPixel() {
  if (!PIXEL_ID) return null
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  )
}

/**
 * Track a Pixel event. Pass the same eventId to the server's Conversions API
 * call so Meta counts it once.
 */
export function trackPixel(eventName, data = {}, eventId) {
  if (typeof window === 'undefined' || !window.fbq) return
  const standard = ['Lead', 'CompleteRegistration', 'Search', 'ViewContent', 'InitiateCheckout', 'Contact', 'CustomizeProduct']
  const method = standard.includes(eventName) ? 'track' : 'trackCustom'
  window.fbq(method, eventName, data, eventId ? { eventID: eventId } : undefined)
}

/** Browser identifiers Meta uses to match server events to ad clicks. */
export function metaBrowserIds() {
  if (typeof document === 'undefined') return {}
  const cookie = (name) => document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1]
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  return {
    fbp: cookie('_fbp') || null,
    // _fbc is set by the Pixel when it sees fbclid; build it ourselves if the
    // Pixel was blocked, in the format Meta documents.
    fbc: cookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : null),
    fbclid: fbclid || null,
  }
}
