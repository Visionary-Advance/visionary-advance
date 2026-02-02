-- SystemForge Schema Migration
-- Code Vault Infrastructure for AI-powered project scaffolding

-- ============================================
-- 1. VAULT_MODULES TABLE - Reusable code units
-- ============================================
CREATE TABLE IF NOT EXISTS vault_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('module', 'component', 'snippet')),
  category TEXT,
  industry_tags TEXT[] DEFAULT '{}',
  dependencies JSONB DEFAULT '{}',
  env_vars JSONB DEFAULT '[]',
  config_schema JSONB DEFAULT '{}',
  is_preset BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. VAULT_FILES TABLE - Code files belonging to modules
-- ============================================
CREATE TABLE IF NOT EXISTS vault_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES vault_modules(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. VAULT_RELATIONSHIPS TABLE - Module dependencies/containment
-- ============================================
CREATE TABLE IF NOT EXISTS vault_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES vault_modules(id) ON DELETE CASCADE,
  child_id UUID REFERENCES vault_modules(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('contains', 'depends_on')),
  UNIQUE(parent_id, child_id, relationship_type)
);

-- ============================================
-- 4. INDUSTRY_PRESETS TABLE - Starter templates per industry
-- ============================================
CREATE TABLE IF NOT EXISTS industry_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  questionnaire_template JSONB DEFAULT '[]',
  default_module_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. PROJECTS TABLE - Generated projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  business_name TEXT,
  industry TEXT,
  status TEXT DEFAULT 'questionnaire' CHECK (status IN (
    'questionnaire', 'selecting_features', 'configuring',
    'assembling', 'pushing', 'complete', 'error'
  )),
  business_profile JSONB DEFAULT '{}',
  branding JSONB DEFAULT '{
    "primary_color": "#000000",
    "secondary_color": "#ffffff",
    "accent_color": "#0066ff",
    "font_heading": "",
    "font_body": "",
    "logo_url": ""
  }',
  github_repo_name TEXT,
  github_repo_url TEXT,
  assembly_log JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. PROJECT_MODULES TABLE - Junction table
-- ============================================
CREATE TABLE IF NOT EXISTS project_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  module_id UUID REFERENCES vault_modules(id),
  config_overrides JSONB DEFAULT '{}',
  UNIQUE(project_id, module_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vault_modules_type ON vault_modules(type);
CREATE INDEX IF NOT EXISTS idx_vault_modules_category ON vault_modules(category);
CREATE INDEX IF NOT EXISTS idx_vault_modules_created ON vault_modules(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vault_files_module_id ON vault_files(module_id);
CREATE INDEX IF NOT EXISTS idx_vault_files_path ON vault_files(file_path);
CREATE INDEX IF NOT EXISTS idx_vault_relationships_parent ON vault_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_vault_relationships_child ON vault_relationships(child_id);
CREATE INDEX IF NOT EXISTS idx_industry_presets_industry ON industry_presets(industry);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_modules_project ON project_modules(project_id);
CREATE INDEX IF NOT EXISTS idx_project_modules_module ON project_modules(module_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vault_modules
DROP TRIGGER IF EXISTS vault_modules_updated_at ON vault_modules;
CREATE TRIGGER vault_modules_updated_at
  BEFORE UPDATE ON vault_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger for vault_files
DROP TRIGGER IF EXISTS vault_files_updated_at ON vault_files;
CREATE TRIGGER vault_files_updated_at
  BEFORE UPDATE ON vault_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger for projects
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE vault_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_modules ENABLE ROW LEVEL SECURITY;

-- Vault tables: shared across all authenticated users
CREATE POLICY "Authenticated users can manage vault_modules"
  ON vault_modules FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage vault_files"
  ON vault_files FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage vault_relationships"
  ON vault_relationships FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read industry_presets"
  ON industry_presets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage industry_presets"
  ON industry_presets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Projects: user-scoped
CREATE POLICY "Users can manage their own projects"
  ON projects FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own project_modules"
  ON project_modules FOR ALL TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Service role has full access (for API routes)
CREATE POLICY "Service role full access vault_modules"
  ON vault_modules FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access vault_files"
  ON vault_files FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access vault_relationships"
  ON vault_relationships FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access industry_presets"
  ON industry_presets FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access projects"
  ON projects FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access project_modules"
  ON project_modules FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- Module summary view
CREATE OR REPLACE VIEW vault_module_summary AS
SELECT
  type,
  COUNT(*) as count,
  COUNT(DISTINCT category) as category_count,
  SUM(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) as new_this_week
FROM vault_modules
GROUP BY type;

-- Module with file count view
CREATE OR REPLACE VIEW vault_modules_with_files AS
SELECT
  m.*,
  (SELECT COUNT(*) FROM vault_files WHERE module_id = m.id) as file_count,
  (SELECT COUNT(*) FROM vault_relationships WHERE parent_id = m.id) as child_count,
  (SELECT COUNT(*) FROM vault_relationships WHERE child_id = m.id) as parent_count
FROM vault_modules m;
