import { NextResponse } from 'next/server'
import { waas } from '@/lib/instant-site'

// "Didn't get the code?" WaaS rate-limits this to once a minute per build.
export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const token = String(body.token || '')
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: 'Bad token' }, { status: 400 })
  }
  const result = await waas('/resend', { method: 'POST', body: { token } })
  return NextResponse.json(result.data, { status: result.ok ? 200 : result.status })
}
