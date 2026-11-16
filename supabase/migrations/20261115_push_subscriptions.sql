-- Web Push subscriptions for the admin PWA (iOS/Android/desktop).
-- Each row is one browser/device that has opted in to push notifications.
-- Accessed only server-side via the Supabase service-role key.

create table if not exists push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists push_subscriptions_created_at_idx
  on push_subscriptions (created_at desc);

-- Service-role access only (matches the rest of the CRM/DevOps tables).
alter table push_subscriptions enable row level security;
