-- supabase/pocket-schema.sql
-- Pocket (HeyPocket) recording inbox.
-- Every summarized recording lands here; rows with status='unmatched' wait in
-- /admin/crm/pocket until they're assigned to a lead.

CREATE TABLE IF NOT EXISTS pocket_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pocket_recording_id TEXT NOT NULL UNIQUE,
  title TEXT,
  recorded_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  language TEXT,
  tags JSONB DEFAULT '[]',
  summary_title TEXT,
  summary_markdown TEXT,
  action_items JSONB DEFAULT '[]',
  transcript JSONB DEFAULT '[]',
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  -- unmatched | matched | dismissed
  status TEXT NOT NULL DEFAULT 'unmatched',
  -- which tag resolved the lead: tag_email | tag_lead_id | manual
  match_method TEXT,
  activity_id UUID,
  task_ids JSONB DEFAULT '[]',
  last_event TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pocket_recordings_status ON pocket_recordings(status);
CREATE INDEX IF NOT EXISTS idx_pocket_recordings_lead_id ON pocket_recordings(lead_id);
CREATE INDEX IF NOT EXISTS idx_pocket_recordings_recorded_at ON pocket_recordings(recorded_at DESC);
