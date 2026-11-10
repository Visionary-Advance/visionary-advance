// app/api/seo/ship-callback/route.js
// Status reports from the seo-ship-task GitHub Action (running / pr_open / failed).
// Authenticated with a shared secret (SEO_SHIP_CALLBACK_SECRET), compared in constant time.
// Fails closed when the secret is unset.

import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { applyShipCallback, ShipError } from '@/lib/seo-ship';

function authorized(request) {
  const secret = process.env.SEO_SHIP_CALLBACK_SECRET;
  if (!secret) return false;

  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request) {
  if (!authorized(request)) {
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
