// app/api/devops/approvals/[taskId]/merge/route.js
// POST { sha }: approve and squash-merge the PR, pinned to the commit that was reviewed.
// Merging deploys the client's site to production.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { approveAndMerge } from '@/lib/devops-approvals'

export async function POST(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { taskId } = await params
    const { sha } = await request.json().catch(() => ({}))
    return NextResponse.json(await approveAndMerge(taskId, { sha, user: auth.user }))
  } catch (error) {
    console.error('Approval merge error:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
