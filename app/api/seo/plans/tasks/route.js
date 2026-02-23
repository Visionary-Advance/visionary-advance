// app/api/seo/plans/tasks/route.js
// Update SEO plan task status and notes

import { NextResponse } from 'next/server';
import { updateTask } from '@/lib/seo-plans';

export async function PATCH(request) {
  try {
    const { taskId, status, notes } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const task = await updateTask(taskId, updates);
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
