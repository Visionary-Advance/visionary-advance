// app/api/seo/ga4/properties/route.js
// List the GA4 properties the signed-in admin's Google connection can read (for the site picker)

import { NextResponse } from 'next/server';
import { listGa4Properties } from '@/lib/ga4';
import { requireAdmin } from '@/lib/admin-api-auth';

export async function GET(request) {
  // The Google connection is keyed by admin email, so take it from the
  // verified session rather than the query string.
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const properties = await listGa4Properties(auth.user.email);

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error listing GA4 properties:', error);
    const missingScope = /Analytics access/.test(error.message);
    return NextResponse.json(
      { error: missingScope ? error.message : 'Failed to load GA4 properties' },
      { status: missingScope ? 403 : 500 }
    );
  }
}
