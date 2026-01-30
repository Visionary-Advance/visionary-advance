# Visionary Advance – Systems SEO Website Build Spec (Next.js App Router + Supabase + Vercel)
Version: 1.1
Stack: Next.js (App Router), Supabase, Vercel
Goal: Local dominance + lead generation for custom systems (Contractors, Warehouses, Dashboards, Custom CMS)

---

## 0) Key Positioning (must appear on homepage + systems pages)
Primary:
"Custom systems built around your workflow — not platforms you have to adapt to."

Secondary:
- Built in Eugene, serving Lane County + Oregon
- Modern frameworks, custom code, secure dashboards
- Websites designed with SEO in mind to get clients found

---

## 1) Routing + File Structure (App Router)
Create these routes/pages:

- /custom-business-systems
  - app/custom-business-systems/page.tsx

- /contractor-systems
  - app/contractor-systems/page.tsx

- /warehouse-inventory-systems
  - app/warehouse-inventory-systems/page.tsx

- /custom-dashboards-analytics
  - app/custom-dashboards-analytics/page.tsx

- /custom-cms-development
  - app/custom-cms-development/page.tsx

Add reusable components:
- components/CTA.tsx
- components/LeadForm.tsx
- components/SchemaJsonLd.tsx
- lib/seo.ts
- lib/analytics.ts
- lib/supabase/client.ts
- lib/supabase/server.ts (if needed)

---

## 2) SEO Metadata (Next.js App Router)
Each page MUST export `metadata` with:
- title
- description
- alternates.canonical
- openGraph (title, description, url)
- twitter (title, description)

Example pattern:
export const metadata: Metadata = {
  title: "...",
  description: "...",
  alternates: { canonical: "https://visionaryadvance.com/..." },
  openGraph: { title: "...", description: "...", url: "https://visionaryadvance.com/..." },
  twitter: { title: "...", description: "..." }
};

---

## 3) Page Titles + Meta Descriptions (final)
Homepage:
TITLE: Custom Business Systems & SEO Web Design | Eugene, OR – Visionary Advance
META: Custom-built websites, dashboards, and business systems designed around how you work. Serving Eugene & Lane County businesses.

 /custom-business-systems
TITLE: Custom Business Systems Built Around Your Workflow | Eugene OR
META: We design custom dashboards, inventory systems, and internal software that fits your business — not the other way around.

 /contractor-systems
TITLE: Custom Contractor Management Systems | Eugene & Lane County
META: Custom dashboards, job tracking, and inventory systems built for contractors. Designed around your workflow. Eugene, OR.

 /warehouse-inventory-systems
TITLE: Custom Inventory & Warehouse Systems | Eugene, Oregon
META: Replace spreadsheets with real-time inventory dashboards and warehouse systems built specifically for your operation.

 /custom-dashboards-analytics
TITLE: Custom Analytics Dashboards for Businesses | Eugene OR
META: Track operations, performance, and ROI with custom analytics dashboards built for your business systems.

 /custom-cms-development
TITLE: Custom CMS Development for Internal Systems | Eugene OR
META: We build custom CMS platforms tailored to your business workflows — secure, scalable, and easy to manage.

---

## 4) On-Page Content (copy to implement)

### 4.1 /contractor-systems (FULL COPY)
H1: Custom Contractor Management Systems Built Around Your Workflow

Above the fold:
Most contractor software forces you to change how you work.
We do the opposite.

Visionary Advance builds custom contractor systems that match how your business already operates — from job tracking to inventory to reporting — all in one secure dashboard.

Built in Eugene. Designed for real contractors.

H2: The Problem
Contractors come to us when:
- Jobs are tracked across texts, spreadsheets, and emails
- Office and field teams are disconnected
- Inventory runs out mid-job
- There’s no clear view of profitability or job status

H2: The Solution
A Contractor System Designed Around Your Business
Includes:
- Job & project dashboards
- Task and labor tracking
- Inventory & materials management
- Reporting & analytics
- Role-based access (office, field, admin)
- Custom CMS for internal updates

H2: Why Custom Wins
Off-the-shelf:
- Forces new workflows
- Monthly fees forever
- Limited reporting
- Hard to scale

Visionary Advance:
- Built around your existing process
- One system, not five tools
- Fully custom dashboards
- Scales as you grow

H2: Local Trust
We work with Eugene and Lane County contractors who need systems that work in the real world — not Silicon Valley demos.

CTA:
Title: Let’s Map Your Workflow
Text: Free system consultation. No pressure. Just clarity.
Button: Map My Workflow (scroll to lead form)

---

### 4.2 /warehouse-inventory-systems (FULL COPY)
H1: Custom Inventory & Warehouse Systems Built for Real Operations

Above the fold:
Spreadsheets break when warehouses grow.
We build custom inventory and warehouse management systems that give you real-time visibility into stock, movement, and performance — all from one dashboard.

H2: Warehouse Pain Points
- Inventory counts are never accurate
- No real-time reporting
- Manual updates waste hours
- No clear analytics for forecasting

H2: Custom Warehouse Systems
Our systems can include:
- Inventory tracking
- Stock movement logs
- Low-stock alerts
- Warehouse dashboards
- Analytics & forecasting
- Custom CMS for internal updates

H2: Local Trust
Designed and built in Eugene for Lane County warehouses and distributors.

CTA:
Title: Replace Spreadsheets With a System That Works
Button: Get a System Plan (scroll to lead form)

---

### 4.3 /custom-dashboards-analytics (SHORT COPY)
H1: Custom Dashboards & Analytics Built for Your Business
Body:
We build dashboards that show what matters — job status, inventory, performance, and ROI — in one place.
No guessing. No spreadsheet chaos. Just clarity.

Bullets:
- Role-based dashboards
- Real-time reporting
- KPI tracking
- Marketing + operations attribution (where applicable)
- Owner-ready reports

CTA: See a Dashboard Example (scroll to example section or lead form)

---

### 4.4 /custom-cms-development (SHORT COPY)
H1: Custom CMS Development for Internal Systems
Body:
If WordPress or off-the-shelf CMS platforms don’t fit your workflow, we build a custom CMS tailored to your operation.
Manage data, users, workflows, and content securely — without unnecessary complexity.

Bullets:
- Secure admin access
- Role-based permissions
- Custom fields + workflows
- Audit logs (recommended)
- API-ready architecture

CTA: Talk to a Developer (scroll to lead form)

---

## 5) Schema JSON-LD (Add to each systems page + optionally sitewide)
Use a `SchemaJsonLd` component that renders:
<script type="application/ld+json">{JSON.stringify(schema)}</script>

Schema object (replace placeholders if known):
- Name: Visionary Advance
- URL: https://visionaryadvance.com
- Area served: Eugene, Lane County, Oregon

JSON:
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Visionary Advance",
  "url": "https://visionaryadvance.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Eugene",
    "addressRegion": "OR",
    "addressCountry": "US"
  },
  "areaServed": ["Eugene", "Lane County", "Oregon"],
  "serviceOffered": [
    { "@type": "Service", "name": "Custom Contractor Management Systems" },
    { "@type": "Service", "name": "Inventory & Warehouse Management Systems" },
    { "@type": "Service", "name": "Custom Analytics Dashboards" },
    { "@type": "Service", "name": "Custom CMS Development" }
  ]
}

Optional: Add FAQ schema if FAQ section is implemented.

---

## 6) Lead Form Requirements (Supabase)
Create a single lead form component used across all pages.

Fields:
- name (required)
- email (required)
- phone (optional)
- business_type (dropdown: Contractor, Warehouse/Inventory, Other)
- current_tools (text)
- biggest_bottleneck (text)
- desired_outcome (text)
- page_path (hidden)
- created_at (auto)

Supabase table: leads
Columns:
- id uuid default gen_random_uuid() primary key
- name text not null
- email text not null
- phone text
- business_type text
- current_tools text
- biggest_bottleneck text
- desired_outcome text
- page_path text
- created_at timestamptz default now()

Security:
- Use Supabase anon key from client; enable RLS
- Create an insert-only policy OR use a server action/API route with service role key.
RECOMMENDED:
- Use server action or route handler with service role key to avoid public insert abuse.

Implementation approach:
A) Route handler: app/api/leads/route.ts
- POST validates input
- inserts into supabase using service role (server-side)
- returns success JSON

B) Client LeadForm submits to /api/leads

---

## 7) Analytics (GA4) + Conversion Events
Install GA4 via Next.js (App Router) using:
- next/script in app/layout.tsx
- Use env var NEXT_PUBLIC_GA_ID

Track events:
- lead_form_submit
- lead_form_error
- cta_click_systems
- click_phone
- click_email

Implementation:
- lib/analytics.ts exports `trackEvent(name, params)`
- On form submit success => trackEvent("lead_form_submit", { page_path, business_type })
- CTA buttons => trackEvent("cta_click_systems", { page_path, cta: "Map My Workflow" })

Ensure events include:
- page_path
- service_type (contractor/warehouse/dashboards/cms)
- business_type (if selected)

---

## 8) Internal Linking Rules
Homepage:
- Link to /custom-business-systems anchor text: "Custom Business Systems"
- Feature cards link to /contractor-systems and /warehouse-inventory-systems

Each systems page:
- Link to /custom-dashboards-analytics and /custom-cms-development (contextual anchors)
- CTA scrolls to lead form
- Add a final line linking to /contact if it exists

---

## 9) UI Requirements (Simple & Fast)
- Use existing design system/components
- Make CTAs prominent above fold + near end
- Lead form at bottom of each systems page
- Keep images optional; prioritize speed

---

## 10) Vercel Environment Variables
Required:
- NEXT_PUBLIC_SITE_URL=https://visionaryadvance.com
- NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
- SUPABASE_URL=...
- SUPABASE_ANON_KEY=...
Server-only (if using route handler insert):
- SUPABASE_SERVICE_ROLE_KEY=...

---

## 11) Acceptance Checklist
- All routes render and are linked in nav
- Metadata correct per page
- Canonical urls set
- Schema injected (validate with rich results test)
- Lead form stores rows in Supabase
- GA4 events firing
- Pages indexable (no noindex)
- Sitemap includes new pages
- Mobile-friendly

---

## 12) Optional Enhancements (Backlog)
- Add FAQ sections + FAQ schema on contractor + warehouse pages
- Add 1–2 optimized screenshots (dashboard example)
- Add case study template pages

---

## 13) Mermaid System Diagram (optional to include on internal docs page)
```mermaid
graph TD
    User -->|Login| Auth
    Auth --> Dashboard
    Dashboard --> Jobs
    Dashboard --> Inventory
    Dashboard --> Analytics
    Admin --> CMS
    CMS --> Database
    Jobs --> Database
    Inventory --> Database
    Analytics --> Database
