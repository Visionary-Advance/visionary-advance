# Graph Report - visionary-advance  (2026-11-11)

## Corpus Check
- 509 files · ~299,245 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .ico 1)

## Summary
- 2831 nodes · 6796 edges · 148 communities (116 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f6a00da5`
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
- formatCurrency
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
- CSVImportModal.jsx
- 001_crm_schema.sql
- pocket.js
- seo-plans.js
- trackEvent
- package.json
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- dependencies
- useAdminAuth
- ProposalEditor.jsx
- app/blog/[slug]/page.jsx
- requireAdmin
- seo.js
- finance.js
- local/route.js
- BlogPostCard
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
- works/page.jsx
- devops-schema.sql
- incidents/[id]/page.js
- facebook.js
- @tiptap/extension-image
- @tiptap/extension-link
- github-import.js
- Components/Blog/BlogPostContent.jsx
- lucide-react
- ui.jsx
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- create/route.js
- urlForImage
- finance/layout.js
- crm-schema.sql
- cx
- income/[id]/page.js
- businesses/page.js
- system-forge/page.js
- resend-stats.js
- crm/page.js
- crm/layout.js
- sanity-boilerplate/lib/image.js
- seo-plan-input.js
- HomeClient.jsx
- pocket/page.js
- react
- sanity-boilerplate/schemas/index.js
- devops/layout.js
- inputs
- inputs
- devops/sites/[id]/page.js
- scripts
- 20261020_comment_automations.sql
- supabase_schema.sql
- KeywordsTab
- admin/page.js
- incidents/[id]/page.js
- steps
- finance/page.js
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
- services/[slug]/layout.js
- leads/new/page.js
- env
- postcss.config.mjs
- vercel.json
- env
- expenses/route.js
- with
- with
- branch
- health/route.js
- task_id
- branch
- task_id
- api-health.js
- task_title
- task_title
- success/page.jsx

## God Nodes (most connected - your core abstractions)
1. `next` - 237 edges
2. `react` - 141 edges
3. `lucide-react` - 66 edges
4. `cx()` - 65 edges
5. `supabaseCRM` - 41 edges
6. `usePersistedState()` - 36 edges
7. `logActivity()` - 35 edges
8. `Button()` - 34 edges
9. `useAdminAuth()` - 33 edges
10. `urlForImage()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `SEOSitesHome()` --indirect_call--> `isRunInFlight()`  [INFERRED]
  app/admin/seo/page.js → Components/Admin/SEO/planRuns.js
- `CRMLayout()` --calls--> `useAdminAuth()`  [EXTRACTED]
  app/admin/crm/layout.js → Components/Admin/AdminAuthProvider.jsx
- `CRMDashboardPage()` --calls--> `useAdminAuth()`  [EXTRACTED]
  app/admin/crm/page.js → Components/Admin/AdminAuthProvider.jsx
- `IncidentDetailPage()` --calls--> `useAdminAuth()`  [EXTRACTED]
  app/admin/devops/incidents/[id]/page.js → Components/Admin/AdminAuthProvider.jsx
- `IncidentsPage()` --calls--> `useAdminAuth()`  [EXTRACTED]
  app/admin/devops/incidents/page.js → Components/Admin/AdminAuthProvider.jsx

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (148 total, 32 thin omitted)

### Community 0 - "seo-ship.js"
Cohesion: 0.18
Nodes (15): POST(), POST(), POST(), sendN8nNotification(), notify(), verifyRunnerSecret(), applyShipCallback(), buildPrompt() (+7 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.07
Nodes (72): handleBookingSubmit(), FAQS, FreeTrialPage(), metadata, SpotsBanner(), FAQS, GetYourSitePage(), metadata (+64 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.07
Nodes (56): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+48 more)

### Community 4 - "businesses/[id]/page.js"
Cohesion: 0.06
Nodes (42): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG (+34 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.07
Nodes (29): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), AddFileModal(), ArrowLeftIcon(), ModuleDetailPage() (+21 more)

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (37): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+29 more)

### Community 7 - "supabase-crm.js"
Cohesion: 0.07
Nodes (22): GET(), GET(), POST(), getStripe(), POST(), createStripeInvoice(), findStripeCustomerByEmail(), formatCurrency() (+14 more)

### Community 8 - "devops.js"
Cohesion: 0.08
Nodes (32): GET(), POST(), GET(), POST(), GET(), PATCH(), POST(), POST() (+24 more)

### Community 9 - "seo-tiers.js"
Cohesion: 0.17
Nodes (13): PLAN_CATEGORIES, PLAN_EFFORTS, PLAN_PRIORITIES, toTaskRows(), validatePlan(), getPlanTaskCap(), KEYWORD_LIMITS, PLAN_TASK_LIMITS (+5 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.08
Nodes (34): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+26 more)

### Community 11 - "crm.js"
Cohesion: 0.11
Nodes (21): PATCH(), PATCH(), POST(), GET(), calculateLeadScore(), createOrUpdateLead(), getPipelineStats(), SCORE_WEIGHTS (+13 more)

### Community 12 - "logActivity"
Cohesion: 0.10
Nodes (25): GET(), POST(), POST(), POST(), GET(), POST(), DELETE(), GET() (+17 more)

### Community 13 - "tasks.js"
Cohesion: 0.10
Nodes (26): DELETE(), GET(), PATCH(), DELETE(), GET(), PATCH(), POST(), GET() (+18 more)

### Community 14 - "systemforge.js"
Cohesion: 0.14
Nodes (31): DELETE(), GET(), PATCH(), GET(), POST(), DELETE(), GET(), PATCH() (+23 more)

### Community 15 - "seo-plan-runs.js"
Cohesion: 0.25
Nodes (14): GET(), maxDuration, GET(), POST(), applyPlanRunCallback(), getLatestRuns(), getRun(), getSupabase() (+6 more)

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 17 - "formatCurrency"
Cohesion: 0.23
Nodes (12): ExpensesPage(), CategoryBadge(), CategoryPieChart(), CustomTooltip(), ExpenseForm(), CustomTooltip(), MoMChange(), MonthlyExpenseSummary() (+4 more)

### Community 18 - "search-console.js"
Cohesion: 0.14
Nodes (34): GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST(), addDashboardWidget() (+26 more)

### Community 19 - "with"
Cohesion: 0.05
Nodes (43): CALLBACK_URL, EXECUTION_FILE, RUN_ID, RUN_URL, RUNNER_SECRET, run_ids, jobs, plan (+35 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.14
Nodes (26): GET(), DELETE(), GET(), POST(), DELETE(), GET(), POST(), getDetailedAnalytics() (+18 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.10
Nodes (6): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag()

### Community 22 - "AdminAuthProvider.jsx"
Cohesion: 0.16
Nodes (28): AdminLayout(), metadata, AdminLoginPage(), AdminAuthContext, AdminAuthProvider(), PUBLIC_ROUTES, AdminScrollRestore(), isReloadOrHistoryLoad() (+20 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "createOrUpdateLead"
Cohesion: 0.10
Nodes (25): POST(), POST(), checkRateLimit(), getRateLimitKey(), POST(), rateLimitMap, resend, saveAuditToDatabase() (+17 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.18
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.18
Nodes (17): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), EugeneFAQ(), DarkVeil, EugeneHero(), EugeneTestimonials(), FinalCTA(), LocalProof() (+9 more)

### Community 29 - "CSVImportModal.jsx"
Cohesion: 0.17
Nodes (24): AlertIcon(), CheckIcon(), CSVImportModal(), ImportResult(), Step1Upload(), Step2Mapping(), Step3Preview(), UploadIcon() (+16 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "pocket.js"
Cohesion: 0.19
Nodes (21): POST(), attachRecordingToLead(), extractSummary(), formatDuration(), getRecording(), getRecordingByPocketId(), handlePocketWebhook(), ingestParsedRecording() (+13 more)

### Community 32 - "seo-plans.js"
Cohesion: 0.26
Nodes (13): POST(), GET(), PATCH(), approveDraftPlan(), archivePlan(), discardDraftPlan(), getActivePlan(), getPlans() (+5 more)

### Community 33 - "trackEvent"
Cohesion: 0.11
Nodes (32): ContactPage(), handleFormSubmit(), COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay() (+24 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (26): gsap@^3.13.0, heroicons@^2.2.0, papaparse@^5.5.3, @react-email/render@^1.4.0, styled-components@^6.1.19, supabase@^2.48.3, @tiptap/extension-table@^3.19.0, @tiptap/extension-table-header@^3.19.0 (+18 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.22
Nodes (19): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), buildKeywordPerformance(), countKeywords() (+11 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.11
Nodes (21): BlogPage(), metadata, PillBadge(), revalidate, GET(), sitemap(), getAllCategories(), getAllPosts() (+13 more)

### Community 38 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, date-fns@^4.1.0, framer-motion@^12.23.12, @gsap/react@^2.1.2, headlessui@^0.0.0, lucide-react@^0.542.0, next@^16.0.0, next-sanity@^12.0.5 (+23 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.21
Nodes (9): ArrowLeftIcon(), EditSitePage(), ArrowLeftIcon(), NewSitePage(), useAdminAuth(), CheckIcon(), ChevronIcon(), CRMLeadSelector() (+1 more)

### Community 40 - "ProposalEditor.jsx"
Cohesion: 0.15
Nodes (22): ArrowLeftIcon(), NewProposalPage(), TrashIcon(), BoldIcon(), BulletListIcon(), CodeIcon(), Divider(), HRIcon() (+14 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.21
Nodes (18): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), CTA_VARIANTS, BlogHero(), BlogPostContent() (+10 more)

### Community 42 - "requireAdmin"
Cohesion: 0.36
Nodes (8): DELETE(), PATCH(), GET(), POST(), requireAdmin(), assignRecordingToLead(), dismissRecording(), getPocketRecordings()

### Community 43 - "seo.js"
Cohesion: 0.10
Nodes (9): metadata, metadata, metadata, metadata, metadata, eugeneHostingContent, eugenePageContent, DEFAULT_OG_IMAGE (+1 more)

### Community 44 - "finance.js"
Cohesion: 0.13
Nodes (20): GET(), getQuarterForDate(), GET(), GET(), GET(), PATCH(), GET(), PaymentStatusBadge() (+12 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "BlogPostCard"
Cohesion: 0.23
Nodes (13): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, BlogPostCard(), CategoryBadge(), getAllCategorySlugs(), getCategoryBySlug() (+5 more)

### Community 48 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.14
Nodes (16): breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, CtaButton(), FinalCTA() (+8 more)

### Community 49 - "ga4.js"
Cohesion: 0.28
Nodes (13): GET(), emptyTotals(), ga4Request(), getGa4MonthlyData(), getGa4PlanData(), listGa4Properties(), listKeyEventNames(), normalizePropertyId() (+5 more)

### Community 50 - "square-auth.js"
Cohesion: 0.21
Nodes (16): GET(), POST(), dynamic, GET(), POST(), runtime, callSquareAPI(), getClientLocationId() (+8 more)

### Community 51 - "instant-site.js"
Cohesion: 0.06
Nodes (59): POST(), POST(), POST(), GET(), GET(), POST(), POST(), escapeRegex() (+51 more)

### Community 52 - "app/blog/tag/[slug]/page.jsx"
Cohesion: 0.28
Nodes (11): generateMetadata(), generateStaticParams(), revalidate, TagPage(), getAllTagSlugs(), getPostsByTag(), getTagBySlug(), generateMetadata() (+3 more)

### Community 53 - "lucide-react"
Cohesion: 0.14
Nodes (10): react-syntax-highlighter@^16.1.0, react-syntax-highlighter, components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery() (+2 more)

### Community 54 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 55 - "google-auth.js"
Cohesion: 0.17
Nodes (18): GET(), POST(), GET(), GET(), GET(), ANALYTICS_SCOPE, exchangeCodeForTokens(), generateOAuthUrl() (+10 more)

### Community 56 - "SEOAnalyticsChart.jsx"
Cohesion: 0.31
Nodes (7): LineChart(), METRICS, niceStep(), PAD, scaleFor(), xLabelIndexes(), focusRing

### Community 57 - "project-tasks.js"
Cohesion: 0.19
Nodes (11): GET(), PATCH(), POST(), DELETE(), PATCH(), completeTask(), createTask(), deleteTask() (+3 more)

### Community 58 - "time-tracking.js"
Cohesion: 0.20
Nodes (11): GET(), POST(), DELETE(), PATCH(), createTimeEntry(), deleteTimeEntry(), getProjectTimeEntries(), getProjectTimeSummary() (+3 more)

### Community 59 - "construction-website-design/page.jsx"
Cohesion: 0.17
Nodes (18): ConstructionWebsiteDesignPage(), metadata, EcommerceWebDesignAgencyPage(), metadata, LawFirmWebDesignPage(), metadata, metadata, ResponsiveWebDesignServicesPage() (+10 more)

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
Cohesion: 0.19
Nodes (26): BackgroundRuns(), Logo(), MenuLink(), NavItem(), SEOLayout(), Shell(), SidebarContent(), SiteNavItem() (+18 more)

### Community 64 - "works/page.jsx"
Cohesion: 0.15
Nodes (13): categoryIcons, fadeUp(), PillBadge(), ProjectCard(), staggerContainer, WorksPage(), PillBadge(), tabs (+5 more)

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "incidents/[id]/page.js"
Cohesion: 0.28
Nodes (12): ChartIcon(), CheckIcon(), DevOpsDashboardPage(), fetchStats(), runAllChecks(), formatTimeAgo(), PlusIcon(), RefreshIcon() (+4 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.17
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 72 - "lucide-react"
Cohesion: 0.14
Nodes (49): SEOSitesHome(), SiteRow(), SEOReportsPage(), LEGACY_TABS, PlanCard(), SiteOverviewPage(), TopTable(), fmtCompact() (+41 more)

### Community 73 - "ui.jsx"
Cohesion: 0.14
Nodes (23): SiteSettingsPage(), AddSiteModal(), PERMISSIONS, LinkToBusinessModal(), DAYS, ScheduleModal(), SendReportModal(), authFetch() (+15 more)

### Community 74 - "tasks/page.js"
Cohesion: 0.19
Nodes (7): BuildingIcon(), CheckIcon(), PlusIcon(), PRIORITY_COLORS, TASK_TYPES, TasksPage(), TrashIcon()

### Community 75 - "HealthAPITemplate"
Cohesion: 0.23
Nodes (9): CheckIcon(), ChevronIcon(), CopyIcon(), generateAPIKey(), HealthAPITemplate(), handleGenerateKey(), HealthAPITemplateCompact(), InfoIcon() (+1 more)

### Community 76 - "20260201_all_tables.sql"
Cohesion: 0.26
Nodes (13): crm_activities, crm_leads, crm_stage_history, google_oauth, idx_crm_activities_created_at, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email (+5 more)

### Community 78 - "create/route.js"
Cohesion: 0.15
Nodes (20): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+12 more)

### Community 79 - "urlForImage"
Cohesion: 0.19
Nodes (17): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), generateBreadcrumbSchema(), getAllSeriesSlugs(), getSeriesBySlug(), date-fns (+9 more)

### Community 80 - "finance/layout.js"
Cohesion: 0.32
Nodes (11): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ExpensesIcon(), FinanceLayout(), HomeIcon(), IncomeIcon(), LogoutIcon() (+3 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "cx"
Cohesion: 0.10
Nodes (37): CompactRunProgress(), RunLink(), RunProgressCard(), usePlanRunProgress(), authFetch(), isRunInFlight(), PlanRunsContext, RUN_IN_FLIGHT (+29 more)

### Community 83 - "income/[id]/page.js"
Cohesion: 0.23
Nodes (12): ArrowLeftIcon(), DetailField(), ExternalLinkIcon(), IncomeDetailPage(), SummaryRow(), TaxRow(), IncomePage(), POST() (+4 more)

### Community 84 - "businesses/page.js"
Cohesion: 0.16
Nodes (20): BuildingIcon(), BusinessesPage(), ChartIcon(), PlusIcon(), SearchIcon(), UsersIcon(), ClientIcon(), ClientsPage() (+12 more)

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.16
Nodes (16): GET(), GET(), GET(), maxDuration, verifyCronRequest(), addDays(), bareAddress(), dayOf() (+8 more)

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
Cohesion: 0.19
Nodes (20): inspectUrl(), attr(), checkPage(), decode(), fetchWithTimeout(), isOwnPage(), mapLimit(), metaContent() (+12 more)

### Community 92 - "HomeClient.jsx"
Cohesion: 0.12
Nodes (20): HomePage(), metadata, CTA(), categoryIcons, HomeClient(), PillBadge(), ProjectCard(), PricingSection() (+12 more)

### Community 93 - "pocket/page.js"
Cohesion: 0.43
Nodes (6): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, getCRMAuthClient()

### Community 94 - "react"
Cohesion: 0.07
Nodes (19): AboutPage(), fadeUp(), scaleIn, slideFrom(), FinanceSettingsPage(), AuditPage(), tips, services (+11 more)

### Community 96 - "devops/layout.js"
Cohesion: 0.38
Nodes (9): AlertIcon(), ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), DevOpsLayout(), HomeIcon(), LogoutIcon(), MenuIcon() (+1 more)

### Community 99 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 100 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 101 - "devops/sites/[id]/page.js"
Cohesion: 0.17
Nodes (17): GridIcon(), PlusIcon(), ServerIcon(), SitesListPage(), SiteTableRow(), StatusTab(), TableIcon(), CheckHistoryTable() (+9 more)

### Community 102 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 105 - "KeywordsTab"
Cohesion: 0.39
Nodes (5): SiteKeywordsPage(), SitePlanPage(), SiteReportsPage(), SiteContext, useSite()

### Community 106 - "admin/page.js"
Cohesion: 0.36
Nodes (8): AdminDashboard(), ArrowIcon(), CRMIcon(), DevOpsIcon(), FinanceIcon(), ForgeIcon(), SEOIcon(), SettingsIcon()

### Community 107 - "incidents/[id]/page.js"
Cohesion: 0.12
Nodes (23): ArrowLeftIcon(), INCIDENT_STATUSES, IncidentDetailPage(), fetchIncident(), updateStatus(), STATUS_CONFIG, CheckIcon(), INCIDENT_STATUSES (+15 more)

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 110 - "finance/page.js"
Cohesion: 0.20
Nodes (11): FinanceDashboard(), TaxEstimatorPage(), AlertIcon(), DeadlineAlert(), FinanceStatCard(), CustomTooltip(), MonthlyChart(), QuarterlyCard() (+3 more)

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

### Community 131 - "leads/new/page.js"
Cohesion: 0.50
Nodes (4): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES

### Community 133 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 141 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

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

## Knowledge Gaps
- **1 isolated node(s):** `RFC-5545`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 611 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `supabase-crm.js` to `seo-ship.js`, `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `leads/new/page.js`, `vault/[id]/page.js`, `app/layout.js`, `devops.js`, `crm.js`, `logActivity`, `tasks.js`, `expenses/route.js`, `seo-plan-runs.js`, `proposals.js`, `systemforge.js`, `search-console.js`, `health/route.js`, `seo-reports.js`, `AdminAuthProvider.jsx`, `api-health.js`, `createOrUpdateLead`, `tasks/[id]/page.js`, `jobber.js`, `framer-motion`, `success/page.jsx`, `pocket.js`, `seo-plans.js`, `trackEvent`, `package.json`, `businesses.js`, `@supabase/supabase-js`, `dependencies`, `useAdminAuth`, `ProposalEditor.jsx`, `app/blog/[slug]/page.jsx`, `requireAdmin`, `finance.js`, `local/route.js`, `BlogPostCard`, `revalidate/route.js`, `affordable-small-business-website-design/page.jsx`, `ga4.js`, `square-auth.js`, `instant-site.js`, `app/blog/tag/[slug]/page.jsx`, `lucide-react`, `google-auth.js`, `project-tasks.js`, `time-tracking.js`, `construction-website-design/page.jsx`, `system-forge/layout.js`, `useAdminAuth`, `works/page.jsx`, `incidents/[id]/page.js`, `facebook.js`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `lucide-react`, `ui.jsx`, `tasks/page.js`, `create/route.js`, `urlForImage`, `finance/layout.js`, `income/[id]/page.js`, `businesses/page.js`, `system-forge/page.js`, `resend-stats.js`, `crm/page.js`, `crm/layout.js`, `HomeClient.jsx`, `pocket/page.js`, `react`, `devops/layout.js`, `devops/sites/[id]/page.js`, `admin/page.js`, `incidents/[id]/page.js`?**
  _High betweenness centrality (0.426) - this node is a cross-community bridge._
- **What connects `RFC-5545` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06613924050632912 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `leads/new/page.js`, `vault/[id]/page.js`, `app/layout.js`, `formatCurrency`, `AdminAuthProvider.jsx`, `tasks/[id]/page.js`, `success/page.jsx`, `framer-motion`, `CSVImportModal.jsx`, `trackEvent`, `package.json`, `dependencies`, `useAdminAuth`, `ProposalEditor.jsx`, `app/blog/[slug]/page.jsx`, `finance.js`, `lucide-react`, `SEOAnalyticsChart.jsx`, `system-forge/layout.js`, `useAdminAuth`, `works/page.jsx`, `incidents/[id]/page.js`, `Components/Blog/BlogPostContent.jsx`, `lucide-react`, `ui.jsx`, `tasks/page.js`, `HealthAPITemplate`, `finance/layout.js`, `cx`, `income/[id]/page.js`, `businesses/page.js`, `system-forge/page.js`, `crm/page.js`, `crm/layout.js`, `HomeClient.jsx`, `pocket/page.js`, `devops/layout.js`, `devops/sites/[id]/page.js`, `KeywordsTab`, `admin/page.js`, `incidents/[id]/page.js`, `finance/page.js`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `works/page.jsx`, `trackEvent`, `InstantSiteFlow.jsx`, `package.json`, `app/layout.js`, `Components/Blog/BlogPostContent.jsx`, `lucide-react`, `ui.jsx`, `app/blog/[slug]/page.jsx`, `dependencies`, `HomeClient.jsx`, `affordable-small-business-website-design/page.jsx`, `cx`, `lucide-react`, `SEOAnalyticsChart.jsx`, `construction-website-design/page.jsx`, `framer-motion`, `useAdminAuth`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `leads/[id]/page.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._