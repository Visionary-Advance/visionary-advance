-- Background plan generation: each "Generate plan" click (or "Generate all") is a run.
-- The run executes in the seo-plan-run GitHub Action (Claude Code on the Pro plan),
-- so it keeps going after the admin page is closed. A finished run saves a DRAFT plan.
-- Safe to re-run.

create table if not exists seo_plan_runs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references seo_sites(id) on delete cascade,
  batch_id uuid,                                   -- shared by runs started together by "Generate all"
  status text not null default 'queued',           -- queued | running | completed | failed
  plan_id uuid references seo_plans(id) on delete set null,
  run_url text,
  error text,
  meta jsonb not null default '{}'::jsonb,         -- turns, duration, data gaps
  requested_by text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table seo_plan_runs drop constraint if exists seo_plan_runs_status_check;
alter table seo_plan_runs add constraint seo_plan_runs_status_check
  check (status in ('queued', 'running', 'completed', 'failed'));

create index if not exists seo_plan_runs_site_created_idx on seo_plan_runs (site_id, created_at desc);

-- Server-only table (service role). No policies = no anon/authenticated access.
alter table seo_plan_runs enable row level security;
