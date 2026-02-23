-- migrations/005_seo_plans.sql
-- SEO Plans and Plan Tasks tables for standalone plan tracking

-- ============================================
-- SEO Plans
-- ============================================
CREATE TABLE IF NOT EXISTS seo_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES seo_sites(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  summary TEXT,
  goals JSONB DEFAULT '[]',
  metrics_to_track JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_plans_site_id ON seo_plans(site_id);
CREATE INDEX IF NOT EXISTS idx_seo_plans_status ON seo_plans(status);
CREATE INDEX IF NOT EXISTS idx_seo_plans_month ON seo_plans(month);

-- ============================================
-- SEO Plan Tasks
-- ============================================
CREATE TABLE IF NOT EXISTS seo_plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES seo_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT DEFAULT 'technical',
  estimated_effort TEXT DEFAULT 'medium' CHECK (estimated_effort IN ('small', 'medium', 'large')),
  files_to_modify JSONB DEFAULT '[]',
  acceptance_criteria JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_plan_tasks_plan_id ON seo_plan_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_seo_plan_tasks_status ON seo_plan_tasks(status);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE seo_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_plan_tasks ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on seo_plans"
  ON seo_plans FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on seo_plan_tasks"
  ON seo_plan_tasks FOR ALL
  USING (true)
  WITH CHECK (true);
