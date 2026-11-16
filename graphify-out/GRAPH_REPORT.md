# Graph Report - visionary-advance  (2026-11-16)

## Corpus Check
- 522 files · ~305,752 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .css 1)

## Summary
- 2896 nodes · 7236 edges · 157 communities (118 shown, 39 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d1b6d34e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- seo-ship.js
- InstantSiteFlow.jsx
- 002_crm_premium_features.sql
- leads/[id]/page.js
- ProposalEditor.jsx
- vault/[id]/page.js
- app/layout.js
- supabase-crm.js
- devops.js
- crm.js
- 20260201_seo_tables.sql
- createOrUpdateLead
- logActivity
- tasks.js
- systemforge.js
- input/route.js
- proposals.js
- package.json
- search-console.js
- with
- seo-reports.js
- sanity-boilerplate/lib/sanity.js
- admin/layout.js
- sanity
- [id]/layout.js
- react
- 20260201_systemforge_tables.sql
- jobber.js
- framer-motion
- finance.js
- 001_crm_schema.sql
- SplitText
- requireAdmin
- instant-site/start/route.js
- devops/sites/page.js
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- Components/Blog/BlogPostCard.jsx
- useAdminAuth
- app/blog/category/[slug]/page.jsx
- app/blog/[slug]/page.jsx
- dependencies
- Card
- CSVImportModal.jsx
- local/route.js
- BlogPostCard
- instant-site.js
- seo-plan-runs.js
- ga4.js
- square-auth.js
- Card
- sites/[id]/route.js
- sanity-boilerplate/Components/Blog/BlogPostContent.jsx
- compilerOptions
- google-auth.js
- works/page.jsx
- project-tasks.js
- time-tracking.js
- app/blog/series/[slug]/page.jsx
- admin-auth.js
- 20260223_finance_tables.sql
- seo-email.js
- admin/page.js
- comment-automations.js
- devops-schema.sql
- useRecaptcha
- facebook.js
- lucide-react
- devops/page.js
- github-import.js
- Components/Blog/BlogPostContent.jsx
- services/[slug]/layout.js
- projects/page.js
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- stripe-crm.js
- devops/sites/[id]/page.js
- health/route.js
- system-forge/layout.js
- crm-schema.sql
- cx
- leads/new/page.js
- seo-plan-validate.js
- system-forge/page.js
- publish-blog-drafts.mjs
- resend-stats.js
- crm/page.js
- api-health.js
- sanity-boilerplate/lib/image.js
- seo-plan-input.js
- next-sanity@^12.0.5
- contact/page.jsx
- sanity-boilerplate/schemas/index.js
- AdminAuthProvider.jsx
- google-calendar.js
- devops/layout.js
- inputs
- inputs
- react-dom
- create/route.js
- 20261020_comment_automations.sql
- supabase_schema.sql
- @react-email/render@^1.4.0
- scripts
- incidents/[id]/page.js
- steps
- @tiptap/extension-image
- pocket.js
- steps
- audit/layout.js
- data-deletion/layout.js
- privacy-policy/layout.js
- [token]/layout.js
- terms-of-service/layout.js
- works/layout.js
- compilerOptions
- 20261021_trial_signups.sql
- next.config.mjs
- workflows/seo-ship-task.yml
- lighthouse-audit/route.js
- hubspot.js
- github/seo-ship-task.yml
- @tiptap/extension-link
- @tiptap/extension-table-cell@^3.19.0
- @tiptap/starter-kit
- env
- postcss.config.mjs
- vercel.json
- env
- devDependencies
- HomeClient.jsx
- with
- with
- branch
- 20261115_push_subscriptions.sql
- task_id
- branch
- task_id
- task_title
- task_title
- affordable-small-business-website-design/page.jsx
- eugene-website-hosting/layout.js

## God Nodes (most connected - your core abstractions)
1. `next` - 243 edges
2. `react` - 146 edges
3. `cx()` - 91 edges
4. `lucide-react` - 78 edges
5. `Button()` - 52 edges
6. `supabaseCRM` - 44 edges
7. `useToast()` - 42 edges
8. `Card()` - 41 edges
9. `usePersistedState()` - 36 edges
10. `logActivity()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `SEOSitesHome()` --indirect_call--> `isRunInFlight()`  [INFERRED]
  app/admin/seo/page.js → Components/Admin/SEO/planRuns.js
- `GET()` --calls--> `verifyCronRequest()`  [EXTRACTED]
  app/api/cron/devops-alerts/route.js → lib/admin-api-auth.js
- `GET()` --calls--> `verifyCronRequest()`  [EXTRACTED]
  app/api/cron/devops-health/route.js → lib/admin-api-auth.js
- `POST()` --calls--> `performHealthCheck()`  [EXTRACTED]
  app/api/devops/sites/[id]/check/route.js → lib/devops.js
- `POST()` --calls--> `createIncident()`  [EXTRACTED]
  app/api/devops/incidents/route.js → lib/devops.js

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (157 total, 39 thin omitted)

### Community 0 - "seo-ship.js"
Cohesion: 0.22
Nodes (12): sendN8nNotification(), notify(), applyShipCallback(), buildPrompt(), dispatchShipTask(), getSupabase(), IN_FLIGHT, notify() (+4 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.07
Nodes (68): handleBookingSubmit(), FAQS, FreeTrialPage(), metadata, SpotsBanner(), FAQS, GetYourSitePage(), metadata (+60 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.06
Nodes (65): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+57 more)

### Community 4 - "ProposalEditor.jsx"
Cohesion: 0.05
Nodes (58): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), BuildingIcon(), BusinessesPage(), ChartIcon() (+50 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.07
Nodes (29): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), AddFileModal(), ArrowLeftIcon(), ModuleDetailPage() (+21 more)

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (38): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+30 more)

### Community 8 - "devops.js"
Cohesion: 0.09
Nodes (31): GET(), POST(), GET(), POST(), GET(), PATCH(), POST(), POST() (+23 more)

### Community 9 - "crm.js"
Cohesion: 0.13
Nodes (16): PATCH(), PATCH(), GET(), getPipelineStats(), SCORE_WEIGHTS, SOURCES, STAGES, toggleActivityPin() (+8 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.08
Nodes (34): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+26 more)

### Community 11 - "createOrUpdateLead"
Cohesion: 0.16
Nodes (19): POST(), POST(), POST(), resend, sendAdminNotification(), sendUserAuditEmail(), POST(), POST() (+11 more)

### Community 12 - "logActivity"
Cohesion: 0.10
Nodes (25): GET(), POST(), POST(), POST(), GET(), POST(), DELETE(), GET() (+17 more)

### Community 13 - "tasks.js"
Cohesion: 0.10
Nodes (26): DELETE(), GET(), PATCH(), DELETE(), GET(), PATCH(), POST(), GET() (+18 more)

### Community 14 - "systemforge.js"
Cohesion: 0.14
Nodes (31): DELETE(), GET(), PATCH(), GET(), POST(), DELETE(), GET(), PATCH() (+23 more)

### Community 15 - "input/route.js"
Cohesion: 0.27
Nodes (8): POST(), GET(), maxDuration, POST(), applyPlanRunCallback(), getRun(), PlanRunError, verifyRunnerSecret()

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 17 - "package.json"
Cohesion: 0.08
Nodes (23): heroicons@^2.2.0, @octokit/rest@^22.0.1, ogl@^1.0.11, @portabletext/react@^6.0.0, stripe@^20.3.0, @tiptap/extension-table-header@^3.19.0, @tiptap/extension-table-row@^3.19.0, @tiptap/pm@^3.19.0 (+15 more)

### Community 18 - "search-console.js"
Cohesion: 0.14
Nodes (33): GET(), maxDuration, GET(), DELETE(), GET(), PATCH(), POST(), POST() (+25 more)

### Community 19 - "with"
Cohesion: 0.04
Nodes (45): CALLBACK_URL, EXECUTION_FILE, HAS_TOKEN, REPO, RUN_ID, RUN_URL, RUNNER_SECRET, run_ids (+37 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.12
Nodes (31): GET(), DELETE(), GET(), POST(), POST(), DELETE(), GET(), POST() (+23 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.10
Nodes (6): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag()

### Community 22 - "admin/layout.js"
Cohesion: 0.15
Nodes (10): AdminLayout(), metadata, viewport, AdminBottomNav(), NAV, AdminScrollRestore(), isReloadOrHistoryLoad(), storageKey() (+2 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "[id]/layout.js"
Cohesion: 0.19
Nodes (26): BackgroundRuns(), Logo(), MenuLink(), NavItem(), SEOLayout(), Shell(), SidebarContent(), SiteNavItem() (+18 more)

### Community 25 - "react"
Cohesion: 0.06
Nodes (23): ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge(), PRIORITY_COLORS, TASK_TYPE_LABELS, ErrorContent() (+15 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.23
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.21
Nodes (15): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), EugeneFAQ(), EugeneTestimonials(), FinalCTA(), LocalProof(), AnimatedNumber(), LocalTrustBand() (+7 more)

### Community 29 - "finance.js"
Cohesion: 0.11
Nodes (25): GET(), POST(), validateExpenseRow(), validateIncomeRow(), GET(), getQuarterForDate(), GET(), GET() (+17 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "SplitText"
Cohesion: 0.15
Nodes (13): AboutPage(), fadeUp(), scaleIn, slideFrom(), AuditPage(), tips, services, ServicesPage() (+5 more)

### Community 32 - "requireAdmin"
Cohesion: 0.17
Nodes (14): dynamic, GET(), noStore, DELETE(), PATCH(), GET(), POST(), POST() (+6 more)

### Community 33 - "instant-site/start/route.js"
Cohesion: 0.18
Nodes (16): POST(), POST(), POST(), GET(), POST(), clientIp(), SMS_CONSENT_TEXT, waas() (+8 more)

### Community 34 - "devops/sites/page.js"
Cohesion: 0.22
Nodes (13): GridIcon(), PlusIcon(), ServerIcon(), SitesListPage(), SiteTableRow(), StatusTab(), TableIcon(), HealthTimeline() (+5 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.24
Nodes (17): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), countKeywords(), dateString() (+9 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.13
Nodes (17): GET(), sitemap(), getAllCategories(), getAllPosts(), getAllSeries(), getAllTags(), getClient(), getFeaturedPosts() (+9 more)

### Community 38 - "Components/Blog/BlogPostCard.jsx"
Cohesion: 0.25
Nodes (7): CategoryBadge(), date-fns@^4.1.0, date-fns, BlogHero(), BlogPostCard(), CategoryBadge(), RelatedPosts()

### Community 39 - "useAdminAuth"
Cohesion: 0.21
Nodes (9): ArrowLeftIcon(), EditSitePage(), ArrowLeftIcon(), NewSitePage(), useAdminAuth(), CheckIcon(), ChevronIcon(), CRMLeadSelector() (+1 more)

### Community 40 - "app/blog/category/[slug]/page.jsx"
Cohesion: 0.28
Nodes (11): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, getAllCategorySlugs(), getCategoryBySlug(), getPostsByCategory(), CategoryPage() (+3 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.21
Nodes (18): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), CTA_VARIANTS, BlogHero(), BlogPostContent() (+10 more)

### Community 42 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, framer-motion@^12.23.12, gsap@^3.13.0, @gsap/react@^2.1.2, headlessui@^0.0.0, lucide-react@^0.542.0, next@^16.0.0, papaparse@^5.5.3 (+17 more)

### Community 43 - "Card"
Cohesion: 0.13
Nodes (45): dateOf(), ExpensesPage(), dateOf(), IncomeDetailPage(), methodLabel(), dateOf(), IncomePage(), methodLabel() (+37 more)

### Community 44 - "CSVImportModal.jsx"
Cohesion: 0.16
Nodes (25): AlertIcon(), CheckIcon(), CSVImportModal(), ImportResult(), Step1Upload(), Step2Mapping(), Step3Preview(), UploadIcon() (+17 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "BlogPostCard"
Cohesion: 0.21
Nodes (17): BlogPage(), metadata, PillBadge(), revalidate, generateMetadata(), generateStaticParams(), revalidate, TagPage() (+9 more)

### Community 47 - "instant-site.js"
Cohesion: 0.20
Nodes (19): POST(), GET(), alertInstantSiteFailed(), alertInstantSiteLead(), alertInstantSiteManual(), alertInstantSiteReady(), alertInstantSiteUnlocked(), INVISIBLE (+11 more)

### Community 48 - "seo-plan-runs.js"
Cohesion: 0.40
Nodes (9): GET(), POST(), getLatestRuns(), getSupabase(), getTypicalWritingMs(), IN_FLIGHT, isStale(), present() (+1 more)

### Community 49 - "ga4.js"
Cohesion: 0.28
Nodes (13): GET(), emptyTotals(), ga4Request(), getGa4MonthlyData(), getGa4PlanData(), listGa4Properties(), listKeyEventNames(), normalizePropertyId() (+5 more)

### Community 50 - "square-auth.js"
Cohesion: 0.21
Nodes (16): GET(), POST(), dynamic, GET(), POST(), runtime, callSquareAPI(), getClientLocationId() (+8 more)

### Community 51 - "Card"
Cohesion: 0.11
Nodes (57): SEOSitesHome(), SiteRow(), SEOReportsPage(), LEGACY_TABS, PlanCard(), SiteOverviewPage(), TopTable(), SiteReportsPage() (+49 more)

### Community 53 - "sanity-boilerplate/Components/Blog/BlogPostContent.jsx"
Cohesion: 0.16
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 54 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 55 - "google-auth.js"
Cohesion: 0.17
Nodes (18): GET(), POST(), GET(), GET(), GET(), ANALYTICS_SCOPE, exchangeCodeForTokens(), generateOAuthUrl() (+10 more)

### Community 56 - "works/page.jsx"
Cohesion: 0.18
Nodes (11): categoryIcons, fadeUp(), PillBadge(), ProjectCard(), staggerContainer, WorksPage(), PillBadge(), tabs (+3 more)

### Community 57 - "project-tasks.js"
Cohesion: 0.19
Nodes (11): GET(), PATCH(), POST(), DELETE(), PATCH(), completeTask(), createTask(), deleteTask() (+3 more)

### Community 58 - "time-tracking.js"
Cohesion: 0.20
Nodes (11): GET(), POST(), DELETE(), PATCH(), createTimeEntry(), deleteTimeEntry(), getProjectTimeEntries(), getProjectTimeSummary() (+3 more)

### Community 59 - "app/blog/series/[slug]/page.jsx"
Cohesion: 0.26
Nodes (12): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), ImageGallery(), getAllSeriesSlugs(), getSeriesBySlug(), generateMetadata() (+4 more)

### Community 60 - "admin-auth.js"
Cohesion: 0.18
Nodes (22): AdminLoginPage(), authHeaders(), isStandalone(), NotificationToggle(), urlBase64ToUint8Array(), CheckIcon(), CloseIcon(), GoogleIcon() (+14 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.30
Nodes (10): breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatKeywordRow(), generateReportHtml(), generateReportText() (+2 more)

### Community 63 - "admin/page.js"
Cohesion: 0.31
Nodes (9): ACTIONS, AdminHome(), AttentionRow(), dueLabel(), greeting(), ListSkeleton(), PRIORITY_TONE, TOOLS (+1 more)

### Community 64 - "comment-automations.js"
Cohesion: 0.24
Nodes (15): POST(), escapeRegex(), extractComments(), findAccount(), findMatchingRule(), getSupabaseClient(), graphPost(), handleMetaWebhook() (+7 more)

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "useRecaptcha"
Cohesion: 0.15
Nodes (22): handleFormSubmit(), ContactForm(), projectTypes, timelines, AuditResultPanel(), ScoreCircle(), businessTypes, EugeneContactSection() (+14 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "lucide-react"
Cohesion: 0.11
Nodes (35): FIELDS, FinanceSettingsPage(), SiteSettingsPage(), ExpenseForm(), ExpenseFormModal(), today(), blank(), IncomeFormModal() (+27 more)

### Community 69 - "devops/page.js"
Cohesion: 0.16
Nodes (18): CheckIcon(), INCIDENT_STATUSES, IncidentRow(), IncidentsPage(), ChartIcon(), CheckIcon(), DevOpsDashboardPage(), fetchStats() (+10 more)

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.20
Nodes (7): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), Quote(), VideoEmbed()

### Community 73 - "projects/page.js"
Cohesion: 0.43
Nodes (6): KanbanIcon(), ListIcon(), ProjectKanbanCard(), ProjectsKanbanPage(), STATUS_CONFIG, STATUS_ORDER

### Community 74 - "tasks/page.js"
Cohesion: 0.19
Nodes (7): BuildingIcon(), CheckIcon(), PlusIcon(), PRIORITY_COLORS, TASK_TYPES, TasksPage(), TrashIcon()

### Community 75 - "HealthAPITemplate"
Cohesion: 0.23
Nodes (9): CheckIcon(), ChevronIcon(), CopyIcon(), generateAPIKey(), HealthAPITemplate(), handleGenerateKey(), HealthAPITemplateCompact(), InfoIcon() (+1 more)

### Community 76 - "20260201_all_tables.sql"
Cohesion: 0.26
Nodes (13): crm_activities, crm_leads, crm_stage_history, google_oauth, idx_crm_activities_created_at, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email (+5 more)

### Community 77 - "stripe-crm.js"
Cohesion: 0.24
Nodes (18): GET(), GET(), POST(), getStripe(), POST(), createStripeInvoice(), findStripeCustomerByEmail(), formatCurrency() (+10 more)

### Community 78 - "devops/sites/[id]/page.js"
Cohesion: 0.20
Nodes (15): ArrowLeftIcon(), CheckIcon(), EditIcon(), ExternalLinkIcon(), RefreshIcon(), SiteDetailPage(), fetchSite(), runCheck() (+7 more)

### Community 80 - "system-forge/layout.js"
Cohesion: 0.29
Nodes (12): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ForgeIcon(), HomeIcon(), ImportIcon(), LogoutIcon(), MenuIcon() (+4 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "cx"
Cohesion: 0.07
Nodes (46): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, SiteKeywordsPage(), SitePlanPage(), RunLink() (+38 more)

### Community 83 - "leads/new/page.js"
Cohesion: 0.50
Nodes (4): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES

### Community 84 - "seo-plan-validate.js"
Cohesion: 0.11
Nodes (26): POST(), GET(), PATCH(), PLAN_CATEGORIES, PLAN_EFFORTS, PLAN_PRIORITIES, toTaskRows(), validatePlan() (+18 more)

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "publish-blog-drafts.mjs"
Cohesion: 0.11
Nodes (21): BLACK, LOGO, main(), png(), root, CAT, __dirname, downloadImage() (+13 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.25
Nodes (12): GET(), addDays(), bareAddress(), dayOf(), DELIVERED_EVENTS, domainFromSiteUrl(), FAILED_EVENTS, getEmailCountsForSite() (+4 more)

### Community 88 - "crm/page.js"
Cohesion: 0.29
Nodes (7): CRMDashboardPage(), QuickStatCard(), ProjectWidgets(), RiskBadge(), PRIORITY_COLORS, TASK_TYPE_ICONS, TasksWidget()

### Community 90 - "sanity-boilerplate/lib/image.js"
Cohesion: 0.20
Nodes (7): @sanity/client@^7.13.2, @sanity/image-url@^2.0.2, @sanity/client, @sanity/image-url, client, previewClient, builder

### Community 91 - "seo-plan-input.js"
Cohesion: 0.14
Nodes (25): RFC-1918, getSearchAnalytics(), inspectUrl(), searchConsoleRequest(), attr(), checkPage(), decode(), fetchWithTimeout() (+17 more)

### Community 94 - "contact/page.jsx"
Cohesion: 0.17
Nodes (14): ContactPage(), COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay(), MONTHS (+6 more)

### Community 96 - "AdminAuthProvider.jsx"
Cohesion: 0.33
Nodes (10): AdminAuthContext, AdminAuthProvider(), decodeJwt(), loadSession(), mfaStatusOf(), needsMfa(), PUBLIC_ROUTES, readStoredSession() (+2 more)

### Community 97 - "google-calendar.js"
Cohesion: 0.35
Nodes (9): GET(), GET(), calendarFetch(), createBookingEvent(), formatSlotLabel(), getAccessToken(), getAvailableSlots(), getRawEvents() (+1 more)

### Community 98 - "devops/layout.js"
Cohesion: 0.38
Nodes (9): AlertIcon(), ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), DevOpsLayout(), HomeIcon(), LogoutIcon(), MenuIcon() (+1 more)

### Community 99 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 100 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 102 - "create/route.js"
Cohesion: 0.17
Nodes (16): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+8 more)

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 106 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

### Community 107 - "incidents/[id]/page.js"
Cohesion: 0.38
Nodes (6): ArrowLeftIcon(), INCIDENT_STATUSES, IncidentDetailPage(), fetchIncident(), updateStatus(), STATUS_CONFIG

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 110 - "pocket.js"
Cohesion: 0.16
Nodes (23): POST(), GET(), verifyCronRequest(), attachRecordingToLead(), extractSummary(), formatDuration(), getRecording(), getRecordingByPocketId() (+15 more)

### Community 111 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 126 - "workflows/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 127 - "lighthouse-audit/route.js"
Cohesion: 0.31
Nodes (8): checkRateLimit(), getRateLimitKey(), POST(), rateLimitMap, resend, saveAuditToDatabase(), sendAuditNotificationEmail(), supabase

### Community 128 - "hubspot.js"
Cohesion: 0.58
Nodes (8): createDeal(), createOrUpdateCompany(), createOrUpdateContact(), createTask(), findCompanyByName(), findContactByEmail(), handleContactFormSubmission(), hubspotRequest()

### Community 129 - "github/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 133 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 141 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 142 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, typescript@5.9.3, tailwindcss, @tailwindcss/postcss, typescript

### Community 143 - "HomeClient.jsx"
Cohesion: 0.14
Nodes (16): HomePage(), metadata, CTA(), categoryIcons, HomeClient(), PillBadge(), ProjectCard(), PricingSection() (+8 more)

### Community 144 - "with"
Cohesion: 0.29
Nodes (7): with, claude_args, claude_code_oauth_token, fetch-depth, github_token, prompt, ref

### Community 145 - "with"
Cohesion: 0.29
Nodes (7): with, claude_args, claude_code_oauth_token, fetch-depth, github_token, prompt, ref

### Community 146 - "branch"
Cohesion: 0.67
Nodes (3): description, required, branch

### Community 148 - "task_id"
Cohesion: 0.67
Nodes (3): task_id, description, required

### Community 149 - "branch"
Cohesion: 0.67
Nodes (3): description, required, branch

### Community 150 - "task_id"
Cohesion: 0.67
Nodes (3): task_id, description, required

### Community 152 - "task_title"
Cohesion: 0.67
Nodes (3): task_title, description, required

### Community 153 - "task_title"
Cohesion: 0.67
Nodes (3): task_title, description, required

### Community 154 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.05
Nodes (45): metadata, breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, ConstructionWebsiteDesignPage() (+37 more)

## Knowledge Gaps
- **2 isolated node(s):** `RFC-5545`, `RFC-1918`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 636 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `supabase-crm.js` to `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `ProposalEditor.jsx`, `vault/[id]/page.js`, `app/layout.js`, `devops.js`, `crm.js`, `createOrUpdateLead`, `logActivity`, `tasks.js`, `systemforge.js`, `input/route.js`, `proposals.js`, `package.json`, `search-console.js`, `seo-reports.js`, `admin/layout.js`, `[id]/layout.js`, `react`, `jobber.js`, `framer-motion`, `finance.js`, `SplitText`, `requireAdmin`, `instant-site/start/route.js`, `devops/sites/page.js`, `businesses.js`, `@supabase/supabase-js`, `Components/Blog/BlogPostCard.jsx`, `useAdminAuth`, `app/blog/category/[slug]/page.jsx`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `local/route.js`, `BlogPostCard`, `instant-site.js`, `seo-plan-runs.js`, `ga4.js`, `square-auth.js`, `Card`, `sites/[id]/route.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `google-auth.js`, `works/page.jsx`, `project-tasks.js`, `time-tracking.js`, `app/blog/series/[slug]/page.jsx`, `admin-auth.js`, `admin/page.js`, `comment-automations.js`, `useRecaptcha`, `facebook.js`, `lucide-react`, `devops/page.js`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `stripe-crm.js`, `devops/sites/[id]/page.js`, `health/route.js`, `system-forge/layout.js`, `cx`, `leads/new/page.js`, `seo-plan-validate.js`, `system-forge/page.js`, `resend-stats.js`, `crm/page.js`, `api-health.js`, `ref_crypto`, `AdminAuthProvider.jsx`, `google-calendar.js`, `devops/layout.js`, `create/route.js`, `incidents/[id]/page.js`, `pocket.js`, `lighthouse-audit/route.js`, `HomeClient.jsx`, `affordable-small-business-website-design/page.jsx`?**
  _High betweenness centrality (0.462) - this node is a cross-community bridge._
- **What connects `RFC-5545`, `RFC-1918` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07171171171171171 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `ProposalEditor.jsx`, `vault/[id]/page.js`, `app/layout.js`, `HomeClient.jsx`, `package.json`, `admin/layout.js`, `[id]/layout.js`, `affordable-small-business-website-design/page.jsx`, `framer-motion`, `SplitText`, `devops/sites/page.js`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `CSVImportModal.jsx`, `Card`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `works/page.jsx`, `app/blog/series/[slug]/page.jsx`, `admin-auth.js`, `admin/page.js`, `useRecaptcha`, `lucide-react`, `devops/page.js`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `HealthAPITemplate`, `devops/sites/[id]/page.js`, `system-forge/layout.js`, `cx`, `leads/new/page.js`, `system-forge/page.js`, `crm/page.js`, `contact/page.jsx`, `AdminAuthProvider.jsx`, `devops/layout.js`, `incidents/[id]/page.js`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `app/layout.js`, `HomeClient.jsx`, `package.json`, `[id]/layout.js`, `react`, `affordable-small-business-website-design/page.jsx`, `framer-motion`, `SplitText`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `Card`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `works/page.jsx`, `app/blog/series/[slug]/page.jsx`, `admin/page.js`, `useRecaptcha`, `Components/Blog/BlogPostContent.jsx`, `cx`, `contact/page.jsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `leads/[id]/page.js` be split into smaller, more focused modules?**
  _Cohesion score 0.055176890619928594 - nodes in this community are weakly interconnected._