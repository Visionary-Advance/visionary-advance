// app/api/system-forge/modules/[id]/route.js
import { NextResponse } from 'next/server'
import { getModule, updateModule, deleteModule } from '@/lib/systemforge'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const module = await getModule(id)

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(module)
  } catch (error) {
    console.error('Failed to get module:', error)
    return NextResponse.json(
      { error: 'Failed to get module' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()

    // Check if module exists
    const existing = await getModule(id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Validate type if provided
    if (data.type && !['module', 'component', 'snippet'].includes(data.type)) {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      )
    }

    const module = await updateModule(id, {
      name: data.name?.trim() || existing.name,
      description: data.description !== undefined ? data.description?.trim() : existing.description,
      type: data.type || existing.type,
      category: data.category !== undefined ? data.category?.trim() : existing.category,
      industry_tags: data.industry_tags !== undefined ? data.industry_tags : existing.industry_tags,
      dependencies: data.dependencies !== undefined ? data.dependencies : existing.dependencies,
      env_vars: data.env_vars !== undefined ? data.env_vars : existing.env_vars,
      config_schema: data.config_schema !== undefined ? data.config_schema : existing.config_schema,
      is_preset: data.is_preset !== undefined ? data.is_preset : existing.is_preset,
    })

    return NextResponse.json(module)
  } catch (error) {
    console.error('Failed to update module:', error)
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Check if module exists
    const existing = await getModule(id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    await deleteModule(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}
