// app/api/finance/clients/route.js
// GET — returns CRM clients (is_client=true) for income form dropdown

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query = supabase
      .from('crm_leads')
      .select('id, full_name, email, company')
      .eq('is_client', true)
      .order('full_name', { ascending: true })
      .limit(50)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ clients: data })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
