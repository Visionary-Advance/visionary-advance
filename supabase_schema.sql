-- Create website_audits table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS va_website_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  performance_score INTEGER,
  accessibility_score INTEGER,
  best_practices_score INTEGER,
  seo_score INTEGER,
  metrics JSONB,
  opportunities JSONB,
  full_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on URL for faster lookups
CREATE INDEX IF NOT EXISTS idx_website_audits_url ON website_audits(url);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_website_audits_created_at ON website_audits(created_at DESC);

-- Create index on average score (for filtering low-scoring sites)
CREATE INDEX IF NOT EXISTS idx_website_audits_avg_score ON website_audits(
  ((performance_score + accessibility_score + best_practices_score + seo_score) / 4)
);

-- Enable Row Level Security (RLS)
ALTER TABLE website_audits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert/read
CREATE POLICY "Allow service role full access" ON website_audits
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create policy to allow authenticated users to read (optional - for future dashboard)
CREATE POLICY "Allow authenticated users to read" ON website_audits
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Add comment to table
COMMENT ON TABLE website_audits IS 'Stores website audit results from the construction websites landing page';
