-- DevOps Monitoring Tables
-- Run this in your Supabase SQL Editor (same database as CRM)

-- Sites table
CREATE TABLE IF NOT EXISTS devops_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  api_key TEXT,
  environment TEXT DEFAULT 'production' CHECK (environment IN ('production', 'staging', 'development')),
  category TEXT,
  owner_email TEXT,
  check_interval_minutes INTEGER DEFAULT 5,
  timeout_seconds INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  ssl_check_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health checks table
CREATE TABLE IF NOT EXISTS devops_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES devops_sites(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unknown' CHECK (status IN ('healthy', 'degraded', 'down', 'unknown')),
  http_status_code INTEGER,
  response_time_ms INTEGER,
  ssl_valid BOOLEAN,
  ssl_expiry_date DATE,
  health_data JSONB,
  database_status TEXT,
  memory_usage_mb INTEGER,
  uptime_seconds BIGINT,
  version TEXT,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS devops_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES devops_sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'minor' CHECK (severity IN ('critical', 'major', 'minor', 'info')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'identified', 'monitoring', 'resolved')),
  incident_type TEXT DEFAULT 'downtime' CHECK (incident_type IN ('downtime', 'degraded_performance', 'ssl_expiring')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table (for future use - notification rules)
CREATE TABLE IF NOT EXISTS devops_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES devops_sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  threshold_value INTEGER,
  condition TEXT,
  consecutive_failures INTEGER DEFAULT 1,
  cooldown_minutes INTEGER DEFAULT 15,
  notify_slack BOOLEAN DEFAULT true,
  notify_email BOOLEAN DEFAULT false,
  notify_emails TEXT[],
  is_enabled BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_checks_site_id ON devops_health_checks(site_id);
CREATE INDEX IF NOT EXISTS idx_health_checks_checked_at ON devops_health_checks(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_checks_site_checked ON devops_health_checks(site_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_site_id ON devops_incidents(site_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON devops_incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON devops_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sites_is_active ON devops_sites(is_active);

-- Row Level Security (RLS)
-- Note: Since this uses service role key for API routes, RLS is optional
-- Enable if you want additional security layer

-- ALTER TABLE devops_sites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE devops_health_checks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE devops_incidents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE devops_alerts ENABLE ROW LEVEL SECURITY;

-- Service role can access everything
-- CREATE POLICY "Service role has full access to sites"
--   ON devops_sites FOR ALL
--   USING (auth.role() = 'service_role');

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for sites table
DROP TRIGGER IF EXISTS update_devops_sites_updated_at ON devops_sites;
CREATE TRIGGER update_devops_sites_updated_at
  BEFORE UPDATE ON devops_sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Cleanup function to remove old health checks (keep last 30 days)
-- Run as a scheduled function or manually
CREATE OR REPLACE FUNCTION cleanup_old_health_checks()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM devops_health_checks
  WHERE checked_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Optional: Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-health-checks', '0 3 * * *', 'SELECT cleanup_old_health_checks()');

COMMENT ON TABLE devops_sites IS 'Client websites monitored by DevOps dashboard';
COMMENT ON TABLE devops_health_checks IS 'Health check results for monitored sites';
COMMENT ON TABLE devops_incidents IS 'Incidents created when sites go down or degrade';
COMMENT ON TABLE devops_alerts IS 'Alert rules for notification triggers';

-- ============================================
-- Migration: Add CRM integration and monitoring fields
-- Run this section on existing databases
-- ============================================

-- New columns for devops_sites
ALTER TABLE devops_sites
ADD COLUMN IF NOT EXISTS health_url TEXT,
ADD COLUMN IF NOT EXISTS monitor_link TEXT,
ADD COLUMN IF NOT EXISTS sla_target DECIMAL(5,2) DEFAULT 99.9,
ADD COLUMN IF NOT EXISTS current_status TEXT DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS current_status_since TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS crm_lead_id UUID;

-- Index for CRM lead lookups
CREATE INDEX IF NOT EXISTS idx_devops_sites_crm_lead_id ON devops_sites(crm_lead_id);

COMMENT ON COLUMN devops_sites.health_url IS 'Custom health endpoint URL (falls back to {url}/api/health if not set)';
COMMENT ON COLUMN devops_sites.monitor_link IS 'External monitoring dashboard URL';
COMMENT ON COLUMN devops_sites.sla_target IS 'Target uptime percentage (default 99.9)';
COMMENT ON COLUMN devops_sites.current_status IS 'Denormalized status, updated on each health check';
COMMENT ON COLUMN devops_sites.current_status_since IS 'When the current status was first recorded';
COMMENT ON COLUMN devops_sites.crm_lead_id IS 'Link to CRM lead for notifications';
