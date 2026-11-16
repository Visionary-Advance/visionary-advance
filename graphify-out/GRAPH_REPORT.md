# Graph Report - visionary-advance  (2026-11-16)

## Corpus Check
- 522 files · ~305,464 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .css 1)

## Summary
- 2894 nodes · 7215 edges · 161 communities (134 shown, 27 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f9e62a3d`
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
- crm.js
- 20260201_seo_tables.sql
- createOrUpdateLead
- logActivity
- tasks.js
- systemforge.js
- seo-plan-runs.js
- proposals.js
- SplitText
- search-console.js
- with
- seo-reports.js
- sanity-boilerplate/lib/sanity.js
- admin/layout.js
- sanity
- seo/page.js
- react
- 20260201_systemforge_tables.sql
- jobber.js
- framer-motion
- finance.js
- 001_crm_schema.sql
- pocket.js
- seo-plans.js
- instant-site/start/route.js
- seo.js
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- affordable-small-business-website-design/page.jsx
- useAdminAuth
- ProposalEditor.jsx
- app/blog/[slug]/page.jsx
- dependencies
- Card
- CSVImportModal.jsx
- local/route.js
- BlogPostCard
- instant-site.js
- clients/page.js
- ga4.js
- square-auth.js
- Card
- app/blog/tag/[slug]/page.jsx
- sanity-boilerplate/Components/Blog/BlogPostContent.jsx
- compilerOptions
- google-auth.js
- works/page.jsx
- project-tasks.js
- time-tracking.js
- app/blog/series/[slug]/page.jsx
- AdminAuthProvider.jsx
- 20260223_finance_tables.sql
- seo-email.js
- cx
- comment-automations.js
- devops-schema.sql
- analytics.js
- facebook.js
- lucide-react
- devops/page.js
- github-import.js
- Components/Blog/BlogPostContent.jsx
- SEOReportPanel
- projects/page.js
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- stripe-crm.js
- devops/sites/[id]/page.js
- app/page.js
- system-forge/layout.js
- crm-schema.sql
- cx
- leads/new/page.js
- seo-plan-validate.js
- system-forge/page.js
- publish-blog-drafts.mjs
- resend-stats.js
- crm/page.js
- projects/[id]/page.js
- sanity-boilerplate/lib/image.js
- seo-plan-input.js
- CheckHistoryTable.jsx
- SettingsModal.jsx
- contact/page.jsx
- sanity-boilerplate/schemas/index.js
- AdminAuthProvider.jsx
- google-calendar.js
- devops/layout.js
- inputs
- inputs
- devops/sites/page.js
- create/route.js
- 20261020_comment_automations.sql
- supabase_schema.sql
- LandingPageTemplate.jsx
- scripts
- incidents/[id]/page.js
- steps
- sendPushToAll
- requireAdmin
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
- proposals/[id]/page.js
- TaskList.jsx
- TimeTracker.jsx
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
- LandingPageTemplate.jsx
- seo-tiers.js
- pocket/page.js
- sites/[id]/route.js
- eugene-website-hosting/layout.js
- TestimonialsCarousel.jsx

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
- `ConstructionWebsiteDesignPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/construction-website-design/page.jsx → Components/Landing/LandingPageTemplate.jsx
- `EcommerceWebDesignAgencyPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/ecommerce-web-design-agency/page.jsx → Components/Landing/LandingPageTemplate.jsx
- `LawFirmWebDesignPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/law-firm-web-design/page.jsx → Components/Landing/LandingPageTemplate.jsx
- `ResponsiveWebDesignServicesPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/responsive-web-design-services/page.jsx → Components/Landing/LandingPageTemplate.jsx
- `SmallBusinessWebsiteDesignPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/small-business-website-design/page.jsx → Components/Landing/LandingPageTemplate.jsx

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (161 total, 27 thin omitted)

### Community 0 - "seo-ship.js"
Cohesion: 0.29
Nodes (10): POST(), POST(), applyShipCallback(), buildPrompt(), dispatchShipTask(), getSupabase(), IN_FLIGHT, notify() (+2 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.06
Nodes (74): handleBookingSubmit(), FAQS, FreeTrialPage(), metadata, SpotsBanner(), FAQS, GetYourSitePage(), metadata (+66 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.06
Nodes (65): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+57 more)

### Community 4 - "businesses/[id]/page.js"
Cohesion: 0.18
Nodes (15): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), ProjectCard(), STATUS_CONFIG, ProjectForm() (+7 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.07
Nodes (29): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), AddFileModal(), ArrowLeftIcon(), ModuleDetailPage() (+21 more)

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (37): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+29 more)

### Community 7 - "supabase-crm.js"
Cohesion: 0.05
Nodes (7): POST(), validateExpenseRow(), validateIncomeRow(), serverStartTime, supabaseCRM, next, serverStartTime

### Community 8 - "devops.js"
Cohesion: 0.09
Nodes (30): GET(), POST(), GET(), POST(), GET(), PATCH(), POST(), POST() (+22 more)

### Community 9 - "crm.js"
Cohesion: 0.09
Nodes (24): PATCH(), POST(), POST(), DELETE(), GET(), PATCH(), PATCH(), GET() (+16 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.08
Nodes (34): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+26 more)

### Community 11 - "createOrUpdateLead"
Cohesion: 0.20
Nodes (14): POST(), POST(), resend, sendAdminNotification(), sendUserAuditEmail(), POST(), POST(), calculateLeadScore() (+6 more)

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
Cohesion: 0.18
Nodes (19): POST(), GET(), maxDuration, GET(), POST(), applyPlanRunCallback(), getLatestRuns(), getRun() (+11 more)

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 17 - "SplitText"
Cohesion: 0.18
Nodes (8): AuditPage(), tips, services, ServicesPage(), stats, ServicePage(), SplitText(), servicesData

### Community 18 - "search-console.js"
Cohesion: 0.14
Nodes (34): GET(), DELETE(), GET(), PATCH(), POST(), POST(), addDashboardWidget(), addSite() (+26 more)

### Community 19 - "with"
Cohesion: 0.04
Nodes (45): CALLBACK_URL, EXECUTION_FILE, HAS_TOKEN, REPO, RUN_ID, RUN_URL, RUNNER_SECRET, run_ids (+37 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.16
Nodes (24): GET(), DELETE(), GET(), POST(), DELETE(), GET(), POST(), calculateChanges() (+16 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.09
Nodes (10): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag(), client, previewClient (+2 more)

### Community 22 - "admin/layout.js"
Cohesion: 0.15
Nodes (11): AdminLayout(), metadata, viewport, AdminBottomNav(), NAV, AdminScrollRestore(), isReloadOrHistoryLoad(), storageKey() (+3 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "seo/page.js"
Cohesion: 0.19
Nodes (24): SEOSitesHome(), SiteRow(), SEOReportsPage(), SiteLayout(), SiteSwitcher(), fmtCompact(), fmtDate(), fmtDateRange() (+16 more)

### Community 25 - "react"
Cohesion: 0.06
Nodes (10): PRIORITY_COLORS, TASK_TYPE_LABELS, ErrorContent(), SquareError(), SquareSuccess(), SuccessContent(), CodeBlock(), DarkVeil (+2 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.23
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.21
Nodes (16): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), EugeneFAQ(), EugeneHero(), EugeneTestimonials(), FinalCTA(), LocalProof(), AnimatedNumber() (+8 more)

### Community 29 - "finance.js"
Cohesion: 0.12
Nodes (22): GET(), GET(), getQuarterForDate(), GET(), GET(), GET(), PATCH(), GET() (+14 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "pocket.js"
Cohesion: 0.16
Nodes (22): POST(), buildLeadNotification(), sendN8nNotification(), attachRecordingToLead(), extractSummary(), formatDuration(), getRecording(), getRecordingByPocketId() (+14 more)

### Community 32 - "seo-plans.js"
Cohesion: 0.30
Nodes (11): POST(), GET(), PATCH(), approveDraftPlan(), archivePlan(), discardDraftPlan(), getActivePlan(), getPlans() (+3 more)

### Community 33 - "instant-site/start/route.js"
Cohesion: 0.25
Nodes (12): POST(), POST(), POST(), GET(), POST(), clientIp(), SMS_CONSENT_TEXT, waas() (+4 more)

### Community 34 - "seo.js"
Cohesion: 0.12
Nodes (7): metadata, metadata, metadata, metadata, eugenePageContent, DEFAULT_OG_IMAGE, SYSTEMS_PAGE_META

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.20
Nodes (20): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), buildKeywordPerformance(), countKeywords() (+12 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.14
Nodes (17): BlogPage(), metadata, PillBadge(), revalidate, GET(), sitemap(), getAllCategories(), getAllPosts() (+9 more)

### Community 38 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.19
Nodes (12): breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, CtaButton(), FinalCTA() (+4 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.20
Nodes (8): ArrowLeftIcon(), EditSitePage(), ArrowLeftIcon(), NewSitePage(), CheckIcon(), ChevronIcon(), CRMLeadSelector(), XIcon()

### Community 40 - "ProposalEditor.jsx"
Cohesion: 0.19
Nodes (18): ArrowLeftIcon(), NewProposalPage(), TrashIcon(), BoldIcon(), BulletListIcon(), CodeIcon(), Divider(), HRIcon() (+10 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.21
Nodes (18): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), CTA_VARIANTS, BlogHero(), BlogPostContent() (+10 more)

### Community 42 - "dependencies"
Cohesion: 0.05
Nodes (57): dependencies, date-fns@^4.1.0, framer-motion@^12.23.12, gsap@^3.13.0, @gsap/react@^2.1.2, headlessui@^0.0.0, heroicons@^2.2.0, lucide-react@^0.542.0 (+49 more)

### Community 43 - "Card"
Cohesion: 0.13
Nodes (48): dateOf(), ExpensesPage(), dateOf(), IncomeDetailPage(), methodLabel(), dateOf(), IncomePage(), methodLabel() (+40 more)

### Community 44 - "CSVImportModal.jsx"
Cohesion: 0.17
Nodes (24): AlertIcon(), CheckIcon(), CSVImportModal(), ImportResult(), Step1Upload(), Step2Mapping(), Step3Preview(), UploadIcon() (+16 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "BlogPostCard"
Cohesion: 0.29
Nodes (13): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, BlogPostCard(), generateBreadcrumbSchema(), getAllCategorySlugs(), getCategoryBySlug() (+5 more)

### Community 47 - "instant-site.js"
Cohesion: 0.20
Nodes (19): POST(), GET(), alertInstantSiteFailed(), alertInstantSiteLead(), alertInstantSiteManual(), alertInstantSiteReady(), alertInstantSiteUnlocked(), INVISIBLE (+11 more)

### Community 48 - "clients/page.js"
Cohesion: 0.23
Nodes (13): BuildingIcon(), BusinessesPage(), ChartIcon(), PlusIcon(), SearchIcon(), UsersIcon(), ClientIcon(), ClientsPage() (+5 more)

### Community 49 - "ga4.js"
Cohesion: 0.28
Nodes (13): GET(), emptyTotals(), ga4Request(), getGa4MonthlyData(), getGa4PlanData(), listGa4Properties(), listKeyEventNames(), normalizePropertyId() (+5 more)

### Community 50 - "square-auth.js"
Cohesion: 0.21
Nodes (16): GET(), POST(), dynamic, GET(), POST(), runtime, callSquareAPI(), getClientLocationId() (+8 more)

### Community 51 - "Card"
Cohesion: 0.14
Nodes (39): LEGACY_TABS, PlanCard(), SiteOverviewPage(), TopTable(), fmtInt(), fmtPct(), fmtPos(), pagePath() (+31 more)

### Community 52 - "app/blog/tag/[slug]/page.jsx"
Cohesion: 0.28
Nodes (11): generateMetadata(), generateStaticParams(), revalidate, TagPage(), getAllTagSlugs(), getPostsByTag(), getTagBySlug(), generateMetadata() (+3 more)

### Community 53 - "sanity-boilerplate/Components/Blog/BlogPostContent.jsx"
Cohesion: 0.12
Nodes (12): @portabletext/react@^6.0.0, react-syntax-highlighter@^16.1.0, @portabletext/react, react-syntax-highlighter, components, Callout(), CALLOUT_STYLES, CodeBlock() (+4 more)

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
Cohesion: 0.17
Nodes (17): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), CategoryBadge(), getAllSeriesSlugs(), getSeriesBySlug(), date-fns (+9 more)

### Community 60 - "AdminAuthProvider.jsx"
Cohesion: 0.34
Nodes (10): AdminLoginPage(), getAssuranceLevel(), getAuthClient(), getMFAStatus(), getSession(), getUser(), onAuthStateChange(), requiresMFAVerification() (+2 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.23
Nodes (14): POST(), breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatDateRange(), formatKeywordRow() (+6 more)

### Community 63 - "cx"
Cohesion: 0.17
Nodes (25): ACTIONS, AdminHome(), AttentionRow(), dueLabel(), greeting(), ListSkeleton(), PRIORITY_TONE, TOOLS (+17 more)

### Community 64 - "comment-automations.js"
Cohesion: 0.24
Nodes (15): POST(), escapeRegex(), extractComments(), findAccount(), findMatchingRule(), getSupabaseClient(), graphPost(), handleMetaWebhook() (+7 more)

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "analytics.js"
Cohesion: 0.17
Nodes (21): ContactPage(), handleFormSubmit(), ContactForm(), projectTypes, timelines, AuditResultPanel(), ScoreCircle(), businessTypes (+13 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "lucide-react"
Cohesion: 0.10
Nodes (36): FIELDS, FinanceSettingsPage(), SiteSettingsPage(), ExpenseForm(), ExpenseFormModal(), today(), blank(), IncomeForm() (+28 more)

### Community 69 - "devops/page.js"
Cohesion: 0.28
Nodes (12): ChartIcon(), CheckIcon(), DevOpsDashboardPage(), fetchStats(), runAllChecks(), formatTimeAgo(), PlusIcon(), RefreshIcon() (+4 more)

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.20
Nodes (7): components, Callout(), CALLOUT_STYLES, EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 72 - "SEOReportPanel"
Cohesion: 0.39
Nodes (5): SiteKeywordsPage(), SitePlanPage(), SiteReportsPage(), SiteContext, useSite()

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
Cohesion: 0.21
Nodes (20): GET(), GET(), POST(), getStripe(), POST(), createStripeInvoice(), findStripeCustomerByEmail(), formatCurrency() (+12 more)

### Community 78 - "devops/sites/[id]/page.js"
Cohesion: 0.27
Nodes (11): ArrowLeftIcon(), CheckIcon(), EditIcon(), ExternalLinkIcon(), RefreshIcon(), SiteDetailPage(), fetchSite(), runCheck() (+3 more)

### Community 79 - "app/page.js"
Cohesion: 0.33
Nodes (7): HomePage(), metadata, HOME_TITLE_TEST, pickRandomVariant(), resolveVariant(), config, middleware()

### Community 80 - "system-forge/layout.js"
Cohesion: 0.29
Nodes (12): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ForgeIcon(), HomeIcon(), ImportIcon(), LogoutIcon(), MenuIcon() (+4 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "cx"
Cohesion: 0.09
Nodes (38): RunLink(), RunProgressCard(), usePlanRunProgress(), accessToken(), authFetch(), isRunInFlight(), PlanRunsContext, PlanRunsProvider() (+30 more)

### Community 83 - "leads/new/page.js"
Cohesion: 0.50
Nodes (4): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES

### Community 84 - "seo-plan-validate.js"
Cohesion: 0.26
Nodes (10): PLAN_CATEGORIES, PLAN_EFFORTS, PLAN_PRIORITIES, toTaskRows(), validatePlan(), getPlanTaskCap(), Fail, fail() (+2 more)

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "publish-blog-drafts.mjs"
Cohesion: 0.11
Nodes (21): BLACK, LOGO, main(), png(), root, CAT, __dirname, downloadImage() (+13 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.29
Nodes (11): addDays(), bareAddress(), dayOf(), DELIVERED_EVENTS, domainFromSiteUrl(), FAILED_EVENTS, getEmailCountsForSite(), getSupabase() (+3 more)

### Community 88 - "crm/page.js"
Cohesion: 0.29
Nodes (7): CRMDashboardPage(), QuickStatCard(), ProjectWidgets(), RiskBadge(), PRIORITY_COLORS, TASK_TYPE_ICONS, TasksWidget()

### Community 89 - "projects/[id]/page.js"
Cohesion: 0.23
Nodes (13): ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge(), CheckIcon(), MilestoneTimeline(), EditIcon() (+5 more)

### Community 90 - "sanity-boilerplate/lib/image.js"
Cohesion: 0.20
Nodes (7): @sanity/client@^7.13.2, @sanity/image-url@^2.0.2, @sanity/client, @sanity/image-url, client, previewClient, builder

### Community 91 - "seo-plan-input.js"
Cohesion: 0.15
Nodes (23): RFC-1918, inspectUrl(), attr(), checkPage(), decode(), fetchWithTimeout(), isOwnPage(), isPrivateAddress() (+15 more)

### Community 92 - "CheckHistoryTable.jsx"
Cohesion: 0.70
Nodes (4): CheckHistoryTable(), CheckRow(), getHttpStatusColor(), getResponseTimeColor()

### Community 93 - "SettingsModal.jsx"
Cohesion: 0.29
Nodes (11): isStandalone(), NotificationToggle(), urlBase64ToUint8Array(), CheckIcon(), CloseIcon(), GoogleIcon(), SettingsModal(), ShieldIcon() (+3 more)

### Community 94 - "contact/page.jsx"
Cohesion: 0.18
Nodes (13): COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay(), MONTHS, TimeSlots() (+5 more)

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

### Community 101 - "devops/sites/page.js"
Cohesion: 0.22
Nodes (13): GridIcon(), PlusIcon(), ServerIcon(), SitesListPage(), SiteTableRow(), StatusTab(), TableIcon(), HealthTimeline() (+5 more)

### Community 102 - "create/route.js"
Cohesion: 0.26
Nodes (11): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+3 more)

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 105 - "LandingPageTemplate.jsx"
Cohesion: 0.32
Nodes (8): LandingHero(), buildSchemas(), FinalCTA(), IncludedSection(), LandingPageTemplate(), ProcessSection(), PainPoints(), WhyUs()

### Community 106 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

### Community 107 - "incidents/[id]/page.js"
Cohesion: 0.19
Nodes (12): ArrowLeftIcon(), INCIDENT_STATUSES, IncidentDetailPage(), fetchIncident(), updateStatus(), STATUS_CONFIG, CheckIcon(), INCIDENT_STATUSES (+4 more)

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 109 - "sendPushToAll"
Cohesion: 0.31
Nodes (7): POST(), POST(), resend, POST(), ensureConfigured(), sendPushToAll(), resend

### Community 110 - "requireAdmin"
Cohesion: 0.12
Nodes (17): dynamic, GET(), noStore, DELETE(), PATCH(), GET(), POST(), GET() (+9 more)

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

### Community 130 - "proposals/[id]/page.js"
Cohesion: 0.43
Nodes (6): ArrowLeftIcon(), LinkIcon(), ProposalDetailPage(), SendIcon(), ProposalStatusBadge(), STATUS_CONFIG

### Community 131 - "TaskList.jsx"
Cohesion: 0.48
Nodes (4): TaskForm(), PRIORITY_COLORS, TaskItem(), TaskList()

### Community 132 - "TimeTracker.jsx"
Cohesion: 0.52
Nodes (4): TimeEntryForm(), TimeEntryItem(), TimeEntryList(), TimeTracker()

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
Cohesion: 0.13
Nodes (16): AboutPage(), fadeUp(), scaleIn, slideFrom(), A11yContext, CTA(), categoryIcons, HomeClient() (+8 more)

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

### Community 154 - "LandingPageTemplate.jsx"
Cohesion: 0.17
Nodes (12): ConstructionWebsiteDesignPage(), metadata, EcommerceWebDesignAgencyPage(), metadata, LawFirmWebDesignPage(), metadata, metadata, ResponsiveWebDesignServicesPage() (+4 more)

### Community 155 - "seo-tiers.js"
Cohesion: 0.33
Nodes (3): KEYWORD_LIMITS, PLAN_TASK_LIMITS, PLAN_TIERS

### Community 156 - "pocket/page.js"
Cohesion: 0.43
Nodes (6): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, getCRMAuthClient()

### Community 160 - "TestimonialsCarousel.jsx"
Cohesion: 0.50
Nodes (4): doubled, StarRating(), testimonials, TestimonialsCarousel()

## Knowledge Gaps
- **2 isolated node(s):** `RFC-5545`, `RFC-1918`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 637 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `supabase-crm.js` to `seo-ship.js`, `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `devops.js`, `crm.js`, `createOrUpdateLead`, `logActivity`, `tasks.js`, `systemforge.js`, `seo-plan-runs.js`, `proposals.js`, `SplitText`, `search-console.js`, `seo-reports.js`, `admin/layout.js`, `seo/page.js`, `react`, `jobber.js`, `framer-motion`, `finance.js`, `pocket.js`, `seo-plans.js`, `instant-site/start/route.js`, `businesses.js`, `@supabase/supabase-js`, `affordable-small-business-website-design/page.jsx`, `useAdminAuth`, `ProposalEditor.jsx`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `local/route.js`, `BlogPostCard`, `instant-site.js`, `clients/page.js`, `ga4.js`, `square-auth.js`, `Card`, `app/blog/tag/[slug]/page.jsx`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `google-auth.js`, `works/page.jsx`, `project-tasks.js`, `time-tracking.js`, `app/blog/series/[slug]/page.jsx`, `AdminAuthProvider.jsx`, `seo-email.js`, `cx`, `comment-automations.js`, `analytics.js`, `facebook.js`, `lucide-react`, `devops/page.js`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `stripe-crm.js`, `devops/sites/[id]/page.js`, `app/page.js`, `system-forge/layout.js`, `leads/new/page.js`, `system-forge/page.js`, `crm/page.js`, `projects/[id]/page.js`, `AdminAuthProvider.jsx`, `google-calendar.js`, `devops/layout.js`, `devops/sites/page.js`, `create/route.js`, `LandingPageTemplate.jsx`, `incidents/[id]/page.js`, `sendPushToAll`, `requireAdmin`, `lighthouse-audit/route.js`, `proposals/[id]/page.js`, `HomeClient.jsx`, `pocket/page.js`, `sites/[id]/route.js`?**
  _High betweenness centrality (0.481) - this node is a cross-community bridge._
- **What connects `RFC-5545`, `RFC-1918` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06376726417866588 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `proposals/[id]/page.js`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `TaskList.jsx`, `TimeTracker.jsx`, `HomeClient.jsx`, `SplitText`, `admin/layout.js`, `seo/page.js`, `pocket/page.js`, `framer-motion`, `TestimonialsCarousel.jsx`, `useAdminAuth`, `ProposalEditor.jsx`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `CSVImportModal.jsx`, `clients/page.js`, `Card`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `works/page.jsx`, `AdminAuthProvider.jsx`, `cx`, `analytics.js`, `lucide-react`, `devops/page.js`, `Components/Blog/BlogPostContent.jsx`, `SEOReportPanel`, `projects/page.js`, `tasks/page.js`, `HealthAPITemplate`, `devops/sites/[id]/page.js`, `system-forge/layout.js`, `cx`, `leads/new/page.js`, `system-forge/page.js`, `crm/page.js`, `projects/[id]/page.js`, `SettingsModal.jsx`, `contact/page.jsx`, `AdminAuthProvider.jsx`, `devops/layout.js`, `devops/sites/page.js`, `incidents/[id]/page.js`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `@supabase/supabase-js` to `seo-ship.js`, `InstantSiteFlow.jsx`, `supabase-crm.js`, `systemforge.js`, `seo-plan-runs.js`, `search-console.js`, `seo-reports.js`, `jobber.js`, `pocket/page.js`, `seo-plans.js`, `businesses.js`, `dependencies`, `square-auth.js`, `google-auth.js`, `comment-automations.js`, `facebook.js`, `seo-plan-validate.js`, `resend-stats.js`, `seo-plan-input.js`, `requireAdmin`, `lighthouse-audit/route.js`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `leads/[id]/page.js` be split into smaller, more focused modules?**
  _Cohesion score 0.055176890619928594 - nodes in this community are weakly interconnected._