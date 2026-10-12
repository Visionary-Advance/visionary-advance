import { NextResponse } from 'next/server'
import { notifyInstantSite, waas } from '@/lib/instant-site'

// Build progress for the countdown. The token is 32 random bytes from WaaS;
// it's the only thing that identifies a build, so it isn't guessable.
export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: 'Bad token' }, { status: 400 })
  }

  const result = await waas(`/status?token=${token}`)
  if (!result.ok) return NextResponse.json(result.data, { status: result.status })

  // The page stops polling once it sees a failure, so this fires about once
  // per failed build.
  if (result.data.stage === 'failed') {
    await notifyInstantSite(
      '⚠️ Instant site build failed for **{business}**. They\'re in the CRM (source: instant_site) — build it by hand from the pipeline.',
      { business: result.data.businessName },
    )
  }

  return NextResponse.json(result.data)
}
