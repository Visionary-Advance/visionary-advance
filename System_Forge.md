# CLAUDE.md — Visionary Advance Dashboard

## Project Overview

This a section in the internal dashboard for **Visionary Advance**, a web development agency specializing in premium websites for construction companies and restaurants. We are building a new feature called **SystemForge** — an AI-powered project scaffolding system that assembles new client projects from reusable code modules.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: Javascript
- **Database**: Supabase (Postgres + Auth + Storage + RLS)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **APIs**: Anthropic Claude API, GitHub API (Octokit), Square, Jobber, Google services, Resend

## Project Structure Conventions

```
src/
├── app/                    # App Router pages and layouts
│   ├── (auth)/             # Auth-related routes (login, etc.)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── layout.jsx      # Dashboard shell with sidebar
│   │   ├── page.jsx        # Dashboard home/overview
│   │   └── system-forge/   # NEW — SystemForge feature
│   │       ├── page.jsx            # SystemForge landing/overview
│   │       ├── vault/              # Code Vault management
│   │       ├── new/                # New System wizard
│   │       ├── import/             # Repo ingestion
│   │       ├── presets/            # Industry preset management
│   │       └── history/            # Generated project history
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Reusable UI primitives (buttons, inputs, modals, etc.)
│   └── [feature]/          # Feature-specific components
├── lib/
│   ├── supabase/           # Supabase client, server client, middleware helpers
│   ├── utils.ts            # General utilities (cn(), formatters, etc.)
│   └── [service].ts        # Service-specific helpers (github.ts, anthropic.ts, etc.)
├── types/                  # TypeScript type definitions
└── hooks/                  # Custom React hooks
```

## Code Conventions

### General
- Use `"use client"` directive only when the component needs client-side interactivity
- Prefer Server Components and Server Actions where possible
- Use `cn()` utility (clsx + tailwind-merge) for conditional class names
- All database queries go through Supabase client — no raw SQL in components
- Environment variables: `NEXT_PUBLIC_` prefix for client-side, plain for server-side

### Components
- Functional components only, no class components
- Use named exports for components (not default exports), except for page.jsx files
- Props defined as TypeScript interfaces above the component
- Destructure props in the function signature
- Keep components focused — if it's doing too much, split it

### Supabase
- Server-side: use `createServerClient()` from `@supabase/ssr`
- Client-side: use `createBrowserClient()` from `@supabase/ssr`
- All tables use Row Level Security (RLS) — never bypass it
- Use `gen_random_uuid()` for primary keys
- Timestamps: `TIMESTAMPTZ DEFAULT now()`
- Always handle Supabase errors: `const { data, error } = await supabase.from(...)`

### Styling
- Tailwind CSS for all styling — no CSS modules or styled-components
- Dark mode support using Tailwind's `dark:` prefix where applicable
- Consistent spacing scale: use Tailwind defaults (p-4, gap-6, etc.)
- Responsive: mobile-first approach

### Error Handling
- Use try/catch in Server Actions and API routes
- Return structured error responses: `{ error: string }` or `{ data: T }`
- Show user-friendly toast notifications for errors
- Log detailed errors server-side

### File Naming
- Components: PascalCase (`VaultModuleCard.jsx`)
- Utilities/hooks: camelCase (`useVaultModules.ts`)
- Types: PascalCase files, PascalCase type names
- Constants: UPPER_SNAKE_CASE

## Database — SystemForge Tables

All SystemForge tables live in the `public` schema alongside existing dashboard tables. Every table has RLS enabled.

### Tables (create in this order due to foreign keys):

1. **`vault_modules`** — Reusable code units (modules, components, snippets)
   - `id` UUID PK
   - `name` TEXT NOT NULL
   - `description` TEXT
   - `type` TEXT NOT NULL CHECK ('module' | 'component' | 'snippet')
   - `category` TEXT (payments, forms, seo, auth, layout, utils, etc.)
   - `industry_tags` TEXT[] DEFAULT '{}'
   - `dependencies` JSONB DEFAULT '{}' (npm packages)
   - `env_vars` JSONB DEFAULT '[]' (required env variables)
   - `config_schema` JSONB DEFAULT '{}' (configurable options)
   - `is_preset` BOOLEAN DEFAULT false
   - `created_at` / `updated_at` TIMESTAMPTZ

2. **`vault_files`** — Actual code files belonging to a module
   - `id` UUID PK
   - `module_id` UUID FK → vault_modules ON DELETE CASCADE
   - `file_path` TEXT NOT NULL (e.g., "src/components/payments/SquareCheckout.jsx
  ")
   - `content` TEXT NOT NULL (the code)
   - `language` TEXT
   - `description` TEXT
   - `created_at` / `updated_at` TIMESTAMPTZ

3. **`vault_relationships`** — Parent/child and dependency links between modules
   - `id` UUID PK
   - `parent_id` UUID FK → vault_modules ON DELETE CASCADE
   - `child_id` UUID FK → vault_modules ON DELETE CASCADE
   - `relationship_type` TEXT CHECK ('contains' | 'depends_on')
   - UNIQUE(parent_id, child_id, relationship_type)

4. **`industry_presets`** — Starter templates per industry
   - `id` UUID PK
   - `name` TEXT NOT NULL
   - `industry` TEXT NOT NULL
   - `description` TEXT
   - `questionnaire_template` JSONB DEFAULT '[]'
   - `default_module_ids` UUID[] DEFAULT '{}'
   - `created_at` TIMESTAMPTZ

5. **`projects`** — Every generated project
   - `id` UUID PK
   - `user_id` UUID FK → auth.users
   - `name` TEXT NOT NULL
   - `business_name` TEXT
   - `industry` TEXT
   - `status` TEXT DEFAULT 'questionnaire' CHECK ('questionnaire' | 'selecting_features' | 'configuring' | 'assembling' | 'pushing' | 'complete' | 'error')
   - `business_profile` JSONB DEFAULT '{}' (questionnaire answers)
   - `branding` JSONB DEFAULT '{"primary_color":"#000000","secondary_color":"#ffffff","accent_color":"#0066ff","font_heading":"","font_body":"","logo_url":""}'
   - `github_repo_name` TEXT
   - `github_repo_url` TEXT
   - `assembly_log` JSONB DEFAULT '[]'
   - `created_at` / `updated_at` TIMESTAMPTZ

6. **`project_modules`** — Junction table: which modules were selected for each project
   - `id` UUID PK
   - `project_id` UUID FK → projects ON DELETE CASCADE
   - `module_id` UUID FK → vault_modules
   - `config_overrides` JSONB DEFAULT '{}'
   - UNIQUE(project_id, module_id)

### RLS Policies
- All tables: authenticated users can CRUD their own data
- vault_modules, vault_files, vault_relationships: accessible to all authenticated dashboard users (shared vault)
- projects, project_modules: scoped to `auth.uid() = user_id`

## SystemForge Feature — Build Phases

### Phase 1: Code Vault & Database (CURRENT)
Build the vault infrastructure and management UI.

**Tasks:**
1. Create Supabase migrations for all 6 tables above
2. Build `/dashboard/system-forge/vault` page:
   - List all modules with filters (type, category, industry)
   - Search functionality
   - Add/edit/delete modules via modal or slide-over panel
   - Tag management for categories and industry_tags
3. Build module detail view:
   - Show module metadata
   - List associated vault_files with a code editor (CodeMirror or Monaco)
   - Add/edit/delete files within a module
   - Show relationships (parent modules, child components, dependencies)
4. Build relationship management:
   - Link components to parent modules
   - Set dependency relationships

### Phase 2: Repo Ingestion Engine
Import existing GitHub repos into the vault via AI analysis.

**Tasks:**
1. GitHub API integration (`@octokit/rest`) — read repo contents
2. Claude API integration (`@anthropic-ai/sdk`) — analyze codebase
3. Build `/dashboard/system-forge/import` page:
   - Enter GitHub repo URL
   - Show analysis progress
   - Display AI-suggested module breakdown as interactive tree
   - Allow editing groupings, names, tags before saving
   - Confirm and batch-insert into vault tables

**Claude prompt strategy:** Send file tree + file contents, ask for structured JSON breakdown identifying modules/components/snippets, their files, dependencies, and env vars.

### Phase 3: AI Questionnaire & Feature Selector
The "New System" wizard.

**Tasks:**
1. Build `/dashboard/system-forge/new` as a multi-step wizard:
   - Step 1: Select industry (or custom) + business name
   - Step 2: AI conversational questionnaire (Claude API chat)
   - Step 3: Feature selector (categorized module grid, pre-checked with AI recommendations)
   - Step 4: Branding config (colors, logo upload, fonts)
   - Step 5: Review summary
   - Step 6: Assembly progress + completion
2. Industry presets management at `/dashboard/system-forge/presets`
3. Claude questionnaire: system prompt with industry-specific question trees, returns business profile + feature recommendations

### Phase 4: Assembly Engine & GitHub Push
The core — assemble and ship.

**Tasks:**
1. Assembly engine (Server Action or API route):
   - Fetch all vault_files for selected modules
   - Resolve dependency tree
   - Send to Claude API with instructions to integrate (not rewrite)
   - Generate merged package.json, tailwind.config with branding, layout with business name/logo
   - Generate .env.example with all required placeholders
   - Generate README
2. GitHub push (`@octokit/rest`):
   - Create private repo under `visionary-advance` org
   - Push all files to `main` branch via Git Data API (blobs → tree → commit → ref)
   - README includes .env.example table
3. Project completion page with repo link

## GitHub Integration Details

- **Organization**: `visionary-advance`
- **Repos**: Always private
- **Default branch**: `main`
- **README**: Auto-generated with setup instructions and .env.example as a table
- **Auth**: GitHub Personal Access Token or GitHub App (stored as `GITHUB_TOKEN` env var)

## Key Environment Variables (Dashboard)

```
# Existing
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# SystemForge - New
ANTHROPIC_API_KEY=          # Claude API for questionnaire + assembly
GITHUB_TOKEN=               # GitHub PAT with org repo create + write permissions
GITHUB_ORG=visionary-advance
```

## Important Notes

- This is an internal tool — only authenticated Visionary Advance team members use it
- The Code Vault is shared across all dashboard users (not per-user scoped)
- Projects ARE per-user scoped (each user's generated projects are private to them)
- The assembly engine should preserve original code as much as possible — integrate, don't rewrite
- All API keys in generated projects use placeholders like `YOUR_SQUARE_ACCESS_TOKEN_HERE`
- Logo files uploaded during branding are stored in Supabase Storage
- The AI questionnaire uses Claude Sonnet 4.5 for cost efficiency
- The assembly engine also uses Claude Sonnet 4.5