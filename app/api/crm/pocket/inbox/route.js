// app/api/crm/pocket/inbox/route.js
// GET  - list Pocket recordings (defaults to the unmatched inbox)
// POST - re-check tags on unmatched recordings
//
// Both return call transcripts and summaries, so both require an admin session.

import { NextResponse } from 'next/server'
import { getPocketRecordings, resyncUnmatchedRecordings } from '@/lib/pocket'
import { requireAdmin } from '@/lib/admin-api-auth'

export async function GET(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') ?? 'unmatched'
    const { recordings, total } = await getPocketRecordings({
      status: status === 'all' ? null : status,
      lead_id: searchParams.get('lead_id'),
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    })

    return NextResponse.json({ recordings, total })
  } catch (error) {
    console.error('Failed to list Pocket recordings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to list recordings' },
      { status: 500 }
    )
  }
}

// POST /api/crm/pocket/inbox - re-check Pocket tags now (same sweep as the cron)
export async function POST(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const results = await resyncUnmatchedRecordings()
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Pocket resync failed:', error)
    return NextResponse.json(
      { error: error.message || 'Resync failed' },
      { status: 500 }
    )
  }
}
