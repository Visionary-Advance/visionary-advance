// app/api/seo/ship-callback/route.js
// Status reports from the seo-ship-task GitHub Action (running / pr_open / failed).
// Authenticated with a shared secret (SEO_SHIP_CALLBACK_SECRET), compared in constant time.
// Fails closed when the secret is unset.

import { NextResponse } from 'next/server';
import { verifyRunnerSecret } from '@/lib/seo-runner-auth';
import { applyShipCallback, ShipError } from '@/lib/seo-ship';

export async function POST(request) {
  if (!verifyRunnerSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const task = await applyShipCallback(payload);
    return NextResponse.json({ ok: true, task_id: task.id });
  } catch (error) {
    console.error('SEO ship callback error:', error);
    const status = error instanceof ShipError ? error.status : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
