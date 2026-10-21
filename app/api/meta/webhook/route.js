// app/api/meta/webhook/route.js
// Meta (Facebook Page + Instagram) webhook for comment-to-DM automations.
// In the Meta App Dashboard → Webhooks, set this URL as the callback for the
// Page object (field: feed) and the Instagram object (field: comments), with
// META_WEBHOOK_VERIFY_TOKEN as the verify token.

import { NextResponse } from 'next/server';
import { verifyMetaSignature, handleMetaWebhook } from '@/lib/comment-automations';

// Verification handshake Meta runs when the callback URL is saved
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expected = process.env.META_WEBHOOK_VERIFY_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: 'META_WEBHOOK_VERIFY_TOKEN is not configured' }, { status: 500 });
  }

  if (mode === 'subscribe' && token === expected && challenge) {
    return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(request) {
  // Signature is over the raw bytes — read as text, never request.json().
  const body = await request.text();
  const { valid, reason } = verifyMetaSignature(body, request.headers.get('x-hub-signature-256'));

  if (!valid) {
    console.error('Meta webhook rejected:', reason);
    const status = reason?.includes('not configured') ? 500 : 401;
    return NextResponse.json({ error: reason }, { status });
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const result = await handleMetaWebhook(payload);
    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    console.error('Meta webhook handler failed:', error);
    // 500 so Meta retries; comments already claimed in social_comment_events
    // are skipped on the retry, so nobody gets a second DM.
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
