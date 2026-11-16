# Graph Report - visionary-advance  (2026-11-16)

## Corpus Check
- 535 files · ~308,125 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .css 1)

## Summary
- 2963 nodes · 7684 edges · 143 communities (115 shown, 28 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1458dfcc`
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
- crm.js
- devops.js
- devops-approvals.js
- 20260201_seo_tables.sql
- createOrUpdateLead
- logActivity
- tasks.js
- systemforge.js
- seo-plan-runs.js
- proposals.js
- ProposalEditor.jsx
- search-console.js
- with
- seo-reports.js
- sanity-boilerplate/lib/sanity.js
- AdminAuthProvider.jsx
- sanity
- seo/layout.js
- projects/[id]/page.js
- 20260201_systemforge_tables.sql
- jobber.js
- framer-motion
- finance.js
- 001_crm_schema.sql
- SplitText
- requireAdmin
- instant-site.js
- lucide-react
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- affordable-small-business-website-design/page.jsx
- useAdminAuth
- app/blog/category/[slug]/page.jsx
- app/blog/[slug]/page.jsx
- package.json
- Card
- sanity-boilerplate/Components/Blog/BlogCTA.jsx
- local/route.js
- BlogPostCard
- construction-website-design/page.jsx
- CSVImportModal.jsx
- ga4.js
- square-auth.js
- Card
- seo/layout.js
- sanity-boilerplate/Components/Blog/BlogPostContent.jsx
- compilerOptions
- google-auth.js
- works/page.jsx
- project-tasks.js
- time-tracking.js
- app/blog/series/[slug]/page.jsx
- planRuns.js
- 20260223_finance_tables.sql
- seo-email.js
- urlForImage
- ProposalCard
- devops-schema.sql
- useRecaptcha
- facebook.js
- lucide-react
- Badge
- github-import.js
- Components/Blog/BlogPostContent.jsx
- services/[slug]/layout.js
- projects/page.js
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- stripe-crm.js
- SectionShell.jsx
- next
- InvoiceList.jsx
- crm-schema.sql
- cx
- leads/new/page.js
- eugene-web-design/layout.js
- system-forge/page.js
- publish-blog-drafts.mjs
- resend-stats.js
- crm/page.js
- sanity-boilerplate/lib/image.js
- seo-plan-input.js
- businesses/page.js
- contact/page.jsx
- sanity-boilerplate/schemas/index.js
- inputs
- inputs
- 20261020_comment_automations.sql
- supabase_schema.sql
- clients/page.js
- steps
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
- TimeTracker.jsx
- github/seo-ship-task.yml
- HomeClient.jsx
- env
- postcss.config.mjs
- vercel.json
- env
- devDependencies
- app/page.js
- with
- with
- branch
- 20261115_push_subscriptions.sql
- task_id
- branch
- task_id
- task_title
- task_title
- seo.js

## God Nodes (most connected - your core abstractions)
1. `next` - 250 edges
2. `react` - 147 edges
3. `cx()` - 98 edges
4. `lucide-react` - 89 edges
5. `Button()` - 61 edges
6. `requireAdmin()` - 55 edges
7. `Card()` - 53 edges
8. `useToast()` - 50 edges
9. `supabaseCRM` - 44 edges
10. `CardHeader()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `approve()` --calls--> `devopsApi()`  [EXTRACTED]
  app/admin/devops/approvals/page.js → Components/Admin/DevOps/api.js
- `sendBack()` --calls--> `devopsApi()`  [EXTRACTED]
  app/admin/devops/approvals/page.js → Components/Admin/DevOps/api.js
- `GET()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/api/devops/incidents/route.js → lib/admin-api-auth.js
- `handleBookingSubmit()` --calls--> `trackEvent()`  [EXTRACTED]
  app/contact/page.jsx → lib/analytics.js
- `handleSubmit()` --calls--> `trackEvent()`  [EXTRACTED]
  Components/Booking/SetupCallBooking.jsx → lib/analytics.js

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (143 total, 28 thin omitted)

### Community 0 - "seo-ship.js"
Cohesion: 0.21
Nodes (13): POST(), POST(), APP_URL, applyShipCallback(), buildPrompt(), dispatchShipTask(), getSupabase(), IN_FLIGHT (+5 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.11
Nodes (45): BUILD_STEPS, BuildingStep(), poll(), BusinessCard(), BusinessStep(), submit(), collectMeta(), ContactStep() (+37 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.07
Nodes (56): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+48 more)

### Community 4 - "businesses/[id]/page.js"
Cohesion: 0.29
Nodes (9): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), ProjectCard(), STATUS_CONFIG, ProjectForm() (+1 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.07
Nodes (29): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), AddFileModal(), ArrowLeftIcon(), ModuleDetailPage() (+21 more)

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (38): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+30 more)

### Community 7 - "crm.js"
Cohesion: 0.06
Nodes (17): PATCH(), PATCH(), GET(), getPipelineStats(), SCORE_WEIGHTS, SOURCES, STAGES, toggleActivityPin() (+9 more)

### Community 8 - "devops.js"
Cohesion: 0.13
Nodes (23): GET(), POST(), GET(), POST(), POST(), autoResolveIncidents(), BLOCKED_STATUS_CODES, checkSSL() (+15 more)

### Community 9 - "devops-approvals.js"
Cohesion: 0.13
Nodes (33): GET(), POST(), POST(), GET(), POST(), applyPullRequestClosed(), ApprovalError, approveAndMerge() (+25 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.07
Nodes (35): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+27 more)

### Community 11 - "createOrUpdateLead"
Cohesion: 0.05
Nodes (60): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+52 more)

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
Cohesion: 0.19
Nodes (18): POST(), GET(), maxDuration, GET(), POST(), sendN8nNotification(), applyPlanRunCallback(), getLatestRuns() (+10 more)

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 17 - "ProposalEditor.jsx"
Cohesion: 0.13
Nodes (24): ArrowLeftIcon(), NewProposalPage(), TrashIcon(), BoldIcon(), BulletListIcon(), CodeIcon(), Divider(), HRIcon() (+16 more)

### Community 18 - "search-console.js"
Cohesion: 0.13
Nodes (36): GET(), maxDuration, GET(), POST(), DELETE(), GET(), PATCH(), POST() (+28 more)

### Community 19 - "with"
Cohesion: 0.04
Nodes (45): CALLBACK_URL, EXECUTION_FILE, HAS_TOKEN, REPO, RUN_ID, RUN_URL, RUNNER_SECRET, run_ids (+37 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.15
Nodes (26): GET(), DELETE(), GET(), DELETE(), GET(), POST(), getDetailedAnalytics(), buildKeywordPerformance() (+18 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.09
Nodes (10): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag(), client, previewClient (+2 more)

### Community 22 - "AdminAuthProvider.jsx"
Cohesion: 0.05
Nodes (61): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, AdminLayout(), metadata, viewport (+53 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "seo/layout.js"
Cohesion: 0.14
Nodes (12): SiteKeywordsPage(), SiteLayout(), SiteSwitcher(), SitePlanPage(), SiteReportsPage(), hostOf(), siteHref(), patchSite() (+4 more)

### Community 25 - "projects/[id]/page.js"
Cohesion: 0.22
Nodes (11): ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge(), CheckIcon(), MilestoneTimeline(), TaskForm() (+3 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.18
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.20
Nodes (18): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), businessTypes, EugeneContactSection(), Field(), EugeneFAQ(), EugeneTestimonials(), FinalCTA() (+10 more)

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
Cohesion: 0.10
Nodes (26): dynamic, GET(), noStore, GET(), POST(), GET(), POST(), GET() (+18 more)

### Community 33 - "instant-site.js"
Cohesion: 0.05
Nodes (73): POST(), POST(), POST(), POST(), GET(), GET(), POST(), POST() (+65 more)

### Community 34 - "lucide-react"
Cohesion: 0.12
Nodes (48): Fact(), IncidentDetailPage(), update(), IncidentsPage(), VIEWS, DevOpsLayout(), DevOpsOverviewPage(), runAllChecks() (+40 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.16
Nodes (21): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), countKeywords(), dateString() (+13 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.14
Nodes (17): BlogPage(), metadata, PillBadge(), revalidate, GET(), sitemap(), getAllCategories(), getAllPosts() (+9 more)

### Community 38 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.18
Nodes (11): breadcrumbSchema, faqSchema, metadata, productSchema, schemas, CtaButton(), FinalCTA(), HowFast() (+3 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.24
Nodes (7): CheckIcon(), ChevronIcon(), CRMLeadSelector(), fetchLeads(), XIcon(), authFetch(), handleShip()

### Community 40 - "app/blog/category/[slug]/page.jsx"
Cohesion: 0.29
Nodes (12): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, BlogPostCard(), getAllCategorySlugs(), getCategoryBySlug(), getPostsByCategory() (+4 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.22
Nodes (17): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), CTA_VARIANTS, BlogPostContent(), RelatedPosts() (+9 more)

### Community 42 - "package.json"
Cohesion: 0.05
Nodes (58): dependencies, date-fns@^4.1.0, framer-motion@^12.23.12, gsap@^3.13.0, @gsap/react@^2.1.2, headlessui@^0.0.0, heroicons@^2.2.0, lucide-react@^0.542.0 (+50 more)

### Community 43 - "Card"
Cohesion: 0.10
Nodes (56): dateOf(), ExpensesPage(), dateOf(), IncomeDetailPage(), methodLabel(), dateOf(), IncomePage(), methodLabel() (+48 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "BlogPostCard"
Cohesion: 0.28
Nodes (11): generateMetadata(), generateStaticParams(), revalidate, TagPage(), getAllTagSlugs(), getPostsByTag(), getTagBySlug(), generateMetadata() (+3 more)

### Community 47 - "construction-website-design/page.jsx"
Cohesion: 0.14
Nodes (21): NinetyNineDollarWebsitesPage(), ConstructionWebsiteDesignPage(), metadata, EcommerceWebDesignAgencyPage(), metadata, LawFirmWebDesignPage(), metadata, metadata (+13 more)

### Community 48 - "CSVImportModal.jsx"
Cohesion: 0.16
Nodes (25): AlertIcon(), CheckIcon(), CSVImportModal(), ImportResult(), Step1Upload(), Step2Mapping(), Step3Preview(), UploadIcon() (+17 more)

### Community 49 - "ga4.js"
Cohesion: 0.28
Nodes (13): GET(), emptyTotals(), ga4Request(), getGa4MonthlyData(), getGa4PlanData(), listGa4Properties(), listKeyEventNames(), normalizePropertyId() (+5 more)

### Community 50 - "square-auth.js"
Cohesion: 0.21
Nodes (16): GET(), POST(), dynamic, GET(), POST(), runtime, callSquareAPI(), getClientLocationId() (+8 more)

### Community 51 - "Card"
Cohesion: 0.12
Nodes (50): SEOSitesHome(), SiteRow(), SEOReportsPage(), LEGACY_TABS, PlanCard(), SiteOverviewPage(), TopTable(), fmtCompact() (+42 more)

### Community 52 - "seo/layout.js"
Cohesion: 0.19
Nodes (22): AccountSheet(), BackgroundRuns(), Logo(), MenuLink(), MobileHeader(), NavItem(), RunsSheet(), SEOLayout() (+14 more)

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
Cohesion: 0.28
Nodes (11): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), generateBreadcrumbSchema(), getAllSeriesSlugs(), getSeriesBySlug(), generateMetadata() (+3 more)

### Community 60 - "planRuns.js"
Cohesion: 0.26
Nodes (14): RunLink(), RunProgressCard(), usePlanRunProgress(), accessToken(), isRunInFlight(), PlanRunsContext, PlanRunsProvider(), RUN_IN_FLIGHT (+6 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.23
Nodes (14): POST(), breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatDateRange(), formatKeywordRow() (+6 more)

### Community 63 - "urlForImage"
Cohesion: 0.30
Nodes (8): BlogHero(), CategoryBadge(), date-fns, BlogHero(), BlogPostCard(), CategoryBadge(), RelatedPosts(), urlForImage()

### Community 64 - "ProposalCard"
Cohesion: 0.25
Nodes (12): ArrowLeftIcon(), LinkIcon(), ProposalDetailPage(), SendIcon(), EditIcon(), EyeIcon(), LinkIcon(), ProposalCard() (+4 more)

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "useRecaptcha"
Cohesion: 0.15
Nodes (21): ContactPage(), handleBookingSubmit(), handleFormSubmit(), ContactForm(), projectTypes, timelines, AuditResultPanel(), ScoreCircle() (+13 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "lucide-react"
Cohesion: 0.08
Nodes (40): FIELDS, FinanceSettingsPage(), SiteSettingsPage(), StatusDot(), ExpenseForm(), ExpenseFormModal(), today(), blank() (+32 more)

### Community 69 - "Badge"
Cohesion: 0.32
Nodes (13): ApprovalCard(), Approvals(), ApprovalsPage(), ChecksBadge(), FileDiff(), MergeableBadge(), PreviewBadge(), ReviewDrawer() (+5 more)

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.17
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

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

### Community 78 - "SectionShell.jsx"
Cohesion: 0.31
Nodes (8): CRMLayout(), NAV_ITEMS, FinanceLayout(), NAV_ITEMS, DesktopUserMenu(), NavBadge(), SectionShell(), SheetLink()

### Community 79 - "next"
Cohesion: 0.06
Nodes (9): PRIORITY_COLORS, TASK_TYPE_LABELS, serverStartTime, ErrorContent(), SquareError(), SquareSuccess(), SuccessContent(), next (+1 more)

### Community 80 - "InvoiceList.jsx"
Cohesion: 0.46
Nodes (6): DownloadIcon(), ExternalLinkIcon(), InvoiceCard(), InvoiceList(), RefreshIcon(), StripeIcon()

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "cx"
Cohesion: 0.07
Nodes (19): capitalize(), DetailSection(), EFFORT, HistoryModal(), manualReason(), PlanSidePanel(), PRIORITY, readTaskParam() (+11 more)

### Community 83 - "leads/new/page.js"
Cohesion: 0.50
Nodes (4): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "publish-blog-drafts.mjs"
Cohesion: 0.06
Nodes (44): POST(), GET(), PATCH(), PLAN_CATEGORIES, PLAN_EFFORTS, PLAN_PRIORITIES, toTaskRows(), validatePlan() (+36 more)

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
Cohesion: 0.15
Nodes (23): RFC-1918, inspectUrl(), attr(), checkPage(), decode(), fetchWithTimeout(), isOwnPage(), isPrivateAddress() (+15 more)

### Community 93 - "businesses/page.js"
Cohesion: 0.36
Nodes (8): BuildingIcon(), BusinessesPage(), ChartIcon(), PlusIcon(), SearchIcon(), UsersIcon(), INDUSTRIES, IndustrySelect()

### Community 94 - "contact/page.jsx"
Cohesion: 0.17
Nodes (14): COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay(), MONTHS, TimeSlots() (+6 more)

### Community 99 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 100 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 106 - "clients/page.js"
Cohesion: 0.46
Nodes (6): ClientIcon(), ClientsPage(), PlusIcon(), SearchIcon(), TrashIcon(), Fab()

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 110 - "pocket.js"
Cohesion: 0.13
Nodes (28): DELETE(), PATCH(), GET(), POST(), POST(), assignRecordingToLead(), attachRecordingToLead(), dismissRecording() (+20 more)

### Community 111 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 126 - "workflows/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 127 - "TimeTracker.jsx"
Cohesion: 0.52
Nodes (4): TimeEntryForm(), TimeEntryItem(), TimeEntryList(), TimeTracker()

### Community 129 - "github/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 131 - "HomeClient.jsx"
Cohesion: 0.17
Nodes (13): CTA(), categoryIcons, HomeClient(), PillBadge(), ProjectCard(), PricingSection(), projectPlans, seoPlans (+5 more)

### Community 133 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 141 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 142 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, typescript@5.9.3, tailwindcss, @tailwindcss/postcss, typescript

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

### Community 154 - "seo.js"
Cohesion: 0.12
Nodes (7): metadata, metadata, metadata, metadata, eugeneHostingContent, DEFAULT_OG_IMAGE, SYSTEMS_PAGE_META

## Knowledge Gaps
- **2 isolated node(s):** `RFC-5545`, `RFC-1918`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 641 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `seo-ship.js`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `crm.js`, `devops.js`, `devops-approvals.js`, `HomeClient.jsx`, `createOrUpdateLead`, `logActivity`, `tasks.js`, `systemforge.js`, `seo-plan-runs.js`, `proposals.js`, `ProposalEditor.jsx`, `search-console.js`, `app/page.js`, `seo-reports.js`, `AdminAuthProvider.jsx`, `seo/layout.js`, `projects/[id]/page.js`, `jobber.js`, `framer-motion`, `finance.js`, `SplitText`, `requireAdmin`, `instant-site.js`, `lucide-react`, `businesses.js`, `@supabase/supabase-js`, `affordable-small-business-website-design/page.jsx`, `app/blog/category/[slug]/page.jsx`, `app/blog/[slug]/page.jsx`, `package.json`, `Card`, `local/route.js`, `BlogPostCard`, `construction-website-design/page.jsx`, `ga4.js`, `square-auth.js`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `google-auth.js`, `works/page.jsx`, `project-tasks.js`, `time-tracking.js`, `app/blog/series/[slug]/page.jsx`, `seo-email.js`, `urlForImage`, `ProposalCard`, `useRecaptcha`, `facebook.js`, `lucide-react`, `Badge`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `stripe-crm.js`, `SectionShell.jsx`, `leads/new/page.js`, `system-forge/page.js`, `publish-blog-drafts.mjs`, `resend-stats.js`, `crm/page.js`, `businesses/page.js`, `clients/page.js`, `pocket.js`?**
  _High betweenness centrality (0.453) - this node is a cross-community bridge._
- **What connects `RFC-5545`, `RFC-1918` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11347517730496454 - nodes in this community are weakly interconnected._
- **Why does `react` connect `lucide-react` to `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `HomeClient.jsx`, `ProposalEditor.jsx`, `AdminAuthProvider.jsx`, `seo/layout.js`, `projects/[id]/page.js`, `framer-motion`, `SplitText`, `instant-site.js`, `lucide-react`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `package.json`, `Card`, `sanity-boilerplate/Components/Blog/BlogCTA.jsx`, `CSVImportModal.jsx`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `works/page.jsx`, `planRuns.js`, `ProposalCard`, `useRecaptcha`, `Badge`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `HealthAPITemplate`, `SectionShell.jsx`, `next`, `InvoiceList.jsx`, `cx`, `leads/new/page.js`, `system-forge/page.js`, `crm/page.js`, `businesses/page.js`, `contact/page.jsx`, `clients/page.js`, `TimeTracker.jsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `InstantSiteFlow.jsx`, `HomeClient.jsx`, `app/layout.js`, `seo/layout.js`, `framer-motion`, `SplitText`, `instant-site.js`, `affordable-small-business-website-design/page.jsx`, `app/blog/[slug]/page.jsx`, `package.json`, `Card`, `sanity-boilerplate/Components/Blog/BlogCTA.jsx`, `construction-website-design/page.jsx`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `works/page.jsx`, `planRuns.js`, `useRecaptcha`, `lucide-react`, `Badge`, `Components/Blog/BlogPostContent.jsx`, `SectionShell.jsx`, `cx`, `contact/page.jsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `leads/[id]/page.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._