-- SEO automation fields on seo_sites (see seo/CLAUDE.md).
-- Run in the Supabase SQL editor for the MAIN instance (NEXT_PUBLIC_SUPABASE_URL).
-- Safe to re-run.

alter table seo_sites
  add column if not exists gbp_location text,                    -- Google Business Profile name, CID, or Maps URL
  add column if not exists competitors  jsonb not null default '[]'::jsonb,  -- ["competitor.com", ...]
  add column if not exists lead_events  jsonb not null default '[]'::jsonb,  -- GA4 key events, e.g. ["form_submit","phone_click"]
  add column if not exists seo_notes    text;

comment on column seo_sites.gbp_location is 'Google Business Profile identifier (name, CID, or Maps URL)';
comment on column seo_sites.competitors  is 'JSON array of competitor domains';
comment on column seo_sites.lead_events  is 'JSON array of GA4 key event names that count as leads';
comment on column seo_sites.seo_notes    is 'Free-form notes for monthly SEO runs';
