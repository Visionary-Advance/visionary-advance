// lib/utm.js
// UTM parameter tracking utilities

/**
 * Extract UTM parameters from a URL or query string
 */
export function extractUTMParams(url) {
  try {
    const urlObj = new URL(url, 'https://example.com')
    const params = urlObj.searchParams

    return {
      utm_source: params.get('utm_source') || null,
      utm_medium: params.get('utm_medium') || null,
      utm_campaign: params.get('utm_campaign') || null,
      utm_term: params.get('utm_term') || null,
      utm_content: params.get('utm_content') || null,
    }
  } catch {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
    }
  }
}

/**
 * Extract UTM parameters from Next.js request
 * Checks URL params, cookies, and headers
 */
export function getUTMFromRequest(request) {
  // Parse from URL
  const url = new URL(request.url)
  const fromUrl = extractUTMParams(request.url)

  // Parse from referrer header
  const referrer = request.headers.get('referer') || request.headers.get('referrer') || null

  // Parse from cookies (for persisted UTM params)
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parseCookies(cookieHeader)

  // Merge: URL params take precedence over cookies
  return {
    utm_source: fromUrl.utm_source || cookies.utm_source || null,
    utm_medium: fromUrl.utm_medium || cookies.utm_medium || null,
    utm_campaign: fromUrl.utm_campaign || cookies.utm_campaign || null,
    utm_term: fromUrl.utm_term || cookies.utm_term || null,
    utm_content: fromUrl.utm_content || cookies.utm_content || null,
    referrer: referrer,
    source_url: url.pathname + url.search,
  }
}

/**
 * Parse cookies from cookie header string
 */
function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...valueParts] = cookie.trim().split('=')
    if (name) {
      cookies[name] = valueParts.join('=')
    }
  })

  return cookies
}

/**
 * Generate cookie strings for persisting UTM params
 * Returns array of Set-Cookie header values
 */
export function generateUTMCookies(utmParams) {
  const cookies = []
  const maxAge = 30 * 24 * 60 * 60 // 30 days in seconds

  const params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

  params.forEach(param => {
    if (utmParams[param]) {
      cookies.push(
        `${param}=${encodeURIComponent(utmParams[param])}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
      )
    }
  })

  return cookies
}

/**
 * Extract UTM params from form data (hidden fields)
 */
export function extractUTMFromFormData(formData) {
  // Handle both FormData objects and plain objects
  const get = (key) => {
    if (formData instanceof FormData) {
      return formData.get(key)
    }
    return formData[key]
  }

  return {
    utm_source: get('utm_source') || null,
    utm_medium: get('utm_medium') || null,
    utm_campaign: get('utm_campaign') || null,
    utm_term: get('utm_term') || null,
    utm_content: get('utm_content') || null,
    referrer: get('referrer') || null,
    source_url: get('source_url') || null,
    conversion_page: get('conversion_page') || null,
  }
}

/**
 * Check if any UTM params are present
 */
export function hasUTMParams(params) {
  return !!(params.utm_source || params.utm_medium || params.utm_campaign)
}

/**
 * Format UTM params for display
 */
export function formatUTMString(params) {
  const parts = []

  if (params.utm_source) parts.push(`Source: ${params.utm_source}`)
  if (params.utm_medium) parts.push(`Medium: ${params.utm_medium}`)
  if (params.utm_campaign) parts.push(`Campaign: ${params.utm_campaign}`)
  if (params.utm_term) parts.push(`Term: ${params.utm_term}`)
  if (params.utm_content) parts.push(`Content: ${params.utm_content}`)

  return parts.join(' | ')
}
