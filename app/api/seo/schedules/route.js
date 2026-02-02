// app/api/seo/schedules/route.js
// Manage SEO report schedules

import { NextResponse } from 'next/server';
import {
  getReportSchedule,
  upsertReportSchedule,
  deleteReportSchedule
} from '@/lib/seo-reports';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    const schedule = await getReportSchedule(siteId);
    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { siteId, frequency, dayOfWeek, dayOfMonth, timeUtc, recipients } = await request.json();

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'recipients array is required' }, { status: 400 });
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ error: 'frequency must be daily, weekly, or monthly' }, { status: 400 });
    }

    const schedule = await upsertReportSchedule(siteId, {
      frequency,
      dayOfWeek,
      dayOfMonth,
      timeUtc: timeUtc || '09:00',
      recipients,
      isActive: true
    });

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Error saving schedule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json({ error: 'Schedule ID is required' }, { status: 400 });
    }

    await deleteReportSchedule(scheduleId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
