// SEO plan tiers and per-tier feature limits.

export const PLAN_TIERS = ['basic', 'growth', 'authority']

export const PLAN_TIER_LABELS = {
  basic: 'Basic',
  growth: 'Growth',
  authority: 'Authority',
}

export const KEYWORD_LIMITS = {
  basic: 20,
  growth: 40,
  authority: 100,
}

// Max tasks in one monthly SEO plan (seo/.claude/skills/seo-monthly-run).
export const PLAN_TASK_LIMITS = {
  basic: 3,
  growth: 5,
  authority: 8,
}

export function getPlanTaskCap(tier) {
  return PLAN_TASK_LIMITS[tier] ?? PLAN_TASK_LIMITS.basic
}

export function getKeywordCap(tier) {
  return KEYWORD_LIMITS[tier] ?? KEYWORD_LIMITS.basic
}

export function isValidTier(tier) {
  return PLAN_TIERS.includes(tier)
}

// Used in upgrade-prompt copy when a customer hits their cap.
export function nextTier(tier) {
  const idx = PLAN_TIERS.indexOf(tier)
  if (idx === -1 || idx === PLAN_TIERS.length - 1) return null
  return PLAN_TIERS[idx + 1]
}
