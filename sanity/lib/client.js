// sanity/lib/client.js
// Sanity client configuration

import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-20',
  useCdn: true, // Enable CDN for fast, cached reads
  perspective: 'published', // Only return published documents
});

// Client for previewing drafts (authenticated)
export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-20',
  useCdn: false, // Don't use CDN for draft content
  token: process.env.SANITY_API_TOKEN, // Authenticated token
  perspective: 'previewDrafts', // Include draft documents
});

export default client;
