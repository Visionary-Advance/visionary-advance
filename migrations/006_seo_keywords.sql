-- migrations/006_seo_keywords.sql
-- Tracked keywords per SEO site, with plan-tier-based caps.

-- 1) Plan tier on seo_sites (basic / growth / authority)
alter table seo_sites
  add column if not exists plan_tier text not null default 'basic'
    check (plan_tier in ('basic', 'growth', 'authority'));

-- 2) Curated keyword list per site
create table if not exists seo_site_keywords (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references seo_sites(id) on delete cascade,
  keyword text not null,
  target_position integer null check (target_position is null or target_position between 1 and 100),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One keyword per site, case-insensitive
create unique index if not exists seo_site_keywords_site_keyword_idx
  on seo_site_keywords (site_id, lower(keyword));

create index if not exists seo_site_keywords_site_idx
  on seo_site_keywords (site_id, sort_order);
