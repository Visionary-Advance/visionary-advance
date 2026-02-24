-- Link finance_income to CRM clients
-- Adds client_id FK to crm_leads, backfills from client_name

-- 1. Add client_id column with FK to crm_leads
ALTER TABLE finance_income
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL;

-- 2. Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_finance_income_client_id ON finance_income(client_id);

-- 3. Backfill: match existing client_name to crm_leads.full_name where is_client=true
UPDATE finance_income fi
SET client_id = cl.id
FROM crm_leads cl
WHERE cl.full_name = fi.client_name
  AND cl.is_client = true
  AND fi.client_id IS NULL;
