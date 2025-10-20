# Lighthouse Website Audit Setup

## Overview
The website audit component uses Google's PageSpeed Insights API to run Lighthouse audits. This document explains how to set up and optimize the feature.

## Current Features
✅ **Caching** - Results cached for 24 hours per URL (reduces API calls)
✅ **Rate Limiting** - 5 audits per IP per hour (prevents abuse)
✅ **Error Handling** - User-friendly messages with CTA fallback
✅ **API Key Support** - Optional for higher quotas

## Free Tier Limits
Without an API key, you get:
- **25,000 queries per day** (shared across all users)
- This is usually sufficient for moderate traffic

The quota resets daily at midnight Pacific Time.

## Getting an API Key (Optional - for High Traffic)

If you're hitting quota limits, get a free API key:

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required, but API is free up to quota limits)

### Step 2: Enable PageSpeed Insights API
1. Go to [API Library](https://console.cloud.google.com/apis/library)
2. Search for "PageSpeed Insights API"
3. Click "Enable"

### Step 3: Create API Key
1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "API Key"
3. Copy your API key
4. (Recommended) Click "Restrict Key" and limit to PageSpeed Insights API only

### Step 4: Add to Environment Variables
Add to your `.env.local` file:

```env
PAGESPEED_API_KEY=your_api_key_here
```

### Step 5: Deploy
If using Vercel:
1. Go to your project settings
2. Add the environment variable: `PAGESPEED_API_KEY`
3. Redeploy

## API Key Benefits
- **Higher quota**: 25,000 queries per day per project
- **Better monitoring**: Track usage in Google Cloud Console
- **More control**: Set custom quotas and restrictions

## How It Works

### 1. User Request Flow
```
User enters URL → Frontend → API Route → Check Cache → Check Rate Limit → Call PageSpeed API → Return Results
```

### 2. Caching Strategy
- Results cached for 24 hours per unique URL
- Same URL tested multiple times = instant cached results
- Reduces API calls by ~80% for popular URLs

### 3. Rate Limiting
- Limit: 5 audits per IP per hour
- Prevents abuse and protects quota
- Can adjust in `app/api/lighthouse-audit/route.js`:
  ```javascript
  const RATE_LIMIT = 5 // Change this number
  const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms
  ```

### 4. Error Handling
When quota is exceeded:
- User sees friendly error message
- Directed to contact form for manual audit
- Converts error into lead generation opportunity

## Monitoring Usage

### Without API Key
You won't be able to see your usage. You'll only know when you hit the limit.

### With API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Dashboard"
3. Click on "PageSpeed Insights API"
4. View usage graphs and metrics

## Adjusting Cache Duration

To change how long results are cached, edit `app/api/lighthouse-audit/route.js`:

```javascript
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours (in milliseconds)
```

Examples:
- 1 hour: `1 * 60 * 60 * 1000`
- 12 hours: `12 * 60 * 60 * 1000`
- 7 days: `7 * 24 * 60 * 60 * 1000`

## Production Considerations

### Current Setup (Good for Most Cases)
- In-memory caching (works on Vercel serverless)
- Simple and fast
- Resets when function cold-starts

### For High-Traffic Sites
Consider upgrading to:
- **Redis** - Persistent cache across all instances
- **Upstash** - Serverless Redis (works great with Vercel)
- **Database** - Store results in Supabase

### Example: Upstash Redis Setup
```javascript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// In your route:
const cached = await redis.get(cacheKey)
await redis.setex(cacheKey, 86400, results) // 24 hours
```

## Lead Generation Strategy

Even when the API fails, you're capturing leads:

1. **Error converts to opportunity** - "Contact us for manual audit"
2. **CTA after results** - "Want help fixing these issues?"
3. **Form integration** - Smooth flow to contact form
4. **Value demonstration** - Shows your expertise even with cached/error states

## Troubleshooting

### "Quota exceeded" error
- **Solution 1**: Wait until midnight PT for reset
- **Solution 2**: Add API key (see above)
- **Solution 3**: Increase cache duration to reduce API calls

### Cache not working
- In-memory cache resets on serverless cold starts
- Consider Redis for persistent cache

### Rate limit too strict
- Adjust `RATE_LIMIT` constant in route.js
- Balance between user experience and API quota protection

## File Structure
```
app/
  api/
    lighthouse-audit/
      route.js          # API endpoint with caching & rate limiting
Components/
  WebsiteAudit.js       # Frontend component
app/
  construction-websites/
    page.js             # Landing page with integrated audit tool
```

## Next Steps
1. Monitor usage for first week
2. Adjust cache duration if needed
3. Add API key if approaching quota limits
4. Consider Redis for high-traffic scenarios
