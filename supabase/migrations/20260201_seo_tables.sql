-- SEO Data Tables for Search Console Integration
-- Run this in your Supabase instance

-- ============================================
-- SEO SITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_url VARCHAR(500) NOT NULL UNIQUE,
  display_name VARCHAR(255),
  google_email VARCHAR(255) NOT NULL, -- Links to google_oauth.email
  is_active BOOLEAN DEFAULT true,
  permission_level VARCHAR(50), -- siteOwner, siteFullUser, siteRestrictedUser, siteUnverifiedUser
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_sites_google_email ON seo_sites(google_email);
CREATE INDEX IF NOT EXISTS idx_seo_sites_is_active ON seo_sites(is_active);

-- ============================================
-- SEO ANALYTICS CACHE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES seo_sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- Metrics
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0, -- Click-through rate (0.0000 to 1.0000)
  position DECIMAL(6,2) DEFAULT 0, -- Average position

  -- Breakdown data (stored as JSONB for flexibility)
  queries JSONB, -- Top queries for the day
  pages JSONB, -- Top pages for the day
  countries JSONB, -- Country breakdown
  devices JSONB, -- Device breakdown

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_site_date UNIQUE (site_id, date)
);

CREATE INDEX IF NOT EXISTS idx_seo_analytics_site_id ON seo_analytics_cache(site_id);
CREATE INDEX IF NOT EXISTS idx_seo_analytics_date ON seo_analytics_cache(date DESC);

-- ============================================
-- SEO SITEMAPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_sitemaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES seo_sites(id) ON DELETE CASCADE,
  path VARCHAR(500) NOT NULL,
  type VARCHAR(50), -- sitemap, sitemapIndex
  is_pending BOOLEAN DEFAULT false,
  is_sitemaps_index BOOLEAN DEFAULT false,
  last_submitted TIMESTAMPTZ,
  last_downloaded TIMESTAMPTZ,
  warnings INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  contents JSONB, -- Sitemap contents breakdown
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_site_sitemap UNIQUE (site_id, path)
);

CREATE INDEX IF NOT EXISTS idx_seo_sitemaps_site_id ON seo_sitemaps(site_id);

-- ============================================
-- SEO INDEX COVERAGE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_index_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES seo_sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- Coverage counts
  valid_count INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  excluded_count INTEGER DEFAULT 0,

  -- Detailed breakdown
  issues JSONB, -- Array of issues with counts

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_site_coverage_date UNIQUE (site_id, date)
);

CREATE INDEX IF NOT EXISTS idx_seo_coverage_site_id ON seo_index_coverage(site_id);
CREATE INDEX IF NOT EXISTS idx_seo_coverage_date ON seo_index_coverage(date DESC);

-- ============================================
-- SEO DASHBOARD WIDGETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL, -- Admin user who added the widget
  widget_type VARCHAR(50) NOT NULL, -- overview, top_queries, top_pages, traffic_chart, coverage
  site_id UUID REFERENCES seo_sites(id) ON DELETE CASCADE, -- NULL for "all sites" widgets
  config JSONB DEFAULT '{}', -- Widget-specific configuration
  position INTEGER DEFAULT 0, -- Order on dashboard
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_widgets_user ON seo_dashboard_widgets(user_email);
CREATE INDEX IF NOT EXISTS idx_seo_widgets_position ON seo_dashboard_widgets(position);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE seo_sites IS 'Sites connected to Google Search Console';
COMMENT ON TABLE seo_analytics_cache IS 'Cached search analytics data from Search Console';
COMMENT ON TABLE seo_sitemaps IS 'Sitemap data from Search Console';
COMMENT ON TABLE seo_index_coverage IS 'Index coverage data from Search Console';
COMMENT ON TABLE seo_dashboard_widgets IS 'User dashboard widget preferences';
