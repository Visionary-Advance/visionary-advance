// sanity/lib/image.js
// Image URL builder for Sanity CDN

import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL from Sanity image source
 * @param {Object} source - Sanity image object
 * @returns {ImageUrlBuilder} - URL builder instance
 */
export function urlForImage(source) {
  if (!source) return null;

  return builder
    .image(source)
    .auto('format') // Automatically use WebP when supported
    .quality(80); // Balance quality and file size
}

/**
 * Get image dimensions from Sanity image asset
 * @param {Object} image - Sanity image object
 * @returns {Object} - { width, height, aspectRatio }
 */
export function getImageDimensions(image) {
  if (!image?.asset?._ref) {
    return { width: 0, height: 0, aspectRatio: 0 };
  }

  const dimensions = image.asset._ref.split('-')[2];
  const [width, height] = dimensions.split('x').map(Number);

  return {
    width,
    height,
    aspectRatio: width / height,
  };
}

export default urlForImage;
