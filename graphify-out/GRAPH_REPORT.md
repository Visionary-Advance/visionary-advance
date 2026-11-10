# Graph Report - visionary-advance  (2026-11-09)

## Corpus Check
- 482 files · ~289,916 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .ico 1)

## Summary
- 2652 nodes · 5833 edges · 160 communities (124 shown, 36 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d0eceed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pocket.js
- InstantSiteFlow.jsx
- 002_crm_premium_features.sql
- leads/[id]/page.js
- ProposalEditor.jsx
- vault/[id]/page.js
- app/layout.js
- supabase-crm.js
- devops.js
- publish-blog-drafts.mjs
- 20260201_seo_tables.sql
- crm.js
- logActivity
- tasks.js
- systemforge.js
- businesses/[id]/page.js
- proposals.js
- lucide-react
- search-console.js
- devops/page.js
- seo-reports.js
- sanity-boilerplate/lib/sanity.js
- AdminAuthProvider.jsx
- sanity
- createOrUpdateLead
- next
- 20260201_systemforge_tables.sql
- dependencies
- framer-motion
- formatCurrency
- 001_crm_schema.sql
- devops/sites/[id]/page.js
- stripe-crm.js
- useRecaptcha
- SEOReportPanel.jsx
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- package.json
- useAdminAuth
- affordable-small-business-website-design/page.jsx
- app/blog/[slug]/page.jsx
- SEOPlanView.jsx
- seo.js
- finance.js
- local/route.js
- generateBreadcrumbSchema
- instant-site/start/route.js
- HomeClient.jsx
- businesses/page.js
- square-auth.js
- instant-site.js
- jobber.js
- LandingPageTemplate.jsx
- compilerOptions
- google-auth.js
- seo/sites/[id]/page.js
- project-tasks.js
- time-tracking.js
- plans/route.js
- construction-website-design/page.jsx
- 20260223_finance_tables.sql
- seo-email.js
- react
- works/page.jsx
- devops-schema.sql
- incidents/[id]/page.js
- facebook.js
- useRecaptcha
- seo/sites/page.js
- github-import.js
- Components/Blog/BlogPostContent.jsx
- sanity-boilerplate/Components/Blog/BlogPostContent.jsx
- crm/layout.js
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- system-forge/layout.js
- create/route.js
- urlForImage
- projects/[id]/page.js
- crm-schema.sql
- pocket/page.js
- income/[id]/page.js
- finance/layout.js
- system-forge/page.js
- google-calendar.js
- resend-stats.js
- crm/page.js
- seo/layout.js
- sanity-boilerplate/lib/image.js
- devops/layout.js
- admin/page.js
- seo/page.js
- app/page.js
- sanity-boilerplate/schemas/index.js
- KeywordsTab
- save-draft-plan.mjs
- lighthouse-audit/route.js
- inputs
- inputs
- projects/page.js
- comment-automations.js
- 20261020_comment_automations.sql
- supabase_schema.sql
- ga4.js
- eugene-website-hosting/layout.js
- services/[slug]/layout.js
- steps
- income/route.js
- scripts
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
- papaparse
- hubspot.js
- github/seo-ship-task.yml
- proposals/[id]/page.js
- supabase@^2.48.3
- @tiptap/extension-table-cell@^3.19.0
- env
- postcss.config.mjs
- vercel.json
- env
- TaskList.jsx
- TimeTracker.jsx
- with
- with
- sites/[id]/route.js
- TestimonialsCarousel.jsx
- base
- permissions
- base
- permissions
- task_title
- task_title
- @gsap/react
- @portabletext/react
- react-dom@^19.2.3
- styled-components@^6.1.19
- @tiptap/extension-image

## God Nodes (most connected - your core abstractions)
1. `next` - 228 edges
2. `react` - 132 edges
3. `lucide-react` - 48 edges
4. `supabaseCRM` - 41 edges
5. `useAdminAuth()` - 39 edges
6. `logActivity()` - 35 edges
7. `urlForImage()` - 33 edges
8. `trackEvent()` - 31 edges
9. `framer-motion` - 28 edges
10. `formatCurrency()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `createProject()`  [EXTRACTED]
  app/api/crm/leads/[id]/projects/route.js → lib/projects.js
- `ConstructionWebsiteDesignPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/construction-website-design/page.jsx → Components/Landing/LandingPageTemplate.jsx
- `EcommerceWebDesignAgencyPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/ecommerce-web-design-agency/page.jsx → Components/Landing/LandingPageTemplate.jsx
- `LawFirmWebDesignPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/law-firm-web-design/page.jsx → Components/Landing/LandingPageTemplate.jsx
- `ResponsiveWebDesignServicesPage()` --calls--> `LandingPageTemplate()`  [EXTRACTED]
  app/responsive-web-design-services/page.jsx → Components/Landing/LandingPageTemplate.jsx

## Import Cycles
- 2-file cycle: `Components/Accessibility/A11yProvider.jsx -> Components/Accessibility/AccessibilityWidget.jsx -> Components/Accessibility/A11yProvider.jsx`

## Communities (160 total, 36 thin omitted)

### Community 0 - "pocket.js"
Cohesion: 0.07
Nodes (44): DELETE(), PATCH(), GET(), POST(), POST(), GET(), GET(), POST() (+36 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.07
Nodes (72): handleBookingSubmit(), FAQS, FreeTrialPage(), metadata, SpotsBanner(), FAQS, GetYourSitePage(), metadata (+64 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.07
Nodes (56): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+48 more)

### Community 4 - "ProposalEditor.jsx"
Cohesion: 0.19
Nodes (18): ArrowLeftIcon(), NewProposalPage(), TrashIcon(), BoldIcon(), BulletListIcon(), CodeIcon(), Divider(), HRIcon() (+10 more)

### Community 5 - "vault/[id]/page.js"
Cohesion: 0.07
Nodes (29): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), AddFileModal(), ArrowLeftIcon(), ModuleDetailPage() (+21 more)

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (36): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+28 more)

### Community 7 - "supabase-crm.js"
Cohesion: 0.07
Nodes (5): GET(), getPipelineStats(), SOURCES, STAGES, supabaseCRM

### Community 8 - "devops.js"
Cohesion: 0.09
Nodes (30): GET(), POST(), GET(), POST(), GET(), PATCH(), POST(), POST() (+22 more)

### Community 9 - "publish-blog-drafts.mjs"
Cohesion: 0.15
Nodes (16): CAT, __dirname, downloadImage(), __filename, key(), main(), makeBlock(), mdToPortableText() (+8 more)

### Community 10 - "20260201_seo_tables.sql"
Cohesion: 0.09
Nodes (32): idx_seo_sites_business_id, idx_seo_plan_tasks_plan_id, idx_seo_plan_tasks_status, idx_seo_plans_month, idx_seo_plans_site_id, idx_seo_plans_status, seo_plan_tasks, seo_plans (+24 more)

### Community 11 - "crm.js"
Cohesion: 0.14
Nodes (19): PATCH(), PATCH(), POST(), calculateLeadScore(), createOrUpdateLead(), SCORE_WEIGHTS, syncToHubSpot(), toggleActivityPin() (+11 more)

### Community 12 - "logActivity"
Cohesion: 0.11
Nodes (23): GET(), POST(), POST(), GET(), POST(), DELETE(), GET(), PATCH() (+15 more)

### Community 13 - "tasks.js"
Cohesion: 0.10
Nodes (25): DELETE(), GET(), PATCH(), DELETE(), GET(), PATCH(), POST(), GET() (+17 more)

### Community 14 - "systemforge.js"
Cohesion: 0.14
Nodes (31): DELETE(), GET(), PATCH(), GET(), POST(), DELETE(), GET(), PATCH() (+23 more)

### Community 15 - "businesses/[id]/page.js"
Cohesion: 0.18
Nodes (15): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), ProjectCard(), STATUS_CONFIG, ProjectForm() (+7 more)

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 18 - "search-console.js"
Cohesion: 0.15
Nodes (30): GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST(), addDashboardWidget() (+22 more)

### Community 19 - "devops/page.js"
Cohesion: 0.13
Nodes (25): ChartIcon(), CheckIcon(), DevOpsDashboardPage(), fetchStats(), runAllChecks(), formatTimeAgo(), PlusIcon(), RefreshIcon() (+17 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.14
Nodes (27): POST(), GET(), DELETE(), GET(), POST(), DELETE(), GET(), POST() (+19 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.10
Nodes (6): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag()

### Community 22 - "AdminAuthProvider.jsx"
Cohesion: 0.19
Nodes (25): AdminLayout(), metadata, AdminLoginPage(), AdminAuthContext, AdminAuthProvider(), PUBLIC_ROUTES, CheckIcon(), CloseIcon() (+17 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "createOrUpdateLead"
Cohesion: 0.14
Nodes (16): POST(), POST(), resend, POST(), resend, sendAdminNotification(), sendUserAuditEmail(), POST() (+8 more)

### Community 25 - "next"
Cohesion: 0.06
Nodes (13): ArrowLeftIcon(), NewLeadPage(), STAGES, TIMELINES, PRIORITY_COLORS, TASK_TYPE_LABELS, serverStartTime, ErrorContent() (+5 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "dependencies"
Cohesion: 0.07
Nodes (28): dependencies, date-fns@^4.1.0, framer-motion@^12.23.12, gsap@^3.13.0, headlessui@^0.0.0, heroicons@^2.2.0, lucide-react@^0.542.0, next@^16.0.0 (+20 more)

### Community 28 - "framer-motion"
Cohesion: 0.24
Nodes (15): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), EugeneFAQ(), EugeneTestimonials(), FinalCTA(), LocalProof(), AnimatedNumber(), LocalTrustBand() (+7 more)

### Community 29 - "formatCurrency"
Cohesion: 0.07
Nodes (50): ExpensesPage(), FinanceDashboard(), TaxEstimatorPage(), CategoryBadge(), CategoryPieChart(), CustomTooltip(), AlertIcon(), CheckIcon() (+42 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "devops/sites/[id]/page.js"
Cohesion: 0.20
Nodes (15): ArrowLeftIcon(), CheckIcon(), EditIcon(), ExternalLinkIcon(), RefreshIcon(), SiteDetailPage(), fetchSite(), runCheck() (+7 more)

### Community 32 - "stripe-crm.js"
Cohesion: 0.21
Nodes (20): GET(), GET(), POST(), getStripe(), POST(), createStripeInvoice(), findStripeCustomerByEmail(), formatCurrency() (+12 more)

### Community 33 - "useRecaptcha"
Cohesion: 0.17
Nodes (14): ContactPage(), COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay(), MONTHS (+6 more)

### Community 34 - "SEOReportPanel.jsx"
Cohesion: 0.14
Nodes (17): BreakdownTable(), ChangeIndicator(), ChevronLeftIcon(), ChevronRightIcon(), ClockIcon(), CloseIcon(), DocumentIcon(), EmailIcon() (+9 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.22
Nodes (19): DELETE(), PATCH(), GET(), getSupabase(), POST(), getSearchAnalytics(), addKeyword(), buildKeywordPerformance() (+11 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.11
Nodes (21): BlogPage(), metadata, PillBadge(), revalidate, GET(), sitemap(), getAllCategories(), getAllPosts() (+13 more)

### Community 38 - "package.json"
Cohesion: 0.09
Nodes (24): @google/generative-ai@^0.24.1, @octokit/rest@^22.0.1, @tiptap/extension-link@^3.19.0, @tiptap/extension-table-header@^3.19.0, @tiptap/pm@^3.19.0, @tiptap/react@^3.19.0, @types/react-syntax-highlighter@^15.5.13, devDependencies (+16 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.16
Nodes (12): ArrowLeftIcon(), EditSitePage(), ArrowLeftIcon(), NewSitePage(), ChangeIndicator(), formatDateRange(), SEOReportsPage(), useAdminAuth() (+4 more)

### Community 40 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.19
Nodes (12): breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, CtaButton(), FinalCTA() (+4 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.24
Nodes (17): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), BlogHero(), BlogPostContent(), RelatedPosts() (+9 more)

### Community 42 - "SEOPlanView.jsx"
Cohesion: 0.12
Nodes (21): authFetch(), categoryColors, DraftPlanPanel(), effortLabels, PlanHistory(), priorityColors, priorityLabels, SEOPlanView() (+13 more)

### Community 43 - "seo.js"
Cohesion: 0.12
Nodes (7): metadata, metadata, metadata, metadata, eugenePageContent, DEFAULT_OG_IMAGE, SYSTEMS_PAGE_META

### Community 44 - "finance.js"
Cohesion: 0.16
Nodes (18): GET(), GET(), getQuarterForDate(), GET(), GET(), PATCH(), GET(), calculateEstimatedTax() (+10 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "generateBreadcrumbSchema"
Cohesion: 0.16
Nodes (24): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, generateMetadata(), generateStaticParams(), revalidate, TagPage() (+16 more)

### Community 47 - "instant-site/start/route.js"
Cohesion: 0.35
Nodes (9): POST(), POST(), POST(), clientIp(), SMS_CONSENT_TEXT, normPhone(), sendMetaEvent(), sha256() (+1 more)

### Community 48 - "HomeClient.jsx"
Cohesion: 0.12
Nodes (15): PillBadge(), tabs, WorkDetailPage(), A11yContext, CTA(), categoryIcons, HomeClient(), PillBadge() (+7 more)

### Community 49 - "businesses/page.js"
Cohesion: 0.23
Nodes (13): BuildingIcon(), BusinessesPage(), ChartIcon(), PlusIcon(), SearchIcon(), UsersIcon(), ClientIcon(), ClientsPage() (+5 more)

### Community 50 - "square-auth.js"
Cohesion: 0.21
Nodes (16): GET(), POST(), dynamic, GET(), POST(), runtime, callSquareAPI(), getClientLocationId() (+8 more)

### Community 51 - "instant-site.js"
Cohesion: 0.18
Nodes (20): POST(), GET(), GET(), alertInstantSiteFailed(), alertInstantSiteLead(), alertInstantSiteManual(), alertInstantSiteReady(), alertInstantSiteUnlocked() (+12 more)

### Community 52 - "jobber.js"
Cohesion: 0.23
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 53 - "LandingPageTemplate.jsx"
Cohesion: 0.32
Nodes (8): LandingHero(), buildSchemas(), FinalCTA(), IncludedSection(), LandingPageTemplate(), ProcessSection(), PainPoints(), WhyUs()

### Community 54 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 55 - "google-auth.js"
Cohesion: 0.17
Nodes (18): GET(), POST(), GET(), GET(), GET(), ANALYTICS_SCOPE, exchangeCodeForTokens(), generateOAuthUrl() (+10 more)

### Community 56 - "seo/sites/[id]/page.js"
Cohesion: 0.16
Nodes (9): MetricCard(), SiteDetailPage(), formatDate(), formatValue(), SEOAnalyticsChart(), KEYWORD_LIMITS, PLAN_TASK_LIMITS, PLAN_TIER_LABELS (+1 more)

### Community 57 - "project-tasks.js"
Cohesion: 0.19
Nodes (11): GET(), PATCH(), POST(), DELETE(), PATCH(), completeTask(), createTask(), deleteTask() (+3 more)

### Community 58 - "time-tracking.js"
Cohesion: 0.20
Nodes (11): GET(), POST(), DELETE(), PATCH(), createTimeEntry(), deleteTimeEntry(), getProjectTimeEntries(), getProjectTimeSummary() (+3 more)

### Community 59 - "plans/route.js"
Cohesion: 0.19
Nodes (20): POST(), GET(), POST(), PATCH(), buildDataSummary(), buildTrafficSummary(), callWithRetry(), generateAIRecommendations() (+12 more)

### Community 60 - "construction-website-design/page.jsx"
Cohesion: 0.17
Nodes (12): ConstructionWebsiteDesignPage(), metadata, EcommerceWebDesignAgencyPage(), metadata, LawFirmWebDesignPage(), metadata, metadata, ResponsiveWebDesignServicesPage() (+4 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.27
Nodes (12): breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatDateRange(), formatKeywordRow(), generateReportHtml() (+4 more)

### Community 63 - "react"
Cohesion: 0.11
Nodes (15): AboutPage(), fadeUp(), scaleIn, slideFrom(), FinanceSettingsPage(), AuditPage(), tips, services (+7 more)

### Community 64 - "works/page.jsx"
Cohesion: 0.31
Nodes (8): categoryIcons, fadeUp(), PillBadge(), ProjectCard(), staggerContainer, WorksPage(), defaultFaqs, FAQ()

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "incidents/[id]/page.js"
Cohesion: 0.19
Nodes (12): ArrowLeftIcon(), INCIDENT_STATUSES, IncidentDetailPage(), fetchIncident(), updateStatus(), STATUS_CONFIG, CheckIcon(), INCIDENT_STATUSES (+4 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "useRecaptcha"
Cohesion: 0.14
Nodes (23): handleFormSubmit(), CTA_VARIANTS, ContactForm(), projectTypes, timelines, AuditResultPanel(), ScoreCircle(), businessTypes (+15 more)

### Community 69 - "seo/sites/page.js"
Cohesion: 0.19
Nodes (5): SEOSitesPage(), LinkToBusinessModal(), formatPermission(), formatTimeAgo(), SEOSiteCard()

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.17
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 72 - "sanity-boilerplate/Components/Blog/BlogPostContent.jsx"
Cohesion: 0.16
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 73 - "crm/layout.js"
Cohesion: 0.27
Nodes (13): ArrowLeftIcon(), BuildingIcon(), ChevronIcon(), ClientsIcon(), CRMLayout(), DashboardIcon(), HomeIcon(), KanbanIcon() (+5 more)

### Community 74 - "tasks/page.js"
Cohesion: 0.19
Nodes (7): BuildingIcon(), CheckIcon(), PlusIcon(), PRIORITY_COLORS, TASK_TYPES, TasksPage(), TrashIcon()

### Community 75 - "HealthAPITemplate"
Cohesion: 0.23
Nodes (9): CheckIcon(), ChevronIcon(), CopyIcon(), generateAPIKey(), HealthAPITemplate(), handleGenerateKey(), HealthAPITemplateCompact(), InfoIcon() (+1 more)

### Community 76 - "20260201_all_tables.sql"
Cohesion: 0.26
Nodes (13): crm_activities, crm_leads, crm_stage_history, google_oauth, idx_crm_activities_created_at, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email (+5 more)

### Community 77 - "system-forge/layout.js"
Cohesion: 0.29
Nodes (12): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ForgeIcon(), HomeIcon(), ImportIcon(), LogoutIcon(), MenuIcon() (+4 more)

### Community 78 - "create/route.js"
Cohesion: 0.26
Nodes (11): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+3 more)

### Community 79 - "urlForImage"
Cohesion: 0.17
Nodes (17): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), CategoryBadge(), getAllSeriesSlugs(), getSeriesBySlug(), date-fns (+9 more)

### Community 80 - "projects/[id]/page.js"
Cohesion: 0.23
Nodes (13): ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge(), CheckIcon(), MilestoneTimeline(), EditIcon() (+5 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "pocket/page.js"
Cohesion: 0.29
Nodes (8): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, authFetch(), SiteSettingsTab(), getCRMAuthClient()

### Community 83 - "income/[id]/page.js"
Cohesion: 0.23
Nodes (12): ArrowLeftIcon(), DetailField(), ExternalLinkIcon(), IncomeDetailPage(), SummaryRow(), TaxRow(), IncomePage(), POST() (+4 more)

### Community 84 - "finance/layout.js"
Cohesion: 0.32
Nodes (11): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ExpensesIcon(), FinanceLayout(), HomeIcon(), IncomeIcon(), LogoutIcon() (+3 more)

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "google-calendar.js"
Cohesion: 0.35
Nodes (9): GET(), GET(), calendarFetch(), createBookingEvent(), formatSlotLabel(), getAccessToken(), getAvailableSlots(), getRawEvents() (+1 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.26
Nodes (12): addDays(), bareAddress(), dayOf(), DELIVERED_EVENTS, domainFromSiteUrl(), FAILED_EVENTS, getEmailCountsForSite(), getSupabase() (+4 more)

### Community 88 - "crm/page.js"
Cohesion: 0.29
Nodes (7): CRMDashboardPage(), QuickStatCard(), ProjectWidgets(), RiskBadge(), PRIORITY_COLORS, TASK_TYPE_ICONS, TasksWidget()

### Community 89 - "seo/layout.js"
Cohesion: 0.35
Nodes (10): ArrowLeftIcon(), ChartIcon(), ChevronIcon(), DashboardIcon(), DocumentIcon(), GlobeIcon(), HomeIcon(), LogoutIcon() (+2 more)

### Community 90 - "sanity-boilerplate/lib/image.js"
Cohesion: 0.20
Nodes (7): @sanity/client@^7.13.2, @sanity/image-url@^2.0.2, @sanity/client, @sanity/image-url, client, previewClient, builder

### Community 91 - "devops/layout.js"
Cohesion: 0.38
Nodes (9): AlertIcon(), ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), DevOpsLayout(), HomeIcon(), LogoutIcon(), MenuIcon() (+1 more)

### Community 92 - "admin/page.js"
Cohesion: 0.36
Nodes (8): AdminDashboard(), ArrowIcon(), CRMIcon(), DevOpsIcon(), FinanceIcon(), ForgeIcon(), SEOIcon(), SettingsIcon()

### Community 93 - "seo/page.js"
Cohesion: 0.31
Nodes (5): formatDateRange(), formatTimeAgo(), SEODashboardPage(), AddSiteModal(), formatPermission()

### Community 94 - "app/page.js"
Cohesion: 0.33
Nodes (7): HomePage(), metadata, HOME_TITLE_TEST, pickRandomVariant(), resolveVariant(), config, middleware()

### Community 96 - "KeywordsTab"
Cohesion: 0.39
Nodes (8): DeltaCell(), KeywordsTab(), handleAdd(), handleDelete(), handleUpdateTarget(), loadKeywords(), PositionCell(), Toast()

### Community 97 - "save-draft-plan.mjs"
Cohesion: 0.31
Nodes (7): getPlanTaskCap(), CATEGORIES, EFFORTS, Fail, fail(), main(), PRIORITIES

### Community 98 - "lighthouse-audit/route.js"
Cohesion: 0.31
Nodes (8): checkRateLimit(), getRateLimitKey(), POST(), rateLimitMap, resend, saveAuditToDatabase(), sendAuditNotificationEmail(), supabase

### Community 99 - "inputs"
Cohesion: 0.17
Nodes (12): description, required, branch, prompt, task_id, on, workflow_dispatch, description (+4 more)

### Community 100 - "inputs"
Cohesion: 0.17
Nodes (12): description, required, branch, prompt, task_id, on, workflow_dispatch, description (+4 more)

### Community 101 - "projects/page.js"
Cohesion: 0.43
Nodes (6): KanbanIcon(), ListIcon(), ProjectKanbanCard(), ProjectsKanbanPage(), STATUS_CONFIG, STATUS_ORDER

### Community 102 - "comment-automations.js"
Cohesion: 0.24
Nodes (15): POST(), escapeRegex(), extractComments(), findAccount(), findMatchingRule(), getSupabaseClient(), graphPost(), handleMetaWebhook() (+7 more)

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 105 - "ga4.js"
Cohesion: 0.30
Nodes (12): GET(), emptyTotals(), ga4Request(), getGa4MonthlyData(), listGa4Properties(), listKeyEventNames(), normalizePropertyId(), percentChange() (+4 more)

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 110 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

### Community 111 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 126 - "workflows/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, ship, name, runs-on, timeout-minutes

### Community 128 - "hubspot.js"
Cohesion: 0.58
Nodes (8): createDeal(), createOrUpdateCompany(), createOrUpdateContact(), createTask(), findCompanyByName(), findContactByEmail(), handleContactFormSubmission(), hubspotRequest()

### Community 129 - "github/seo-ship-task.yml"
Cohesion: 0.22
Nodes (8): concurrency, cancel-in-progress, group, jobs, ship, name, runs-on, timeout-minutes

### Community 130 - "proposals/[id]/page.js"
Cohesion: 0.43
Nodes (6): ArrowLeftIcon(), LinkIcon(), ProposalDetailPage(), SendIcon(), ProposalStatusBadge(), STATUS_CONFIG

### Community 133 - "env"
Cohesion: 0.25
Nodes (8): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, env

### Community 141 - "env"
Cohesion: 0.25
Nodes (8): BASE, BRANCH, CALLBACK_SECRET, CALLBACK_URL, RUN_URL, TASK_ID, TASK_TITLE, env

### Community 142 - "TaskList.jsx"
Cohesion: 0.48
Nodes (4): TaskForm(), PRIORITY_COLORS, TaskItem(), TaskList()

### Community 143 - "TimeTracker.jsx"
Cohesion: 0.52
Nodes (4): TimeEntryForm(), TimeEntryItem(), TimeEntryList(), TimeTracker()

### Community 144 - "with"
Cohesion: 0.29
Nodes (7): with, claude_args, claude_code_oauth_token, fetch-depth, github_token, prompt, ref

### Community 145 - "with"
Cohesion: 0.29
Nodes (7): with, claude_args, claude_code_oauth_token, fetch-depth, github_token, prompt, ref

### Community 147 - "TestimonialsCarousel.jsx"
Cohesion: 0.50
Nodes (4): doubled, StarRating(), testimonials, TestimonialsCarousel()

### Community 148 - "base"
Cohesion: 0.50
Nodes (4): default, description, required, base

### Community 149 - "permissions"
Cohesion: 0.50
Nodes (4): permissions, contents, id-token, pull-requests

### Community 150 - "base"
Cohesion: 0.50
Nodes (4): default, description, required, base

### Community 151 - "permissions"
Cohesion: 0.50
Nodes (4): permissions, contents, id-token, pull-requests

### Community 152 - "task_title"
Cohesion: 0.67
Nodes (3): task_title, description, required

### Community 153 - "task_title"
Cohesion: 0.67
Nodes (3): task_title, description, required

## Knowledge Gaps
- **1 isolated node(s):** `RFC-5545`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 570 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `pocket.js`, `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `ProposalEditor.jsx`, `vault/[id]/page.js`, `app/layout.js`, `supabase-crm.js`, `devops.js`, `crm.js`, `logActivity`, `tasks.js`, `systemforge.js`, `businesses/[id]/page.js`, `proposals.js`, `lucide-react`, `search-console.js`, `devops/page.js`, `seo-reports.js`, `AdminAuthProvider.jsx`, `createOrUpdateLead`, `dependencies`, `framer-motion`, `devops/sites/[id]/page.js`, `stripe-crm.js`, `businesses.js`, `@supabase/supabase-js`, `package.json`, `useAdminAuth`, `affordable-small-business-website-design/page.jsx`, `app/blog/[slug]/page.jsx`, `finance.js`, `local/route.js`, `generateBreadcrumbSchema`, `instant-site/start/route.js`, `HomeClient.jsx`, `businesses/page.js`, `square-auth.js`, `instant-site.js`, `jobber.js`, `LandingPageTemplate.jsx`, `google-auth.js`, `seo/sites/[id]/page.js`, `project-tasks.js`, `time-tracking.js`, `plans/route.js`, `react`, `works/page.jsx`, `incidents/[id]/page.js`, `facebook.js`, `useRecaptcha`, `seo/sites/page.js`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `crm/layout.js`, `tasks/page.js`, `system-forge/layout.js`, `create/route.js`, `urlForImage`, `projects/[id]/page.js`, `pocket/page.js`, `income/[id]/page.js`, `finance/layout.js`, `system-forge/page.js`, `google-calendar.js`, `crm/page.js`, `seo/layout.js`, `devops/layout.js`, `admin/page.js`, `seo/page.js`, `app/page.js`, `lighthouse-audit/route.js`, `projects/page.js`, `comment-automations.js`, `ga4.js`, `income/route.js`, `proposals/[id]/page.js`, `sites/[id]/route.js`?**
  _High betweenness centrality (0.485) - this node is a cross-community bridge._
- **What connects `RFC-5545` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `pocket.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07062146892655367 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `proposals/[id]/page.js`, `leads/[id]/page.js`, `ProposalEditor.jsx`, `vault/[id]/page.js`, `app/layout.js`, `TaskList.jsx`, `businesses/[id]/page.js`, `TimeTracker.jsx`, `lucide-react`, `devops/page.js`, `TestimonialsCarousel.jsx`, `AdminAuthProvider.jsx`, `next`, `dependencies`, `framer-motion`, `formatCurrency`, `devops/sites/[id]/page.js`, `useRecaptcha`, `SEOReportPanel.jsx`, `package.json`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `SEOPlanView.jsx`, `HomeClient.jsx`, `businesses/page.js`, `seo/sites/[id]/page.js`, `works/page.jsx`, `incidents/[id]/page.js`, `useRecaptcha`, `seo/sites/page.js`, `Components/Blog/BlogPostContent.jsx`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `crm/layout.js`, `tasks/page.js`, `HealthAPITemplate`, `system-forge/layout.js`, `projects/[id]/page.js`, `pocket/page.js`, `income/[id]/page.js`, `finance/layout.js`, `system-forge/page.js`, `crm/page.js`, `seo/layout.js`, `devops/layout.js`, `admin/page.js`, `seo/page.js`, `KeywordsTab`, `projects/page.js`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06613924050632912 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `resend-stats.js` to `pocket.js`, `InstantSiteFlow.jsx`, `supabase-crm.js`, `systemforge.js`, `search-console.js`, `seo-reports.js`, `dependencies`, `businesses.js`, `@supabase/supabase-js`, `package.json`, `square-auth.js`, `jobber.js`, `google-auth.js`, `plans/route.js`, `facebook.js`, `pocket/page.js`, `save-draft-plan.mjs`, `lighthouse-audit/route.js`, `comment-automations.js`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._