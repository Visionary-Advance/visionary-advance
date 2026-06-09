// lib/seo.js
// SEO metadata utilities for consistent page metadata

const SITE_URL = 'https://visionaryadvance.com'
const SITE_NAME = 'Visionary Advance'

// Shared default social-share image. NOTE: this is currently the logo card;
// replace with a purpose-built 1200x630 OG image at /Img/og-default.jpg when available.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/Img/VaLogo_Large.png`

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
  const ogImage = image ? `${SITE_URL}${image}` : DEFAULT_OG_IMAGE

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
          url: ogImage,
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
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

/**
 * Build Next.js metadata for a landing page from its `meta` config block
 * ({ title, description, canonical }). Ensures every landing page ships a
 * complete Open Graph + Twitter card (incl. image) and a self canonical.
 * @param {object} meta - { title, description, canonical }
 * @returns {object} - Next.js metadata object
 */
export function landingPageMetadata({ title, description, canonical }) {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
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
    title: 'Custom Business Systems & Software Development | Visionary Advance',
    description: 'Streamline operations and boost efficiency with Visionary Advance\'s custom business systems. Tailored solutions for your unique business needs. Learn more!',
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
    description: 'We build custom CMS platforms tailored to your business workflows,secure, scalable, and easy to manage.',
    path: '/custom-cms-development',
  },
  customWebsites: {
    title: 'Custom Website Design & Development | Visionary Advance Eugene OR',
    description: 'Visionary Advance offers custom website design in Eugene, Oregon. Get a hand-coded, mobile-first, fast, and SEO-optimized site with easy content management.',
    path: '/custom-websites',
  },
  seoServices: {
    title: 'SEO Services | Local & Technical SEO | Visionary Advance Eugene OR',
    description: 'Visionary Advance offers strategic SEO services in Eugene, Oregon. Boost your small business with local SEO, technical optimization, and content strategy to attract ideal clients.',
    path: '/seo-services',
  },
  hosting: {
    title: 'Managed Web Hosting & Support | Visionary Advance Eugene OR',
    description: 'Get reliable managed web hosting and website support services in Eugene, Oregon. Enjoy 99.9% uptime, SSL, and daily backups. Grow your business online.',
    path: '/hosting',
  },
}
