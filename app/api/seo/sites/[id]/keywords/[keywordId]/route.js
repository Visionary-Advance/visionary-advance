import { NextResponse } from 'next/server'
import { deleteKeyword, updateKeyword } from '@/lib/seo-keywords'

export async function PATCH(request, { params }) {
  try {
    const { keywordId } = await params
    const body = await request.json()
    const keyword = await updateKeyword(keywordId, body)
    return NextResponse.json({ keyword })
  } catch (error) {
    if (error.code === 'duplicate') {
      return NextResponse.json(
        { error: error.message, code: 'duplicate' },
        { status: 409 }
      )
    }
    console.error('Error updating keyword:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { keywordId } = await params
    await deleteKeyword(keywordId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting keyword:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
