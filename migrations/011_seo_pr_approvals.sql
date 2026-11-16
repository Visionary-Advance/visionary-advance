-- PR approvals in DevOps: track what happens to a shipped task's PR after it opens
-- (merged, closed, or sent back with a note). See lib/devops-approvals.js.
-- Safe to re-run.

alter table seo_plan_tasks
  add column if not exists pr_number integer,
  add column if not exists merged_at timestamptz,
  add column if not exists merged_by text,
  add column if not exists review_note text;

alter table seo_plan_tasks drop constraint if exists seo_plan_tasks_ship_status_check;
alter table seo_plan_tasks add constraint seo_plan_tasks_ship_status_check
  check (ship_status is null or ship_status in (
    'queued', 'running', 'pr_open', 'failed',
    'merged', 'closed', 'changes_requested'
  ));

-- Backfill PR numbers from existing PR links
update seo_plan_tasks
   set pr_number = substring(pr_url from '/pull/([0-9]+)')::int
 where pr_url is not null and pr_number is null;

create index if not exists seo_plan_tasks_ship_status_idx on seo_plan_tasks (ship_status)
  where ship_status is not null;
