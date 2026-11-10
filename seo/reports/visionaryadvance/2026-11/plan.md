# Visionary Advance: SEO plan, November 2026

**Run:** 2026-11-09 · `seo-monthly-run` (first run) · tier **basic**, so 3 tasks · status: **draft, needs approval**
**Windows:** current Oct 10 – Nov 6, previous Sep 12 – Oct 9 (GSC lags about 3 days)

## Headline numbers

| | Current | Previous | Change |
|---|---|---|---|
| GSC clicks | 16 | 9 | +78% |
| GSC impressions (sum of pages) | ~3,257 | ~2,199 | +48% |
| Homepage avg position | 10.7 | 5.4 | worse (impressions up 574 → 783, clicks flat at 9) |
| `/eugene-web-design` | 839 impr · pos 25.8 · 1 click | 766 · 28.4 · 0 | slightly better |
| `/services/web-design` | 746 impr · pos 42.0 · 0 clicks | 136 · 40.1 · 0 | **5.5× impressions**, see task 1 |
| `/eugene-website-hosting` | 208 impr · pos 13.6 · 1 click | (new) | new page is picking up hosting demand |
| GA4 organic sessions | 27 | — | |
| Leads (form/booking) | 3 (Aug 15 – Nov 6, all `/contact`) | — | none are Key Events yet |

## Chosen tasks

### 1. Stop `/services/web-design` competing with `/eugene-web-design` (high · on-page · small · score 20)
`app/services/[slug]/layout.js` titles every service page `"<Service> Services | Eugene, OR"`, so `/services/web-design` competes with the dedicated Eugene page:

| Query | `/eugene-web-design` | `/services/web-design` |
|---|---|---|
| eugene web design | pos 21 · 2 impr | pos 35 · **53 impr** |
| eugene website designer | pos 25 · 1 | pos 38 · **36** |
| eugene oregon web design | **pos 11** · 9 | pos 55 · 36 |
| eugene website design | **pos 12** · 7 | pos 48 · 23 |
| eugene web designer | pos 21 · 2 | pos 45 · 33 |

Fix: make the services page location-neutral and link it to `/eugene-web-design`. This fits the existing SEO notes, which name `/eugene-web-design` as the lever.

### 2. Fix GA4 tracking (high · analytics · small · score 16)
77 of ~100 sessions have landing page **"(not set)"**. `Components/Analytics.jsx` sends the first `page_view` before the `lazyOnload` init script configures GA4. `page_location` also drops the query string, losing UTMs and gclid. Until this is fixed, the "traffic but no leads" check can't run. **Your part:** mark `lead_form_submit`, `book_call_submit` and `click_phone` as Key Events in GA4.

### 3. Track money keywords in the CRM (medium · analytics · small · score 15)
`seo_site_keywords` is empty, so this run couldn't measure keyword movement. The plan adds 10 keywords (basic tier allows 20).

## Considered, not chosen
- **Rewrite the `/eugene-website-hosting` title for CTR.** "eugene website hosting" has 27 impressions at position 7.0 and 0 clicks. The sample is small and the page is new and still climbing. Revisit next month. (impact 2 × ease 5 = 10)
- **Homepage position drop 5.4 → 10.7.** Clicks are flat and impressions are up. It looks like dilution from broad queries ("internet marketing services", pos 26; "internet marketing agency", pos 41) rather than a real loss. Watch.
- **Branding, graphic design and digital marketing queries** ("branding eugene" 12 impr pos 36; "design agency eugene oregon" 10 impr pos 52). These land on `/eugene-web-design` at 36–96. A dedicated page could work, but only after task 1 settles. A competitor page comparison is due next run. (impact 3 × ease 1)
- **The law-firm page gets out-of-area queries** (San Francisco, Chicago, Reno, at positions 55–73). Low value, so no action.
- **Google Business Profile "Book" links go to `http://visionaryadvance.com/contact?rwg_token=...`.** These are Reserve with Google links using http. Setting the GBP appointment URL to `https://visionaryadvance.com/contact` would avoid a redirect hop. This is a 2-minute fix in GBP, not a plan task.

## Carried over
October's Gemini plan ("Improve Search Rankings", "Technical SEO Audit", "Review Analytics Setup") has all 3 tasks still pending. They're too generic to carry forward. Tasks 1–2 above are the specific versions of them. Approving this draft archives that plan.

## Gaps in this run
- GA4 landing pages are mostly "(not set)", so the traffic-vs-leads rule is unreliable.
- No tracked keywords (R7 skipped).
- Competitor sites weren't fetched (R3 partial). The Google Business Profile wasn't audited (R6 used GSC only).
- The query×page pull used a keyword filter and 120 rows instead of 500, to keep this first run lean.

## Watch next month
- Which page Google shows for the Eugene web design queries after task 1
- "(not set)" share and Direct sessions after task 2
- `/eugene-website-hosting` position for "eugene website hosting"
