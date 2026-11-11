# Graph Report - visionary-advance  (2026-11-11)

## Corpus Check
- 497 files · ~293,519 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: .ttf 18, (none) 4, .ico 1)

## Summary
- 2727 nodes · 6513 edges · 158 communities (123 shown, 35 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e324eb87`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pocket.js
- InstantSiteFlow.jsx
- 002_crm_premium_features.sql
- leads/[id]/page.js
- ProposalEditor.jsx
- ModuleDetailPage
- app/layout.js
- supabase-crm.js
- devops.js
- publish-blog-drafts.mjs
- 20260201_seo_tables.sql
- crm.js
- logActivity
- tasks.js
- systemforge.js
- react
- proposals.js
- formatCurrency
- search-console.js
- devops/sites/[id]/page.js
- seo-reports.js
- sanity-boilerplate/lib/sanity.js
- AdminAuthProvider.jsx
- sanity
- createOrUpdateLead
- next
- 20260201_systemforge_tables.sql
- jobber.js
- framer-motion
- CSVImportModal.jsx
- 001_crm_schema.sql
- businesses/[id]/page.js
- stripe-crm.js
- useRecaptcha
- package.json
- businesses.js
- @supabase/supabase-js
- lib/sanity.js
- dependencies
- useAdminAuth
- affordable-small-business-website-design/page.jsx
- app/blog/[slug]/page.jsx
- comment-automations.js
- seo.js
- finance.js
- local/route.js
- BlogPostCard
- instant-site/start/route.js
- LandingPageTemplate.jsx
- ga4.js
- square-auth.js
- instant-site.js
- app/blog/tag/[slug]/page.jsx
- sanity-boilerplate/Components/Blog/BlogPostContent.jsx
- compilerOptions
- google-auth.js
- ModuleCard.jsx
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
- analytics.js
- projects/page.js
- github-import.js
- Components/Blog/BlogPostContent.jsx
- EXPENSE_CATEGORIES
- system-forge/layout.js
- tasks/page.js
- HealthAPITemplate
- 20260201_all_tables.sql
- gemini-seo.js
- create/route.js
- urlForImage
- usePersistedState
- crm-schema.sql
- lucide-react
- income/[id]/page.js
- businesses/page.js
- system-forge/page.js
- google-calendar.js
- resend-stats.js
- crm/page.js
- finance/layout.js
- sanity-boilerplate/lib/image.js
- pocket/page.js
- import/page.js
- services/[slug]/layout.js
- HomeClient.jsx
- sanity-boilerplate/schemas/index.js
- vault/page.js
- save-draft-plan.mjs
- lighthouse-audit/route.js
- inputs
- inputs
- devops/sites/page.js
- scripts
- 20261020_comment_automations.sql
- supabase_schema.sql
- InvoiceList.jsx
- sites/[id]/route.js
- incidents/[id]/page.js
- steps
- eugene-website-hosting/layout.js
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
- income/route.js
- hubspot.js
- github/seo-ship-task.yml
- @gsap/react
- leads/new/page.js
- papaparse
- env
- postcss.config.mjs
- vercel.json
- env
- react-dom@^19.2.3
- styled-components@^6.1.19
- with
- with
- branch
- TestimonialsCarousel.jsx
- task_id
- branch
- task_id
- supabase@^2.48.3
- task_title
- task_title
- @tiptap/extension-image
- @tiptap/extension-table@^3.19.0
- @tiptap/extension-table-cell@^3.19.0

## God Nodes (most connected - your core abstractions)
1. `next` - 234 edges
2. `react` - 140 edges
3. `lucide-react` - 65 edges
4. `cx()` - 61 edges
5. `supabaseCRM` - 41 edges
6. `usePersistedState()` - 36 edges
7. `logActivity()` - 35 edges
8. `Button()` - 34 edges
9. `urlForImage()` - 33 edges
10. `useAdminAuth()` - 33 edges

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

## Communities (158 total, 35 thin omitted)

### Community 0 - "pocket.js"
Cohesion: 0.08
Nodes (43): DELETE(), PATCH(), GET(), POST(), POST(), GET(), POST(), authorized() (+35 more)

### Community 1 - "InstantSiteFlow.jsx"
Cohesion: 0.07
Nodes (73): handleBookingSubmit(), FAQS, FreeTrialPage(), metadata, SpotsBanner(), FAQS, GetYourSitePage(), metadata (+65 more)

### Community 2 - "002_crm_premium_features.sql"
Cohesion: 0.05
Nodes (71): crm_businesses, idx_crm_businesses_created_at, idx_crm_businesses_name, idx_crm_leads_business_id, idx_crm_leads_client_since, idx_crm_leads_is_client, update_crm_businesses_updated_at, update_updated_at_column() (+63 more)

### Community 3 - "leads/[id]/page.js"
Cohesion: 0.07
Nodes (56): ACTIVITY_TYPES, ActivityTypeIcon(), ArrowLeftIcon(), ClientDetailPage(), EmailIcon(), formatHostingDate(), FormIcon(), MeetingIcon() (+48 more)

### Community 4 - "ProposalEditor.jsx"
Cohesion: 0.07
Nodes (45): ArrowLeftIcon(), NewProposalPage(), TrashIcon(), ArrowLeftIcon(), ProjectDetailPage(), STATUS_CONFIG, STATUS_OPTIONS, StatusBadge() (+37 more)

### Community 5 - "ModuleDetailPage"
Cohesion: 0.17
Nodes (8): AddFileModal(), ArrowLeftIcon(), ModuleDetailPage(), PlusIcon(), FileEditor(), FileIcon(), FileList(), TrashIcon()

### Community 6 - "app/layout.js"
Cohesion: 0.07
Nodes (36): dmSansBold, dmSansReg, instSans, metadata, RootLayout(), DEFAULT_SETTINGS, FONT_SCALES, isProfileActive() (+28 more)

### Community 7 - "supabase-crm.js"
Cohesion: 0.08
Nodes (3): GET(), getPipelineStats(), supabaseCRM

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
Cohesion: 0.12
Nodes (21): PATCH(), PATCH(), POST(), calculateLeadScore(), createOrUpdateLead(), SCORE_WEIGHTS, SOURCES, STAGES (+13 more)

### Community 12 - "logActivity"
Cohesion: 0.10
Nodes (25): GET(), POST(), POST(), POST(), GET(), POST(), DELETE(), GET() (+17 more)

### Community 13 - "tasks.js"
Cohesion: 0.10
Nodes (25): DELETE(), GET(), PATCH(), DELETE(), GET(), PATCH(), POST(), GET() (+17 more)

### Community 14 - "systemforge.js"
Cohesion: 0.14
Nodes (31): DELETE(), GET(), PATCH(), GET(), POST(), DELETE(), GET(), PATCH() (+23 more)

### Community 15 - "react"
Cohesion: 0.09
Nodes (16): FinanceSettingsPage(), AuditPage(), tips, CTA_VARIANTS, ContactForm(), projectTypes, timelines, businessTypes (+8 more)

### Community 16 - "proposals.js"
Cohesion: 0.10
Nodes (26): GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+18 more)

### Community 17 - "formatCurrency"
Cohesion: 0.23
Nodes (13): ExpensesPage(), CategoryPieChart(), CustomTooltip(), CustomTooltip(), MonthlyChart(), CustomTooltip(), MoMChange(), MonthlyExpenseSummary() (+5 more)

### Community 18 - "search-console.js"
Cohesion: 0.12
Nodes (37): GET(), maxDuration, GET(), POST(), DELETE(), GET(), PATCH(), POST() (+29 more)

### Community 19 - "devops/sites/[id]/page.js"
Cohesion: 0.17
Nodes (19): ArrowLeftIcon(), CheckIcon(), EditIcon(), ExternalLinkIcon(), RefreshIcon(), SiteDetailPage(), fetchSite(), runCheck() (+11 more)

### Community 20 - "seo-reports.js"
Cohesion: 0.15
Nodes (25): GET(), DELETE(), GET(), DELETE(), GET(), POST(), formatPlanForClaudeCode(), buildKeywordPerformance() (+17 more)

### Community 21 - "sanity-boilerplate/lib/sanity.js"
Cohesion: 0.09
Nodes (10): getAllPosts(), getClient(), getPostBySlug(), getPostsByCategory(), getPostsBySeries(), getPostsByTag(), client, previewClient (+2 more)

### Community 22 - "AdminAuthProvider.jsx"
Cohesion: 0.07
Nodes (58): ArrowLeftIcon(), BuildingIcon(), ChevronIcon(), ClientsIcon(), CRMLayout(), DashboardIcon(), HomeIcon(), KanbanIcon() (+50 more)

### Community 23 - "sanity"
Cohesion: 0.09
Nodes (7): sanity@^5.1.0, @sanity/code-input@^7.0.2, @sanity/vision@^5.1.0, sanity, @sanity/code-input, @sanity/vision, schemaTypes

### Community 24 - "createOrUpdateLead"
Cohesion: 0.16
Nodes (14): POST(), resend, POST(), resend, sendAdminNotification(), sendUserAuditEmail(), POST(), POST() (+6 more)

### Community 25 - "next"
Cohesion: 0.05
Nodes (9): PRIORITY_COLORS, TASK_TYPE_LABELS, serverStartTime, ErrorContent(), SquareError(), SquareSuccess(), SuccessContent(), next (+1 more)

### Community 26 - "20260201_systemforge_tables.sql"
Cohesion: 0.15
Nodes (25): idx_industry_presets_industry, idx_project_modules_module, idx_project_modules_project, idx_projects_created, idx_projects_status, idx_projects_user_id, idx_vault_files_module_id, idx_vault_files_path (+17 more)

### Community 27 - "jobber.js"
Cohesion: 0.23
Nodes (17): GET(), redirectTo(), stateMatches(), createJobberClient(), createJobberProperty(), createJobberRequest(), digitsOf(), exchangeCodeForTokens() (+9 more)

### Community 28 - "framer-motion"
Cohesion: 0.23
Nodes (16): EugeneWebDesignPage(), EugeneWebsiteHostingPage(), EugeneFAQ(), EugeneHero(), EugeneTestimonials(), FinalCTA(), LocalProof(), AnimatedNumber() (+8 more)

### Community 29 - "CSVImportModal.jsx"
Cohesion: 0.17
Nodes (24): AlertIcon(), CheckIcon(), CSVImportModal(), ImportResult(), Step1Upload(), Step2Mapping(), Step3Preview(), UploadIcon() (+16 more)

### Community 30 - "001_crm_schema.sql"
Cohesion: 0.15
Nodes (25): create_initial_stage_history(), create_lead_initial_stage, crm_activities, crm_leads, crm_pipeline_summary, crm_recent_leads, crm_stage_history, idx_activities_created (+17 more)

### Community 31 - "businesses/[id]/page.js"
Cohesion: 0.23
Nodes (11): AlertIcon(), ArrowLeftIcon(), BusinessDetailPage(), DevOpsStatusBadge(), XIcon(), ProjectCard(), STATUS_CONFIG, ProjectForm() (+3 more)

### Community 32 - "stripe-crm.js"
Cohesion: 0.24
Nodes (18): GET(), GET(), POST(), getStripe(), POST(), createStripeInvoice(), findStripeCustomerByEmail(), formatCurrency() (+10 more)

### Community 33 - "useRecaptcha"
Cohesion: 0.15
Nodes (17): ContactPage(), handleFormSubmit(), COVERS, metadata, SetupCallPage(), CalendarPicker(), DAYS, isSameDay() (+9 more)

### Community 34 - "package.json"
Cohesion: 0.09
Nodes (24): @google/generative-ai@^0.24.1, gsap@^3.13.0, headlessui@^0.0.0, @octokit/rest@^22.0.1, @react-email/render@^1.4.0, @tiptap/extension-table-row@^3.19.0, @tiptap/starter-kit@^3.19.0, devDependencies (+16 more)

### Community 35 - "businesses.js"
Cohesion: 0.18
Nodes (20): DELETE(), GET(), POST(), DELETE(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 36 - "@supabase/supabase-js"
Cohesion: 0.22
Nodes (18): DELETE(), PATCH(), GET(), getSupabase(), POST(), addKeyword(), countKeywords(), dateString() (+10 more)

### Community 37 - "lib/sanity.js"
Cohesion: 0.14
Nodes (17): BlogPage(), metadata, PillBadge(), revalidate, GET(), sitemap(), getAllCategories(), getAllPosts() (+9 more)

### Community 38 - "dependencies"
Cohesion: 0.07
Nodes (28): dependencies, date-fns@^4.1.0, framer-motion@^12.23.12, heroicons@^2.2.0, lucide-react@^0.542.0, next@^16.0.0, next-sanity@^12.0.5, ogl@^1.0.11 (+20 more)

### Community 39 - "useAdminAuth"
Cohesion: 0.20
Nodes (8): ArrowLeftIcon(), EditSitePage(), ArrowLeftIcon(), NewSitePage(), CheckIcon(), ChevronIcon(), CRMLeadSelector(), XIcon()

### Community 40 - "affordable-small-business-website-design/page.jsx"
Cohesion: 0.19
Nodes (12): breadcrumbSchema, faqSchema, metadata, NinetyNineDollarWebsitesPage(), productSchema, schemas, CtaButton(), FinalCTA() (+4 more)

### Community 41 - "app/blog/[slug]/page.jsx"
Cohesion: 0.24
Nodes (17): BlogPostPage(), generateMetadata(), generateStaticParams(), revalidate, BlogCTA(), BlogHero(), BlogPostContent(), RelatedPosts() (+9 more)

### Community 42 - "comment-automations.js"
Cohesion: 0.24
Nodes (15): POST(), escapeRegex(), extractComments(), findAccount(), findMatchingRule(), getSupabaseClient(), graphPost(), handleMetaWebhook() (+7 more)

### Community 43 - "seo.js"
Cohesion: 0.12
Nodes (7): metadata, metadata, metadata, metadata, eugenePageContent, DEFAULT_OG_IMAGE, SYSTEMS_PAGE_META

### Community 44 - "finance.js"
Cohesion: 0.21
Nodes (16): GET(), getQuarterForDate(), GET(), GET(), PATCH(), GET(), calculateEstimatedTax(), DEFAULT_TAX_RATES (+8 more)

### Community 45 - "local/route.js"
Cohesion: 0.13
Nodes (15): ALLOWED_DIRECTORIES, ALLOWED_EXTENSIONS, detectLanguage(), getFilesRecursively(), IGNORED_PATTERNS, isAllowedExtension(), isPathAllowed(), POST() (+7 more)

### Community 46 - "BlogPostCard"
Cohesion: 0.29
Nodes (12): CategoryPage(), generateMetadata(), generateStaticParams(), revalidate, BlogPostCard(), getAllCategorySlugs(), getCategoryBySlug(), getPostsByCategory() (+4 more)

### Community 47 - "instant-site/start/route.js"
Cohesion: 0.21
Nodes (13): POST(), POST(), POST(), GET(), POST(), alertInstantSiteUnlocked(), clientIp(), SMS_CONSENT_TEXT (+5 more)

### Community 48 - "LandingPageTemplate.jsx"
Cohesion: 0.21
Nodes (11): PricingSection(), projectPlans, seoPlans, LandingHero(), buildSchemas(), FinalCTA(), IncludedSection(), LandingPageTemplate() (+3 more)

### Community 49 - "ga4.js"
Cohesion: 0.30
Nodes (12): GET(), emptyTotals(), ga4Request(), getGa4MonthlyData(), listGa4Properties(), listKeyEventNames(), normalizePropertyId(), percentChange() (+4 more)

### Community 50 - "square-auth.js"
Cohesion: 0.21
Nodes (16): GET(), POST(), dynamic, GET(), POST(), runtime, callSquareAPI(), getClientLocationId() (+8 more)

### Community 51 - "instant-site.js"
Cohesion: 0.20
Nodes (18): POST(), GET(), alertInstantSiteFailed(), alertInstantSiteLead(), alertInstantSiteManual(), alertInstantSiteReady(), INVISIBLE, kindLabel() (+10 more)

### Community 52 - "app/blog/tag/[slug]/page.jsx"
Cohesion: 0.29
Nodes (12): generateMetadata(), generateStaticParams(), revalidate, TagPage(), generateBreadcrumbSchema(), getAllTagSlugs(), getPostsByTag(), getTagBySlug() (+4 more)

### Community 53 - "sanity-boilerplate/Components/Blog/BlogPostContent.jsx"
Cohesion: 0.15
Nodes (9): @portabletext/react, components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote() (+1 more)

### Community 54 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 55 - "google-auth.js"
Cohesion: 0.17
Nodes (18): GET(), POST(), GET(), GET(), GET(), ANALYTICS_SCOPE, exchangeCodeForTokens(), generateOAuthUrl() (+10 more)

### Community 56 - "ModuleCard.jsx"
Cohesion: 0.21
Nodes (9): CategoryBadge(), ModuleCard(), TrashIcon(), TypeIcon(), RelationshipItem(), RelationshipManager(), XIcon(), TYPE_CONFIG (+1 more)

### Community 57 - "project-tasks.js"
Cohesion: 0.19
Nodes (11): GET(), PATCH(), POST(), DELETE(), PATCH(), completeTask(), createTask(), deleteTask() (+3 more)

### Community 58 - "time-tracking.js"
Cohesion: 0.20
Nodes (11): GET(), POST(), DELETE(), PATCH(), createTimeEntry(), deleteTimeEntry(), getProjectTimeEntries(), getProjectTimeSummary() (+3 more)

### Community 59 - "plans/route.js"
Cohesion: 0.26
Nodes (14): POST(), GET(), POST(), PATCH(), getDetailedAnalytics(), approveDraftPlan(), archivePlan(), createPlan() (+6 more)

### Community 60 - "construction-website-design/page.jsx"
Cohesion: 0.17
Nodes (12): ConstructionWebsiteDesignPage(), metadata, EcommerceWebDesignAgencyPage(), metadata, LawFirmWebDesignPage(), metadata, metadata, ResponsiveWebDesignServicesPage() (+4 more)

### Community 61 - "20260223_finance_tables.sql"
Cohesion: 0.18
Nodes (16): idx_finance_income_client_id, finance_expenses, finance_income, finance_quarterly_payments, finance_settings, idx_finance_expenses_category, idx_finance_expenses_created, idx_finance_expenses_date (+8 more)

### Community 62 - "seo-email.js"
Cohesion: 0.23
Nodes (14): POST(), breakdownHeaderHtml(), breakdownRowHtml(), escapeHtml(), formatChangeInline(), formatChangeText(), formatDateRange(), formatKeywordRow() (+6 more)

### Community 63 - "react"
Cohesion: 0.21
Nodes (10): AboutPage(), fadeUp(), scaleIn, slideFrom(), services, ServicesPage(), stats, ServicePage() (+2 more)

### Community 64 - "works/page.jsx"
Cohesion: 0.18
Nodes (11): categoryIcons, fadeUp(), PillBadge(), ProjectCard(), staggerContainer, WorksPage(), PillBadge(), tabs (+3 more)

### Community 65 - "devops-schema.sql"
Cohesion: 0.22
Nodes (15): devops_alerts, devops_health_checks, devops_incidents, devops_sites, idx_devops_sites_crm_lead_id, idx_health_checks_checked_at, idx_health_checks_site_checked, idx_health_checks_site_id (+7 more)

### Community 66 - "incidents/[id]/page.js"
Cohesion: 0.19
Nodes (16): ChartIcon(), CheckIcon(), DevOpsDashboardPage(), fetchStats(), runAllChecks(), formatTimeAgo(), PlusIcon(), RefreshIcon() (+8 more)

### Community 67 - "facebook.js"
Cohesion: 0.28
Nodes (12): GET(), GET(), exchangeCodeForTokens(), getFacebookAccount(), getFacebookPages(), getInstagramMedia(), getLongLivedToken(), getPagePosts() (+4 more)

### Community 68 - "analytics.js"
Cohesion: 0.24
Nodes (9): AuditResultPanel(), ScoreCircle(), DarkVeil, SystemsCTA(), WebsiteAudit(), getServiceTypeFromPath(), trackAuditEmailSubmit(), trackAuditSubmit() (+1 more)

### Community 69 - "projects/page.js"
Cohesion: 0.43
Nodes (6): KanbanIcon(), ListIcon(), ProjectKanbanCard(), ProjectsKanbanPage(), STATUS_CONFIG, STATUS_ORDER

### Community 70 - "github-import.js"
Cohesion: 0.29
Nodes (13): POST(), ALLOWED_EXTENSIONS, analyzeRepository(), createOctokit(), detectLanguageFromPath(), fetchFileContent(), fetchMultipleFiles(), fetchRepoTree() (+5 more)

### Community 71 - "Components/Blog/BlogPostContent.jsx"
Cohesion: 0.17
Nodes (8): components, Callout(), CALLOUT_STYLES, CodeBlock(), EmbeddedCTA(), ImageGallery(), Quote(), VideoEmbed()

### Community 72 - "EXPENSE_CATEGORIES"
Cohesion: 0.17
Nodes (9): GET(), POST(), validateExpenseRow(), validateIncomeRow(), ExpenseForm(), ReceiptUpload(), UploadIcon(), EXPENSE_CATEGORIES (+1 more)

### Community 73 - "system-forge/layout.js"
Cohesion: 0.29
Nodes (12): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ForgeIcon(), HomeIcon(), ImportIcon(), LogoutIcon(), MenuIcon() (+4 more)

### Community 74 - "tasks/page.js"
Cohesion: 0.19
Nodes (7): BuildingIcon(), CheckIcon(), PlusIcon(), PRIORITY_COLORS, TASK_TYPES, TasksPage(), TrashIcon()

### Community 75 - "HealthAPITemplate"
Cohesion: 0.23
Nodes (9): CheckIcon(), ChevronIcon(), CopyIcon(), generateAPIKey(), HealthAPITemplate(), handleGenerateKey(), HealthAPITemplateCompact(), InfoIcon() (+1 more)

### Community 76 - "20260201_all_tables.sql"
Cohesion: 0.26
Nodes (13): crm_activities, crm_leads, crm_stage_history, google_oauth, idx_crm_activities_created_at, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email (+5 more)

### Community 77 - "gemini-seo.js"
Cohesion: 0.61
Nodes (7): buildDataSummary(), buildTrafficSummary(), callWithRetry(), generateAIRecommendations(), generateSEOPlan(), getClient(), parseJsonResponse()

### Community 78 - "create/route.js"
Cohesion: 0.26
Nodes (11): buildAdminEmail(), buildClientEmail(), buildEmailCard(), DOMAIN_STATUS, esc(), field(), POST(), resend (+3 more)

### Community 79 - "urlForImage"
Cohesion: 0.17
Nodes (17): generateMetadata(), generateStaticParams(), revalidate, SeriesPage(), CategoryBadge(), getAllSeriesSlugs(), getSeriesBySlug(), date-fns (+9 more)

### Community 80 - "usePersistedState"
Cohesion: 0.23
Nodes (11): ClientIcon(), ClientsPage(), PlusIcon(), SearchIcon(), TrashIcon(), CheckIcon(), INCIDENT_STATUSES, IncidentRow() (+3 more)

### Community 81 - "crm-schema.sql"
Cohesion: 0.29
Nodes (12): crm_activities, crm_leads, crm_leads_updated_at, crm_stage_history, idx_crm_activities_lead_id, idx_crm_leads_created_at, idx_crm_leads_email, idx_crm_leads_source (+4 more)

### Community 82 - "lucide-react"
Cohesion: 0.05
Nodes (136): Logo(), MenuLink(), NavItem(), SEOLayout(), Shell(), SidebarContent(), SiteNavItem(), UserMenu() (+128 more)

### Community 83 - "income/[id]/page.js"
Cohesion: 0.32
Nodes (9): ArrowLeftIcon(), DetailField(), ExternalLinkIcon(), IncomeDetailPage(), SummaryRow(), TaxRow(), IncomePage(), IncomeForm() (+1 more)

### Community 84 - "businesses/page.js"
Cohesion: 0.52
Nodes (6): BuildingIcon(), BusinessesPage(), ChartIcon(), PlusIcon(), SearchIcon(), UsersIcon()

### Community 85 - "system-forge/page.js"
Cohesion: 0.35
Nodes (10): BoxIcon(), CodeIcon(), ComponentIcon(), CubeIcon(), ImportIcon(), PlusIcon(), RocketIcon(), SystemForgeOverview() (+2 more)

### Community 86 - "google-calendar.js"
Cohesion: 0.35
Nodes (9): GET(), GET(), calendarFetch(), createBookingEvent(), formatSlotLabel(), getAccessToken(), getAvailableSlots(), getRawEvents() (+1 more)

### Community 87 - "resend-stats.js"
Cohesion: 0.25
Nodes (12): GET(), addDays(), bareAddress(), dayOf(), DELIVERED_EVENTS, domainFromSiteUrl(), FAILED_EVENTS, getEmailCountsForSite() (+4 more)

### Community 88 - "crm/page.js"
Cohesion: 0.29
Nodes (7): CRMDashboardPage(), QuickStatCard(), ProjectWidgets(), RiskBadge(), PRIORITY_COLORS, TASK_TYPE_ICONS, TasksWidget()

### Community 89 - "finance/layout.js"
Cohesion: 0.32
Nodes (11): ArrowLeftIcon(), ChevronIcon(), DashboardIcon(), ExpensesIcon(), FinanceLayout(), HomeIcon(), IncomeIcon(), LogoutIcon() (+3 more)

### Community 90 - "sanity-boilerplate/lib/image.js"
Cohesion: 0.20
Nodes (7): @sanity/client@^7.13.2, @sanity/image-url@^2.0.2, @sanity/client, @sanity/image-url, client, previewClient, builder

### Community 91 - "pocket/page.js"
Cohesion: 0.43
Nodes (6): authFetch(), formatDate(), formatDuration(), PocketInboxPage(), STATUS_TABS, getCRMAuthClient()

### Community 92 - "import/page.js"
Cohesion: 0.27
Nodes (6): ArrowLeftIcon(), CloudIcon(), FolderIcon(), GitHubIcon(), ImportPage(), ImportWizard()

### Community 94 - "HomeClient.jsx"
Cohesion: 0.16
Nodes (15): HomePage(), metadata, CTA(), categoryIcons, HomeClient(), PillBadge(), ProjectCard(), ScrollReveal() (+7 more)

### Community 96 - "vault/page.js"
Cohesion: 0.36
Nodes (6): BoxIcon(), ImportIcon(), PlusIcon(), VaultPage(), ModuleForm(), XIcon()

### Community 97 - "save-draft-plan.mjs"
Cohesion: 0.17
Nodes (10): getPlanTaskCap(), KEYWORD_LIMITS, PLAN_TASK_LIMITS, PLAN_TIERS, CATEGORIES, EFFORTS, Fail, fail() (+2 more)

### Community 98 - "lighthouse-audit/route.js"
Cohesion: 0.31
Nodes (8): checkRateLimit(), getRateLimitKey(), POST(), rateLimitMap, resend, saveAuditToDatabase(), sendAuditNotificationEmail(), supabase

### Community 99 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 100 - "inputs"
Cohesion: 0.20
Nodes (10): default, description, required, base, prompt, on, workflow_dispatch, description (+2 more)

### Community 101 - "devops/sites/page.js"
Cohesion: 0.39
Nodes (7): GridIcon(), PlusIcon(), ServerIcon(), SitesListPage(), SiteTableRow(), StatusTab(), TableIcon()

### Community 102 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

### Community 103 - "20261020_comment_automations.sql"
Cohesion: 0.60
Nodes (5): idx_social_comment_events_created, idx_social_comment_events_rule, idx_social_comment_rules_active, social_comment_events, social_comment_rules

### Community 104 - "supabase_schema.sql"
Cohesion: 0.47
Nodes (4): idx_website_audits_avg_score, idx_website_audits_created_at, idx_website_audits_url, va_website_audits

### Community 105 - "InvoiceList.jsx"
Cohesion: 0.46
Nodes (6): DownloadIcon(), ExternalLinkIcon(), InvoiceCard(), InvoiceList(), RefreshIcon(), StripeIcon()

### Community 107 - "incidents/[id]/page.js"
Cohesion: 0.38
Nodes (6): ArrowLeftIcon(), INCIDENT_STATUSES, IncidentDetailPage(), fetchIncident(), updateStatus(), STATUS_CONFIG

### Community 108 - "steps"
Cohesion: 0.20
Nodes (10): EXECUTION_FILE, GH_TOKEN, PR_URL, steps, env, id, if, name (+2 more)

### Community 110 - "finance/page.js"
Cohesion: 0.17
Nodes (7): FinanceDashboard(), AlertIcon(), DeadlineAlert(), FinanceStatCard(), PaymentStatusBadge(), QuarterlyCard(), PAYMENT_STATUSES

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

### Community 147 - "TestimonialsCarousel.jsx"
Cohesion: 0.50
Nodes (4): doubled, StarRating(), testimonials, TestimonialsCarousel()

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
  These have ≤1 connection - possible missing edges. (Counts symbols only; 573 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `pocket.js`, `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `ProposalEditor.jsx`, `ModuleDetailPage`, `app/layout.js`, `supabase-crm.js`, `devops.js`, `crm.js`, `logActivity`, `tasks.js`, `systemforge.js`, `react`, `proposals.js`, `search-console.js`, `devops/sites/[id]/page.js`, `seo-reports.js`, `AdminAuthProvider.jsx`, `createOrUpdateLead`, `jobber.js`, `framer-motion`, `businesses/[id]/page.js`, `stripe-crm.js`, `package.json`, `businesses.js`, `@supabase/supabase-js`, `dependencies`, `useAdminAuth`, `affordable-small-business-website-design/page.jsx`, `app/blog/[slug]/page.jsx`, `comment-automations.js`, `finance.js`, `local/route.js`, `BlogPostCard`, `instant-site/start/route.js`, `LandingPageTemplate.jsx`, `ga4.js`, `square-auth.js`, `instant-site.js`, `app/blog/tag/[slug]/page.jsx`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `google-auth.js`, `ModuleCard.jsx`, `project-tasks.js`, `time-tracking.js`, `plans/route.js`, `seo-email.js`, `react`, `works/page.jsx`, `incidents/[id]/page.js`, `facebook.js`, `analytics.js`, `projects/page.js`, `github-import.js`, `Components/Blog/BlogPostContent.jsx`, `EXPENSE_CATEGORIES`, `system-forge/layout.js`, `tasks/page.js`, `create/route.js`, `urlForImage`, `usePersistedState`, `lucide-react`, `income/[id]/page.js`, `businesses/page.js`, `system-forge/page.js`, `google-calendar.js`, `resend-stats.js`, `crm/page.js`, `finance/layout.js`, `pocket/page.js`, `import/page.js`, `HomeClient.jsx`, `vault/page.js`, `lighthouse-audit/route.js`, `devops/sites/page.js`, `sites/[id]/route.js`, `incidents/[id]/page.js`, `income/route.js`, `leads/new/page.js`?**
  _High betweenness centrality (0.491) - this node is a cross-community bridge._
- **What connects `RFC-5545` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `pocket.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07518796992481203 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `InstantSiteFlow.jsx`, `leads/[id]/page.js`, `ProposalEditor.jsx`, `leads/new/page.js`, `ModuleDetailPage`, `app/layout.js`, `formatCurrency`, `devops/sites/[id]/page.js`, `TestimonialsCarousel.jsx`, `AdminAuthProvider.jsx`, `next`, `framer-motion`, `CSVImportModal.jsx`, `businesses/[id]/page.js`, `useRecaptcha`, `package.json`, `dependencies`, `useAdminAuth`, `app/blog/[slug]/page.jsx`, `LandingPageTemplate.jsx`, `sanity-boilerplate/Components/Blog/BlogPostContent.jsx`, `ModuleCard.jsx`, `react`, `works/page.jsx`, `incidents/[id]/page.js`, `analytics.js`, `projects/page.js`, `Components/Blog/BlogPostContent.jsx`, `EXPENSE_CATEGORIES`, `system-forge/layout.js`, `tasks/page.js`, `HealthAPITemplate`, `usePersistedState`, `lucide-react`, `income/[id]/page.js`, `businesses/page.js`, `system-forge/page.js`, `crm/page.js`, `finance/layout.js`, `pocket/page.js`, `import/page.js`, `HomeClient.jsx`, `vault/page.js`, `devops/sites/page.js`, `InvoiceList.jsx`, `incidents/[id]/page.js`, `finance/page.js`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `InstantSiteFlow.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06504065040650407 - nodes in this community are weakly interconnected._
- **Why does `@sanity/client` connect `sanity-boilerplate/lib/image.js` to `publish-blog-drafts.mjs`, `package.json`, `sanity-boilerplate/lib/sanity.js`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `002_crm_premium_features.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.0519311911716975 - nodes in this community are weakly interconnected._