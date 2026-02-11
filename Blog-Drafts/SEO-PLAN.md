# SEO Plan for Sanity Blog Rankings

A step-by-step guide to getting your Sanity blog posts ranking in Google search results.

---

## Phase 1: Technical Foundation (Week 1)

### 1. Google Search Console Setup
- Verify your domain at [search.google.com/search-console](https://search.google.com/search-console)
- Submit your sitemap (likely `https://visionaryadvance.com/sitemap.xml`)
- Check for crawl errors and fix any issues

### 2. Verify Sitemap Includes Blog Posts
Your Next.js + Sanity setup should auto-generate blog URLs. Confirm your sitemap includes entries like:
```xml
<url>
  <loc>https://visionaryadvance.com/blog/construction-website-must-haves</loc>
  <lastmod>2026-02-10</lastmod>
</url>
```

### 3. Check Meta Tags on Blog Posts
Each blog post should have unique:
- **Title tag**: `5 Must-Have Features for Construction Websites | Visionary Advance`
- **Meta description**: `Learn the 5 essential features every construction company website needs to generate leads and win more bids.`
- **Open Graph tags** for social sharing

---

## Phase 2: Content Strategy (Weeks 1-4)

### 1. Target Long-Tail Keywords First
Start with low-competition, high-intent keywords:

| Instead of... | Target... |
|---------------|-----------|
| "construction website" | "construction company website examples 2026" |
| "contractor SEO" | "how to get more leads as a general contractor" |
| "web design" | "does my construction company need a new website" |

### 2. Content Structure Template
Each blog post should follow this format:

```markdown
# [Primary Keyword in Title]

Introduction (include keyword naturally in first 100 words)

## [H2 with related keyword]
Content...

## [H2 with related keyword]
Content...

## Conclusion / Call to Action
Link to your services or free website audit
```

### 3. Example Blog Topics for Construction Niche
1. "7 Signs Your Construction Website Is Costing You Jobs"
2. "How to Showcase Your Construction Portfolio Online"
3. "Why Construction Companies Need Mobile-Friendly Websites"
4. "Before & After: Construction Website Redesign Case Studies"
5. "How General Contractors Can Get More Leads From Google"

---

## Phase 3: On-Page Optimization (Ongoing)

### 1. Internal Linking Strategy
Link between related content:
```
Blog Post: "5 Website Must-Haves for Contractors"
    ↓ links to
Service Page: /construction-websites
    ↓ links to
Blog Post: "Construction Website Examples"
    ↓ links to
Free Audit: /audit
```

### 2. Image Optimization
For every image:
- Descriptive filename: `construction-website-portfolio-example.jpg` (not `IMG_1234.jpg`)
- Alt text: `Screenshot of a modern construction company website homepage`
- Compress images for fast loading

### 3. Schema Markup (Structured Data)
Add BlogPosting schema to each post:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "5 Must-Have Features for Construction Websites",
  "author": {
    "@type": "Organization",
    "name": "Visionary Advance"
  },
  "datePublished": "2026-02-10"
}
```

---

## Phase 4: Off-Page SEO (Months 1-3)

### 1. Build Backlinks
Target these sources:
- **Construction industry directories** (AGC, local builder associations)
- **Guest posts** on construction/business blogs
- **Local business directories** (Google Business Profile, Yelp)
- **Partner links** (if you've built sites for clients, ask for a "Website by Visionary Advance" link)

### 2. Social Signals
Share each post on:
- LinkedIn (your primary B2B audience)
- Facebook business page
- Twitter/X with relevant hashtags (#construction #webdesign #contractors)

---

## Phase 5: Measure & Iterate (Monthly)

### Track These Metrics in Google Search Console:
| Metric | What to look for |
|--------|------------------|
| Impressions | Are posts appearing in search? |
| Clicks | Are people clicking through? |
| Average Position | Improving over time? |
| Indexed Pages | Are all blog posts indexed? |

### Monthly Tasks:
1. Check which posts are gaining traction → write more on those topics
2. Update older posts with new information
3. Fix any pages with high impressions but low clicks (improve titles/descriptions)
4. Add internal links from new posts to old ones

---

## Quick Wins Checklist

- [ ] Set up Google Search Console
- [ ] Submit sitemap
- [ ] Verify each blog post has unique title + meta description
- [ ] Add internal links from blog → service pages
- [ ] Create Google Business Profile (if not already)
- [ ] Share first 3 blog posts on LinkedIn
- [ ] Compress all blog images

---

## Timeline Expectations

| Milestone | Typical Timeline |
|-----------|------------------|
| Initial indexing | 1-4 weeks |
| Ranking for long-tail keywords | 1-3 months |
| Ranking for competitive keywords | 3-12+ months |

Results depend on domain authority, content quality, backlinks, and competition.
