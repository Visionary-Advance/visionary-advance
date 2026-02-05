// app/api/crm/projects/[id]/tasks/[taskId]/route.js
import { NextResponse } from 'next/server'
import { updateTask, deleteTask } from '@/lib/project-tasks'

export async function PATCH(request, { params }) {
  try {
    const { taskId } = await params
    const body = await request.json()

    const task = await updateTask(taskId, body)
    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { taskId } = await params

    await deleteTask(taskId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete task' },
      { status: 500 }
    )
  }
}
