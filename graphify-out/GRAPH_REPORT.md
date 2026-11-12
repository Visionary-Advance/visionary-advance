# Graph Report - visionary-advance  (2026-11-11)

## Corpus Check
- 509 files · ~299,955 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .ico 1)

## Summary
- 2838 nodes · 6809 edges · 161 communities (128 shown, 33 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3742736b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- seo-ship.js
- InstantSiteFlow.jsx
- 002_crm_premium_features.sql
- leads/[id]/page.js
- businesses/[id]/page.js
- vault/[id]/page.js
- app/layout.js
- supabase-crm.js
- devops.js
- seo-tiers.js
- 20260201_seo_tables.sql
- crm.js
- logActivity
- tasks.js
- systemforge.js
- seo-plan-runs.js
- proposals.js
- projects/[id]/page.js
- search-console.js
- with
- seo-reports.js
- sanity-boilerplate/lib/sanity.js
- AdminAuthProvider.jsx
- sanity
- createOrUpdateLead
- tasks/[id]/page.js
- 20260201_systemforge_tables.sql
- jobber.js
- framer-motion
- formatCurrency
- 001_crm_schema.sql
- pocket.js
- seo-plans.js
- useRecaptcha
- package.json
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- dependencies
- useAdminAuth
- @tiptap/react
- app/blog/[slug]/page.jsx
- requireAdmin
- seo.js
- finance.js
- local/route.js
- BlogPostCard
- react
- affordable-small-business-website-design/page.jsx
- ga4.js
- square-auth.js
- instant-site.js
- app/blog/tag/[slug]/page.jsx
- lucide-react
- compilerOptions
- google-auth.js
- SEOAnalyticsChart.jsx
- project-tasks.js
- time-tracking.js
- construction-website-design/page.jsx
- system-forge/layout.js
- 20260223_finance_tables.sql
- seo-email.js
- useAdminAuth
- works/[slug]/page.jsx
- devops-schema.sql
- incidents/[id]/page.js
- facebook.js
- seo/page.js
- @tiptap/extension-link
- github-import.js
- Components/Blog/BlogPostContent.jsx
- seo/sites/[id]/page.js
- ui.jsx
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- stripe-crm.js
- create/route.js
- urlForImage
- finance/layout.js
- crm-schema.sql
- cx
- income/[id]/page.js
- businesses/page.js
- system-forge/page.js
- publish-blog-drafts.mjs
- resend-stats.js
- crm/page.js
- crm/layout.js
- sanity-boilerplate/lib/image.js
- seo-plan-input.js
- HomeClient.jsx
- comment-automations.js
- works/page.jsx
- sanity-boilerplate/schemas/index.js
- devops/layout.js
- vault/page.js
- analytics.js
- inputs
- inputs
- devops/sites/[id]/page.js
- scripts
- 20261020_comment_automations.sql
- supabase_schema.sql
- import/page.js
- admin/page.js
- incidents/[id]/page.js
- steps
- instant-site/start/route.js
- RelationshipManager
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
- hubspot.js
- github/seo-ship-task.yml
- devDependencies
- leads/new/page.js
- google-calendar.js
- env
- postcss.config.mjs
- vercel.json
- env
- lighthouse-audit/route.js
- app/page.js
- with
- with
- branch
- usePersistedState
- task_id
- branch
- task_id
- admin/layout.js
- task_title
- task_title
- eugene-web-design/layout.js
- eugene-website-hosting/layout.js
- react-syntax-highlighter
- newsletter/route.js
- @tiptap/extension-table@^3.19.0
- @tiptap/extension-table-cell@^3.19.0

## God Nodes (most connected - your core abstractions)
1. `next` - 237 edges
2. `react` - 141 edges
3. `lucide-react` - 66 edges
4. `cx()` - 65 edges
5. `supabaseCRM` - 41 edges
6. `usePersistedState()` - 36 edges
7. `logActivity()` - 35 edges
8. `Button()` - 34 edges
9. `urlForImage()` - 33 edges
10. `useAdminAuth()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `SEOSitesHome()` --indirect_call--> `isRunInFlight()`  [INFERRED]
  app/admin/seo/page.js → Components/Admin/SEO/planRuns.js
- `SitePlanPage()` --calls--> `SEOPlanView()`  [EXTRACTED]
  app/admin/seo/sites/[id]/plan/page.js → Components/Admin/SEO/SEOPlanView.jsx
- `SEOPlanView()` --calls--> `usePersistedState()`  [EXTRACTED]
  Components/Admin/SEO/SEOPlanView.jsx → lib/usePersistedState.js
- `DraftBanner()` --calls--> `usePersistedState()`  [EXTRACTED]
  Components/Admin/SEO/SEOPlanView.jsx → lib/usePersistedState.js
- `POST()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/api/seo/plans/tasks/ship/route.js → lib/admin-api-auth.js

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (161 total, 33 thin omitted)

### Community 0 - "seo-ship.js"
Cohesion: 0.22
Nodes (13): POST(), POST(), buildLeadNotification(), sendN8nNotification(), applyShipCallback(), buildPrompt(), dispatchShipTask(), getSupabase() (+5 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.07
Nodes (69): handleBookingSubmit(), FAQS, FreeTrialPage(), metadata, SpotsBanner(), FAQS, GetYourSitePage(), metadata (+61 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.07
Nodes (56): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+48 more)

### Community 4 - "businesses/[id]/page.js"
Cohesion: 0.07
Nodes (45): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), ArrowLeftIcon(), NewProposalPage(), TrashIcon() (+37 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.18
Nodes (8): AddFileModal(), ArrowLeftIcon(), ModuleDetailPage(), PlusIcon(), FileEditor(), FileIcon(), FileList(), TrashIcon()

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (37): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+29 more)

### Community 7 - "supabase-crm.js"
Cohesion: 0.05
Nodes (6): GET(), serverStartTime, getSiteWithHistory(), supabaseCRM, next, serverStartTime

### Community 8 - "devops.js"
Cohesion: 0.09
Nodes (30): GET(), POST(), GET(), POST(), GET(), PATCH(), POST(), POST() (+22 more)

### Community 9 - "seo-tiers.js"
Cohesion: 0.17
Nodes (13): PLAN_CATEGORIES, PLAN_EFFORTS, PLAN_PRIORITIES, toTaskRows(), validatePlan(), getPlanTaskCap(), KEYWORD_LIMITS, PLAN_TASK_LIMITS (+5 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.08
Nodes (34): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+26 more)

### Community 11 - "crm.js"
Cohesion: 0.09
Nodes (25): PATCH(), POST(), POST(), DELETE(), GET(), PATCH(), PATCH(), GET() (+17 more)

### Community 12 - "logActivity"
Cohesion: 0.14
Nodes (18): GET(), POST(), GET(), POST(), PATCH(), DELETE(), GET(), PATCH() (+10 more)

### Community 13 - "tasks.js"
Cohesion: 0.10
Nodes (26): DELETE(), GET(), PATCH(), DELETE(), GET(), PATCH(), POST(), GET() (+18 more)

### Community 14 - "systemforge.js"
Cohesion: 0.14
Nodes (31): DELETE(), GET(), PATCH(), GET(), POST(), DELETE(), GET(), PATCH() (+23 more)

### Community 15 - "seo-plan-runs.js"
Cohesion: 0.21
Nodes (17): POST(), GET(), maxDuration, GET(), POST(), applyPlanRunCallback(), getLatestRuns(), getRun() (+9 more)

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 17 - "projects/[id]/page.js"
Cohesion: 0.23
Nodes (11): ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge(), CheckIcon(), MilestoneTimeline(), TimeEntryForm() (+3 more)

### Community 18 - "search-console.js"
Cohesion: 0.13
Nodes (35): GET(), maxDuration, GET(), DELETE(), GET(), PATCH(), POST(), POST() (+27 more)

### Community 19 - "with"
Cohesion: 0.05
Nodes (43): CALLBACK_URL, EXECUTION_FILE, RUN_ID, RUN_URL, RUNNER_SECRET, run_ids, jobs, plan (+35 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.13
Nodes (29): GET(), DELETE(), GET(), POST(), POST(), DELETE(), GET(), POST() (+21 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.09
Nodes (10): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag(), client, previewClient (+2 more)

### Community 22 - "AdminAuthProvider.jsx"
Cohesion: 0.22
Nodes (23): AdminLoginPage(), AdminAuthContext, AdminAuthProvider(), PUBLIC_ROUTES, CheckIcon(), CloseIcon(), GoogleIcon(), SettingsModal() (+15 more)

### Community 23 - "sanity"
Cohesion: 0.13
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "createOrUpdateLead"
Cohesion: 0.17
Nodes (16): POST(), POST(), POST(), POST(), resend, sendAdminNotification(), sendUserAuditEmail(), POST() (+8 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.23
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.19
Nodes (18): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), EugeneContactSection(), Field(), EugeneFAQ(), EugeneHero(), EugeneTestimonials(), FinalCTA() (+10 more)

### Community 29 - "formatCurrency"
Cohesion: 0.07
Nodes (50): ExpensesPage(), FinanceDashboard(), TaxEstimatorPage(), CategoryBadge(), CategoryPieChart(), CustomTooltip(), AlertIcon(), CheckIcon() (+42 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "pocket.js"
Cohesion: 0.19
Nodes (21): POST(), attachRecordingToLead(), extractSummary(), formatDuration(), getRecording(), getRecordingByPocketId(), handlePocketWebhook(), ingestParsedRecording() (+13 more)

### Community 32 - "seo-plans.js"
Cohesion: 0.26
Nodes (13): POST(), GET(), PATCH(), approveDraftPlan(), archivePlan(), discardDraftPlan(), getActivePlan(), getPlans() (+5 more)

### Community 33 - "useRecaptcha"
Cohesion: 0.11
Nodes (28): ContactPage(), handleFormSubmit(), COVERS, metadata, SetupCallPage(), CTA_VARIANTS, CalendarPicker(), DAYS (+20 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (23): gsap@^3.13.0, heroicons@^2.2.0, next-sanity@^12.0.5, ogl@^1.0.11, @react-email/render@^1.4.0, @tiptap/extension-table-header@^3.19.0, @tiptap/extension-table-row@^3.19.0, @tiptap/pm@^3.19.0 (+15 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.24
Nodes (17): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), countKeywords(), dateString() (+9 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.14
Nodes (17): BlogPage(), metadata, PillBadge(), revalidate, GET(), sitemap(), getAllCategories(), getAllPosts() (+9 more)

### Community 38 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, date-fns@^4.1.0, framer-motion@^12.23.12, @gsap/react@^2.1.2, headlessui@^0.0.0, lucide-react@^0.542.0, next@^16.0.0, @octokit/rest@^22.0.1 (+18 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.21
Nodes (9): ArrowLeftIcon(), EditSitePage(), ArrowLeftIcon(), NewSitePage(), useAdminAuth(), CheckIcon(), ChevronIcon(), CRMLeadSelector() (+1 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.24
Nodes (17): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), BlogHero(), BlogPostContent(), RelatedPosts() (+9 more)

### Community 42 - "requireAdmin"
Cohesion: 0.17
Nodes (11): DELETE(), PATCH(), GET(), POST(), GET(), GET(), requireAdmin(), verifyCronRequest() (+3 more)

### Community 43 - "seo.js"
Cohesion: 0.15
Nodes (5): metadata, metadata, metadata, DEFAULT_OG_IMAGE, SYSTEMS_PAGE_META

### Community 44 - "finance.js"
Cohesion: 0.13
Nodes (20): GET(), GET(), getQuarterForDate(), GET(), GET(), GET(), PATCH(), GET() (+12 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "BlogPostCard"
Cohesion: 0.23
Nodes (13): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, BlogPostCard(), CategoryBadge(), getAllCategorySlugs(), getCategoryBySlug() (+5 more)

### Community 47 - "react"
Cohesion: 0.07
Nodes (12): FinanceSettingsPage(), ErrorContent(), SquareError(), SquareSuccess(), SuccessContent(), TaskForm(), PRIORITY_COLORS, TaskItem() (+4 more)

### Community 48 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.15
Nodes (15): breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, LandingHero(), CtaButton() (+7 more)

### Community 49 - "ga4.js"
Cohesion: 0.28
Nodes (13): GET(), emptyTotals(), ga4Request(), getGa4MonthlyData(), getGa4PlanData(), listGa4Properties(), listKeyEventNames(), normalizePropertyId() (+5 more)

### Community 50 - "square-auth.js"
Cohesion: 0.21
Nodes (16): GET(), POST(), dynamic, GET(), POST(), runtime, callSquareAPI(), getClientLocationId() (+8 more)

### Community 51 - "instant-site.js"
Cohesion: 0.18
Nodes (21): POST(), GET(), GET(), alertInstantSiteFailed(), alertInstantSiteLead(), alertInstantSiteManual(), alertInstantSiteReady(), alertInstantSiteUnlocked() (+13 more)

### Community 52 - "app/blog/tag/[slug]/page.jsx"
Cohesion: 0.29
Nodes (12): generateMetadata(), generateStaticParams(), revalidate, TagPage(), generateBreadcrumbSchema(), getAllTagSlugs(), getPostsByTag(), getTagBySlug() (+4 more)

### Community 53 - "lucide-react"
Cohesion: 0.15
Nodes (9): @portabletext/react, components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote() (+1 more)

### Community 54 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 55 - "google-auth.js"
Cohesion: 0.17
Nodes (18): GET(), POST(), GET(), GET(), GET(), ANALYTICS_SCOPE, exchangeCodeForTokens(), generateOAuthUrl() (+10 more)

### Community 56 - "SEOAnalyticsChart.jsx"
Cohesion: 0.27
Nodes (8): LineChart(), METRICS, niceStep(), PAD, scaleFor(), xLabelIndexes(), focusRing, SegmentedControl()

### Community 57 - "project-tasks.js"
Cohesion: 0.19
Nodes (11): GET(), PATCH(), POST(), DELETE(), PATCH(), completeTask(), createTask(), deleteTask() (+3 more)

### Community 58 - "time-tracking.js"
Cohesion: 0.20
Nodes (11): GET(), POST(), DELETE(), PATCH(), createTimeEntry(), deleteTimeEntry(), getProjectTimeEntries(), getProjectTimeSummary() (+3 more)

### Community 59 - "construction-website-design/page.jsx"
Cohesion: 0.18
Nodes (17): ConstructionWebsiteDesignPage(), metadata, EcommerceWebDesignAgencyPage(), metadata, LawFirmWebDesignPage(), metadata, metadata, ResponsiveWebDesignServicesPage() (+9 more)

### Community 60 - "system-forge/layout.js"
Cohesion: 0.29
Nodes (12): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ForgeIcon(), HomeIcon(), ImportIcon(), LogoutIcon(), MenuIcon() (+4 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.27
Nodes (12): breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatDateRange(), formatKeywordRow(), generateReportHtml() (+4 more)

### Community 63 - "useAdminAuth"
Cohesion: 0.17
Nodes (26): BackgroundRuns(), Logo(), MenuLink(), NavItem(), SEOLayout(), Shell(), SidebarContent(), SiteNavItem() (+18 more)

### Community 64 - "works/[slug]/page.jsx"
Cohesion: 0.27
Nodes (5): PillBadge(), tabs, WorkDetailPage(), portfolioProjects, worksData

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "incidents/[id]/page.js"
Cohesion: 0.28
Nodes (12): ChartIcon(), CheckIcon(), DevOpsDashboardPage(), fetchStats(), runAllChecks(), formatTimeAgo(), PlusIcon(), RefreshIcon() (+4 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "seo/page.js"
Cohesion: 0.17
Nodes (33): SEOSitesHome(), SiteRow(), SEOReportsPage(), fmtCompact(), fmtDate(), fmtDateRange(), fmtDateTime(), fmtInt() (+25 more)

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.17
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 72 - "seo/sites/[id]/page.js"
Cohesion: 0.16
Nodes (26): SiteKeywordsPage(), LEGACY_TABS, PlanCard(), SiteOverviewPage(), TopTable(), SitePlanPage(), fmtPct(), fmtPos() (+18 more)

### Community 73 - "ui.jsx"
Cohesion: 0.14
Nodes (23): SiteSettingsPage(), AddSiteModal(), PERMISSIONS, LinkToBusinessModal(), DAYS, ScheduleModal(), SendReportModal(), DraftBanner() (+15 more)

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
Cohesion: 0.23
Nodes (19): GET(), GET(), POST(), getStripe(), POST(), createStripeInvoice(), findStripeCustomerByEmail(), formatCurrency() (+11 more)

### Community 78 - "create/route.js"
Cohesion: 0.26
Nodes (11): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+3 more)

### Community 79 - "urlForImage"
Cohesion: 0.19
Nodes (16): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), getAllSeriesSlugs(), getSeriesBySlug(), date-fns, BlogHero() (+8 more)

### Community 80 - "finance/layout.js"
Cohesion: 0.32
Nodes (11): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ExpensesIcon(), FinanceLayout(), HomeIcon(), IncomeIcon(), LogoutIcon() (+3 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "cx"
Cohesion: 0.10
Nodes (34): RunLink(), RunProgressCard(), usePlanRunProgress(), authFetch(), isRunInFlight(), PlanRunsContext, PlanRunsProvider(), RUN_IN_FLIGHT (+26 more)

### Community 83 - "income/[id]/page.js"
Cohesion: 0.23
Nodes (12): ArrowLeftIcon(), DetailField(), ExternalLinkIcon(), IncomeDetailPage(), SummaryRow(), TaxRow(), IncomePage(), POST() (+4 more)

### Community 84 - "businesses/page.js"
Cohesion: 0.23
Nodes (13): BuildingIcon(), BusinessesPage(), ChartIcon(), PlusIcon(), SearchIcon(), UsersIcon(), ClientIcon(), ClientsPage() (+5 more)

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "publish-blog-drafts.mjs"
Cohesion: 0.15
Nodes (16): CAT, __dirname, downloadImage(), __filename, key(), main(), makeBlock(), mdToPortableText() (+8 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.29
Nodes (11): addDays(), bareAddress(), dayOf(), DELIVERED_EVENTS, domainFromSiteUrl(), FAILED_EVENTS, getEmailCountsForSite(), getSupabase() (+3 more)

### Community 88 - "crm/page.js"
Cohesion: 0.29
Nodes (7): CRMDashboardPage(), QuickStatCard(), ProjectWidgets(), RiskBadge(), PRIORITY_COLORS, TASK_TYPE_ICONS, TasksWidget()

### Community 89 - "crm/layout.js"
Cohesion: 0.27
Nodes (13): ArrowLeftIcon(), BuildingIcon(), ChevronIcon(), ClientsIcon(), CRMLayout(), DashboardIcon(), HomeIcon(), KanbanIcon() (+5 more)

### Community 90 - "sanity-boilerplate/lib/image.js"
Cohesion: 0.20
Nodes (7): @sanity/client@^7.13.2, @sanity/image-url@^2.0.2, @sanity/client, @sanity/image-url, client, previewClient, builder

### Community 91 - "seo-plan-input.js"
Cohesion: 0.15
Nodes (23): RFC-1918, inspectUrl(), attr(), checkPage(), decode(), fetchWithTimeout(), isOwnPage(), isPrivateAddress() (+15 more)

### Community 92 - "HomeClient.jsx"
Cohesion: 0.16
Nodes (13): CTA(), categoryIcons, HomeClient(), PillBadge(), ProjectCard(), PricingSection(), projectPlans, seoPlans (+5 more)

### Community 93 - "comment-automations.js"
Cohesion: 0.22
Nodes (15): POST(), escapeRegex(), extractComments(), findAccount(), findMatchingRule(), getSupabaseClient(), graphPost(), handleMetaWebhook() (+7 more)

### Community 94 - "works/page.jsx"
Cohesion: 0.10
Nodes (20): AboutPage(), fadeUp(), scaleIn, slideFrom(), AuditPage(), tips, services, ServicesPage() (+12 more)

### Community 96 - "devops/layout.js"
Cohesion: 0.38
Nodes (9): AlertIcon(), ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), DevOpsLayout(), HomeIcon(), LogoutIcon(), MenuIcon() (+1 more)

### Community 97 - "vault/page.js"
Cohesion: 0.25
Nodes (10): BoxIcon(), ImportIcon(), PlusIcon(), VaultPage(), CategoryBadge(), ModuleCard(), TrashIcon(), TypeIcon() (+2 more)

### Community 98 - "analytics.js"
Cohesion: 0.31
Nodes (6): AuditResultPanel(), ScoreCircle(), DarkVeil, WebsiteAudit(), trackAuditEmailSubmit(), trackAuditSubmit()

### Community 99 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 100 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 101 - "devops/sites/[id]/page.js"
Cohesion: 0.11
Nodes (28): ArrowLeftIcon(), CheckIcon(), EditIcon(), ExternalLinkIcon(), RefreshIcon(), SiteDetailPage(), fetchSite(), runCheck() (+20 more)

### Community 102 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 105 - "import/page.js"
Cohesion: 0.27
Nodes (6): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), ImportWizard()

### Community 106 - "admin/page.js"
Cohesion: 0.36
Nodes (8): AdminDashboard(), ArrowIcon(), CRMIcon(), DevOpsIcon(), FinanceIcon(), ForgeIcon(), SEOIcon(), SettingsIcon()

### Community 107 - "incidents/[id]/page.js"
Cohesion: 0.19
Nodes (12): ArrowLeftIcon(), INCIDENT_STATUSES, IncidentDetailPage(), fetchIncident(), updateStatus(), STATUS_CONFIG, CheckIcon(), INCIDENT_STATUSES (+4 more)

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 109 - "instant-site/start/route.js"
Cohesion: 0.24
Nodes (13): POST(), POST(), POST(), clientIp(), SMS_CONSENT_TEXT, normPhone(), sendMetaEvent(), sha256() (+5 more)

### Community 110 - "RelationshipManager"
Cohesion: 0.31
Nodes (5): RelationshipItem(), RelationshipManager(), XIcon(), TYPE_CONFIG, TypeBadge()

### Community 111 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 126 - "workflows/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 128 - "hubspot.js"
Cohesion: 0.58
Nodes (8): createDeal(), createOrUpdateCompany(), createOrUpdateContact(), createTask(), findCompanyByName(), findContactByEmail(), handleContactFormSubmission(), hubspotRequest()

### Community 129 - "github/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 130 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, typescript@5.9.3, tailwindcss, @tailwindcss/postcss, typescript

### Community 131 - "leads/new/page.js"
Cohesion: 0.50
Nodes (4): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES

### Community 132 - "google-calendar.js"
Cohesion: 0.35
Nodes (9): GET(), GET(), calendarFetch(), createBookingEvent(), formatSlotLabel(), getAccessToken(), getAvailableSlots(), getRawEvents() (+1 more)

### Community 133 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 141 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 142 - "lighthouse-audit/route.js"
Cohesion: 0.31
Nodes (8): checkRateLimit(), getRateLimitKey(), POST(), rateLimitMap, resend, saveAuditToDatabase(), sendAuditNotificationEmail(), supabase

### Community 143 - "app/page.js"
Cohesion: 0.33
Nodes (7): HomePage(), metadata, HOME_TITLE_TEST, pickRandomVariant(), resolveVariant(), config, middleware()

### Community 144 - "with"
Cohesion: 0.29
Nodes (7): with, claude_args, claude_code_oauth_token, fetch-depth, github_token, prompt, ref

### Community 145 - "with"
Cohesion: 0.29
Nodes (7): with, claude_args, claude_code_oauth_token, fetch-depth, github_token, prompt, ref

### Community 146 - "branch"
Cohesion: 0.67
Nodes (3): description, required, branch

### Community 147 - "usePersistedState"
Cohesion: 0.21
Nodes (13): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, KanbanIcon(), ListIcon(), ProjectKanbanCard() (+5 more)

### Community 148 - "task_id"
Cohesion: 0.67
Nodes (3): task_id, description, required

### Community 149 - "branch"
Cohesion: 0.67
Nodes (3): description, required, branch

### Community 150 - "task_id"
Cohesion: 0.67
Nodes (3): task_id, description, required

### Community 151 - "admin/layout.js"
Cohesion: 0.48
Nodes (5): AdminLayout(), metadata, AdminScrollRestore(), isReloadOrHistoryLoad(), storageKey()

### Community 152 - "task_title"
Cohesion: 0.67
Nodes (3): task_title, description, required

### Community 153 - "task_title"
Cohesion: 0.67
Nodes (3): task_title, description, required

## Knowledge Gaps
- **2 isolated node(s):** `RFC-5545`, `RFC-1918`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 615 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `supabase-crm.js` to `seo-ship.js`, `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `devops.js`, `crm.js`, `logActivity`, `tasks.js`, `systemforge.js`, `seo-plan-runs.js`, `proposals.js`, `projects/[id]/page.js`, `search-console.js`, `seo-reports.js`, `AdminAuthProvider.jsx`, `createOrUpdateLead`, `tasks/[id]/page.js`, `jobber.js`, `framer-motion`, `pocket.js`, `seo-plans.js`, `useRecaptcha`, `package.json`, `businesses.js`, `@supabase/supabase-js`, `dependencies`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `requireAdmin`, `finance.js`, `local/route.js`, `BlogPostCard`, `react`, `affordable-small-business-website-design/page.jsx`, `ga4.js`, `square-auth.js`, `instant-site.js`, `app/blog/tag/[slug]/page.jsx`, `lucide-react`, `google-auth.js`, `project-tasks.js`, `time-tracking.js`, `construction-website-design/page.jsx`, `system-forge/layout.js`, `useAdminAuth`, `works/[slug]/page.jsx`, `incidents/[id]/page.js`, `facebook.js`, `seo/page.js`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `seo/sites/[id]/page.js`, `ui.jsx`, `tasks/page.js`, `stripe-crm.js`, `create/route.js`, `urlForImage`, `finance/layout.js`, `income/[id]/page.js`, `businesses/page.js`, `system-forge/page.js`, `crm/page.js`, `crm/layout.js`, `HomeClient.jsx`, `comment-automations.js`, `works/page.jsx`, `devops/layout.js`, `vault/page.js`, `analytics.js`, `devops/sites/[id]/page.js`, `import/page.js`, `admin/page.js`, `incidents/[id]/page.js`, `instant-site/start/route.js`, `RelationshipManager`, `leads/new/page.js`, `google-calendar.js`, `lighthouse-audit/route.js`, `app/page.js`, `usePersistedState`, `admin/layout.js`, `newsletter/route.js`?**
  _High betweenness centrality (0.494) - this node is a cross-community bridge._
- **What connects `RFC-5545`, `RFC-1918` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0712280701754386 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `leads/new/page.js`, `vault/[id]/page.js`, `app/layout.js`, `projects/[id]/page.js`, `usePersistedState`, `AdminAuthProvider.jsx`, `admin/layout.js`, `tasks/[id]/page.js`, `framer-motion`, `formatCurrency`, `useRecaptcha`, `package.json`, `dependencies`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `lucide-react`, `SEOAnalyticsChart.jsx`, `system-forge/layout.js`, `useAdminAuth`, `works/[slug]/page.jsx`, `incidents/[id]/page.js`, `seo/page.js`, `Components/Blog/BlogPostContent.jsx`, `seo/sites/[id]/page.js`, `ui.jsx`, `tasks/page.js`, `HealthAPITemplate`, `finance/layout.js`, `cx`, `income/[id]/page.js`, `businesses/page.js`, `system-forge/page.js`, `crm/page.js`, `crm/layout.js`, `HomeClient.jsx`, `works/page.jsx`, `devops/layout.js`, `vault/page.js`, `analytics.js`, `devops/sites/[id]/page.js`, `import/page.js`, `admin/page.js`, `incidents/[id]/page.js`, `RelationshipManager`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `@supabase/supabase-js` to `seo-ship.js`, `supabase-crm.js`, `seo-tiers.js`, `lighthouse-audit/route.js`, `seo-plan-runs.js`, `systemforge.js`, `search-console.js`, `usePersistedState`, `seo-reports.js`, `jobber.js`, `seo-plans.js`, `package.json`, `businesses.js`, `dependencies`, `requireAdmin`, `square-auth.js`, `google-auth.js`, `facebook.js`, `resend-stats.js`, `seo-plan-input.js`, `comment-automations.js`, `instant-site/start/route.js`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `leads/[id]/page.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._