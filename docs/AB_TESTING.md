# A/B Testing

Lightweight, edge-evaluated A/B testing for the marketing site. No third-party
service — variants are assigned in middleware via cookie, rendered server-side
(no flicker), and reported to GA4 as custom events.

## Architecture

```
Request to /
   │
   ▼
middleware.js
   ├─ has cookie? → reuse variant
   └─ no cookie?  → pick random variant, set cookie (30 days)
   │
   ▼
app/page.js (server component)
   ├─ reads cookie via next/headers cookies()
   └─ passes resolved title + variant key to <HomeClient />
   │
   ▼
Components/Home/HomeClient.jsx (client)
   ├─ renders <h1>{title}</h1>
   └─ on mount: gtag('event', 'ab_view', {experiment_id, variant})
```

Why server-rendered: the H1 is above-the-fold. Reading the cookie client-side
would cause a flash of the default title before swapping to the variant.

## Files

| File | Purpose |
| --- | --- |
| `lib/ab-tests.js` | Registry of all tests (id, cookie name, variants, helpers) |
| `middleware.js` | Edge cookie assignment for `/` |
| `app/page.js` | Server wrapper that reads cookie and picks the variant text |
| `Components/Home/HomeClient.jsx` | Client component that renders the page and fires the GA4 event |

## Adding a new variant title

Edit `lib/ab-tests.js`:

```js
export const HOME_TITLE_TEST = {
  id: 'home_title',
  cookieName: 'ab_home_title',
  cookieMaxAge: 60 * 60 * 24 * 30,
  variants: {
    a: 'Custom Websites, SEO & Business Systems Built Around How You Work',
    b: 'Your new headline here',
    // c: '...' — add as many as you want; weights are even across keys
  },
}
```

That's it. Existing visitors keep their assigned variant until the cookie
expires; new visitors get bucketed across all current variants.

## Adding a new test (e.g., CTA button copy)

1. Add a test object to `lib/ab-tests.js`:
   ```js
   export const CTA_BUTTON_TEST = {
     id: 'cta_button',
     cookieName: 'ab_cta_button',
     cookieMaxAge: 60 * 60 * 24 * 30,
     variants: {
       a: 'Run an Audit',
       b: 'Get Your Free Audit',
     },
   }
   ```
2. In `middleware.js`, assign the cookie alongside the existing one:
   ```js
   import { HOME_TITLE_TEST, CTA_BUTTON_TEST, pickRandomVariant } from '@/lib/ab-tests'
   // …existing code…
   const tests = [HOME_TITLE_TEST, CTA_BUTTON_TEST]
   for (const test of tests) {
     const existing = request.cookies.get(test.cookieName)?.value
     if (!existing || !test.variants[existing]) {
       response.cookies.set(test.cookieName, pickRandomVariant(test), {
         maxAge: test.cookieMaxAge,
         path: '/',
         sameSite: 'lax',
       })
     }
   }
   ```
3. In whichever server component renders the surface, read the cookie and pass
   the variant to its client component (same pattern as `app/page.js`).
4. Fire `gtag('event', 'ab_view', { experiment_id: <test.id>, variant })`.

## Reading results in GA4

1. **Configure GA4 once.** In GA4 → Admin → Custom definitions, register two
   custom event-scoped dimensions if not already present:
   - `experiment_id` (event parameter: `experiment_id`)
   - `variant` (event parameter: `variant`)
2. **Build an exploration:**
   - Free-form report
   - Filter: `event name = ab_view`
   - Rows: `variant` (or `experiment_id` + `variant` for multiple tests)
   - Values: total users, plus your conversion event of choice (e.g.
     `lead_form_submit`)

For conversion attribution, the variant cookie persists 30 days, so we can
also stamp the variant onto the `lead_form_submit` event from the client.
That's not wired up yet — see "Future" below.

## Cookie reference

| Cookie | Default lifetime | Set by | Notes |
| --- | --- | --- | --- |
| `ab_home_title` | 30 days | `middleware.js` | Sticks visitors to `a` or `b` for the home headline test |

Cookies are `sameSite=lax`, path `/`. They are not marked `httpOnly` because
the client also needs to read them when stamping conversion events (future
work).

## Bot traffic

Bots get bucketed too, which can dilute results. Two pragmatic options:
- Add a UA check in `middleware.js` to skip cookie assignment for known bots.
- Filter `ab_view` events in GA4 by `device.category` or by excluding common
  crawler UAs.

For now we accept the noise; revisit if a test is close to significance and
bot share looks high.

## Future improvements

- **Conversion attribution.** Read `ab_home_title` in `trackLeadFormSubmit` and
  send it as `variant` on the conversion event so funnels can be split by
  variant directly.
- **Server-side stat sig.** A small route handler that pulls counts from GA4
  Data API and computes a chi-squared p-value would let us short-circuit
  obvious winners without leaving the dashboard.
- **Vercel Edge Config.** If we want to flip variants without redeploying,
  move the variants table into Edge Config and read it from middleware. Adds
  a small read-time cost in exchange for runtime config.
