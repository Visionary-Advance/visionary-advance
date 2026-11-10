-- Ship button: per-task GitHub Action that opens a PR (see seo/CLAUDE.md, Phase 2b).
-- Safe to re-run.

alter table seo_sites
  add column if not exists github_repo text,                      -- e.g. 'Visionary-Advance/visionary-advance'
  add column if not exists github_default_branch text not null default 'main';

alter table seo_plan_tasks
  add column if not exists ship_status text,                      -- null | queued | running | pr_open | failed
  add column if not exists ship_branch text,
  add column if not exists pr_url text,
  add column if not exists ship_run_url text,
  add column if not exists ship_error text,
  add column if not exists ship_requested_at timestamptz,
  add column if not exists ship_updated_at timestamptz;

alter table seo_plan_tasks drop constraint if exists seo_plan_tasks_ship_status_check;
alter table seo_plan_tasks add constraint seo_plan_tasks_ship_status_check
  check (ship_status is null or ship_status in ('queued', 'running', 'pr_open', 'failed'));

-- Repos for the current SEO clients (all default branch main as of 2026-11-09).
update seo_sites set github_repo = 'Visionary-Advance/visionary-advance' where site_url = 'sc-domain:visionaryadvance.com' and github_repo is null;
update seo_sites set github_repo = 'Visionary-Advance/three-peaks'      where site_url = 'sc-domain:threepeakstreeservice.com' and github_repo is null;
update seo_sites set github_repo = 'Visionary-Advance/anco'             where site_url = 'sc-domain:ancofastenersales.com' and github_repo is null;
update seo_sites set github_repo = 'Visionary-Advance/nw-hazmat'        where site_url = 'sc-domain:nwhazmat.com' and github_repo is null;
update seo_sites set github_repo = 'Visionary-Advance/patrick'          where site_url = 'sc-domain:patrickfire.com' and github_repo is null;
update seo_sites set github_repo = 'Visionary-Advance/kings'            where site_url = 'sc-domain:kingsasianmarket.com' and github_repo is null;
