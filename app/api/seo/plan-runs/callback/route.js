// app/api/seo/plan-runs/callback/route.js
// Status reports from the seo-plan-run GitHub Action (running / completed / failed).
// A completed report carries plan.json, which is saved as the site's draft plan.
// Authenticated with the runner shared secret.

import { NextResponse } from 'next/server';
import { verifyRunnerSecret } from '@/lib/seo-runner-auth';
import { applyPlanRunCallback, PlanRunError } from '@/lib/seo-plan-runs';

export async function POST(request) {
  if (!verifyRunnerSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const run = await applyPlanRunCallback(payload);
    return NextResponse.json({ ok: true, run_id: run.id, status: run.status, plan_id: run.plan_id || null });
  } catch (error) {
    console.error('SEO plan run callback error:', error);
    const status = error instanceof PlanRunError ? error.status : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
