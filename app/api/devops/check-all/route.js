// app/api/devops/check-all/route.js
// "Run all checks" from the DevOps dashboard. Admin-only; the cron route stays
// cron-only so its secret never has to reach the browser.

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-auth'
import { checkAllSites } from '@/lib/devops'

export async function POST(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const results = await checkAllSites()
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('DevOps check-all error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
