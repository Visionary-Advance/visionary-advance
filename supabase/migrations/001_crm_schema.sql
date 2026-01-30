-- CRM Schema Migration
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. CRM LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact Information
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  website TEXT,

  -- Pipeline Stage
  stage TEXT DEFAULT 'contact' CHECK (stage IN (
    'contact', 'plan_audit_meeting', 'discovery_call',
    'proposal', 'offer', 'negotiating', 'won', 'lost'
  )),
  stage_changed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Lead Scoring (0-100)
  score INTEGER DEFAULT 0,
  score_breakdown JSONB DEFAULT '{"needs":0,"company_size":0,"budget":0,"timeline":0}',

  -- Source Tracking
  source TEXT NOT NULL CHECK (source IN (
    'website_audit', 'systems_form', 'contact_form', 'audit_email', 'manual'
  )),
  source_url TEXT,
  conversion_page TEXT,

  -- UTM Parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,

  -- Form Data (flexible storage)
  form_data JSONB DEFAULT '{}',

  -- Business Context
  business_type TEXT,
  project_type TEXT,
  budget_range TEXT,
  timeline TEXT,

  -- Audit Link
  audit_id UUID,
  audit_scores JSONB,

  -- HubSpot Sync
  hubspot_contact_id TEXT,
  hubspot_deal_id TEXT,
  hubspot_synced_at TIMESTAMPTZ,
  hubspot_sync_status TEXT DEFAULT 'pending' CHECK (hubspot_sync_status IN (
    'pending', 'synced', 'failed', 'skipped'
  )),

  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new', 'contacted', 'qualified', 'unqualified', 'archived'
  )),
  is_duplicate BOOLEAN DEFAULT FALSE,

  -- Engagement Tracking
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  last_contacted_at TIMESTAMPTZ,

  -- Metadata
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for crm_leads
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads(lower(email));
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads(source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_score ON crm_leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created ON crm_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_updated ON crm_leads(updated_at DESC);

-- ============================================
-- 2. CRM ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN (
    'note', 'email_sent', 'email_received', 'call', 'meeting',
    'stage_change', 'form_submission', 'audit_completed', 'hubspot_sync', 'system'
  )),

  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',

  -- Stage change tracking
  previous_stage TEXT,
  new_stage TEXT,

  -- Actor information
  actor_type TEXT DEFAULT 'system' CHECK (actor_type IN ('system', 'user', 'automation')),
  actor_name TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for crm_activities
CREATE INDEX IF NOT EXISTS idx_activities_lead ON crm_activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON crm_activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created ON crm_activities(created_at DESC);

-- ============================================
-- 3. CRM STAGE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_stage_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ
);

-- Indexes for crm_stage_history
CREATE INDEX IF NOT EXISTS idx_stage_history_lead ON crm_stage_history(lead_id, entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_stage_history_stage ON crm_stage_history(stage);

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_crm_leads_updated_at ON crm_leads;
CREATE TRIGGER update_crm_leads_updated_at
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update last_activity_at when activities are added
CREATE OR REPLACE FUNCTION update_lead_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE crm_leads
  SET last_activity_at = NOW()
  WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lead_activity_timestamp ON crm_activities;
CREATE TRIGGER update_lead_activity_timestamp
  AFTER INSERT ON crm_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_last_activity();

-- Track stage changes in history table
CREATE OR REPLACE FUNCTION track_stage_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- If stage changed
  IF OLD.stage IS DISTINCT FROM NEW.stage THEN
    -- Close out the previous stage history entry
    UPDATE crm_stage_history
    SET exited_at = NOW()
    WHERE lead_id = NEW.id
      AND stage = OLD.stage
      AND exited_at IS NULL;

    -- Create new stage history entry
    INSERT INTO crm_stage_history (lead_id, stage, entered_at)
    VALUES (NEW.id, NEW.stage, NOW());

    -- Update stage_changed_at
    NEW.stage_changed_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_lead_stage_changes ON crm_leads;
CREATE TRIGGER track_lead_stage_changes
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION track_stage_changes();

-- Create initial stage history entry on lead creation
CREATE OR REPLACE FUNCTION create_initial_stage_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO crm_stage_history (lead_id, stage, entered_at)
  VALUES (NEW.id, NEW.stage, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_lead_initial_stage ON crm_leads;
CREATE TRIGGER create_lead_initial_stage
  AFTER INSERT ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_stage_history();

-- ============================================
-- 5. ROW LEVEL SECURITY (Optional)
-- ============================================
-- Uncomment if you want to enable RLS

-- ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_stage_history ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
-- CREATE POLICY "Service role has full access to crm_leads" ON crm_leads
--   FOR ALL USING (auth.role() = 'service_role');

-- CREATE POLICY "Service role has full access to crm_activities" ON crm_activities
--   FOR ALL USING (auth.role() = 'service_role');

-- CREATE POLICY "Service role has full access to crm_stage_history" ON crm_stage_history
--   FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 6. HELPFUL VIEWS
-- ============================================

-- Pipeline summary view
CREATE OR REPLACE VIEW crm_pipeline_summary AS
SELECT
  stage,
  COUNT(*) as count,
  SUM(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) as new_this_week,
  AVG(score) as avg_score
FROM crm_leads
WHERE status NOT IN ('archived', 'unqualified')
GROUP BY stage;

-- Recent leads view
CREATE OR REPLACE VIEW crm_recent_leads AS
SELECT
  l.*,
  (SELECT COUNT(*) FROM crm_activities WHERE lead_id = l.id) as activity_count
FROM crm_leads l
ORDER BY l.created_at DESC
LIMIT 50;
