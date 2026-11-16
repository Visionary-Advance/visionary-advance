// GET /api/admin/me — server-side admin check for the /admin UI.
// The browser sends its Supabase access token; requireAdmin verifies it with
// Supabase and checks the email against ADMIN_EMAILS (fails closed when unset).

import { requireAdmin } from '@/lib/admin-api-auth'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function GET(request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status, headers: noStore })
  }
  return Response.json({ email: auth.user.email }, { headers: noStore })
}
