-- SEO Reports Tables
-- Run this in your Supabase instance

-- ============================================
-- SEO REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES seo_sites(id) ON DELETE CASCADE,

  -- Report period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Summary metrics
  total_clicks INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  avg_ctr DECIMAL(5,4) DEFAULT 0,
  avg_position DECIMAL(6,2) DEFAULT 0,

  -- Comparison to previous period
  clicks_change DECIMAL(8,2), -- percentage change
  impressions_change DECIMAL(8,2),
  ctr_change DECIMAL(8,4),
  position_change DECIMAL(6,2),

  -- Recommendations and month comparison data (stored as JSONB)
  recommendations JSONB DEFAULT '{}',

  -- Report status
  status VARCHAR(20) DEFAULT 'generated', -- generated, sent, archived
  sent_to TEXT[], -- email addresses sent to
  sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_reports_site_id ON seo_reports(site_id);
CREATE INDEX IF NOT EXISTS idx_seo_reports_created_at ON seo_reports(created_at DESC);

-- ============================================
-- SEO REPORT SCHEDULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES seo_sites(id) ON DELETE CASCADE,

  -- Schedule settings
  frequency VARCHAR(20) NOT NULL DEFAULT 'weekly', -- daily, weekly, monthly
  day_of_week INTEGER, -- 0-6 for weekly (0 = Sunday)
  day_of_month INTEGER, -- 1-31 for monthly
  time_utc TIME DEFAULT '09:00:00', -- Time to send in UTC

  -- Recipients
  recipients TEXT[] NOT NULL,

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_site_schedule UNIQUE (site_id, frequency)
);

CREATE INDEX IF NOT EXISTS idx_seo_schedules_next_run ON seo_report_schedules(next_run_at) WHERE is_active = true;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE seo_reports IS 'Generated SEO reports with recommendations';
COMMENT ON TABLE seo_report_schedules IS 'Scheduled SEO report delivery settings';
