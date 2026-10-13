import { NextResponse } from 'next/server'
import { alertInstantSiteFailed, alertInstantSiteReady, waas } from '@/lib/instant-site'

// Build progress for the countdown. The token is 32 random bytes from WaaS;
// it's the only thing that identifies a build, so it isn't guessable.
export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: 'Bad token' }, { status: 400 })
  }

  const result = await waas(`/status?token=${token}`)
  if (!result.ok) return NextResponse.json(result.data, { status: result.status })

  // WaaS says when to send these: once per build, however often this
  // endpoint is polled (it claims each alert, migration 035 there).
  if (result.data.alert === 'ready') {
    await alertInstantSiteReady({ businessName: result.data.businessName })
  } else if (result.data.alert === 'failed') {
    await alertInstantSiteFailed({ businessName: result.data.businessName })
  }

  return NextResponse.json(result.data)
}
