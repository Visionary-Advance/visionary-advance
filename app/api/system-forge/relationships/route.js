// app/api/system-forge/relationships/route.js
import { NextResponse } from 'next/server'
import { createRelationship, deleteRelationship, getRelationships, getModule } from '@/lib/systemforge'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')

    if (!moduleId) {
      return NextResponse.json(
        { error: 'moduleId is required' },
        { status: 400 }
      )
    }

    const relationships = await getRelationships(moduleId)
    return NextResponse.json(relationships)
  } catch (error) {
    console.error('Failed to get relationships:', error)
    return NextResponse.json(
      { error: 'Failed to get relationships' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.parent_id || !data.child_id) {
      return NextResponse.json(
        { error: 'parent_id and child_id are required' },
        { status: 400 }
      )
    }

    if (!data.relationship_type || !['contains', 'depends_on'].includes(data.relationship_type)) {
      return NextResponse.json(
        { error: 'Valid relationship_type is required (contains, depends_on)' },
        { status: 400 }
      )
    }

    // Verify both modules exist
    const [parent, child] = await Promise.all([
      getModule(data.parent_id),
      getModule(data.child_id)
    ])

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent module not found' },
        { status: 404 }
      )
    }

    if (!child) {
      return NextResponse.json(
        { error: 'Child module not found' },
        { status: 404 }
      )
    }

    // Prevent self-reference
    if (data.parent_id === data.child_id) {
      return NextResponse.json(
        { error: 'A module cannot reference itself' },
        { status: 400 }
      )
    }

    const relationship = await createRelationship(
      data.parent_id,
      data.child_id,
      data.relationship_type
    )

    return NextResponse.json(relationship, { status: 201 })
  } catch (error) {
    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This relationship already exists' },
        { status: 409 }
      )
    }

    console.error('Failed to create relationship:', error)
    return NextResponse.json(
      { error: 'Failed to create relationship' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    await deleteRelationship(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete relationship:', error)
    return NextResponse.json(
      { error: 'Failed to delete relationship' },
      { status: 500 }
    )
  }
}
