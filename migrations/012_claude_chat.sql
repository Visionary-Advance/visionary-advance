-- Claude chat (DevOps → Claude): message Claude from the admin app, get an answer or a
-- plan, approve the plan, and Claude opens a PR that waits in DevOps → Approvals.
-- Every reply comes from the claude-chat-run GitHub Action (Claude Code on the Pro plan).
-- Main Supabase instance. Server-only tables (service role). Safe to re-run.

create table if not exists claude_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'New chat',
  title_source text not null default 'auto',       -- auto (first message) | claude | user (renamed: never replaced)
  repo text not null default 'Visionary-Advance/visionary-advance',
  base_branch text not null default 'main',
  status text not null default 'open',             -- open | archived
  state text not null default 'idle',              -- idle | working | waiting (on you) | pr_open | failed
  preview text,                                    -- last message, for the thread list
  branch text,                                     -- Claude's branch while a PR is open
  pr_url text,
  pr_number int,
  pr_status text,                                  -- open | merged | closed
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

alter table claude_threads drop constraint if exists claude_threads_status_check;
alter table claude_threads add constraint claude_threads_status_check check (status in ('open', 'archived'));
alter table claude_threads drop constraint if exists claude_threads_state_check;
alter table claude_threads add constraint claude_threads_state_check
  check (state in ('idle', 'working', 'waiting', 'pr_open', 'failed'));
alter table claude_threads drop constraint if exists claude_threads_pr_status_check;
alter table claude_threads add constraint claude_threads_pr_status_check
  check (pr_status is null or pr_status in ('open', 'merged', 'closed'));

create index if not exists claude_threads_list_idx on claude_threads (status, last_message_at desc);
create index if not exists claude_threads_pr_url_idx on claude_threads (pr_url) where pr_url is not null;

create table if not exists claude_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references claude_threads(id) on delete cascade,
  role text not null,                              -- user | assistant | system
  kind text not null default 'text',               -- text | answer | question | plan | pr | error | event
  body text not null default '',
  data jsonb not null default '{}'::jsonb,         -- plan structure (+ status), PR details, run link
  run_id uuid,
  created_by text,
  created_at timestamptz not null default now()
);

alter table claude_messages drop constraint if exists claude_messages_role_check;
alter table claude_messages add constraint claude_messages_role_check check (role in ('user', 'assistant', 'system'));
alter table claude_messages drop constraint if exists claude_messages_kind_check;
alter table claude_messages add constraint claude_messages_kind_check
  check (kind in ('text', 'answer', 'question', 'plan', 'pr', 'error', 'event'));

create index if not exists claude_messages_thread_idx on claude_messages (thread_id, created_at);

create table if not exists claude_runs (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references claude_threads(id) on delete cascade,
  mode text not null,                              -- plan | execute
  status text not null default 'queued',           -- queued | running | completed | failed | cancelled
  trigger_message_id uuid references claude_messages(id) on delete set null,
  plan_message_id uuid references claude_messages(id) on delete set null,  -- execute: the approved plan
  run_url text,
  error text,
  meta jsonb not null default '{}'::jsonb,         -- stage, stage_at, branch, turns, duration
  requested_by text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table claude_runs drop constraint if exists claude_runs_mode_check;
alter table claude_runs add constraint claude_runs_mode_check check (mode in ('plan', 'execute'));
alter table claude_runs drop constraint if exists claude_runs_status_check;
alter table claude_runs add constraint claude_runs_status_check
  check (status in ('queued', 'running', 'completed', 'failed', 'cancelled'));

-- One run at a time per thread.
create unique index if not exists claude_runs_one_in_flight on claude_runs (thread_id) where status in ('queued', 'running');
create index if not exists claude_runs_thread_idx on claude_runs (thread_id, created_at desc);

do $$ begin
  alter table claude_messages add constraint claude_messages_run_fk
    foreign key (run_id) references claude_runs(id) on delete set null;
exception when duplicate_object then null; end $$;

-- No policies = no anon/authenticated access.
alter table claude_threads enable row level security;
alter table claude_messages enable row level security;
alter table claude_runs enable row level security;
