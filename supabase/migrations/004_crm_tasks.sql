-- Migration: CRM Tasks/Todo System
-- Global and lead-specific tasks for the CRM

-- ============================================
-- CRM TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,  -- NULL for global tasks
  business_id UUID,  -- NULL for non-business tasks, FK added below if table exists
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  task_type TEXT DEFAULT 'general' CHECK (task_type IN ('general', 'follow_up', 'call', 'email', 'meeting', 'review')),
  assignee TEXT,
  due_date DATE,
  due_time TIME,
  is_auto_created BOOLEAN DEFAULT FALSE,
  auto_task_source TEXT,  -- e.g., 'new_lead', 'stage_change'
  completed_at TIMESTAMPTZ,
  completed_by TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK constraint for business_id if crm_businesses table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crm_businesses') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'crm_tasks_business_id_fkey' AND table_name = 'crm_tasks'
    ) THEN
      ALTER TABLE crm_tasks
      ADD CONSTRAINT crm_tasks_business_id_fkey
      FOREIGN KEY (business_id) REFERENCES crm_businesses(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead ON crm_tasks(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_crm_tasks_business ON crm_tasks(business_id) WHERE business_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date) WHERE status != 'completed';
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assignee ON crm_tasks(assignee) WHERE assignee IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_crm_tasks_priority ON crm_tasks(priority, due_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_pending ON crm_tasks(due_date, priority) WHERE status = 'pending';

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update timestamps and handle completion
CREATE OR REPLACE FUNCTION update_crm_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  -- Set completed_at when status changes to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = NOW();
  END IF;

  -- Clear completed_at when status changes from completed
  IF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at = NULL;
    NEW.completed_by = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_crm_task_timestamp ON crm_tasks;
CREATE TRIGGER trigger_update_crm_task_timestamp
  BEFORE UPDATE ON crm_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_task_timestamp();

-- ============================================
-- VIEWS
-- ============================================

-- Task summary by status
CREATE OR REPLACE VIEW crm_task_summary AS
SELECT
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
  COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_count,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
  COUNT(*) FILTER (WHERE status != 'completed' AND due_date < CURRENT_DATE) AS overdue_count,
  COUNT(*) FILTER (WHERE status != 'completed' AND due_date = CURRENT_DATE) AS due_today_count,
  COUNT(*) FILTER (WHERE status != 'completed' AND due_date = CURRENT_DATE + 1) AS due_tomorrow_count,
  COUNT(*) FILTER (WHERE status != 'completed' AND due_date > CURRENT_DATE AND due_date <= CURRENT_DATE + 7) AS due_this_week_count
FROM crm_tasks;

-- ============================================
-- SUBTASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_task_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES crm_tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_task_subtasks_task ON crm_task_subtasks(task_id);

-- Trigger for subtask timestamps
CREATE OR REPLACE FUNCTION update_crm_subtask_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
    NEW.completed_at = NOW();
  END IF;
  IF NEW.is_completed = FALSE AND OLD.is_completed = TRUE THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_crm_subtask_timestamp ON crm_task_subtasks;
CREATE TRIGGER trigger_update_crm_subtask_timestamp
  BEFORE UPDATE ON crm_task_subtasks
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_subtask_timestamp();

-- ============================================
-- VIEWS
-- ============================================

-- Task overview with lead and business info
CREATE OR REPLACE VIEW crm_task_overview AS
SELECT
  t.id,
  t.title,
  t.description,
  t.status,
  t.priority,
  t.task_type,
  t.assignee,
  t.due_date,
  t.due_time,
  t.is_auto_created,
  t.auto_task_source,
  t.completed_at,
  t.completed_by,
  t.sort_order,
  t.created_at,
  t.updated_at,
  t.lead_id,
  l.full_name AS lead_name,
  l.email AS lead_email,
  l.company AS lead_company,
  l.stage AS lead_stage,
  l.is_client AS lead_is_client,
  t.business_id,
  b.name AS business_name,
  b.website AS business_website,
  CASE
    WHEN t.status = 'completed' THEN 'completed'
    WHEN t.due_date < CURRENT_DATE THEN 'overdue'
    WHEN t.due_date = CURRENT_DATE THEN 'due_today'
    WHEN t.due_date = CURRENT_DATE + 1 THEN 'due_tomorrow'
    WHEN t.due_date <= CURRENT_DATE + 7 THEN 'due_this_week'
    ELSE 'upcoming'
  END AS urgency
FROM crm_tasks t
LEFT JOIN crm_leads l ON l.id = t.lead_id
LEFT JOIN crm_businesses b ON b.id = t.business_id;
