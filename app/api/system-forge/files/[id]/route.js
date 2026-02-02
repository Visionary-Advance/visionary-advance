// app/api/system-forge/files/[id]/route.js
import { NextResponse } from 'next/server'
import { getFile, updateFile, deleteFile } from '@/lib/systemforge'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const file = await getFile(id)

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(file)
  } catch (error) {
    console.error('Failed to get file:', error)
    return NextResponse.json(
      { error: 'Failed to get file' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()

    // Check if file exists
    const existing = await getFile(id)
    if (!existing) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    const file = await updateFile(id, {
      file_path: data.file_path?.trim(),
      content: data.content,
      language: data.language,
      description: data.description?.trim(),
    })

    return NextResponse.json(file)
  } catch (error) {
    console.error('Failed to update file:', error)
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Check if file exists
    const existing = await getFile(id)
    if (!existing) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    await deleteFile(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
