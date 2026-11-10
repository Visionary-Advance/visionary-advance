-- Draft status + source tracking for SEO plans (see seo/CLAUDE.md).
-- Claude's monthly runs save plans as 'draft'. Brandon approves a draft in /admin/seo,
-- which archives the current active plan and promotes the draft.
-- Safe to re-run.

alter table seo_plans drop constraint if exists seo_plans_status_check;
alter table seo_plans add constraint seo_plans_status_check
  check (status in ('draft', 'active', 'archived'));

alter table seo_plans
  add column if not exists generated_by text not null default 'gemini',
  add column if not exists run_meta jsonb not null default '{}'::jsonb;

alter table seo_plans drop constraint if exists seo_plans_generated_by_check;
alter table seo_plans add constraint seo_plans_generated_by_check
  check (generated_by in ('gemini', 'claude', 'manual'));

comment on column seo_plans.generated_by is 'Who produced the plan: gemini (Generate Plan button), claude (seo-monthly-run), manual';
comment on column seo_plans.run_meta     is 'Run details: data windows, row counts, token cost, report path';

-- At most one draft per site at a time.
create unique index if not exists seo_plans_one_draft_per_site
  on seo_plans (site_id) where status = 'draft';
