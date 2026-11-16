// app/api/devops/approvals/route.js
// GET: SEO Ship PRs waiting for review, with live GitHub state. ?count=1 returns just
// the number waiting (database only), for the nav badge.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { countPendingApprovals, listApprovals } from '@/lib/devops-approvals'

export async function GET(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    if (new URL(request.url).searchParams.get('count')) {
      return NextResponse.json({ count: await countPendingApprovals() })
    }
    return NextResponse.json(await listApprovals())
  } catch (error) {
    console.error('Approvals list error:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
