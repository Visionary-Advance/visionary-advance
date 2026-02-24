// app/api/finance/expenses/upload/route.js
// POST — receipt upload via FormData → Supabase Storage

import { NextResponse } from 'next/server'
import { supabaseCRM as supabase } from '@/lib/supabase-crm'

// POST /api/finance/expenses/upload
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const expenseId = formData.get('expenseId')

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (!expenseId) {
      return NextResponse.json({ error: 'expenseId is required' }, { status: 400 })
    }

    // Convert to buffer for Supabase upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExt = file.name.split('.').pop()
    const fileName = `${expenseId}-${Date.now()}.${fileExt}`
    const filePath = `receipts/${fileName}`

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath)

    // Update expense with receipt URL
    const { error: updateError } = await supabase
      .from('finance_expenses')
      .update({ receipt_url: urlData.publicUrl })
      .eq('id', expenseId)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch (error) {
    console.error('Error uploading receipt:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
