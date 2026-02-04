-- Add ALL missing columns to existing CRM tables
-- Run this in Supabase SQL Editor if you have existing tables with missing columns

-- ============================================
-- CRM LEADS TABLE - All columns
-- ============================================

-- Contact Information
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS website TEXT;

-- Pipeline Stage
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'contact';
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS stage_changed_at TIMESTAMPTZ DEFAULT NOW();

-- Lead Scoring
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS score_breakdown JSONB DEFAULT '{"needs":0,"company_size":0,"budget":0,"timeline":0}';

-- Source Tracking
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS conversion_page TEXT;

-- UTM Parameters
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Form Data
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';

-- Business Context
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS budget_range TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS needs TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- Audit Link
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS audit_id TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS audit_scores JSONB;

-- HubSpot Sync
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS hubspot_contact_id TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS hubspot_deal_id TEXT;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS hubspot_synced_at TIMESTAMPTZ;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS hubspot_sync_status TEXT DEFAULT 'pending';

-- Status
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT FALSE;

-- Engagement Tracking
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

-- Hosting tracking
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS has_website BOOLEAN DEFAULT false;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS hosting_start_date DATE;
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS hosting_expiry_date DATE;

-- Metadata
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();


-- ============================================
-- CRM ACTIVITIES TABLE - All columns
-- ============================================

ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Stage change tracking
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS previous_stage TEXT;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS new_stage TEXT;

-- Actor information
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS actor_type TEXT DEFAULT 'system';
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS actor_name TEXT;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS created_by TEXT;

ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();


-- ============================================
-- CRM STAGE HISTORY TABLE - All columns
-- ============================================

ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS stage TEXT;
ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS from_stage TEXT;
ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS to_stage TEXT;
ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS entered_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS exited_at TIMESTAMPTZ;
ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS changed_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS changed_by TEXT;
ALTER TABLE crm_stage_history ADD COLUMN IF NOT EXISTS time_in_stage_seconds INTEGER;
