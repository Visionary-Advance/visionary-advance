// app/api/seo/plans/route.js
// List a site's SEO plans. New plans come from Claude via POST /api/seo/plan-runs
// (background GitHub Action) and arrive as drafts; Gemini plan generation is retired.

import { NextResponse } from 'next/server';
import { getPlans, getActivePlan } from '@/lib/seo-plans';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    if (activeOnly) {
      const plan = await getActivePlan(siteId);
      return NextResponse.json({ plan });
    }

    const plans = await getPlans(siteId);
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
