-- Migration: Add Businesses, Client fields, and SEO site linking
-- Run this in your CRM Supabase instance

-- ============================================
-- 1. Create crm_businesses table
-- ============================================
CREATE TABLE IF NOT EXISTS crm_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  notes TEXT,
  default_report_recipients TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching businesses
CREATE INDEX IF NOT EXISTS idx_crm_businesses_name ON crm_businesses(name);
CREATE INDEX IF NOT EXISTS idx_crm_businesses_created_at ON crm_businesses(created_at DESC);

-- ============================================
-- 2. Add business_id to crm_leads
-- ============================================
ALTER TABLE crm_leads
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES crm_businesses(id) ON DELETE SET NULL;

-- Index for finding leads by business
CREATE INDEX IF NOT EXISTS idx_crm_leads_business_id ON crm_leads(business_id);

-- ============================================
-- 3. Add is_client and client_since to crm_leads
-- ============================================
ALTER TABLE crm_leads
ADD COLUMN IF NOT EXISTS is_client BOOLEAN DEFAULT FALSE;

ALTER TABLE crm_leads
ADD COLUMN IF NOT EXISTS client_since TIMESTAMPTZ;

-- Index for filtering clients
CREATE INDEX IF NOT EXISTS idx_crm_leads_is_client ON crm_leads(is_client);

-- Index for sorting by client_since
CREATE INDEX IF NOT EXISTS idx_crm_leads_client_since ON crm_leads(client_since DESC NULLS LAST);

-- ============================================
-- 4. Add lead_id and business_id to seo_sites
-- (Run this in your main Supabase instance where seo_sites lives)
-- ============================================
-- NOTE: If seo_sites is in a different Supabase instance, run these separately there:

-- ALTER TABLE seo_sites
-- ADD COLUMN IF NOT EXISTS lead_id UUID;

-- ALTER TABLE seo_sites
-- ADD COLUMN IF NOT EXISTS business_id UUID;

-- CREATE INDEX IF NOT EXISTS idx_seo_sites_lead_id ON seo_sites(lead_id);
-- CREATE INDEX IF NOT EXISTS idx_seo_sites_business_id ON seo_sites(business_id);

-- ============================================
-- 5. Update existing "won" leads to be clients
-- ============================================
UPDATE crm_leads
SET is_client = TRUE,
    client_since = COALESCE(updated_at, created_at)
WHERE stage = 'won' AND is_client IS NOT TRUE;

-- ============================================
-- 6. Create updated_at trigger for businesses
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_crm_businesses_updated_at ON crm_businesses;
CREATE TRIGGER update_crm_businesses_updated_at
    BEFORE UPDATE ON crm_businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. RLS Policies for crm_businesses (if using RLS)
-- ============================================
-- Uncomment and adjust these if you have RLS enabled:

-- ALTER TABLE crm_businesses ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow authenticated read access" ON crm_businesses
--   FOR SELECT TO authenticated USING (true);

-- CREATE POLICY "Allow authenticated insert access" ON crm_businesses
--   FOR INSERT TO authenticated WITH CHECK (true);

-- CREATE POLICY "Allow authenticated update access" ON crm_businesses
--   FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- CREATE POLICY "Allow authenticated delete access" ON crm_businesses
--   FOR DELETE TO authenticated USING (true);
