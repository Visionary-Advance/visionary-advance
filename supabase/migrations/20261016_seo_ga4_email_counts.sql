-- GA4 + website email counts for the monthly SEO report
-- Run against the main Supabase instance (NEXT_PUBLIC_SUPABASE_URL).

-- Which GA4 property backs each site, e.g. '123456789' (no "properties/" prefix)
ALTER TABLE seo_sites ADD COLUMN IF NOT EXISTS ga4_property_id VARCHAR(32);

-- Inboxes the site's forms notify (e.g. 'threepeakstree@outlook.com').
-- Emails Resend sent to any of these count toward the site's monthly total.
ALTER TABLE seo_sites ADD COLUMN IF NOT EXISTS notification_emails TEXT[] NOT NULL DEFAULT '{}';

-- Daily per-site counts, snapshotted from Resend by /api/cron/resend-counts.
-- Resend only lists ~30 days of history, so this table is the long-term record.
CREATE TABLE IF NOT EXISTS seo_email_daily_counts (
  site_id UUID NOT NULL REFERENCES seo_sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sent INTEGER NOT NULL DEFAULT 0,
  delivered INTEGER NOT NULL DEFAULT 0,
  failed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (site_id, date)
);

ALTER TABLE seo_email_daily_counts ENABLE ROW LEVEL SECURITY;
