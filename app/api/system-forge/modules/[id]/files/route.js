// app/api/system-forge/modules/[id]/files/route.js
import { NextResponse } from 'next/server'
import { getModule, getModuleFiles, createFile, createFiles } from '@/lib/systemforge'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Check if module exists
    const module = await getModule(id)
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    const files = await getModuleFiles(id)
    return NextResponse.json(files)
  } catch (error) {
    console.error('Failed to get files:', error)
    return NextResponse.json(
      { error: 'Failed to get files' },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()

    // Check if module exists
    const module = await getModule(id)
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Handle bulk create
    if (Array.isArray(data)) {
      const files = await createFiles(id, data.map(f => ({
        file_path: f.file_path,
        content: f.content || '',
        language: f.language,
        description: f.description,
      })))
      return NextResponse.json(files, { status: 201 })
    }

    // Single file create
    if (!data.file_path?.trim()) {
      return NextResponse.json(
        { error: 'file_path is required' },
        { status: 400 }
      )
    }

    const file = await createFile({
      module_id: id,
      file_path: data.file_path.trim(),
      content: data.content || '',
      language: data.language,
      description: data.description?.trim(),
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    console.error('Failed to create file:', error)
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    )
  }
}
