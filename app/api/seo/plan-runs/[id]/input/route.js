// app/api/seo/plan-runs/[id]/input/route.js
// The data packet for one plan run, fetched by the seo-plan-run GitHub Action.
// Built on request (live Search Console + GA4 via the app's Google connection).
// Authenticated with the runner shared secret.

import { NextResponse } from 'next/server';
import { verifyRunnerSecret } from '@/lib/seo-runner-auth';
import { getRun, PlanRunError } from '@/lib/seo-plan-runs';
import { buildPlanInput } from '@/lib/seo-plan-input';

export const maxDuration = 300;

export async function GET(request, { params }) {
  if (!verifyRunnerSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const run = await getRun(id);
    if (!['queued', 'running'].includes(run.status)) {
      return NextResponse.json({ error: `Run is ${run.status}` }, { status: 409 });
    }
    const input = await buildPlanInput(run.site_id);
    return NextResponse.json({ run_id: run.id, ...input });
  } catch (error) {
    console.error('Error building plan input:', error);
    const status = error instanceof PlanRunError ? error.status : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
