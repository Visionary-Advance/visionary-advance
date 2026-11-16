// app/api/devops/approvals/[taskId]/route.js
// GET: one approval — the task, the live PR, checks, preview and the diff.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { getApproval } from '@/lib/devops-approvals'

export async function GET(request, { params }) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { taskId } = await params
    return NextResponse.json(await getApproval(taskId))
  } catch (error) {
    console.error('Approval detail error:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
