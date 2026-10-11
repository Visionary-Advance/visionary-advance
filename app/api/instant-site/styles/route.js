import { NextResponse } from 'next/server'
import { waas } from '@/lib/instant-site'

// The styles (templates) to offer for a business, and the kinds of work to
// offer as chips on its card. WaaS reads the listing's Google categories and
// name to suggest kinds; once the owner picks, `industries` carries the pick.
export async function GET(request) {
  const params = request.nextUrl.searchParams
  const types = (params.get('types') || '')
    .split(',')
    .filter((t) => /^[a-z_]{1,60}$/.test(t))
    .slice(0, 20)
    .join(',')
  const label = (params.get('label') || '').replace(/[^\p{L}\p{N} &'-]/gu, '').slice(0, 80)
  const name = (params.get('name') || '').replace(/[^\p{L}\p{N} &'.,-]/gu, '').slice(0, 120)

  const query = { types, label, name }
  if (params.has('industries')) {
    query.industries = (params.get('industries') || '')
      .split(',')
      .filter((i) => /^[a-z_]{1,30}$/.test(i))
      .slice(0, 12)
      .join(',')
  }

  const qs = new URLSearchParams(query).toString()
  const result = await waas(`/templates?${qs}`)
  if (!result.ok) {
    return NextResponse.json({ error: "We couldn't load the styles. Try again." }, { status: result.status })
  }
  // Same answer for every visitor with the same listing, so let the CDN serve
  // repeats: a flood of identical calls never reaches WaaS.
  return NextResponse.json(result.data, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
