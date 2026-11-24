# Graph Report - visionary-advance  (2026-11-23)

## Corpus Check
- 551 files · ~322,515 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .css 1)

## Summary
- 3130 nodes · 8287 edges · 160 communities (130 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `538fca04`
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
- claude-chat.js
- package.json
- 20260201_systemforge_tables.sql
- jobber.js
- framer-motion
- finance.js
- 001_crm_schema.sql
- SplitText
- requireAdmin
- instant-site.js
- mode
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- affordable-small-business-website-design/page.jsx
- useAdminAuth
- generateBreadcrumbSchema
- app/blog/[slug]/page.jsx
- dependencies
- Card
- react
- local/route.js
- next
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
- app/blog/category/[slug]/page.jsx
- 20260223_finance_tables.sql
- seo-email.js
- urlForImage
- admin/page.js
- devops-schema.sql
- useRecaptcha
- facebook.js
- lucide-react
- cx
- github-import.js
- Components/Blog/BlogPostContent.jsx
- env
- projects/page.js
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- stripe-crm.js
- SectionShell.jsx
- health/route.js
- seo-tiers.js
- crm-schema.sql
- cx
- leads/new/page.js
- eugene-web-design/layout.js
- system-forge/page.js
- publish-blog-drafts.mjs
- resend-stats.js
- crm/page.js
- plan
- sanity-boilerplate/lib/image.js
- seo-plan-input.js
- comment-automations.js
- seo-plans.js
- contact/page.jsx
- sanity-boilerplate/schemas/index.js
- 012_claude_chat.sql
- admin-auth.js
- claude-chat-validate.js
- inputs
- inputs
- system-forge/layout.js
- execute
- 20261020_comment_automations.sql
- supabase_schema.sql
- google-calendar.js
- with
- AdminAuthProvider.jsx
- steps
- lighthouse-audit/route.js
- verifyRunnerSecret
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
- steps
- env
- postcss.config.mjs
- vercel.json
- env
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
- eugene-website-hosting/layout.js
- scripts
- api-health.js
- @tiptap/extension-link

## God Nodes (most connected - your core abstractions)
1. `next` - 260 edges
2. `react` - 151 edges
3. `cx()` - 130 edges
4. `lucide-react` - 93 edges
5. `Button()` - 77 edges
6. `requireAdmin()` - 67 edges
7. `useToast()` - 60 edges
8. `Card()` - 59 edges
9. `Badge()` - 52 edges
10. `EmptyState()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `save()` --calls--> `devopsApi()`  [EXTRACTED]
  app/admin/devops/sites/[id]/edit/page.js → Components/Admin/DevOps/api.js
- `create()` --calls--> `devopsApi()`  [EXTRACTED]
  app/admin/devops/sites/new/page.js → Components/Admin/DevOps/api.js
- `SEOSitesHome()` --indirect_call--> `isRunInFlight()`  [INFERRED]
  app/admin/seo/page.js → Components/Admin/SEO/planRuns.js
- `GET()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/api/devops/incidents/[id]/route.js → lib/admin-api-auth.js
- `GET()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/api/devops/incidents/route.js → lib/admin-api-auth.js

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (160 total, 30 thin omitted)

### Community 0 - "seo-ship.js"
Cohesion: 0.21
Nodes (13): POST(), POST(), APP_URL, applyShipCallback(), buildPrompt(), dispatchShipTask(), getSupabase(), IN_FLIGHT (+5 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.06
Nodes (74): handleBookingSubmit(), FAQS, FreeTrialPage(), metadata, SpotsBanner(), FAQS, GetYourSitePage(), metadata (+66 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.07
Nodes (56): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+48 more)

### Community 4 - "businesses/[id]/page.js"
Cohesion: 0.07
Nodes (41): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), BuildingIcon(), BusinessesPage(), ChartIcon() (+33 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.07
Nodes (29): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), AddFileModal(), ArrowLeftIcon(), ModuleDetailPage() (+21 more)

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (38): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+30 more)

### Community 7 - "crm.js"
Cohesion: 0.15
Nodes (14): PATCH(), PATCH(), calculateLeadScore(), SCORE_WEIGHTS, toggleActivityPin(), updateLeadStage(), buildNewLeadEmbed(), buildStageChangeEmbed() (+6 more)

### Community 8 - "devops.js"
Cohesion: 0.11
Nodes (26): GET(), POST(), GET(), PATCH(), GET(), POST(), POST(), autoResolveIncidents() (+18 more)

### Community 9 - "devops-approvals.js"
Cohesion: 0.12
Nodes (38): GET(), POST(), POST(), GET(), POST(), countOpenPrThreads(), findOpenPrThreadByUrl(), recordPrOutcome() (+30 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.07
Nodes (35): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+27 more)

### Community 11 - "createOrUpdateLead"
Cohesion: 0.10
Nodes (32): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+24 more)

### Community 12 - "logActivity"
Cohesion: 0.10
Nodes (26): GET(), POST(), POST(), POST(), GET(), POST(), DELETE(), GET() (+18 more)

### Community 13 - "tasks.js"
Cohesion: 0.06
Nodes (51): GET(), POST(), POST(), DELETE(), GET(), PATCH(), DELETE(), GET() (+43 more)

### Community 14 - "systemforge.js"
Cohesion: 0.14
Nodes (31): DELETE(), GET(), PATCH(), GET(), POST(), DELETE(), GET(), PATCH() (+23 more)

### Community 15 - "seo-plan-runs.js"
Cohesion: 0.18
Nodes (19): POST(), GET(), maxDuration, GET(), POST(), sendN8nNotification(), applyPlanRunCallback(), getLatestRuns() (+11 more)

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 17 - "ProposalEditor.jsx"
Cohesion: 0.13
Nodes (24): ArrowLeftIcon(), NewProposalPage(), TrashIcon(), BoldIcon(), BulletListIcon(), CodeIcon(), Divider(), HRIcon() (+16 more)

### Community 18 - "search-console.js"
Cohesion: 0.13
Nodes (36): GET(), maxDuration, GET(), POST(), DELETE(), GET(), POST(), POST() (+28 more)

### Community 19 - "with"
Cohesion: 0.04
Nodes (45): CALLBACK_URL, EXECUTION_FILE, HAS_TOKEN, REPO, RUN_ID, RUN_URL, RUNNER_SECRET, run_ids (+37 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.15
Nodes (26): GET(), DELETE(), GET(), DELETE(), GET(), POST(), getDetailedAnalytics(), buildKeywordPerformance() (+18 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.10
Nodes (6): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag()

### Community 22 - "admin/layout.js"
Cohesion: 0.13
Nodes (14): AdminLayout(), metadata, viewport, AdminBottomNav(), NAV, SPRING, AdminScrollRestore(), isReloadOrHistoryLoad() (+6 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "claude-chat.js"
Cohesion: 0.12
Nodes (45): POST(), POST(), POST(), GET(), PATCH(), GET(), POST(), addMessage() (+37 more)

### Community 25 - "package.json"
Cohesion: 0.07
Nodes (30): gsap@^3.13.0, next-sanity@^12.0.5, papaparse@^5.5.3, @portabletext/react@^6.0.0, @react-email/render@^1.4.0, react-markdown@^10.1.0, react-syntax-highlighter@^16.1.0, styled-components@^6.1.19 (+22 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.18
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.18
Nodes (19): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), businessTypes, EugeneContactSection(), Field(), EugeneFAQ(), EugeneHero(), EugeneTestimonials() (+11 more)

### Community 29 - "finance.js"
Cohesion: 0.16
Nodes (20): GET(), getQuarterForDate(), GET(), GET(), GET(), PATCH(), GET(), calculateEstimatedTax() (+12 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "SplitText"
Cohesion: 0.10
Nodes (20): AboutPage(), fadeUp(), scaleIn, slideFrom(), AuditPage(), tips, services, ServicesPage() (+12 more)

### Community 32 - "requireAdmin"
Cohesion: 0.09
Nodes (27): dynamic, GET(), noStore, DELETE(), PATCH(), GET(), POST(), GET() (+19 more)

### Community 33 - "instant-site.js"
Cohesion: 0.13
Nodes (31): POST(), POST(), POST(), POST(), GET(), GET(), POST(), alertInstantSiteFailed() (+23 more)

### Community 34 - "mode"
Cohesion: 0.14
Nodes (14): mode, run_id, thread_id, description, options, required, type, on (+6 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.24
Nodes (17): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), countKeywords(), dateString() (+9 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.13
Nodes (17): BlogPage(), metadata, PillBadge(), revalidate, GET(), sitemap(), getAllCategories(), getAllPosts() (+9 more)

### Community 38 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.19
Nodes (12): breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, CtaButton(), FinalCTA() (+4 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.27
Nodes (7): CheckIcon(), ChevronIcon(), CRMLeadSelector(), fetchLeads(), XIcon(), authFetch(), handleShip()

### Community 40 - "generateBreadcrumbSchema"
Cohesion: 0.21
Nodes (17): generateMetadata(), generateStaticParams(), revalidate, TagPage(), BlogPostCard(), generateBreadcrumbSchema(), getAllTagSlugs(), getFeaturedPosts() (+9 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.22
Nodes (17): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), CTA_VARIANTS, BlogPostContent(), RelatedPosts() (+9 more)

### Community 42 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, date-fns@^4.1.0, framer-motion@^12.23.12, @gsap/react@^2.1.2, headlessui@^0.0.0, heroicons@^2.2.0, lucide-react@^0.542.0, next@^16.0.0 (+26 more)

### Community 43 - "Card"
Cohesion: 0.14
Nodes (45): dateOf(), ExpensesPage(), dateOf(), IncomeDetailPage(), methodLabel(), dateOf(), IncomePage(), methodLabel() (+37 more)

### Community 44 - "react"
Cohesion: 0.06
Nodes (23): ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge(), PRIORITY_COLORS, TASK_TYPE_LABELS, ErrorContent() (+15 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "next"
Cohesion: 0.06
Nodes (12): GET(), GET(), POST(), validateExpenseRow(), validateIncomeRow(), getPipelineStats(), SOURCES, STAGES (+4 more)

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
Cohesion: 0.09
Nodes (66): SEOSitesHome(), SiteRow(), SEOReportsPage(), SiteKeywordsPage(), SiteLayout(), SiteSwitcher(), LEGACY_TABS, PlanCard() (+58 more)

### Community 52 - "seo/layout.js"
Cohesion: 0.15
Nodes (33): AccountSheet(), BackgroundRuns(), Logo(), MenuLink(), MobileHeader(), NavItem(), RunsSheet(), SEOLayout() (+25 more)

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
Cohesion: 0.27
Nodes (5): PillBadge(), tabs, WorkDetailPage(), portfolioProjects, worksData

### Community 57 - "project-tasks.js"
Cohesion: 0.19
Nodes (11): GET(), PATCH(), POST(), DELETE(), PATCH(), completeTask(), createTask(), deleteTask() (+3 more)

### Community 58 - "time-tracking.js"
Cohesion: 0.20
Nodes (11): GET(), POST(), DELETE(), PATCH(), createTimeEntry(), deleteTimeEntry(), getProjectTimeEntries(), getProjectTimeSummary() (+3 more)

### Community 59 - "cx"
Cohesion: 0.17
Nodes (34): Fact(), IncidentDetailPage(), IncidentsPage(), VIEWS, DevOpsOverviewPage(), NeedsAttention(), rank(), Fact() (+26 more)

### Community 60 - "app/blog/category/[slug]/page.jsx"
Cohesion: 0.28
Nodes (11): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, getAllCategorySlugs(), getCategoryBySlug(), getPostsByCategory(), CategoryPage() (+3 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.23
Nodes (14): POST(), breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatDateRange(), formatKeywordRow() (+6 more)

### Community 63 - "urlForImage"
Cohesion: 0.16
Nodes (18): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), BlogHero(), CategoryBadge(), getAllSeriesSlugs(), getSeriesBySlug() (+10 more)

### Community 64 - "admin/page.js"
Cohesion: 0.29
Nodes (10): ACTIONS, AdminHome(), AttentionRow(), dueLabel(), greeting(), ListSkeleton(), PRIORITY_TONE, TOOLS (+2 more)

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "useRecaptcha"
Cohesion: 0.24
Nodes (9): AuditResultPanel(), ScoreCircle(), DarkVeil, SystemsCTA(), WebsiteAudit(), getServiceTypeFromPath(), trackAuditEmailSubmit(), trackAuditSubmit() (+1 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "lucide-react"
Cohesion: 0.09
Nodes (41): EditSitePage(), save(), NewSitePage(), create(), FIELDS, FinanceSettingsPage(), SiteSettingsPage(), EMPTY_SITE (+33 more)

### Community 69 - "cx"
Cohesion: 0.10
Nodes (50): ApprovalCard(), Approvals(), ApprovalsPage(), ChecksBadge(), FileDiff(), MergeableBadge(), PreviewBadge(), ReviewDrawer() (+42 more)

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.17
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 72 - "env"
Cohesion: 0.17
Nodes (12): BASE, BRANCH, CALLBACK_URL, EXECUTION_FILE, EXISTING_PR, GH_TOKEN, NEEDS_MIGRATION, PR_URL (+4 more)

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
Cohesion: 0.27
Nodes (9): CRMLayout(), NAV_ITEMS, DevOpsLayout(), FinanceLayout(), NAV_ITEMS, DesktopUserMenu(), NavBadge(), SectionShell() (+1 more)

### Community 80 - "seo-tiers.js"
Cohesion: 0.17
Nodes (13): PLAN_CATEGORIES, PLAN_EFFORTS, PLAN_PRIORITIES, toTaskRows(), validatePlan(), getPlanTaskCap(), KEYWORD_LIMITS, PLAN_TASK_LIMITS (+5 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "cx"
Cohesion: 0.11
Nodes (23): capitalize(), DetailSection(), DraftBanner(), EFFORT, HistoryModal(), manualReason(), PlanSidePanel(), PRIORITY (+15 more)

### Community 83 - "leads/new/page.js"
Cohesion: 0.50
Nodes (4): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "publish-blog-drafts.mjs"
Cohesion: 0.17
Nodes (16): CAT, __dirname, downloadImage(), __filename, key(), main(), makeBlock(), mdToPortableText() (+8 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.26
Nodes (12): PATCH(), addDays(), bareAddress(), dayOf(), DELIVERED_EVENTS, domainFromSiteUrl(), FAILED_EVENTS, getEmailCountsForSite() (+4 more)

### Community 88 - "crm/page.js"
Cohesion: 0.29
Nodes (7): CRMDashboardPage(), QuickStatCard(), ProjectWidgets(), RiskBadge(), PRIORITY_COLORS, TASK_TYPE_ICONS, TasksWidget()

### Community 89 - "plan"
Cohesion: 0.18
Nodes (10): concurrency, cancel-in-progress, group, jobs, plan, name, permissions, if (+2 more)

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
Cohesion: 0.30
Nodes (11): POST(), GET(), PATCH(), approveDraftPlan(), archivePlan(), discardDraftPlan(), getActivePlan(), getPlans() (+3 more)

### Community 94 - "contact/page.jsx"
Cohesion: 0.13
Nodes (23): ContactPage(), handleFormSubmit(), COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay() (+15 more)

### Community 96 - "012_claude_chat.sql"
Cohesion: 0.44
Nodes (8): claude_messages, claude_messages_thread_idx, claude_runs, claude_runs_one_in_flight, claude_runs_thread_idx, claude_threads, claude_threads_list_idx, claude_threads_pr_url_idx

### Community 97 - "admin-auth.js"
Cohesion: 0.18
Nodes (22): AdminLoginPage(), authHeaders(), isStandalone(), NotificationToggle(), urlBase64ToUint8Array(), CheckIcon(), CloseIcon(), GoogleIcon() (+14 more)

### Community 98 - "claude-chat-validate.js"
Cohesion: 0.39
Nodes (6): [replyFile], checkStrings(), isStr(), PLAN_SIZES, REPLY_KINDS, validateReply()

### Community 99 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 100 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 101 - "system-forge/layout.js"
Cohesion: 0.29
Nodes (12): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ForgeIcon(), HomeIcon(), ImportIcon(), LogoutIcon(), MenuIcon() (+4 more)

### Community 102 - "execute"
Cohesion: 0.25
Nodes (8): if, permissions, runs-on, timeout-minutes, execute, contents, pull-requests, permissions

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 105 - "google-calendar.js"
Cohesion: 0.35
Nodes (9): GET(), GET(), calendarFetch(), createBookingEvent(), formatSlotLabel(), getAccessToken(), getAvailableSlots(), getRawEvents() (+1 more)

### Community 106 - "with"
Cohesion: 0.25
Nodes (8): with, claude_args, claude_code_oauth_token, fetch-depth, github_token, persist-credentials, prompt, ref

### Community 107 - "AdminAuthProvider.jsx"
Cohesion: 0.33
Nodes (10): AdminAuthContext, AdminAuthProvider(), decodeJwt(), loadSession(), mfaStatusOf(), needsMfa(), PUBLIC_ROUTES, readStoredSession() (+2 more)

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 109 - "lighthouse-audit/route.js"
Cohesion: 0.31
Nodes (8): checkRateLimit(), getRateLimitKey(), POST(), rateLimitMap, resend, saveAuditToDatabase(), sendAuditNotificationEmail(), supabase

### Community 110 - "verifyRunnerSecret"
Cohesion: 0.48
Nodes (3): POST(), GET(), verifyRunnerSecret()

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
Cohesion: 0.31
Nodes (8): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, accessToken(), storedAccessToken(), getCRMAuthClient()

### Community 131 - "HomeClient.jsx"
Cohesion: 0.17
Nodes (13): CTA(), categoryIcons, HomeClient(), PillBadge(), ProjectCard(), PricingSection(), projectPlans, seoPlans (+5 more)

### Community 132 - "steps"
Cohesion: 0.48
Nodes (7): steps, steps, id, if, name, run, uses

### Community 133 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 141 - "env"
Cohesion: 0.18
Nodes (11): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, ship (+3 more)

### Community 142 - "env"
Cohesion: 0.47
Nodes (6): CHAT_TMP, RUN_ID, RUN_URL, THREAD_ID, env, env

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
Cohesion: 0.15
Nodes (5): metadata, metadata, metadata, DEFAULT_OG_IMAGE, SYSTEMS_PAGE_META

### Community 156 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

## Knowledge Gaps
- **2 isolated node(s):** `RFC-5545`, `RFC-1918`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 678 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `seo-ship.js`, `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `crm.js`, `devops.js`, `devops-approvals.js`, `createOrUpdateLead`, `logActivity`, `tasks.js`, `systemforge.js`, `seo-plan-runs.js`, `proposals.js`, `ProposalEditor.jsx`, `search-console.js`, `seo-reports.js`, `admin/layout.js`, `claude-chat.js`, `package.json`, `jobber.js`, `framer-motion`, `finance.js`, `SplitText`, `requireAdmin`, `instant-site.js`, `businesses.js`, `@supabase/supabase-js`, `affordable-small-business-website-design/page.jsx`, `generateBreadcrumbSchema`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `react`, `local/route.js`, `construction-website-design/page.jsx`, `ga4.js`, `square-auth.js`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `google-auth.js`, `works/page.jsx`, `project-tasks.js`, `time-tracking.js`, `cx`, `app/blog/category/[slug]/page.jsx`, `seo-email.js`, `urlForImage`, `admin/page.js`, `useRecaptcha`, `facebook.js`, `lucide-react`, `cx`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `stripe-crm.js`, `SectionShell.jsx`, `health/route.js`, `leads/new/page.js`, `system-forge/page.js`, `crm/page.js`, `comment-automations.js`, `seo-plans.js`, `contact/page.jsx`, `admin-auth.js`, `system-forge/layout.js`, `google-calendar.js`, `AdminAuthProvider.jsx`, `lighthouse-audit/route.js`, `verifyRunnerSecret`, `pocket/page.js`, `HomeClient.jsx`, `app/page.js`, `api-health.js`?**
  _High betweenness centrality (0.412) - this node is a cross-community bridge._
- **What connects `RFC-5545`, `RFC-1918` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06376726417866588 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `pocket/page.js`, `leads/[id]/page.js`, `businesses/[id]/page.js`, `vault/[id]/page.js`, `app/layout.js`, `HomeClient.jsx`, `ProposalEditor.jsx`, `admin/layout.js`, `package.json`, `framer-motion`, `SplitText`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `CSVImportModal.jsx`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `works/page.jsx`, `cx`, `admin/page.js`, `useRecaptcha`, `lucide-react`, `cx`, `Components/Blog/BlogPostContent.jsx`, `projects/page.js`, `tasks/page.js`, `HealthAPITemplate`, `SectionShell.jsx`, `cx`, `leads/new/page.js`, `system-forge/page.js`, `crm/page.js`, `contact/page.jsx`, `admin-auth.js`, `system-forge/layout.js`, `AdminAuthProvider.jsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `cx` to `InstantSiteFlow.jsx`, `HomeClient.jsx`, `app/layout.js`, `package.json`, `framer-motion`, `SplitText`, `affordable-small-business-website-design/page.jsx`, `app/blog/[slug]/page.jsx`, `dependencies`, `Card`, `react`, `construction-website-design/page.jsx`, `Card`, `seo/layout.js`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `admin/page.js`, `useRecaptcha`, `lucide-react`, `cx`, `Components/Blog/BlogPostContent.jsx`, `SectionShell.jsx`, `cx`, `contact/page.jsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `leads/[id]/page.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._