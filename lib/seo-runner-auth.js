// lib/seo-runner-auth.js
// Shared-secret auth for calls from the SEO GitHub Actions (seo-ship-task, seo-plan-run).
// Both use SEO_SHIP_CALLBACK_SECRET (same value in Vercel and the org Actions secrets),
// compared in constant time. Fails closed when the secret is unset.

import { timingSafeEqual } from 'node:crypto';

export function verifyRunnerSecret(request) {
  const secret = process.env.SEO_SHIP_CALLBACK_SECRET;
  if (!secret) return false;

  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
