-- Migration: Project Tasks & Time Tracking
-- Adds tasks/checklists and time tracking to projects

-- ============================================
-- PROJECT TASKS (Checklist items)
-- ============================================
CREATE TABLE IF NOT EXISTS crm_project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES crm_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee TEXT,
  due_date DATE,
  sort_order INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  completed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_tasks_project ON crm_project_tasks(project_id);
CREATE INDEX idx_project_tasks_status ON crm_project_tasks(project_id, status);
CREATE INDEX idx_project_tasks_due ON crm_project_tasks(due_date) WHERE status != 'completed';

-- ============================================
-- TIME ENTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS crm_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES crm_projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES crm_project_tasks(id) ON DELETE SET NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_name TEXT NOT NULL,
  billable BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_time_entries_project ON crm_time_entries(project_id);
CREATE INDEX idx_time_entries_date ON crm_time_entries(entry_date DESC);
CREATE INDEX idx_time_entries_task ON crm_time_entries(task_id) WHERE task_id IS NOT NULL;

-- ============================================
-- ADD ESTIMATED HOURS TO PROJECTS
-- ============================================
ALTER TABLE crm_projects ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(10,2);
ALTER TABLE crm_projects ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);

-- ============================================
-- VIEWS
-- ============================================

-- Project time summary
CREATE OR REPLACE VIEW crm_project_time_summary AS
SELECT
  p.id AS project_id,
  p.name AS project_name,
  p.estimated_hours,
  p.hourly_rate,
  COALESCE(SUM(t.duration_minutes), 0) AS total_minutes,
  ROUND(COALESCE(SUM(t.duration_minutes), 0) / 60.0, 2) AS total_hours,
  COALESCE(SUM(CASE WHEN t.billable THEN t.duration_minutes ELSE 0 END), 0) AS billable_minutes,
  ROUND(COALESCE(SUM(CASE WHEN t.billable THEN t.duration_minutes ELSE 0 END), 0) / 60.0, 2) AS billable_hours,
  COUNT(DISTINCT t.id) AS entry_count,
  CASE
    WHEN p.estimated_hours > 0
    THEN ROUND((COALESCE(SUM(t.duration_minutes), 0) / 60.0 / p.estimated_hours) * 100, 1)
    ELSE NULL
  END AS percent_used
FROM crm_projects p
LEFT JOIN crm_time_entries t ON t.project_id = p.id
GROUP BY p.id, p.name, p.estimated_hours, p.hourly_rate;

-- Project task summary
CREATE OR REPLACE VIEW crm_project_task_summary AS
SELECT
  p.id AS project_id,
  p.name AS project_name,
  COUNT(t.id) AS total_tasks,
  COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed_tasks,
  COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) AS in_progress_tasks,
  COUNT(CASE WHEN t.status = 'pending' THEN 1 END) AS pending_tasks,
  COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'completed' THEN 1 END) AS overdue_tasks,
  CASE
    WHEN COUNT(t.id) > 0
    THEN ROUND((COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::DECIMAL / COUNT(t.id)) * 100, 1)
    ELSE 0
  END AS completion_percent
FROM crm_projects p
LEFT JOIN crm_project_tasks t ON t.project_id = p.id
GROUP BY p.id, p.name;

-- Dashboard: Overdue items across all projects
CREATE OR REPLACE VIEW crm_overdue_items AS
SELECT
  'milestone' AS item_type,
  p.id AS project_id,
  p.name AS project_name,
  p.lead_id,
  m.value->>'id' AS item_id,
  m.value->>'name' AS item_name,
  (m.value->>'due_date')::DATE AS due_date,
  CURRENT_DATE - (m.value->>'due_date')::DATE AS days_overdue
FROM crm_projects p,
LATERAL jsonb_array_elements(COALESCE(p.milestones, '[]'::jsonb)) AS m(value)
WHERE m.value->>'status' != 'completed'
  AND (m.value->>'due_date')::DATE < CURRENT_DATE
  AND p.status NOT IN ('completed', 'cancelled')

UNION ALL

SELECT
  'task' AS item_type,
  p.id AS project_id,
  p.name AS project_name,
  p.lead_id,
  t.id::TEXT AS item_id,
  t.title AS item_name,
  t.due_date,
  CURRENT_DATE - t.due_date AS days_overdue
FROM crm_project_tasks t
JOIN crm_projects p ON p.id = t.project_id
WHERE t.status != 'completed'
  AND t.due_date < CURRENT_DATE
  AND p.status NOT IN ('completed', 'cancelled')
ORDER BY days_overdue DESC;

-- Dashboard: Upcoming deadlines (next 14 days)
CREATE OR REPLACE VIEW crm_upcoming_deadlines AS
SELECT
  'milestone' AS item_type,
  p.id AS project_id,
  p.name AS project_name,
  p.lead_id,
  m.value->>'id' AS item_id,
  m.value->>'name' AS item_name,
  (m.value->>'due_date')::DATE AS due_date,
  (m.value->>'due_date')::DATE - CURRENT_DATE AS days_until
FROM crm_projects p,
LATERAL jsonb_array_elements(COALESCE(p.milestones, '[]'::jsonb)) AS m(value)
WHERE m.value->>'status' != 'completed'
  AND (m.value->>'due_date')::DATE >= CURRENT_DATE
  AND (m.value->>'due_date')::DATE <= CURRENT_DATE + INTERVAL '14 days'
  AND p.status NOT IN ('completed', 'cancelled')

UNION ALL

SELECT
  'task' AS item_type,
  p.id AS project_id,
  p.name AS project_name,
  p.lead_id,
  t.id::TEXT AS item_id,
  t.title AS item_name,
  t.due_date,
  t.due_date - CURRENT_DATE AS days_until
FROM crm_project_tasks t
JOIN crm_projects p ON p.id = t.project_id
WHERE t.status != 'completed'
  AND t.due_date >= CURRENT_DATE
  AND t.due_date <= CURRENT_DATE + INTERVAL '14 days'
  AND p.status NOT IN ('completed', 'cancelled')
ORDER BY due_date ASC;

-- Dashboard: Projects at risk
CREATE OR REPLACE VIEW crm_projects_at_risk AS
SELECT
  p.id,
  p.name,
  p.lead_id,
  p.status,
  p.budget,
  p.amount_invoiced,
  p.estimated_hours,
  p.target_end_date,
  ts.total_hours,
  ts.percent_used AS hours_percent_used,
  CASE WHEN p.budget > 0 THEN ROUND((p.amount_invoiced / p.budget) * 100, 1) ELSE NULL END AS budget_percent_used,
  CASE
    WHEN p.target_end_date < CURRENT_DATE THEN 'overdue'
    WHEN ts.percent_used > 90 THEN 'over_hours'
    WHEN p.budget > 0 AND p.amount_invoiced > p.budget THEN 'over_budget'
    WHEN (
      SELECT COUNT(*) FROM crm_project_tasks t
      WHERE t.project_id = p.id AND t.status != 'completed' AND t.due_date < CURRENT_DATE
    ) > 2 THEN 'many_overdue_tasks'
    ELSE NULL
  END AS risk_reason
FROM crm_projects p
LEFT JOIN crm_project_time_summary ts ON ts.project_id = p.id
WHERE p.status IN ('active', 'planning')
  AND (
    p.target_end_date < CURRENT_DATE
    OR ts.percent_used > 90
    OR (p.budget > 0 AND p.amount_invoiced > p.budget)
    OR (
      SELECT COUNT(*) FROM crm_project_tasks t
      WHERE t.project_id = p.id AND t.status != 'completed' AND t.due_date < CURRENT_DATE
    ) > 2
  );

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_project_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  IF NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
    NEW.completed_by = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_project_task_timestamp ON crm_project_tasks;
CREATE TRIGGER trigger_update_project_task_timestamp
  BEFORE UPDATE ON crm_project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_project_task_timestamp();

CREATE OR REPLACE FUNCTION update_time_entry_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_time_entry_timestamp ON crm_time_entries;
CREATE TRIGGER trigger_update_time_entry_timestamp
  BEFORE UPDATE ON crm_time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_time_entry_timestamp();
