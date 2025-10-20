# Website Audit Lead Tracking Setup

## Overview
When someone runs a website audit, the system now:
1. ✅ Saves the audit results to your Supabase database
2. ✅ Sends you an email notification with the results
3. ✅ Tracks all audits for future follow-up

## Setup Instructions

### Step 1: Install Required Package

You need the Supabase client library:

```bash
npm install @supabase/supabase-js
```

### Step 2: Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `supabase_schema.sql` and paste it
6. Click "Run" to create the table

This creates a `website_audits` table with all the necessary columns and indexes.

### Step 3: Add Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Email (you should already have this)
RESEND_API_KEY=your_resend_api_key

# Optional: PageSpeed Insights API Key
PAGESPEED_API_KEY=your_google_api_key
```

**Where to find your Supabase keys:**
1. Go to your Supabase Dashboard
2. Click on "Project Settings" (gear icon in sidebar)
3. Click on "API" tab
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this SECRET!)

### Step 4: Deploy Environment Variables to Vercel

If using Vercel:
1. Go to your project settings
2. Click "Environment Variables"
3. Add all the variables from `.env.local`
4. Redeploy your site

## What Gets Saved to Database

Each audit record includes:

```javascript
{
  id: "uuid",
  url: "https://example.com",
  performance_score: 85,
  accessibility_score: 92,
  best_practices_score: 88,
  seo_score: 90,
  metrics: {
    firstContentfulPaint: "1.2s",
    speedIndex: "2.1s",
    largestContentfulPaint: "2.5s",
    // ... more metrics
  },
  opportunities: {
    performance: [...], // Array of improvement suggestions
    seo: [...]
  },
  full_results: {...}, // Complete audit data
  created_at: "2025-01-15T10:30:00Z"
}
```

## What You Get in Email Notifications

Every time someone runs an audit, you get an email with:

**Subject:** `New Website Audit: example.com (Avg Score: 75)`

**Email includes:**
- Website URL (clickable)
- All 4 scores (Performance, Accessibility, Best Practices, SEO)
- Average score
- Key performance metrics (FCP, LCP, Speed Index, TTI)
- Top 3 performance issues
- Lead opportunity assessment (highlights if scores are low)
- Link to view in dashboard (future feature)

**Example:**
```
New Website Audit Completed

Website: https://bobscontruction.com

Scores:
• Performance: 45/100
• Accessibility: 78/100
• Best Practices: 82/100
• SEO: 65/100
• Average: 67/100

Key Metrics:
• First Contentful Paint: 3.2s
• Largest Contentful Paint: 5.8s
• Speed Index: 4.1s
• Time to Interactive: 6.2s

Top Performance Issues:
• Eliminate render-blocking resources - 1.5s potential savings
• Properly size images - 2.1s potential savings
• Reduce unused JavaScript - 0.8s potential savings

🔥 Lead Opportunity: Their low scores indicate significant
room for improvement!
```

## Viewing Your Audit Data

### Option 1: Supabase Dashboard (Quick View)
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "website_audits" table
4. See all audits sorted by date

### Option 2: Build a Dashboard (Future)
You can create a `/admin/audits` page to view:
- All audits in a table
- Filter by score ranges
- Sort by date
- Export to CSV
- Flag potential leads

Example query to find hot leads:
```sql
SELECT * FROM website_audits
WHERE (performance_score + accessibility_score + best_practices_score + seo_score) / 4 < 70
ORDER BY created_at DESC;
```

## Privacy & Data Handling

**What we track:**
- ✅ Website URL
- ✅ Audit scores
- ✅ Performance metrics
- ✅ Timestamp

**What we DON'T track:**
- ❌ Personal information (unless they fill out contact form)
- ❌ IP addresses in database (only for rate limiting)
- ❌ Cookies or user identifiers

This is audit data only - not personally identifiable information.

## Lead Follow-Up Strategy

### Immediate (Hot Leads)
Email notifications let you respond quickly to:
- Sites with avg score < 50 (urgent help needed)
- Sites with specific issues you specialize in
- Repeat audits (shows high interest)

### Weekly Review
1. Check Supabase for all audits this week
2. Filter for scores < 70
3. Cross-reference with contact form submissions
4. Prioritize leads based on score + engagement

### Monthly Analysis
Track metrics like:
- Total audits run
- Average scores by category
- Most common issues
- Conversion rate (audits → contact forms)

## Troubleshooting

### "Failed to save to database" in logs
- Check your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify the table was created properly
- Check Supabase logs for errors

### "Failed to send email" in logs
- Verify `RESEND_API_KEY` is set
- Check your Resend dashboard for quota/errors
- Verify sending domain is verified

### Emails not arriving
- Check spam folder
- Verify email address in route.js (line 61)
- Check Resend dashboard for delivery status

### Duplicate audits in database
- This is normal - same URL can be audited multiple times
- Use `created_at` to see chronological order
- Consider deduplicating in your dashboard view

## Cost Considerations

**Supabase:**
- Free tier: 500MB database, 2GB bandwidth
- Website audits are small (~10-50KB each)
- Can store ~10,000+ audits on free tier

**Resend:**
- Free tier: 100 emails/day, 3,000/month
- One email per audit
- Should be fine unless you get massive traffic

**PageSpeed Insights API:**
- Free: 25,000 queries/day
- With caching, actual API calls are minimal

## Next Steps

1. ✅ Run the SQL schema in Supabase
2. ✅ Add environment variables
3. ✅ Test an audit to verify email arrives
4. ✅ Check Supabase to confirm data saved
5. Consider building an admin dashboard
6. Set up automated follow-up sequences

## Files Modified

```
lib/
  supabase.js               # New: Supabase client
app/
  api/
    lighthouse-audit/
      route.js              # Updated: Added DB save & email
supabase_schema.sql         # New: Database schema
AUDIT_TRACKING_SETUP.md     # This file
```

## Support

If you have issues, check:
1. Supabase logs: Project → Logs → Functions
2. Vercel logs: Deployment → Functions
3. Browser console for any client errors
