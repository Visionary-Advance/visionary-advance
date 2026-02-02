// app/api/system-forge/modules/route.js
import { NextResponse } from 'next/server'
import { getModules, createModule, getModuleStats, getCategories } from '@/lib/systemforge'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeStats = searchParams.get('stats') === 'true'

    const { modules } = await getModules({ type, category, search, limit, offset })
    const categories = await getCategories()

    const response = { modules, categories }

    if (includeStats) {
      response.stats = await getModuleStats()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to get modules:', error)
    return NextResponse.json(
      { error: 'Failed to get modules' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    if (!data.type || !['module', 'component', 'snippet'].includes(data.type)) {
      return NextResponse.json(
        { error: 'Valid type is required (module, component, snippet)' },
        { status: 400 }
      )
    }

    const module = await createModule({
      name: data.name.trim(),
      description: data.description?.trim() || null,
      type: data.type,
      category: data.category?.trim() || null,
      industry_tags: data.industry_tags || [],
      dependencies: data.dependencies || {},
      env_vars: data.env_vars || [],
      config_schema: data.config_schema || {},
      is_preset: data.is_preset || false,
    })

    return NextResponse.json(module, { status: 201 })
  } catch (error) {
    console.error('Failed to create module:', error)
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    )
  }
}
