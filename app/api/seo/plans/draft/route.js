// app/api/seo/plans/draft/route.js
// Approve or discard a draft SEO plan (drafts come from the Claude seo-monthly-run skill).
// Admin-only: approving replaces the site's live plan.

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api-auth';
import { approveDraftPlan, discardDraftPlan } from '@/lib/seo-plans';

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { planId, action } = await request.json();

    if (!planId || !['approve', 'discard'].includes(action)) {
      return NextResponse.json(
        { error: 'planId and action ("approve" or "discard") are required' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      const plan = await approveDraftPlan(planId);
      return NextResponse.json({ plan });
    }

    await discardDraftPlan(planId);
    return NextResponse.json({ discarded: planId });
  } catch (error) {
    console.error('Error updating draft plan:', error);
    const status = /not found|only draft/i.test(error.message) ? 400 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
