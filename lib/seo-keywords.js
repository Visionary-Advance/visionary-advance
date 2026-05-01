// CRUD for tracked keywords + Google Search Console enrichment.

import { getSearchAnalytics } from './search-console'
import { getKeywordCap } from './seo-tiers'

let supabaseClient = null
function getSupabase() {
  if (!supabaseClient) {
    const { createClient } = require('@supabase/supabase-js')
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    )
  }
  return supabaseClient
}

function dateString(daysAgo) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + daysAgo)
  return d.toISOString().split('T')[0]
}

async function getSiteRow(siteId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('seo_sites')
    .select('id, site_url, google_email, plan_tier')
    .eq('id', siteId)
    .single()
  if (error) throw error
  return data
}

export async function listKeywords(siteId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('seo_site_keywords')
    .select('*')
    .eq('site_id', siteId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function countKeywords(siteId) {
  const supabase = getSupabase()
  const { count, error } = await supabase
    .from('seo_site_keywords')
    .select('id', { count: 'exact', head: true })
    .eq('site_id', siteId)
  if (error) throw error
  return count || 0
}

export async function addKeyword(siteId, { keyword, target_position = null }) {
  const trimmed = (keyword || '').trim()
  if (!trimmed) {
    const err = new Error('Keyword is required')
    err.code = 'invalid'
    throw err
  }

  const site = await getSiteRow(siteId)
  const cap = getKeywordCap(site.plan_tier)
  const current = await countKeywords(siteId)

  if (current >= cap) {
    const err = new Error(`Keyword cap reached for ${site.plan_tier} plan`)
    err.code = 'cap_reached'
    err.limit = cap
    err.tier = site.plan_tier
    throw err
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('seo_site_keywords')
    .insert({
      site_id: siteId,
      keyword: trimmed,
      target_position,
      sort_order: current,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      const dup = new Error('Keyword already tracked for this site')
      dup.code = 'duplicate'
      throw dup
    }
    throw error
  }

  return data
}

export async function updateKeyword(keywordId, updates) {
  const supabase = getSupabase()
  const allowed = {}
  if (updates.keyword !== undefined) allowed.keyword = String(updates.keyword).trim()
  if (updates.target_position !== undefined) allowed.target_position = updates.target_position
  if (updates.sort_order !== undefined) allowed.sort_order = updates.sort_order
  allowed.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('seo_site_keywords')
    .update(allowed)
    .eq('id', keywordId)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      const dup = new Error('Keyword already tracked for this site')
      dup.code = 'duplicate'
      throw dup
    }
    throw error
  }
  return data
}

export async function deleteKeyword(keywordId) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('seo_site_keywords')
    .delete()
    .eq('id', keywordId)
  if (error) throw error
  return { success: true }
}

// Convert a list of GSC query rows into a Map keyed by lowercased query.
// Tolerates both raw GSC rows ({keys, position}) and the aggregated rows from
// getDetailedAnalytics ({query, avgPosition}).
export function toQueryMap(rows) {
  const map = new Map()
  for (const row of rows || []) {
    const key = (row.keys?.[0] || row.query || '').toLowerCase()
    if (!key) continue
    map.set(key, {
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ?? row.avgCtr ?? 0,
      position: row.position ?? row.avgPosition ?? null,
    })
  }
  return map
}

// Pure: join tracked keywords against current/previous query maps. Position is
// "lower is better" — delta is previous - current so positive = moved up.
export function buildKeywordPerformance(keywords, currentMap, previousMap) {
  return keywords.map((kw) => {
    const key = kw.keyword.toLowerCase()
    const cur = currentMap.get(key) || null
    const prev = previousMap.get(key) || null
    const currentPosition = cur?.position ?? null
    const previousPosition = prev?.position ?? null
    const positionDelta =
      currentPosition !== null && previousPosition !== null
        ? +(previousPosition - currentPosition).toFixed(1)
        : null
    return {
      ...kw,
      current: cur,
      previous: prev,
      positionDelta,
    }
  })
}

async function getQueryStats(email, siteUrl, startDate, endDate) {
  const data = await getSearchAnalytics(email, siteUrl, {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: 5000,
  })
  return toQueryMap(data.rows)
}

// Returns keywords joined with current and previous 28-day GSC stats.
// Window: current = days [-28, -1], previous = days [-56, -29] (yesterday is the
// most recent fully-populated GSC day).
export async function listKeywordsWithStats(siteId) {
  const [keywords, site] = await Promise.all([
    listKeywords(siteId),
    getSiteRow(siteId),
  ])

  if (keywords.length === 0) return { keywords: [], gscError: null }

  const currentEnd = dateString(-1)
  const currentStart = dateString(-28)
  const previousEnd = dateString(-29)
  const previousStart = dateString(-56)

  let currentStats = new Map()
  let previousStats = new Map()
  let gscError = null

  try {
    [currentStats, previousStats] = await Promise.all([
      getQueryStats(site.google_email, site.site_url, currentStart, currentEnd),
      getQueryStats(site.google_email, site.site_url, previousStart, previousEnd),
    ])
  } catch (err) {
    gscError = err.message || 'Failed to fetch Search Console data'
  }

  return {
    keywords: buildKeywordPerformance(keywords, currentStats, previousStats),
    gscError,
  }
}
