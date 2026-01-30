// lib/analytics.js
// GA4 Analytics utility for tracking events

/**
 * Track a custom event in GA4
 * @param {string} eventName - The name of the event (e.g., 'lead_form_submit')
 * @param {object} params - Additional parameters to send with the event
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      send_to: process.env.NEXT_PUBLIC_GA_ID,
    })
  }
}

/**
 * Track lead form submission
 * @param {string} pagePath - The page where the form was submitted
 * @param {string} businessType - The type of business selected
 */
export function trackLeadFormSubmit(pagePath, businessType) {
  trackEvent('lead_form_submit', {
    page_path: pagePath,
    business_type: businessType,
    service_type: getServiceTypeFromPath(pagePath),
  })
}

/**
 * Track lead form error
 * @param {string} pagePath - The page where the error occurred
 * @param {string} errorMessage - Description of the error
 */
export function trackLeadFormError(pagePath, errorMessage) {
  trackEvent('lead_form_error', {
    page_path: pagePath,
    error_message: errorMessage,
  })
}

/**
 * Track CTA button clicks on systems pages
 * @param {string} pagePath - The current page path
 * @param {string} ctaText - The text/label of the CTA button
 */
export function trackCtaClick(pagePath, ctaText) {
  trackEvent('cta_click_systems', {
    page_path: pagePath,
    cta: ctaText,
    service_type: getServiceTypeFromPath(pagePath),
  })
}

/**
 * Track phone number clicks
 * @param {string} pagePath - The current page path
 */
export function trackPhoneClick(pagePath) {
  trackEvent('click_phone', {
    page_path: pagePath,
  })
}

/**
 * Track email link clicks
 * @param {string} pagePath - The current page path
 */
export function trackEmailClick(pagePath) {
  trackEvent('click_email', {
    page_path: pagePath,
  })
}

/**
 * Helper to determine service type from page path
 * @param {string} pagePath - The URL path
 * @returns {string} - The service type
 */
function getServiceTypeFromPath(pagePath) {
  if (pagePath.includes('contractor')) return 'contractor'
  if (pagePath.includes('warehouse') || pagePath.includes('inventory')) return 'warehouse'
  if (pagePath.includes('dashboard') || pagePath.includes('analytics')) return 'dashboards'
  if (pagePath.includes('cms')) return 'cms'
  if (pagePath.includes('custom-business-systems')) return 'general'
  return 'other'
}
