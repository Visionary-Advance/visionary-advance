// app/api/devops/approvals/[taskId]/request-changes/route.js
// POST { note }: comment the note on the PR, close it, and keep the note so the next
// Ship of this task passes it to Claude.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { requestChanges } from '@/lib/devops-approvals'

export async function POST(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { taskId } = await params
    const { note } = await request.json().catch(() => ({}))
    return NextResponse.json(await requestChanges(taskId, { note, user: auth.user }))
  } catch (error) {
    console.error('Approval request-changes error:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
