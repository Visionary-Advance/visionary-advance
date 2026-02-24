-- Finance Module Schema Migration
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. FINANCE INCOME TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_income (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  date_paid DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'other' CHECK (payment_method IN (
    'check', 'cash', 'bank_transfer', 'paypal', 'venmo', 'zelle', 'stripe', 'square', 'other'
  )),
  type TEXT DEFAULT 'one-time' CHECK (type IN ('one-time', 'recurring')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for finance_income
CREATE INDEX IF NOT EXISTS idx_finance_income_date ON finance_income(date_paid DESC);
CREATE INDEX IF NOT EXISTS idx_finance_income_client ON finance_income(client_name);
CREATE INDEX IF NOT EXISTS idx_finance_income_created ON finance_income(created_at DESC);

-- ============================================
-- 2. FINANCE EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN (
    'advertising', 'car_and_truck', 'commissions', 'contract_labor',
    'depletion', 'depreciation', 'employee_benefits', 'insurance',
    'interest_mortgage', 'interest_other', 'legal_professional',
    'office_expense', 'pension_profit_sharing', 'rent_lease_vehicles',
    'rent_lease_property', 'repairs_maintenance', 'supplies',
    'taxes_licenses', 'travel', 'meals', 'utilities',
    'wages', 'other_expenses'
  )),
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for finance_expenses
CREATE INDEX IF NOT EXISTS idx_finance_expenses_date ON finance_expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_category ON finance_expenses(category);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_created ON finance_expenses(created_at DESC);

-- ============================================
-- 3. FINANCE QUARTERLY PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_quarterly_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quarter INTEGER NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
  year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
  amount_due NUMERIC(12,2) DEFAULT 0,
  amount_paid NUMERIC(12,2) DEFAULT 0,
  date_paid DATE,
  status TEXT DEFAULT 'due' CHECK (status IN ('due', 'paid', 'overpaid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quarter, year)
);

-- Indexes for finance_quarterly_payments
CREATE INDEX IF NOT EXISTS idx_finance_quarterly_year ON finance_quarterly_payments(year, quarter);

-- ============================================
-- 4. FINANCE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  federal_bracket NUMERIC(5,2) DEFAULT 22.00,
  state_rate NUMERIC(5,2) DEFAULT 9.00,
  state_name TEXT DEFAULT 'Oregon',
  se_tax_rate NUMERIC(5,2) DEFAULT 15.30,
  se_tax_base NUMERIC(5,2) DEFAULT 92.35,
  tax_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TRIGGERS
-- ============================================

-- Reuse the existing update_updated_at_column() function from CRM migration

DROP TRIGGER IF EXISTS update_finance_income_updated_at ON finance_income;
CREATE TRIGGER update_finance_income_updated_at
  BEFORE UPDATE ON finance_income
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_finance_expenses_updated_at ON finance_expenses;
CREATE TRIGGER update_finance_expenses_updated_at
  BEFORE UPDATE ON finance_expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_finance_quarterly_updated_at ON finance_quarterly_payments;
CREATE TRIGGER update_finance_quarterly_updated_at
  BEFORE UPDATE ON finance_quarterly_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_finance_settings_updated_at ON finance_settings;
CREATE TRIGGER update_finance_settings_updated_at
  BEFORE UPDATE ON finance_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. INSERT DEFAULT SETTINGS
-- ============================================
INSERT INTO finance_settings (federal_bracket, state_rate, state_name, se_tax_rate, se_tax_base, tax_year)
VALUES (22.00, 9.00, 'Oregon', 15.30, 92.35, 2026)
ON CONFLICT DO NOTHING;
