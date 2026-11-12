// app/api/seo/plan-runs/route.js
// Background Claude plan generation. Admin-only.
//   GET  ?siteId=<id>          → { runs: { [siteId]: latestRun }, typicalMs } (omit siteId for every site)
//   POST { siteIds: [...] }    → start runs for those sites
//   POST { all: true }         → start runs for every site (2 run at a time on GitHub)

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api-auth';
import { getLatestRuns, getTypicalWritingMs, startPlanRuns, PlanRunError } from '@/lib/seo-plan-runs';

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const siteId = new URL(request.url).searchParams.get('siteId');
    const [runs, typicalMs] = await Promise.all([
      getLatestRuns(siteId ? [siteId] : null),
      getTypicalWritingMs().catch(() => null),
    ]);
    return NextResponse.json({ runs, typicalMs });
  } catch (error) {
    console.error('Error loading plan runs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json().catch(() => ({}));
    const target = body.all === true ? 'all' : body.siteIds;
    const result = await startPlanRuns(target, { requestedBy: auth.user?.email });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error starting plan runs:', error);
    const status = error instanceof PlanRunError ? error.status : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
