-- Migration: Add business_id to seo_sites
-- Run this in your MAIN Supabase instance (where seo_sites table lives)

-- ============================================
-- 1. Add business_id column to seo_sites
-- ============================================
ALTER TABLE seo_sites
ADD COLUMN IF NOT EXISTS business_id UUID;

-- Index for finding sites by business
CREATE INDEX IF NOT EXISTS idx_seo_sites_business_id ON seo_sites(business_id);
