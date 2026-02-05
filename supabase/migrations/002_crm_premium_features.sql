-- CRM Premium Features Migration
-- Adds Stripe integration, Projects, Proposals, and Pinned Communications

-- ============================================
-- 1. STRIPE TABLES
-- ============================================

-- Stripe customer cache (links leads to Stripe customers)
CREATE TABLE IF NOT EXISTS crm_stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  customer_email TEXT,
  customer_name TEXT,
  balance INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_customers_lead ON crm_stripe_customers(lead_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_email ON crm_stripe_customers(customer_email);

-- Stripe invoices cache
CREATE TABLE IF NOT EXISTS crm_stripe_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id TEXT NOT NULL,
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  amount_due INTEGER NOT NULL,
  amount_paid INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  invoice_number TEXT,
  description TEXT,
  invoice_pdf_url TEXT,
  hosted_invoice_url TEXT,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_in_stripe TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_invoices_customer ON crm_stripe_invoices(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_lead ON crm_stripe_invoices(lead_id);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_status ON crm_stripe_invoices(status);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_created ON crm_stripe_invoices(created_in_stripe DESC);

-- ============================================
-- 2. PROJECTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS crm_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  budget DECIMAL(12,2),
  amount_invoiced DECIMAL(12,2) DEFAULT 0,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  milestones JSONB DEFAULT '[]',
  devops_site_ids UUID[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_lead ON crm_projects(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON crm_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created ON crm_projects(created_at DESC);

-- Trigger for updating updated_at on projects
DROP TRIGGER IF EXISTS update_crm_projects_updated_at ON crm_projects;
CREATE TRIGGER update_crm_projects_updated_at
  BEFORE UPDATE ON crm_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add deal_value to crm_leads if not exists
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS deal_value DECIMAL(12,2);

-- ============================================
-- 3. PROPOSALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS crm_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  project_id UUID REFERENCES crm_projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  proposal_number TEXT UNIQUE,
  content_json JSONB,
  content_html TEXT,
  total_amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  line_items JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  valid_until DATE,
  view_count INTEGER DEFAULT 0,
  public_token TEXT UNIQUE,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_lead ON crm_proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_project ON crm_proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON crm_proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_token ON crm_proposals(public_token);
CREATE INDEX IF NOT EXISTS idx_proposals_created ON crm_proposals(created_at DESC);

-- Trigger for updating updated_at on proposals
DROP TRIGGER IF EXISTS update_crm_proposals_updated_at ON crm_proposals;
CREATE TRIGGER update_crm_proposals_updated_at
  BEFORE UPDATE ON crm_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sequence for proposal numbers
CREATE SEQUENCE IF NOT EXISTS proposal_number_seq START WITH 1;

-- Function to auto-generate proposal numbers
CREATE OR REPLACE FUNCTION generate_proposal_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.proposal_number IS NULL THEN
    NEW.proposal_number := 'PRO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('proposal_number_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_proposal_number ON crm_proposals;
CREATE TRIGGER set_proposal_number
  BEFORE INSERT ON crm_proposals
  FOR EACH ROW
  EXECUTE FUNCTION generate_proposal_number();

-- ============================================
-- 4. PINNED COMMUNICATIONS
-- ============================================

-- Add pinned columns to crm_activities
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMPTZ;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS pinned_by TEXT;

-- Index for fast pinned activity queries
CREATE INDEX IF NOT EXISTS idx_activities_pinned ON crm_activities(lead_id, is_pinned, created_at DESC)
  WHERE is_pinned = true;

-- ============================================
-- 5. HELPFUL VIEWS
-- ============================================

-- Project summary view
CREATE OR REPLACE VIEW crm_project_summary AS
SELECT
  p.*,
  l.full_name as lead_name,
  l.company as lead_company,
  l.email as lead_email,
  (SELECT COUNT(*) FROM crm_proposals WHERE project_id = p.id) as proposal_count,
  (SELECT COUNT(*) FROM crm_stripe_invoices WHERE lead_id = p.lead_id) as invoice_count
FROM crm_projects p
JOIN crm_leads l ON l.id = p.lead_id;

-- Active proposals view
CREATE OR REPLACE VIEW crm_active_proposals AS
SELECT
  pr.*,
  l.full_name as lead_name,
  l.company as lead_company,
  l.email as lead_email,
  p.name as project_name
FROM crm_proposals pr
JOIN crm_leads l ON l.id = pr.lead_id
LEFT JOIN crm_projects p ON p.id = pr.project_id
WHERE pr.status NOT IN ('accepted', 'rejected', 'expired')
ORDER BY pr.created_at DESC;

-- Lead financials view
CREATE OR REPLACE VIEW crm_lead_financials AS
SELECT
  l.id as lead_id,
  l.full_name,
  l.company,
  l.deal_value,
  COALESCE(SUM(i.amount_due), 0) as total_invoiced,
  COALESCE(SUM(i.amount_paid), 0) as total_paid,
  COALESCE(SUM(CASE WHEN i.status = 'open' THEN i.amount_due ELSE 0 END), 0) as outstanding,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT pr.id) as proposal_count
FROM crm_leads l
LEFT JOIN crm_stripe_invoices i ON i.lead_id = l.id
LEFT JOIN crm_projects p ON p.lead_id = l.id
LEFT JOIN crm_proposals pr ON pr.lead_id = l.id
GROUP BY l.id, l.full_name, l.company, l.deal_value;
