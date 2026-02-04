-- CRM Schema for Visionary Advance
-- Run this in your Supabase SQL Editor for a fresh install

-- CRM Leads table with all columns
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact info
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  website TEXT,

  -- Pipeline
  stage TEXT DEFAULT 'contact',
  source TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  score_breakdown JSONB,

  -- Business info
  needs TEXT,
  budget TEXT,
  timeline TEXT,
  notes TEXT,
  business_type TEXT,
  project_type TEXT,
  budget_range TEXT,

  -- Form and audit data
  form_data JSONB DEFAULT '{}',
  audit_id TEXT,
  audit_scores JSONB,

  -- Tags
  tags TEXT[] DEFAULT '{}',

  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  source_url TEXT,
  conversion_page TEXT,

  -- External IDs
  hubspot_contact_id TEXT,
  hubspot_deal_id TEXT,

  -- Hosting tracking
  has_website BOOLEAN DEFAULT false,
  hosting_start_date DATE,
  hosting_expiry_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  stage_changed_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Activities table
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_by TEXT,
  actor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Stage History table
CREATE TABLE IF NOT EXISTS crm_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by TEXT,
  time_in_stage_seconds INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads(email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads(source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON crm_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_stage_history_lead_id ON crm_stage_history(lead_id);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS crm_leads_updated_at ON crm_leads;
CREATE TRIGGER crm_leads_updated_at
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
