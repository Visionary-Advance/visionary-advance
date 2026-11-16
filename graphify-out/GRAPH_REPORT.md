# Graph Report - visionary-advance  (2026-11-16)

## Corpus Check
- 536 files · ~309,076 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .css 1)

## Summary
- 2970 nodes · 7700 edges · 155 communities (127 shown, 28 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ddbd2d03`
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
- admin/layout.js
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
- generateBreadcrumbSchema
- app/blog/[slug]/page.jsx
- package.json
- Card
- react
- local/route.js
- supabase-crm.js
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
- cx
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
- seo-tiers.js
- crm-schema.sql
- cx
- leads/new/page.js
- eugene-web-design/layout.js
- system-forge/page.js
- publish-blog-drafts.mjs
- resend-stats.js
- crm/page.js
- admin-api-auth.js
- sanity-boilerplate/lib/image.js
- seo-plan-input.js
- comment-automations.js
- seo-plans.js
- contact/page.jsx
- sanity-boilerplate/schemas/index.js
- instant-site/start/route.js
- admin-auth.js
- SettingsModal.jsx
- inputs
- inputs
- system-forge/layout.js
- create/route.js
- 20261020_comment_automations.sql
- supabase_schema.sql
- google-calendar.js
- lucide-react
- AdminAuthProvider.jsx
- steps
- lighthouse-audit/route.js
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
- hubspot.js
- generate-icons.mjs
- github/seo-ship-task.yml
- pocket/page.js
- HomeClient.jsx
- sendPushToAll
- env
- postcss.config.mjs
- vercel.json
- env
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
2. `react` - 148 edges
3. `cx()` - 100 edges
4. `lucide-react` - 90 edges
5. `Button()` - 61 edges
6. `requireAdmin()` - 55 edges
7. `Card()` - 53 edges
8. `useToast()` - 50 edges
9. `supabaseCRM` - 44 edges
10. `CardHeader()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `trackEvent()`  [EXTRACTED]
  Components/Booking/SetupCallBooking.jsx → lib/analytics.js
- `POST()` --calls--> `logActivity()`  [EXTRACTED]
  app/api/crm/clients/route.js → lib/crm.js
- `POST()` --calls--> `logActivity()`  [EXTRACTED]
  app/api/crm/leads/[id]/activities/route.js → lib/crm.js
- `GET()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/api/devops/incidents/route.js → lib/admin-api-auth.js
- `SEOSitesHome()` --indirect_call--> `isRunInFlight()`  [INFERRED]
  app/admin/seo/page.js → Components/Admin/SEO/planRuns.js

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (155 total, 28 thin omitted)

### Community 0 - "seo-ship.js"
Cohesion: 0.21
Nodes (13): POST(), POST(), APP_URL, applyShipCallback(), buildPrompt(), dispatchShipTask(), getSupabase(), IN_FLIGHT (+5 more)

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
Cohesion: 0.10
Nodes (29): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), BuildingIcon(), BusinessesPage(), ChartIcon() (+21 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.07
Nodes (29): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), AddFileModal(), ArrowLeftIcon(), ModuleDetailPage() (+21 more)

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (38): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+30 more)

### Community 7 - "crm.js"
Cohesion: 0.12
Nodes (17): PATCH(), PATCH(), POST(), GET(), getPipelineStats(), SCORE_WEIGHTS, SOURCES, STAGES (+9 more)

### Community 8 - "devops.js"
Cohesion: 0.13
Nodes (22): GET(), GET(), POST(), POST(), autoResolveIncidents(), BLOCKED_STATUS_CODES, checkSSL(), createIncident() (+14 more)

### Community 9 - "devops-approvals.js"
Cohesion: 0.17
Nodes (30): GET(), POST(), applyPullRequestClosed(), ApprovalError, approveAndMerge(), countPendingApprovals(), getApproval(), getSupabase() (+22 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.07
Nodes (35): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+27 more)

### Community 11 - "createOrUpdateLead"
Cohesion: 0.16
Nodes (18): POST(), POST(), resend, sendAdminNotification(), sendUserAuditEmail(), POST(), POST(), calculateLeadScore() (+10 more)

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
Cohesion: 0.19
Nodes (18): POST(), GET(), maxDuration, GET(), POST(), sendN8nNotification(), applyPlanRunCallback(), getLatestRuns() (+10 more)

### Community 16 - "proposals.js"
Cohesion: 0.09
Nodes (31): GET(), GET(), POST(), DELETE(), GET(), PATCH(), DELETE(), GET() (+23 more)

### Community 17 - "ProposalEditor.jsx"
Cohesion: 0.15
Nodes (22): ArrowLeftIcon(), NewProposalPage(), TrashIcon(), BoldIcon(), BulletListIcon(), CodeIcon(), Divider(), HRIcon() (+14 more)

### Community 18 - "search-console.js"
Cohesion: 0.13
Nodes (36): GET(), maxDuration, GET(), DELETE(), GET(), PATCH(), POST(), POST() (+28 more)

### Community 19 - "with"
Cohesion: 0.04
Nodes (45): CALLBACK_URL, EXECUTION_FILE, HAS_TOKEN, REPO, RUN_ID, RUN_URL, RUNNER_SECRET, run_ids (+37 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.13
Nodes (29): GET(), DELETE(), GET(), POST(), POST(), DELETE(), GET(), POST() (+21 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.10
Nodes (6): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag()

### Community 22 - "admin/layout.js"
Cohesion: 0.12
Nodes (14): AdminLayout(), metadata, viewport, AdminBottomNav(), NAV, SPRING, AdminScrollRestore(), isReloadOrHistoryLoad() (+6 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "seo/layout.js"
Cohesion: 0.14
Nodes (12): SiteKeywordsPage(), SiteLayout(), SiteSwitcher(), SitePlanPage(), SiteReportsPage(), hostOf(), siteHref(), patchSite() (+4 more)

### Community 25 - "projects/[id]/page.js"
Cohesion: 0.16
Nodes (18): ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge(), CheckIcon(), MilestoneTimeline(), TaskList() (+10 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.23
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.18
Nodes (18): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), businessTypes, EugeneContactSection(), Field(), EugeneFAQ(), EugeneTestimonials(), FinalCTA() (+10 more)

### Community 29 - "finance.js"
Cohesion: 0.12
Nodes (22): GET(), GET(), getQuarterForDate(), GET(), GET(), GET(), PATCH(), GET() (+14 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "SplitText"
Cohesion: 0.12
Nodes (19): AboutPage(), fadeUp(), scaleIn, slideFrom(), AuditPage(), tips, services, ServicesPage() (+11 more)

### Community 32 - "requireAdmin"
Cohesion: 0.10
Nodes (21): dynamic, GET(), noStore, POST(), POST(), GET(), GET(), PATCH() (+13 more)

### Community 33 - "instant-site.js"
Cohesion: 0.15
Nodes (25): POST(), POST(), POST(), GET(), GET(), POST(), alertInstantSiteFailed(), alertInstantSiteLead() (+17 more)

### Community 34 - "lucide-react"
Cohesion: 0.13
Nodes (31): approve(), sendBack(), Fact(), IncidentDetailPage(), update(), IncidentsPage(), VIEWS, DevOpsOverviewPage() (+23 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.24
Nodes (17): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), countKeywords(), dateString() (+9 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.13
Nodes (17): GET(), sitemap(), getAllCategories(), getAllPosts(), getAllSeries(), getAllTags(), getClient(), getFeaturedPosts() (+9 more)

### Community 38 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.19
Nodes (12): breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, CtaButton(), FinalCTA() (+4 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.24
Nodes (7): CheckIcon(), ChevronIcon(), CRMLeadSelector(), fetchLeads(), XIcon(), authFetch(), handleShip()

### Community 40 - "generateBreadcrumbSchema"
Cohesion: 0.13
Nodes (28): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, BlogPage(), metadata, PillBadge(), revalidate (+20 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.21
Nodes (18): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), CTA_VARIANTS, BlogHero(), BlogPostContent() (+10 more)

### Community 42 - "package.json"
Cohesion: 0.04
Nodes (62): dependencies, framer-motion@^12.23.12, gsap@^3.13.0, @gsap/react@^2.1.2, headlessui@^0.0.0, heroicons@^2.2.0, lucide-react@^0.542.0, next@^16.0.0 (+54 more)

### Community 43 - "Card"
Cohesion: 0.09
Nodes (55): dateOf(), ExpensesPage(), dateOf(), IncomeDetailPage(), methodLabel(), dateOf(), IncomePage(), methodLabel() (+47 more)

### Community 44 - "react"
Cohesion: 0.10
Nodes (11): PRIORITY_COLORS, TASK_TYPE_LABELS, ErrorContent(), SquareError(), SquareSuccess(), SuccessContent(), TaskForm(), PRIORITY_COLORS (+3 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "supabase-crm.js"
Cohesion: 0.09
Nodes (6): POST(), POST(), POST(), validateExpenseRow(), validateIncomeRow(), supabaseCRM

### Community 47 - "construction-website-design/page.jsx"
Cohesion: 0.14
Nodes (20): ConstructionWebsiteDesignPage(), metadata, EcommerceWebDesignAgencyPage(), metadata, LawFirmWebDesignPage(), metadata, metadata, ResponsiveWebDesignServicesPage() (+12 more)

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
Nodes (54): SEOSitesHome(), SiteRow(), SEOReportsPage(), LEGACY_TABS, PlanCard(), SiteOverviewPage(), TopTable(), fmtCompact() (+46 more)

### Community 52 - "seo/layout.js"
Cohesion: 0.19
Nodes (19): AccountSheet(), Logo(), MenuLink(), MobileHeader(), NavItem(), RunsSheet(), SEOLayout(), SheetLink() (+11 more)

### Community 53 - "sanity-boilerplate/Components/Blog/BlogPostContent.jsx"
Cohesion: 0.14
Nodes (10): react-syntax-highlighter@^16.1.0, react-syntax-highlighter, components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery() (+2 more)

### Community 54 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 55 - "google-auth.js"
Cohesion: 0.17
Nodes (18): GET(), POST(), GET(), GET(), GET(), ANALYTICS_SCOPE, exchangeCodeForTokens(), generateOAuthUrl() (+10 more)

### Community 56 - "works/page.jsx"
Cohesion: 0.27
Nodes (5): PillBadge(), tabs, WorkDetailPage(), portfolioProjects, worksData

### Community 57 - "project-tasks.js"
Cohesion: 0.19
Nodes (11): GET(), PATCH(), POST(), DELETE(), PATCH(), completeTask(), createTask(), deleteTask() (+3 more)

### Community 58 - "time-tracking.js"
Cohesion: 0.20
Nodes (11): GET(), POST(), DELETE(), PATCH(), createTimeEntry(), deleteTimeEntry(), getProjectTimeEntries(), getProjectTimeSummary() (+3 more)

### Community 59 - "cx"
Cohesion: 0.28
Nodes (20): Fact(), SiteDetailPage(), runCheck(), SitesPage(), siteStatus(), CheckHistoryTable(), responseColor(), ENVIRONMENT (+12 more)

### Community 60 - "planRuns.js"
Cohesion: 0.24
Nodes (16): BackgroundRuns(), SidebarContent(), CompactRunProgress(), RunLink(), RunProgressCard(), usePlanRunProgress(), accessToken(), isRunInFlight() (+8 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.27
Nodes (12): breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatDateRange(), formatKeywordRow(), generateReportHtml() (+4 more)

### Community 63 - "urlForImage"
Cohesion: 0.16
Nodes (18): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), CategoryBadge(), getAllSeriesSlugs(), getSeriesBySlug(), date-fns@^4.1.0 (+10 more)

### Community 64 - "ProposalCard"
Cohesion: 0.43
Nodes (6): ArrowLeftIcon(), LinkIcon(), ProposalDetailPage(), SendIcon(), ProposalStatusBadge(), STATUS_CONFIG

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "useRecaptcha"
Cohesion: 0.16
Nodes (20): ContactPage(), handleFormSubmit(), ContactForm(), projectTypes, timelines, AuditResultPanel(), ScoreCircle(), DarkVeil (+12 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "lucide-react"
Cohesion: 0.10
Nodes (36): FIELDS, FinanceSettingsPage(), SiteSettingsPage(), ExpenseForm(), ExpenseFormModal(), today(), blank(), IncomeForm() (+28 more)

### Community 69 - "Badge"
Cohesion: 0.45
Nodes (10): ApprovalCard(), Approvals(), ApprovalsPage(), ChecksBadge(), FileDiff(), MergeableBadge(), PreviewBadge(), ReviewDrawer() (+2 more)

### Community 70 - "github-import.js"
Cohesion: 0.24
Nodes (15): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+7 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.15
Nodes (10): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed() (+2 more)

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
Cohesion: 0.23
Nodes (19): GET(), GET(), POST(), getStripe(), POST(), createStripeInvoice(), findStripeCustomerByEmail(), formatCurrency() (+11 more)

### Community 78 - "SectionShell.jsx"
Cohesion: 0.23
Nodes (10): CRMLayout(), NAV_ITEMS, DevOpsLayout(), FinanceLayout(), NAV_ITEMS, useAdminAuth(), DesktopUserMenu(), NavBadge() (+2 more)

### Community 79 - "next"
Cohesion: 0.09
Nodes (3): serverStartTime, next, serverStartTime

### Community 80 - "seo-tiers.js"
Cohesion: 0.17
Nodes (13): PLAN_CATEGORIES, PLAN_EFFORTS, PLAN_PRIORITIES, toTaskRows(), validatePlan(), getPlanTaskCap(), KEYWORD_LIMITS, PLAN_TASK_LIMITS (+5 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "cx"
Cohesion: 0.07
Nodes (20): capitalize(), DetailSection(), DraftBanner(), EFFORT, HistoryModal(), manualReason(), PlanSidePanel(), PRIORITY (+12 more)

### Community 83 - "leads/new/page.js"
Cohesion: 0.50
Nodes (4): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "publish-blog-drafts.mjs"
Cohesion: 0.16
Nodes (16): CAT, __dirname, downloadImage(), __filename, key(), main(), makeBlock(), mdToPortableText() (+8 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.25
Nodes (12): GET(), addDays(), bareAddress(), dayOf(), DELIVERED_EVENTS, domainFromSiteUrl(), FAILED_EVENTS, getEmailCountsForSite() (+4 more)

### Community 88 - "crm/page.js"
Cohesion: 0.29
Nodes (7): CRMDashboardPage(), QuickStatCard(), ProjectWidgets(), RiskBadge(), PRIORITY_COLORS, TASK_TYPE_ICONS, TasksWidget()

### Community 89 - "admin-api-auth.js"
Cohesion: 0.19
Nodes (9): GET(), POST(), GET(), POST(), GET(), POST(), verifyCronRequest(), checkAllSites() (+1 more)

### Community 90 - "sanity-boilerplate/lib/image.js"
Cohesion: 0.20
Nodes (7): @sanity/client@^7.13.2, @sanity/image-url@^2.0.2, @sanity/client, @sanity/image-url, client, previewClient, builder

### Community 91 - "seo-plan-input.js"
Cohesion: 0.16
Nodes (22): RFC-1918, attr(), checkPage(), decode(), fetchWithTimeout(), isOwnPage(), isPrivateAddress(), mapLimit() (+14 more)

### Community 92 - "comment-automations.js"
Cohesion: 0.24
Nodes (15): POST(), escapeRegex(), extractComments(), findAccount(), findMatchingRule(), getSupabaseClient(), graphPost(), handleMetaWebhook() (+7 more)

### Community 93 - "seo-plans.js"
Cohesion: 0.26
Nodes (13): POST(), GET(), PATCH(), approveDraftPlan(), archivePlan(), discardDraftPlan(), getActivePlan(), getPlans() (+5 more)

### Community 94 - "contact/page.jsx"
Cohesion: 0.17
Nodes (14): COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay(), MONTHS, TimeSlots() (+6 more)

### Community 96 - "instant-site/start/route.js"
Cohesion: 0.27
Nodes (10): POST(), SMS_CONSENT_TEXT, normPhone(), sendMetaEvent(), sha256(), claimTrialSpot(), getSupabaseClient(), getTrialSpotsLeft() (+2 more)

### Community 97 - "admin-auth.js"
Cohesion: 0.34
Nodes (10): AdminLoginPage(), getAssuranceLevel(), getAuthClient(), getMFAStatus(), getSession(), getUser(), onAuthStateChange(), requiresMFAVerification() (+2 more)

### Community 98 - "SettingsModal.jsx"
Cohesion: 0.27
Nodes (12): authHeaders(), isStandalone(), NotificationToggle(), urlBase64ToUint8Array(), CheckIcon(), CloseIcon(), GoogleIcon(), SettingsModal() (+4 more)

### Community 99 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 100 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 101 - "system-forge/layout.js"
Cohesion: 0.29
Nodes (12): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ForgeIcon(), HomeIcon(), ImportIcon(), LogoutIcon(), MenuIcon() (+4 more)

### Community 102 - "create/route.js"
Cohesion: 0.26
Nodes (11): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+3 more)

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 105 - "google-calendar.js"
Cohesion: 0.35
Nodes (9): GET(), GET(), calendarFetch(), createBookingEvent(), formatSlotLabel(), getAccessToken(), getAvailableSlots(), getRawEvents() (+1 more)

### Community 107 - "AdminAuthProvider.jsx"
Cohesion: 0.33
Nodes (10): AdminAuthContext, AdminAuthProvider(), decodeJwt(), loadSession(), mfaStatusOf(), needsMfa(), PUBLIC_ROUTES, readStoredSession() (+2 more)

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 109 - "lighthouse-audit/route.js"
Cohesion: 0.31
Nodes (8): checkRateLimit(), getRateLimitKey(), POST(), rateLimitMap, resend, saveAuditToDatabase(), sendAuditNotificationEmail(), supabase

### Community 110 - "pocket.js"
Cohesion: 0.13
Nodes (28): DELETE(), PATCH(), GET(), POST(), POST(), assignRecordingToLead(), attachRecordingToLead(), dismissRecording() (+20 more)

### Community 111 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 126 - "workflows/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 127 - "hubspot.js"
Cohesion: 0.58
Nodes (8): createDeal(), createOrUpdateCompany(), createOrUpdateContact(), createTask(), findCompanyByName(), findContactByEmail(), handleContactFormSubmission(), hubspotRequest()

### Community 128 - "generate-icons.mjs"
Cohesion: 0.25
Nodes (5): BLACK, LOGO, main(), png(), root

### Community 129 - "github/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, name, permissions, contents, pull-requests

### Community 130 - "pocket/page.js"
Cohesion: 0.43
Nodes (6): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, getCRMAuthClient()

### Community 131 - "HomeClient.jsx"
Cohesion: 0.16
Nodes (13): CTA(), categoryIcons, HomeClient(), PillBadge(), ProjectCard(), PricingSection(), projectPlans, seoPlans (+5 more)

### Community 132 - "sendPushToAll"
Cohesion: 0.43
Nodes (5): POST(), resend, POST(), ensureConfigured(), sendPushToAll()

### Community 133 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 141 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

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
  These have ≤1 connection - possible missing edges. (Counts symbols only; 643 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `seo-ship.js`, `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `crm.js`, `devops.js`, `devops-approvals.js`, `createOrUpdateLead`, `logActivity`, `tasks.js`, `systemforge.js`, `seo-plan-runs.js`, `proposals.js`, `ProposalEditor.jsx`, `search-console.js`, `seo-reports.js`, `admin/layout.js`, `seo/layout.js`, `projects/[id]/page.js`, `jobber.js`, `framer-motion`, `finance.js`, `SplitText`, `requireAdmin`, `instant-site.js`, `lucide-react`, `businesses.js`, `@supabase/supabase-js`, `affordable-small-business-website-design/page.jsx`, `generateBreadcrumbSchema`, `app/blog/[slug]/page.jsx`, `package.json`, `Card`, `react`, `local/route.js`, `supabase-crm.js`, `construction-website-design/page.jsx`, `ga4.js`, `square-auth.js`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `google-auth.js`, `works/page.jsx`, `project-tasks.js`, `time-tracking.js`, `cx`, `urlForImage`, `ProposalCard`, `useRecaptcha`, `facebook.js`, `lucide-react`, `Badge`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `stripe-crm.js`, `SectionShell.jsx`, `leads/new/page.js`, `system-forge/page.js`, `resend-stats.js`, `crm/page.js`, `admin-api-auth.js`, `comment-automations.js`, `seo-plans.js`, `instant-site/start/route.js`, `admin-auth.js`, `system-forge/layout.js`, `create/route.js`, `google-calendar.js`, `lucide-react`, `AdminAuthProvider.jsx`, `lighthouse-audit/route.js`, `pocket.js`, `pocket/page.js`, `HomeClient.jsx`, `sendPushToAll`, `app/page.js`?**
  _High betweenness centrality (0.517) - this node is a cross-community bridge._
- **What connects `RFC-5545`, `RFC-1918` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07040328092959672 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `pocket/page.js`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `HomeClient.jsx`, `ProposalEditor.jsx`, `admin/layout.js`, `seo/layout.js`, `projects/[id]/page.js`, `framer-motion`, `SplitText`, `lucide-react`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `package.json`, `Card`, `CSVImportModal.jsx`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `works/page.jsx`, `cx`, `planRuns.js`, `ProposalCard`, `useRecaptcha`, `lucide-react`, `Badge`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `HealthAPITemplate`, `SectionShell.jsx`, `cx`, `leads/new/page.js`, `system-forge/page.js`, `crm/page.js`, `contact/page.jsx`, `admin-auth.js`, `SettingsModal.jsx`, `system-forge/layout.js`, `lucide-react`, `AdminAuthProvider.jsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `InstantSiteFlow.jsx`, `HomeClient.jsx`, `app/layout.js`, `seo/layout.js`, `framer-motion`, `SplitText`, `lucide-react`, `affordable-small-business-website-design/page.jsx`, `app/blog/[slug]/page.jsx`, `package.json`, `Card`, `react`, `construction-website-design/page.jsx`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `cx`, `planRuns.js`, `useRecaptcha`, `lucide-react`, `Badge`, `Components/Blog/BlogPostContent.jsx`, `SectionShell.jsx`, `cx`, `contact/page.jsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `leads/[id]/page.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._