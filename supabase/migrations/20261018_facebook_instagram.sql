-- Instagram account linked to each connected Facebook page, for /api/facebook/posts
-- Run against the main Supabase instance (NEXT_PUBLIC_SUPABASE_URL).

ALTER TABLE facebook_accounts ADD COLUMN IF NOT EXISTS instagram_account_id TEXT;
ALTER TABLE facebook_accounts ADD COLUMN IF NOT EXISTS instagram_username TEXT;
