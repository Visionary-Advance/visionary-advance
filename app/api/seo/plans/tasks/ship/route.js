// app/api/seo/plans/tasks/ship/route.js
// Ship one SEO task: start the GitHub Action that opens a PR. Admin-only.

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api-auth';
import { dispatchShipTask, ShipError } from '@/lib/seo-ship';

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { taskId } = await request.json();
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const task = await dispatchShipTask(taskId);
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error shipping SEO task:', error);
    const status = error instanceof ShipError ? error.status : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
