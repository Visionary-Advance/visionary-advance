// A/B test registry. Each test owns its own cookie so variants are stable
// per-visitor for the cookie's lifetime.

export const HOME_TITLE_TEST = {
  id: 'home_title',
  cookieName: 'ab_home_title',
  cookieMaxAge: 60 * 60 * 24 * 30, // 30 days
  variants: {
    a: 'Custom Websites, SEO & Business Systems Built Around How You Work',
    b: 'Websites & Systems Built to Run Your Business — Not Just Look Good',
  },
}

export function pickRandomVariant(test) {
  const keys = Object.keys(test.variants)
  return keys[Math.floor(Math.random() * keys.length)]
}

export function resolveVariant(test, value) {
  return value && test.variants[value] ? value : Object.keys(test.variants)[0]
}
