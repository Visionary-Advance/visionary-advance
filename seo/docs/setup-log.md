# SEO Automation Setup Log

How the SEO automation was connected, so it can be repeated or repaired.

## 2026-11-09: Phase 1

### Credentials
- **Service account:** `mcp-analytics@analytics-456605.iam.gserviceaccount.com`. GCP project `analytics-456605`.
- **No JSON key.** Access goes through ADC **impersonation** from Brandon's Google account:
  ```
  gcloud auth application-default login --impersonate-service-account=mcp-analytics@analytics-456605.iam.gserviceaccount.com --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
  ```
  This writes `%APPDATA%\gcloud\application_default_credentials.json`, and both MCPs read that file.
- The web app (`/admin/seo`) does **not** use this. It uses Brandon's Google OAuth tokens in the `google_oauth` table (`lib/google-auth.js`).

### MCP servers (user scope, unchanged)
| Name | Command | Env |
|---|---|---|
| `gsc` | `npx -y mcp-server-gsc` | `GOOGLE_APPLICATION_CREDENTIALS` = ADC file above |
| `google-analytics` | `google-analytics-mcp` | `GOOGLE_APPLICATION_CREDENTIALS` = ADC file, `GOOGLE_CLOUD_PROJECT=analytics-456605` |

We decided not to switch to `AminForou/mcp-gsc`, because the current server already works.

### Property access (verified 2026-11-09)
`mcp-analytics` is a Restricted user on every `seo_sites` GSC property (A.N.CO is Full) and can read every GA4 property:

| Site | GSC | GA4 property |
|---|---|---|
| visionaryadvance.com | ✅ | 524740890 |
| ancofastenersales.com | ✅ (Full) | 290210908 (ANCO's own GA account; ignore 541193121 under the VA account) |
| kingsasianmarket.com | ✅ | 557182494 |
| nwhazmat.com | ✅ | 544629771 |
| patrickfire.com | ✅ | 556870845 |
| threepeakstreeservice.com | ✅ | 552660669 |

**Adding a new client:** add `mcp-analytics@analytics-456605.iam.gserviceaccount.com` as a Restricted user in GSC (Settings → Users and permissions) and as a Viewer in GA4 (Admin → Property access management). Then set `ga4_property_id` on the client's `seo_sites` row.

### Repo changes
- Created `seo/` (`reports/`, `docs/`, `.claude/skills/`, `secrets/`). Moved the plan doc to `seo/CLAUDE.md`.
- `.gitignore`: added `seo/secrets/`.
- `migrations/007_seo_sites_automation_fields.sql`: adds `gbp_location`, `competitors`, `lead_events`, `seo_notes` to `seo_sites`. **Applied 2026-11-09** through the Supabase MCP (migration name `seo_sites_automation_fields`), and the columns were checked afterwards.
- **Supabase MCP:** `claude mcp add --transport http supabase "https://mcp.supabase.com/mcp?project_ref=hdxlvrqxdwwymcemciti"`. It's in local scope and limited to the main project. Authenticate with `/mcp` → supabase → Authenticate, and restart Claude Code after adding it. It can write, so show Brandon any SQL before running it.
- `lib/search-console.js` `updateSite()`: allows the 4 new fields.

### Data changes
- Set `seo_sites.ga4_property_id` for visionaryadvance.com, nwhazmat.com and kingsasianmarket.com (filled only where it was NULL).
- Set `seo_report_schedules` id `4bd1538e-…` (visionaryadvance.com, monthly) to `is_active = false`, so no client is emailed automatically. The cron at `app/api/cron/seo-reports/route.js` still sends for any schedule that's active.

- Filled the new fields for visionaryadvance.com: `gbp_location` (Google share link), `competitors`, `lead_events` = `lead_form_submit`, `book_call_submit`, `click_phone`, and `seo_notes` (Clutch directory).

### Verification
- `gsc list_sites` returned all 6 properties.
- GSC top queries came back for visionaryadvance.com and threepeakstreeservice.com (Oct 9 – Nov 6, 2026).
- A GA4 `run_report` came back for 524740890: 96 sessions and **0 key events** over 28 days. Lead events aren't marked yet.

## 2026-11-09: Phase 2

- `migrations/008_seo_plans_draft_status.sql`: adds `draft` to the `seo_plans.status` check, `generated_by` (gemini/claude/manual, default gemini), `run_meta jsonb`, and a unique index allowing one draft per site. **Applied 2026-11-09** through the Supabase MCP and checked afterwards. The 36 existing plans defaulted to `generated_by = 'gemini'`. Deploy only after the migration, since `createPlan()` now writes `generated_by`.
- `lib/seo-tiers.js`: `PLAN_TASK_LIMITS` / `getPlanTaskCap()`.
- `lib/seo-plans.js`: `approveDraftPlan()`, `discardDraftPlan()`. `createPlan()` tags `generated_by: 'gemini'`.
- `app/api/seo/plans/draft/route.js`: approve/discard, `requireAdmin`-guarded (the first `/api/seo/*` route with server-side auth).
- `Components/Admin/SEO/SEOPlanView.jsx`: Draft panel, source badge, `local` category colour.
- `seo/scripts/save-draft-plan.mjs`: tested with `--dry-run` on a valid plan, an over-cap plan (rejected) and a malformed plan (rejected with field errors). `next build` passes.
- **Gotcha:** on Windows, `process.exit()` with open supabase-js fetch handles trips a libuv assertion (`UV_HANDLE_CLOSING`). The script sets `process.exitCode` instead.

## 2026-11-09: First real run (visionaryadvance.com)

- Draft `13d57138-309a-4f8d-93e6-bdd02fd6d458` saved (3 tasks, basic tier). The October Gemini plan stays active until the draft is approved.
- Files: `seo/reports/visionaryadvance/2026-11/plan.{json,md}`.
- Skill fixes from the run: the keywords table is `seo_site_keywords`, and GA4 sanity checks were added.
- **Noticed:** Gemini plans for this site were created on 2026-10-02 and 2026-11-02 at ~09:02 UTC, so something generates Gemini plans automatically each month. Find it before retiring Gemini, or it will keep replacing the active plan.

## 2026-11-09: Ship button (Phase 2b)

**Built:**
- Migration 009 (applied through MCP): `seo_sites.github_repo` / `github_default_branch` (all 6 sites filled, all `main`), plus ship columns on `seo_plan_tasks`.
- `lib/seo-ship.js`, `app/api/seo/plans/tasks/ship/route.js` (`requireAdmin`), `app/api/seo/ship-callback/route.js` (Bearer `SEO_SHIP_CALLBACK_SECRET`, constant-time, fails closed).
- `seo/github/seo-ship-task.yml` (template), installed at `.github/workflows/seo-ship-task.yml` in this repo.
- UI: `ShipControl` in `SEOPlanView.jsx`. It polls every 15s while a task is queued or running.
- Gemini monthly plan generation removed from `generateReport()`.
- Tested: `next build` passes. Callback returns 401 with no or wrong secret, 400 on bad body and 404 on an unknown task. Ship and draft return 401 with no admin token.

**One-time setup (Brandon):**
> **Repo secrets, not org secrets.** On the org's current GitHub plan, org secrets can't be used by private repos. Steps 1–3 go into **each of the 6 repos** (repo → Settings → Secrets and variables → Actions → Secrets). With the GitHub CLI: `gh secret set <NAME> -R Visionary-Advance/<repo>`.

1. **Claude token:** run `claude setup-token` locally, then add the repo secret `CLAUDE_CODE_OAUTH_TOKEN`. It uses the Pro subscription, and each Ship run counts against Pro limits.
2. **Callback secret:** generate a random string. Add it as the repo secret `SEO_SHIP_CALLBACK_SECRET` (the same value in every repo) **and** as the Vercel env var `SEO_SHIP_CALLBACK_SECRET`.
3. **Callback URL:** add the repo secret `SEO_SHIP_CALLBACK_URL` = `https://visionaryadvance.com/api/seo/ship-callback`.
4. **Dispatch token:** create a fine-grained PAT (resource owner Visionary-Advance, only the 6 SEO repos, permission **Actions: Read and write**) and save it as the Vercel env var `GITHUB_SEO_DISPATCH_TOKEN`.
5. **Actions settings:**
   - Allow workflows to create pull requests: Settings → Actions → General → Workflow permissions → "Allow GitHub Actions to create and approve pull requests". Set it at org level; if that has no effect, set it in each repo.
   - The Actions policy must allow `actions/checkout` and `anthropics/claude-code-action`. "Allow all actions" is simplest.
   - Leave "Require actions to be pinned to a full-length commit SHA" off until a Ship run works, because claude-code-action's internal steps may not be pinned.
6. **Workflow file:** ✅ added 2026-11-10 to `main` in three-peaks, anco, nw-hazmat, patrick and kings (and in this repo via the seo-automation merge). After changing the template, re-copy it to each repo.
7. **Deploy:** the callback must be live at visionaryadvance.com before Ship works end to end, even when clicking Ship from `npm run dev`.

**Gotchas:**
- workflow_dispatch only runs workflows that exist on the ref, so a 404 from dispatch means the file isn't on `main` yet, or the PAT can't see the repo.
- PRs opened with `GITHUB_TOKEN` don't trigger other GitHub workflows. Vercel previews still build, because Vercel uses its own GitHub app.
- Actions are **pinned to commit SHAs**: `claude-code-action` 4fa93a88… (v1.0.271) and `checkout` 11d5960a… (v4.4.0). That way a moved tag can't run different code with the Claude token. To upgrade, run `git ls-remote --tags <repo>`, update the SHA in `seo/github/seo-ship-task.yml`, then re-copy it to each repo. No `id-token` permission is needed, because `github_token` is passed directly.
- **The callback URL is `https://visionary-advance.vercel.app/api/seo/ship-callback`, not visionaryadvance.com.** The main domain sits behind Cloudflare, and Bot Fight Mode returns 403 to GitHub runners; Skip rules don't apply to it. A Vercel Firewall custom rule (path equals `/api/seo/ship-callback` → Bypass) covers Vercel's own Bot Protection. The route still requires the secret.
- **Reading callback errors in the run log:** a 403 means a firewall blocked it before the app. A 401 means the secret in GitHub doesn't match Vercel's `SEO_SHIP_CALLBACK_SECRET`; set them again together and redeploy.
- `gh secret set NAME` with no `-b` waits for you to paste the value. Pressing Enter without pasting saves a **blank** secret, which makes the action fail with "Either ANTHROPIC_API_KEY, CLAUDE_CODE_OAUTH_TOKEN… is required".
- **Testing callbacks for free:** re-run an old Ship run whose branch still exists. It stops at "Create branch" before Claude starts, and the failure callback still fires. Afterwards, set the task's `ship_status` back.
- ~~The Gemini Regenerate button archives the active plan.~~ Gone: Gemini was removed on 2026-11-11, and Regenerate now starts a Claude plan run that only writes a draft.

**Plan runs (Generate / Regenerate / Generate all), added 2026-11-11:**
- Workflow `.github/workflows/seo-plan-run.yml` lives only in **visionary-advance**; nothing gets copied to client repos.
- It reuses that repo's `CLAUDE_CODE_OAUTH_TOKEN`, `SEO_SHIP_CALLBACK_URL` (the app's base URL is taken from it, so it also uses visionary-advance.vercel.app) and `SEO_SHIP_CALLBACK_SECRET`.
- **`SEO_CLIENT_REPO_TOKEN`** is a **repo secret in visionary-advance** (org secrets don't reach private repos on this plan): a fine-grained PAT, resource owner Visionary-Advance, Contents: Read-only on three-peaks, anco, nw-hazmat, patrick and kings. Without it the client checkout fails with "Repository not found" and tasks come out without file paths (no Ship button). The token expires; renew it.
- The app routes it calls are `/api/seo/plan-runs/<id>/input` and `/api/seo/plan-runs/callback`. If Vercel's bot protection ever blocks them (403 in the run log), extend the Firewall bypass rule from `/api/seo/ship-callback` to cover `/api/seo/plan-runs/`.
- A failed run's error lists the tool calls that the permission rules blocked.

### Gotchas
- **`unable to impersonate ... invalid_grant / invalid_rapt`**: Workspace reauth policy expired Brandon's login. Re-run the impersonation command. This will block unattended runs (Phase 5) unless a JSON key is allowed or reauth is relaxed in Workspace Admin → Security → Google Cloud session control.
- On low-traffic sites most queries have 0 clicks, so they tie and the GSC MCP lists them alphabetically. Rank by impressions or position instead.
- Two Supabase URLs show up in docs, but every SEO and `crm_businesses` table is in the **main** instance.
