# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Visionary Advance is a Next.js 16.1.1 application providing premium web design and development services, with a specialized focus on construction company websites. The project features multiple landing pages, OAuth integrations (Square, Jobber), and automated website auditing capabilities.

## Development Commands
```bash
npm run dev    # Development server (http://localhost:3000)
npm run build  # Production build
npm run start  # Start production server
```

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS v4 with PostCSS
- **Animations**: Framer Motion, GSAP
- **Backend**: Supabase (database), Resend (email)
- **Integrations**: Square API, Jobber API, HubSpot CRM
- **3D Graphics**: OGL (WebGL library)
- **CMS**: Sanity v5.1.0 with next-sanity v12.0.5

## Architecture

### Application Structure
The app follows Next.js App Router conventions:
- **app/** - Route handlers and pages using Next.js 15 App Router
- **Components/** - Shared React components (note: capital C)
- **lib/** - Utility functions and integration logic
- **public/** - Static assets

### Key Integration Patterns

#### OAuth Token Management
The codebase implements a sophisticated OAuth token management system for both Square and Jobber:

**Square (`lib/square-auth.js`)**:
- Automatic token refresh when expiring within 5 days
- `getValidSquareToken(clientId)` - Returns valid token, auto-refreshes if needed
- `callSquareAPI(clientId, endpoint, options)` - Makes authenticated calls with retry logic
- `refreshExpiringTokens()` - Batch refresh job (runs via cron at 2 AM daily)
- Tokens stored in `square_auth` table in Supabase
- Location data stored separately in `square_locations` table

**Jobber (`lib/jobber.js`)**:
- `getValidJobberToken(accountId)` - Auto-refreshing token getter
- Uses GraphQL API with `X-JOBBER-GRAPHQL-VERSION: 2025-01-20` header
- `createJobberClient()` and `createJobberRequest()` for lead capture
- Tokens stored in `jobber_accounts` table in Supabase

**HubSpot (`lib/hubspot.js`)**:
- Automatic CRM integration for contact form submissions
- `handleContactFormSubmission(formData)` - Main function that orchestrates all HubSpot operations
- Creates/updates Contacts with email, phone, name
- Creates/updates Companies based on company name
- Creates Deals automatically for each form submission
- Creates high-priority Tasks for follow-up
- Automatically associates all objects (Contact → Company → Deal → Task)
- Non-blocking integration (doesn't fail form submission if HubSpot is down)
- Handles duplicate detection by searching for existing contacts/companies first

#### Supabase Database Architecture
Uses TWO separate Supabase instances:
1. **Main instance** (`NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`)
   - Website audits (`va_website_audits`)
   - Square auth and locations

2. **Tokens instance** (`SUPABASE_TOKENS_URL` + `SUPABASE_TOKENS_SERVICE_KEY`)
   - Jobber accounts
   - Note: `lib/jobber.js` uses tokens instance, `lib/square-auth.js` uses main instance

#### Layout System
The app uses a conditional layout system via `Components/ConditionalLayout.jsx`:
- Regular pages get `Header` + `Footer`
- Landing pages (e.g., `/construction-websites`) exclude them
- Detection based on `usePathname()` check
- Individual routes can also have their own `layout.js` (e.g., `app/construction-websites/layout.js`)

### API Routes

**Email Endpoints**:
- `/api/send` - Main contact form submissions (Resend + HubSpot integration)
- `/api/send-email` - Alternative email endpoint (Resend + HubSpot integration)
- `/api/send-audit-email` - Website audit report emails

**OAuth Callbacks**:
- `/api/square/callback` - Square OAuth flow completion
- `/api/jobber/authorize` - Jobber auth initiation
- `/api/jobber/callback` - Jobber OAuth flow completion

**Utilities**:
- `/api/lighthouse-audit` - Google PageSpeed Insights integration with rate limiting
- `/api/cron/refresh-tokens` - Automated token refresh (runs daily at 2 AM via vercel.json)

### Website Audit Flow
1. User submits URL to `/api/lighthouse-audit`
2. Route validates URL, checks rate limits (200/hr per IP)
3. Calls Google PageSpeed API (uses `PAGESPEED_API_KEY` if available)
4. Saves results to `va_website_audits` table (non-blocking)
5. Sends admin notification email (non-blocking)
6. Returns scores and metrics to client

### Environment Variables Required

**Supabase** (two instances):
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (main)
- `SUPABASE_TOKENS_URL` + `SUPABASE_TOKENS_SERVICE_KEY` (tokens)

**Email**:
- `RESEND_API_KEY` (Resend service)

**Square Integration**:
- `SQUARE_APPLICATION_ID`
- `SQUARE_APPLICATION_SECRET`
- `SQUARE_ENVIRONMENT` (sandbox or production)

**Jobber Integration**:
- `JOBBER_CLIENT_ID`
- `JOBBER_CLIENT_SECRET`
- `JOBBER_REDIRECT_URI`

**HubSpot Integration**:
- `HUBSPOT_ACCESS_TOKEN` (Private App Access Token from HubSpot)

**Optional**:
- `PAGESPEED_API_KEY` (Google PageSpeed API, falls back to anonymous if not set)

## Key Landing Pages

### Construction Websites (`/construction-websites`)
Primary lead generation page with:
- Hero, Problems, Solutions, Social Proof, CTA sections
- 6-field contact form integrated with `/api/send`
- Mobile-first responsive design
- Gradient backgrounds with grid patterns
- No default header/footer (custom layout)

### Target Keywords
construction website design, contractor website, construction company website, builder website design, construction web development, contractor lead generation

## Deployment

**Platform**: Vercel

**Cron Jobs** (vercel.json):
- Token refresh runs daily at 2:00 AM UTC
- Refreshes Square tokens expiring within 5 days

## Important Notes

1. **Component Directory**: Uses capital `Components/` not `components/`

2. **Next.js 16 Breaking Changes**:
   - `params` in page components and `generateMetadata` must be awaited (e.g., `const { slug } = await params`)
   - Supabase clients use lazy initialization to prevent build-time errors
   - All dynamic routes have been updated to handle async params

3. **Server-Side Keys**: Always use `SUPABASE_SERVICE_ROLE_KEY` in API routes (never anon key for privileged operations)

4. **OAuth Token Pattern**: Both Square and Jobber use similar patterns:
   - Store tokens in Supabase with expiration
   - Auto-refresh when getting valid tokens
   - Handle 401s with automatic retry after refresh

5. **Rate Limiting**: Lighthouse audit endpoint implements in-memory rate limiting (200 req/hr per IP)

6. **Google Fonts**: Custom font configuration in root layout using DM Sans and Instrument Sans

7. **SEO Metadata**: Root layout includes comprehensive Open Graph, Twitter Cards, and robots directives

8. **Error Handling**: API routes should return descriptive JSON errors with appropriate status codes

## Business Context
- **Primary Service**: Web design/development for construction companies
- **Lead Generation**: Free website audits as entry point
- **Integration Goal**: Seamless client onboarding through Square (payments) and Jobber (CRM)
