// lib/sanity.js
// Main Sanity client and GROQ query functions

import { client, previewClient } from '@/sanity/lib/client';
import { urlForImage, getImageDimensions } from '@/sanity/lib/image';

// Re-export utilities for convenience
export { urlForImage, getImageDimensions };

/**
 * Get client based on preview mode
 */
function getClient(preview = false) {
  return preview ? previewClient : client;
}

// ========================================
// GROQ QUERIES
// ========================================

// Post projection - common fields used across queries
const postProjection = `
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  excerpt,
  publishedAt,
  featured,
  mainImage {
    asset->,
    alt,
    caption,
    attribution
  },
  author->{
    _id,
    name,
    slug,
    image {
      asset->,
      alt
    },
    bio
  },
  categories[]->{
    _id,
    title,
    slug,
    icon,
    color
  },
  tags[]->{
    _id,
    title,
    slug
  },
  series->{
    _id,
    title,
    slug
  },
  seriesOrder,
  seo
`;

// ========================================
// POST QUERIES
// ========================================

/**
 * Get all published posts
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of posts to return
 * @param {number} options.offset - Offset for pagination
 * @param {boolean} options.preview - Include draft posts
 * @returns {Promise<Array>} - Array of posts
 */
export async function getAllPosts({ limit = 100, offset = 0, preview = false } = {}) {
  const query = `*[_type == "post" && publishedAt < now()] | order(publishedAt desc) [${offset}...${offset + limit}] {
    ${postProjection}
  }`;

  return await getClient(preview).fetch(query);
}

/**
 * Get a single post by slug
 * @param {string} slug - Post slug
 * @param {boolean} preview - Include draft posts
 * @returns {Promise<Object>} - Post object
 */
export async function getPostBySlug(slug, preview = false) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    ${postProjection},
    body,
    "headings": body[style in ["h2", "h3"]]{
      style,
      "text": children[0].text
    },
    relatedPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      mainImage {
        asset->,
        alt
      },
      publishedAt,
      categories[]->{
        title,
        slug,
        color
      }
    }
  }`;

  const post = await getClient(preview).fetch(query, { slug });

  if (!post) {
    return null;
  }

  // Calculate read time (average 200 words per minute)
  if (post.body) {
    const wordCount = post.body
      .filter(block => block._type === 'block')
      .reduce((count, block) => {
        const text = block.children?.map(child => child.text).join(' ') || '';
        return count + text.split(/\s+/).length;
      }, 0);

    post.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  return post;
}

/**
 * Get posts by category
 * @param {string} categorySlug - Category slug
 * @param {number} limit - Number of posts
 * @param {boolean} preview - Include draft posts
 * @returns {Promise<Array>} - Array of posts
 */
export async function getPostsByCategory(categorySlug, limit = 12, preview = false) {
  const query = `*[_type == "post" && references(*[_type=="category" && slug.current == $categorySlug]._id) && publishedAt < now()] | order(publishedAt desc) [0...${limit}] {
    ${postProjection}
  }`;

  return await getClient(preview).fetch(query, { categorySlug });
}

/**
 * Get posts by tag
 * @param {string} tagSlug - Tag slug
 * @param {number} limit - Number of posts
 * @param {boolean} preview - Include draft posts
 * @returns {Promise<Array>} - Array of posts
 */
export async function getPostsByTag(tagSlug, limit = 12, preview = false) {
  const query = `*[_type == "post" && references(*[_type=="tag" && slug.current == $tagSlug]._id) && publishedAt < now()] | order(publishedAt desc) [0...${limit}] {
    ${postProjection}
  }`;

  return await getClient(preview).fetch(query, { tagSlug });
}

/**
 * Get posts by series
 * @param {string} seriesSlug - Series slug
 * @param {boolean} preview - Include draft posts
 * @returns {Promise<Array>} - Array of posts ordered by seriesOrder
 */
export async function getPostsBySeries(seriesSlug, preview = false) {
  const query = `*[_type == "post" && series->slug.current == $seriesSlug && publishedAt < now()] | order(seriesOrder asc) {
    ${postProjection}
  }`;

  return await getClient(preview).fetch(query, { seriesSlug });
}

/**
 * Get related posts based on shared categories/tags
 * @param {string} postId - Current post ID
 * @param {Array} categoryRefs - Array of category IDs
 * @param {Array} tagRefs - Array of tag IDs
 * @param {number} limit - Number of posts to return
 * @returns {Promise<Array>} - Array of related posts
 */
export async function getRelatedPosts(postId, categoryRefs = [], tagRefs = [], limit = 3) {
  if (!categoryRefs.length && !tagRefs.length) {
    return [];
  }

  const query = `*[
    _type == "post"
    && _id != $postId
    && publishedAt < now()
    && (
      count((categories[]._ref)[@ in $categoryRefs]) > 0
      || count((tags[]._ref)[@ in $tagRefs]) > 0
    )
  ] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset->,
      alt
    },
    publishedAt,
    categories[]->{
      title,
      slug,
      color
    }
  }`;

  return await client.fetch(query, { postId, categoryRefs, tagRefs });
}

/**
 * Get featured posts
 * @param {number} limit - Number of posts
 * @returns {Promise<Array>} - Array of featured posts
 */
export async function getFeaturedPosts(limit = 3) {
  const query = `*[_type == "post" && featured == true && publishedAt < now()] | order(publishedAt desc) [0...${limit}] {
    ${postProjection}
  }`;

  return await client.fetch(query);
}

/**
 * Get total post count
 * @returns {Promise<number>} - Total number of published posts
 */
export async function getPostCount() {
  const query = `count(*[_type == "post" && publishedAt < now()])`;
  return await client.fetch(query);
}

// ========================================
// CATEGORY QUERIES
// ========================================

/**
 * Get all categories
 * @returns {Promise<Array>} - Array of categories
 */
export async function getAllCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    "postCount": count(*[_type == "post" && references(^._id) && publishedAt < now()])
  }`;

  return await client.fetch(query);
}

/**
 * Get category by slug
 * @param {string} slug - Category slug
 * @returns {Promise<Object>} - Category object
 */
export async function getCategoryBySlug(slug) {
  const query = `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    seo,
    "postCount": count(*[_type == "post" && references(^._id) && publishedAt < now()])
  }`;

  return await client.fetch(query, { slug });
}

// ========================================
// TAG QUERIES
// ========================================

/**
 * Get all tags
 * @returns {Promise<Array>} - Array of tags
 */
export async function getAllTags() {
  const query = `*[_type == "tag"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "postCount": count(*[_type == "post" && references(^._id) && publishedAt < now()])
  }`;

  return await client.fetch(query);
}

/**
 * Get tag by slug
 * @param {string} slug - Tag slug
 * @returns {Promise<Object>} - Tag object
 */
export async function getTagBySlug(slug) {
  const query = `*[_type == "tag" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    "postCount": count(*[_type == "post" && references(^._id) && publishedAt < now()])
  }`;

  return await client.fetch(query, { slug });
}

// ========================================
// SERIES QUERIES
// ========================================

/**
 * Get all series
 * @returns {Promise<Array>} - Array of series
 */
export async function getAllSeries() {
  const query = `*[_type == "series"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    coverImage {
      asset->,
      alt
    },
    seo,
    "postCount": count(*[_type == "post" && references(^._id) && publishedAt < now()])
  }`;

  return await client.fetch(query);
}

/**
 * Get series by slug
 * @param {string} slug - Series slug
 * @returns {Promise<Object>} - Series object
 */
export async function getSeriesBySlug(slug) {
  const query = `*[_type == "series" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    coverImage {
      asset->,
      alt
    },
    seo,
    "posts": *[_type == "post" && series._ref == ^._id && publishedAt < now()] | order(seriesOrder asc) {
      _id,
      title,
      slug,
      excerpt,
      seriesOrder,
      publishedAt
    }
  }`;

  return await client.fetch(query, { slug });
}

// ========================================
// AUTHOR QUERIES
// ========================================

/**
 * Get all authors
 * @returns {Promise<Array>} - Array of authors
 */
export async function getAllAuthors() {
  const query = `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    image {
      asset->,
      alt
    },
    email,
    socialLinks,
    "postCount": count(*[_type == "post" && author._ref == ^._id && publishedAt < now()])
  }`;

  return await client.fetch(query);
}

/**
 * Get author by slug
 * @param {string} slug - Author slug
 * @returns {Promise<Object>} - Author object
 */
export async function getAuthorBySlug(slug) {
  const query = `*[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    bio,
    image {
      asset->,
      alt
    },
    email,
    socialLinks,
    "posts": *[_type == "post" && author._ref == ^._id && publishedAt < now()] | order(publishedAt desc) [0...10] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage {
        asset->,
        alt
      }
    }
  }`;

  return await client.fetch(query, { slug });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Search posts by keyword
 * @param {string} keyword - Search keyword
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} - Array of matching posts
 */
export async function searchPosts(keyword, limit = 10) {
  const query = `*[
    _type == "post"
    && publishedAt < now()
    && (
      title match $keyword
      || excerpt match $keyword
    )
  ] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset->,
      alt
    },
    publishedAt
  }`;

  return await client.fetch(query, { keyword: `*${keyword}*` });
}

/**
 * Get post slugs for generateStaticParams
 * @returns {Promise<Array>} - Array of slug objects
 */
export async function getAllPostSlugs() {
  const query = `*[_type == "post" && publishedAt < now()].slug.current`;
  const slugs = await client.fetch(query);
  return slugs.map(slug => ({ slug }));
}

/**
 * Get category slugs for generateStaticParams
 * @returns {Promise<Array>} - Array of slug objects
 */
export async function getAllCategorySlugs() {
  const query = `*[_type == "category"].slug.current`;
  const slugs = await client.fetch(query);
  return slugs.map(slug => ({ slug }));
}

/**
 * Get tag slugs for generateStaticParams
 * @returns {Promise<Array>} - Array of slug objects
 */
export async function getAllTagSlugs() {
  const query = `*[_type == "tag"].slug.current`;
  const slugs = await client.fetch(query);
  return slugs.map(slug => ({ slug }));
}

/**
 * Get series slugs for generateStaticParams
 * @returns {Promise<Array>} - Array of slug objects
 */
export async function getAllSeriesSlugs() {
  const query = `*[_type == "series"].slug.current`;
  const slugs = await client.fetch(query);
  return slugs.map(slug => ({ slug }));
}

// ========================================
// SEO UTILITIES
// ========================================

/**
 * Generate BreadcrumbList JSON-LD structured data
 * @param {Array} breadcrumbs - Array of breadcrumb items { name, url }
 * @returns {Object} - JSON-LD BreadcrumbList
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Extract headings from Portable Text body for Table of Contents
 * @param {Array} body - Portable Text body array
 * @returns {Array} - Array of heading objects { id, text, level }
 */
export function extractHeadings(body) {
  if (!body || !Array.isArray(body)) return [];

  const headings = [];

  body.forEach((block) => {
    if (block._type === 'block' && ['h2', 'h3', 'h4'].includes(block.style)) {
      const text = block.children
        ?.map((child) => child.text)
        .join('') || '';

      if (text) {
        const id = text.toLowerCase().replace(/\s+/g, '-');
        const level = parseInt(block.style.replace('h', ''));

        headings.push({ id, text, level });
      }
    }
  });

  return headings;
}
