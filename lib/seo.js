// lib/seo.js
// SEO metadata utilities for consistent page metadata

const SITE_URL = 'https://visionaryadvance.com'
const SITE_NAME = 'Visionary Advance'

/**
 * Generate consistent metadata for a page
 * @param {object} options - Metadata options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.path - URL path (e.g., '/contractor-systems')
 * @param {string} [options.image] - Optional OG image path
 * @returns {object} - Next.js metadata object
 */
export function generateMetadata({ title, description, path, image }) {
  const url = `${SITE_URL}${path}`
  const ogImage = image || '/Img/og-default.jpg'

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

/**
 * Generate LocalBusiness schema for systems pages
 * @param {object} options - Schema options
 * @param {string} options.pageName - Name of the page/service
 * @param {string} options.pageUrl - Full URL of the page
 * @returns {object} - JSON-LD schema object
 */
export function generateLocalBusinessSchema({ pageName, pageUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Eugene',
      addressRegion: 'OR',
      addressCountry: 'US',
    },
    areaServed: ['Eugene', 'Lane County', 'Oregon'],
    serviceOffered: [
      { '@type': 'Service', name: 'Custom Contractor Management Systems' },
      { '@type': 'Service', name: 'Inventory & Warehouse Management Systems' },
      { '@type': 'Service', name: 'Custom Analytics Dashboards' },
      { '@type': 'Service', name: 'Custom CMS Development' },
    ],
  }
}

/**
 * Generate WebPage schema
 * @param {object} options - Schema options
 * @returns {object} - JSON-LD schema object
 */
export function generateWebPageSchema({ title, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

/**
 * Generate Service schema for individual service pages
 * @param {object} options - Schema options
 * @returns {object} - JSON-LD schema object
 */
export function generateServiceSchema({ serviceName, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    url,
    provider: {
      '@type': 'LocalBusiness',
      name: SITE_NAME,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Eugene',
        addressRegion: 'OR',
        addressCountry: 'US',
      },
      areaServed: ['Eugene', 'Lane County', 'Oregon'],
    },
  }
}

/**
 * Predefined metadata for systems pages (from SYSTEMS_SEO.md)
 */
export const SYSTEMS_PAGE_META = {
  home: {
    title: 'Custom Business Systems & SEO Web Design | Eugene, OR – Visionary Advance',
    description: 'Custom-built websites, dashboards, and business systems designed around how you work. Serving Eugene & Lane County businesses.',
    path: '/',
  },
  customBusinessSystems: {
    title: 'Custom Business Systems Built Around Your Workflow | Eugene OR',
    description: 'We design custom dashboards, inventory systems, and internal software that fits your business — not the other way around.',
    path: '/custom-business-systems',
  },
  contractorSystems: {
    title: 'Custom Contractor Management Systems | Eugene & Lane County',
    description: 'Custom dashboards, job tracking, and inventory systems built for contractors. Designed around your workflow. Eugene, OR.',
    path: '/contractor-systems',
  },
  warehouseInventorySystems: {
    title: 'Custom Inventory & Warehouse Systems | Eugene, Oregon',
    description: 'Replace spreadsheets with real-time inventory dashboards and warehouse systems built specifically for your operation.',
    path: '/warehouse-inventory-systems',
  },
  customDashboardsAnalytics: {
    title: 'Custom Analytics Dashboards for Businesses | Eugene OR',
    description: 'Track operations, performance, and ROI with custom analytics dashboards built for your business systems.',
    path: '/custom-dashboards-analytics',
  },
  customCmsDevelopment: {
    title: 'Custom CMS Development for Internal Systems | Eugene OR',
    description: 'We build custom CMS platforms tailored to your business workflows — secure, scalable, and easy to manage.',
    path: '/custom-cms-development',
  },
}
