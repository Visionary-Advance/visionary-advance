import { NextResponse } from 'next/server'
import {
  addKeyword,
  countKeywords,
  listKeywordsWithStats,
} from '@/lib/seo-keywords'
import { getKeywordCap } from '@/lib/seo-tiers'

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

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = getSupabase()

    const { data: site, error: siteErr } = await supabase
      .from('seo_sites')
      .select('plan_tier')
      .eq('id', id)
      .single()
    if (siteErr || !site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    const { keywords, gscError } = await listKeywordsWithStats(id)
    return NextResponse.json({
      keywords,
      tier: site.plan_tier,
      limit: getKeywordCap(site.plan_tier),
      used: keywords.length,
      gscError,
    })
  } catch (error) {
    console.error('Error listing keywords:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const keyword = await addKeyword(id, {
      keyword: body.keyword,
      target_position: body.target_position ?? null,
    })

    const used = await countKeywords(id)
    return NextResponse.json({ keyword, used })
  } catch (error) {
    if (error.code === 'cap_reached') {
      return NextResponse.json(
        { error: error.message, code: 'cap_reached', limit: error.limit, tier: error.tier },
        { status: 403 }
      )
    }
    if (error.code === 'duplicate') {
      return NextResponse.json(
        { error: error.message, code: 'duplicate' },
        { status: 409 }
      )
    }
    if (error.code === 'invalid') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Error adding keyword:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
