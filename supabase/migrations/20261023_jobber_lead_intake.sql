-- Jobber lead intake: client websites post their contact forms to
-- /api/integrations/jobber/lead, which creates a Client + Request in the
-- contractor's connected Jobber account (the Angi-style "lead goes straight
-- into Jobber" flow).
-- Run against the main Supabase instance (NEXT_PUBLIC_SUPABASE_URL), the same
-- one lib/jobber.js reads tokens from.

-- OAuth tokens per connected Jobber account. Already exists in production;
-- created here so a fresh database matches what lib/jobber.js expects.
CREATE TABLE IF NOT EXISTS jobber_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id TEXT NOT NULL UNIQUE,
  account_name TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE jobber_accounts ENABLE ROW LEVEL SECURITY;

-- One row per client website allowed to send leads. The site authenticates
-- with a secret key; only its SHA-256 hash is stored. Create and manage rows
-- with scripts/jobber-site.mjs.
CREATE TABLE IF NOT EXISTS jobber_lead_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  -- jobber_accounts.account_id, set when the contractor finishes the connect
  -- link. Null until then, and leads are refused.
  jobber_account_id TEXT,
  -- One-time connect invite (hash of the token in the link sent to the
  -- contractor). Cleared once used, so a leaked link can't re-point the site
  -- at a different Jobber account.
  connect_token_hash TEXT,
  connect_token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_lead_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE jobber_lead_sites ENABLE ROW LEVEL SECURITY;

-- Every lead received, whether or not it reached Jobber, so a failed push can
-- be found and re-entered by hand.
CREATE TABLE IF NOT EXISTS jobber_lead_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES jobber_lead_sites(id) ON DELETE CASCADE,
  -- sent: client + request created | duplicate: same lead resubmitted within
  -- minutes, skipped | failed: Jobber rejected it or was unreachable
  status TEXT NOT NULL CHECK (status IN ('sent', 'duplicate', 'failed')),
  phone_digits TEXT,
  service TEXT,
  lead JSONB NOT NULL,
  jobber_client_id TEXT,
  jobber_request_id TEXT,
  matched_existing_client BOOLEAN,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobber_lead_submissions_site_created_idx
  ON jobber_lead_submissions (site_id, created_at DESC);

ALTER TABLE jobber_lead_submissions ENABLE ROW LEVEL SECURITY;
