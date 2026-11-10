# SEO Automation — Visionary Advance

Monthly SEO analysis and reporting for Visionary Advance and its local small-business clients in Eugene, Oregon, run by Claude Code on top of the **existing SEO CRM** in this repo. You are working with Brandon, the owner. Read this whole file before doing anything.

## Goal

Once a month, for each client: pull Google Search Console and GA4 data, diagnose issues, write a ranked change plan sized to the client's tier, and produce a one-page client report. **A human approves every change before it ships. Nothing publishes or emails a client automatically.**

## How this fits the repo

This is not a separate system. The Next.js app already has an SEO CRM at `/admin/seo`, and Claude Code is an analysis layer that reads from it and writes plans and reports back into it. Do not build parallel storage for anything the CRM already holds.

### Source of truth (all in the **main** Supabase instance — `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`)

| Need | Where it lives | Code |
|---|---|---|
| Client (name, website, report recipients) | `crm_businesses` | `lib/businesses.js` |
| SEO site per client (GSC property, GA4 property, tier) | `seo_sites` (`site_url`, `ga4_property_id`, `plan_tier`, `business_id` → `crm_businesses`, `lead_id` → `crm_leads`) | `lib/search-console.js` |
| Money keywords (capped by tier) | `seo_keywords` | `lib/seo-keywords.js` |
| Tiers | `basic` / `growth` / `authority` (keyword caps 20 / 40 / 100) | `lib/seo-tiers.js` |
| Daily GSC cache | `seo_analytics_cache`, `seo_sitemaps`, `seo_index_coverage` | `lib/search-console.js` |
| Monthly change plan | `seo_plans` (one per site per `month`) + `seo_plan_tasks` (priority, effort, category, files_to_modify, acceptance_criteria, status) | `lib/seo-plans.js` |
| Client report | `seo_reports` (+ `seo_report_schedules`) | `lib/seo-reports.js`, `lib/seo-email.js` |
| GA4 data in the app | — | `lib/ga4.js` |

**Fields not yet in the CRM** (need a migration in Phase 1 — see task 6): GBP location, competitors, GA4 lead events, SEO notes. Add them as columns on `seo_sites`; do not create per-client YAML files.

### Two ways the data is accessed

1. **The app** uses Google OAuth: Brandon's tokens in the `google_oauth` table (`lib/google-auth.js`), keyed by `seo_sites.google_email`. Leave this alone.
2. **Claude Code** uses MCP servers authenticated by a **Google Cloud service account**, so runs work headless and don't depend on a login that expires.

### Write boundary

- Claude Code may read anywhere in the repo.
- Files it generates go in `seo/` only (`seo/reports/<site-slug>/<YYYY-MM>/`).
- Database writes are limited to **`seo_plans`, `seo_plan_tasks`, and `seo_reports`**, and only through the functions in `lib/seo-plans.js` / `lib/seo-reports.js`, or after Brandon reviews the exact rows. New reports are saved with `status = 'generated'` and are never marked sent by Claude.
- Never edit `crm_businesses`, `crm_leads`, `seo_sites`, or `seo_keywords` unless Brandon asks.
- Credentials live in `seo/secrets/`, which must be in `.gitignore` before any key file exists.

## Current phase: Phase 2 — Skills

Phase 1 (below) is complete. Phase 2 status is under "Later phases". Don't start Phase 3+ until Brandon says so.

## Phase 1 — Service-account connection (complete)

### State as of 2026-11-09

- `gsc` MCP (`mcp-server-gsc`) and `google-analytics` MCP are installed at **user** scope, both using `GOOGLE_APPLICATION_CREDENTIALS` = gcloud ADC (`%APPDATA%/gcloud/application_default_credentials.json`), GCP project `analytics-456605`.
- **Service account:** `mcp-analytics@analytics-456605.iam.gserviceaccount.com`. There is no key file. Brandon gets in by impersonation:
  ```
  gcloud auth application-default login --impersonate-service-account=mcp-analytics@analytics-456605.iam.gserviceaccount.com --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
  ```
  Impersonation still rides on Brandon's own login. Workspace reauth policy expires that login, and the MCPs then fail with `unable to impersonate ... invalid_grant / invalid_rapt` (as on 2026-11-09). Re-running the command fixes it by hand, but headless runs (Phase 5) need credentials that don't expire this way.
- **Scaffold (task 1) is done.** `seo/` was created and `seo/secrets/` is in `.gitignore` (checked with `git check-ignore`).
- **MCPs (task 5): keep the current ones.** `mcp-server-gsc` + `google-analytics-mcp` at user scope already work through the service account, so they were not switched to `AminForou/mcp-gsc`.
- **Migration (task 6):** `migrations/007_seo_sites_automation_fields.sql` was applied on 2026-11-09 through the Supabase MCP, and `updateSite()` allows the new fields.
- **Auto-send (task 2) is done.** The only active schedule (visionaryadvance.com, monthly) was set to `is_active = false` on 2026-11-09. The cron code is unchanged; keep schedules inactive until the cron is changed to notify Brandon instead of emailing clients.
- **Access (task 4) is done.** `mcp-analytics` sees all 6 `seo_sites` in GSC and all their GA4 properties.
- **GA4 IDs** are set for all 6 sites. A.N.CO uses 290210908, the property in ANCO's own GA account; ignore the duplicate 541193121 under the VA account.
- **First site (task 8) is done.** visionaryadvance.com has its GBP, competitors (bemacreative.com, oregonmarketinggroup.com, localfresh.com) and lead events (`lead_form_submit`, `book_call_submit`, `click_phone`) filled in. Clutch's Oregon directory is in `seo_notes` as a listing to watch.
- **Lead tracking gaps:** none of these events are marked as Key Events in GA4. `click_phone` fires only from `Components/Eugene/FinalCTA.jsx`, so other `tel:` links aren't tracked.
- **Verification (task 7) passed on 2026-11-09** through the user-scope MCPs: GSC queries came back for visionaryadvance.com and Three Peaks, and a GA4 report came back for visionaryadvance.com. visionaryadvance.com GA4 showed 0 key events in 28 days, so lead events need marking before Phase 3's "traffic but no leads" rule means anything.

### Phase 1 tasks

1. **Scaffold** `seo/` (structure below) and add `seo/secrets/` to `.gitignore` first.
2. **Resolve auto-send.** Either deactivate the client-facing schedules (`is_active = false`) or change the cron so it generates reports and notifies Brandon instead of emailing clients. Brandon picks which.
3. **Settle credentials for `mcp-analytics@analytics-456605.iam.gserviceaccount.com`.**
   - Check that the Search Console API and the Google Analytics Data API are enabled on `analytics-456605`.
   - Try to create a JSON key and save it to `seo/secrets/gsc-service-account.json`. Org policy `iam.disableServiceAccountKeyCreation` may block this; if it does, Brandon decides whether to lift it.
   - Without a key, keep using impersonation for manual runs and solve headless auth in Phase 5.
   - Never print key contents.
4. **Grant access.** Make sure the service-account email is a user (Restricted is enough) on each client's GSC property and a Viewer on each GA4 property. Check it against the `seo_sites` list.
5. **MCPs.** Keep the user-scope `gsc` (`mcp-server-gsc`) and `google-analytics`. Both read gcloud ADC, which impersonates `mcp-analytics`. If they fail with `invalid_rapt`, re-run the impersonation login above.
6. **Migration for missing fields.** Add `gbp_location TEXT`, `competitors JSONB DEFAULT '[]'`, `lead_events JSONB DEFAULT '[]'`, `seo_notes TEXT` to `seo_sites` (new file in `migrations/`), and allow them in `updateSite()`. Brandon runs the migration.
7. **Verify.** Through the MCPs, list the GSC properties the service account can see and match them against `seo_sites.site_url`. Pull the top 25 queries by clicks for the last 28 days for `sc-domain:visionaryadvance.com` and for one client, and run a GA4 report for both. Show Brandon the results.
8. **Fill the first site.** For visionaryadvance.com's `seo_sites` row, ask Brandon only for the new fields (GBP, competitors, lead events) and check that `plan_tier` and `ga4_property_id` are set.
9. **Write `seo/docs/setup-log.md`** with what was installed, versions, the service-account email, and gotchas, so the setup can be repeated.

**Phase 1 is done when** Search Console and GA4 data both come back through the service-account MCPs for visionaryadvance.com and at least one client, and the auto-send question is settled.

## `seo/` structure

```
seo/
├── CLAUDE.md            # this file, moved here once Phase 1 starts
├── reports/             # generated drafts: reports/<site-slug>/<YYYY-MM>/
├── .claude/skills/      # project-level skills (Phase 2)
├── docs/
│   └── setup-log.md
└── secrets/             # gitignored: credentials only
```

Client config lives in Supabase (`crm_businesses` + `seo_sites` + `seo_keywords`), not in files.

## Rules

- Run each client as its own session or `claude -p` call. Never load several clients' data into one context.
- Request capped data, e.g. the top 500 queries and pages, not full exports.
- Read-only by default. Site changes go through Brandon's approval first, then ship as a pull request (client repos are under `C:/Users/brand/websites/<client>/`) or a Sanity edit.
- Plan tasks map to `seo_plan_tasks` fields: `priority` high/medium/low, `estimated_effort` small/medium/large, plus `files_to_modify` and `acceptance_criteria`, so the plan shows up in `/admin/seo` as-is.
- No Ahrefs. Search Console is the main keyword source, GA4 tracks leads, and BrightLocal covers local data.
- Brandon is on the Claude Pro plan, so keep runs lean and report token cost after each run.
- Tech stack: Next.js 16, Vercel, Supabase, Sanity CMS (MCP connected), Resend for email.

## Later phases (context only, do not start yet)

- **Phase 2: Skills (built 2026-11-09, migration 008 applied, waiting on the first test run).**
  - **Reused, not reinstalled:** `seo-audit` (marketingskills v2.0.1, user scope) and `claude-seo:seo-local` (already built on Whitespark 2026). Copy them into the project only if Phase 5 runs somewhere other than this PC.
  - **Built:** `seo/.claude/skills/seo-monthly-run/`. One site per run, rules R1–R7, impact × ease scoring, writes `seo/reports/<slug>/<YYYY-MM>/plan.{json,md}`.
  - **Drafts:** `seo/scripts/save-draft-plan.mjs` validates the plan, enforces the tier cap (`PLAN_TASK_LIMITS`: basic 3 / growth 5 / authority 8) and saves `status='draft'`, `generated_by='claude'`. Claude never writes plan rows any other way.
  - **Approval:** a Draft panel in `/admin/seo` → Plan, with Approve (archives the active plan, promotes the draft) and Discard. It calls `POST /api/seo/plans/draft`, which is behind `requireAdmin`.
  - **Gemini "Generate Plan"** stays until Claude runs are trusted, then gets retired. Plans show a Claude/Gemini badge.
  - **Gemini monthly job retired (2026-11-09).** `generateReport()` (`lib/seo-reports.js`, run by the `seo-reports` cron and manual reports) used to build and save a Gemini plan, which archived the approved plan. It now reads the active plan instead.
- **Phase 2b: Ship button (built 2026-11-09).** Each code task on the active plan has a **Ship** button.
  - Flow: `POST /api/seo/plans/tasks/ship` (`requireAdmin`) → `lib/seo-ship.js` dispatches `.github/workflows/seo-ship-task.yml` in `seo_sites.github_repo` → Claude Code (Pro OAuth token) edits files → the workflow commits, pushes `seo/<id>-<slug>` and opens a PR → `POST /api/seo/ship-callback` (shared secret) records the PR → Telegram ping via n8n.
  - **Brandon merges. Nothing auto-merges.** Vercel posts the preview link on the PR.
  - Shippable = `files_to_modify` non-empty and `claude_code_prompt` set. Everything else shows "Manual task".
  - Workflow source of truth: `seo/github/seo-ship-task.yml`. Copy it into each client repo's `.github/workflows/`.
  - Task columns: `ship_status` (queued/running/pr_open/failed), `ship_branch`, `pr_url`, `ship_run_url`, `ship_error`. Migration 009.
- **Phase 3: Monthly plan rules.**
  - Flag queries with high impressions, position 4–15 and low CTR for title and meta rewrites.
  - Check for cannibalization before ever suggesting a new page.
  - Flag missing service pages.
  - Run URL inspection on pages whose clicks dropped.
  - Flag pages with high traffic and no `lead_events` as conversion problems.
  - Score each action by impact × effort and fill the plan to the site's `plan_tier`.
  - Compare against last month's `seo_plans` / `seo_keywords` positions.
- **Phase 4: Client report.** A one-page summary saved to `seo_reports` (status `generated`): leads, clicks, money-keyword positions, reviews, what was done (completed `seo_plan_tasks`), the next three actions, and what's being watched. Brandon reviews it in `/admin/seo/reports` and sends it himself.
- **Phase 5: Scheduling.** Cron on the homelab or GitHub Actions, running headless `claude -p` per site with a restricted `--allowedTools` list.
