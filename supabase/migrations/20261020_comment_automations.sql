-- Comment-to-DM automations for Facebook Pages and Instagram
-- Run against the main Supabase instance (NEXT_PUBLIC_SUPABASE_URL).
-- /api/meta/webhook matches new comments against these rules and sends the
-- commenter a private reply (one per comment, within 7 days of it).

CREATE TABLE IF NOT EXISTS social_comment_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  -- facebook | instagram | both
  platform TEXT NOT NULL DEFAULT 'both' CHECK (platform IN ('facebook', 'instagram', 'both')),
  -- facebook_accounts.account_id (the page ID); NULL = every connected page
  page_id TEXT,
  -- FB post ID or IG media ID; NULL = every post
  post_id TEXT,
  -- Matched case-insensitively, e.g. '{price,quote}'
  keywords TEXT[] NOT NULL,
  -- word: "price" matches "Price?" but not "priceless" | contains: any substring
  match_type TEXT NOT NULL DEFAULT 'word' CHECK (match_type IN ('word', 'contains')),
  dm_message TEXT NOT NULL,
  -- Optional public reply under the comment, e.g. 'Sent you a DM 👋'
  public_reply TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_comment_rules_active ON social_comment_rules (active);

-- One row per comment we acted on (or deliberately skipped). The unique
-- comment_id is what stops Meta's duplicate deliveries from double-DMing.
CREATE TABLE IF NOT EXISTS social_comment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram')),
  page_id TEXT NOT NULL,
  post_id TEXT,
  rule_id UUID REFERENCES social_comment_rules(id) ON DELETE SET NULL,
  commenter_id TEXT,
  commenter_name TEXT,
  comment_text TEXT,
  -- processing | sent | failed
  status TEXT NOT NULL DEFAULT 'processing',
  dm_message_id TEXT,
  public_reply_id TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_comment_events_rule ON social_comment_events (rule_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_comment_events_created ON social_comment_events (created_at DESC);

-- Only the service role (server routes) touches these
ALTER TABLE social_comment_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comment_events ENABLE ROW LEVEL SECURITY;
