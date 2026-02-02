-- All database tables for Visionary Advance
-- Run this in your Supabase instance

-- ============================================
-- CRM LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact info
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company_name VARCHAR(255),

  -- Lead details
  source VARCHAR(50) DEFAULT 'website', -- website_audit, systems_form, contact_form, audit_email, manual
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, unqualified
  stage VARCHAR(50) DEFAULT 'contact', -- contact, plan_audit_meeting, discovery_call, proposal, offer, negotiating, won, lost

  -- Scoring
  score INTEGER DEFAULT 0, -- 0-100

  -- Additional data
  notes TEXT,
  needs TEXT, -- What they need (from form)
  budget VARCHAR(50),
  timeline VARCHAR(50),
  website_url VARCHAR(500),

  -- UTM tracking
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),

  -- External IDs
  hubspot_contact_id VARCHAR(100),
  hubspot_deal_id VARCHAR(100),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_contacted_at TIMESTAMPTZ,

  -- Indexes
  CONSTRAINT unique_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads(email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads(source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON crm_leads(created_at DESC);

-- ============================================
-- CRM ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,

  type VARCHAR(50) NOT NULL, -- note, email, call, meeting, stage_change, form_submission
  description TEXT,

  -- For stage changes
  old_stage VARCHAR(50),
  new_stage VARCHAR(50),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255) -- admin email or 'system'
);

CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created_at ON crm_activities(created_at DESC);

-- ============================================
-- CRM STAGE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  duration_seconds INTEGER -- calculated when exiting stage
);

CREATE INDEX IF NOT EXISTS idx_crm_stage_history_lead_id ON crm_stage_history(lead_id);

-- ============================================
-- GOOGLE OAUTH TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS google_oauth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[],
  status VARCHAR(20) DEFAULT 'active',
  error_message TEXT,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_google_oauth_email ON google_oauth(email);
CREATE INDEX IF NOT EXISTS idx_google_oauth_status ON google_oauth(status);

-- ============================================
-- ENABLE AUTH (if not already enabled)
-- ============================================
-- Make sure Supabase Auth is enabled in your project settings
-- Users table is managed by Supabase Auth automatically

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE crm_leads IS 'CRM leads/contacts';
COMMENT ON TABLE crm_activities IS 'Activity timeline for leads';
COMMENT ON TABLE crm_stage_history IS 'Track time spent in each pipeline stage';
COMMENT ON TABLE google_oauth IS 'Google OAuth tokens for Search Console API';
