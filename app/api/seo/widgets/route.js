// app/api/seo/widgets/route.js
// Manage SEO dashboard widgets

import { NextResponse } from 'next/server';
import {
  getDashboardWidgets,
  addDashboardWidget,
  removeDashboardWidget,
  updateWidgetPositions
} from '@/lib/search-console';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400 }
      );
    }

    const widgets = await getDashboardWidgets(email);

    return NextResponse.json({ widgets });
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userEmail, widgetType, siteId, config } = await request.json();

    if (!userEmail || !widgetType) {
      return NextResponse.json(
        { error: 'userEmail and widgetType are required' },
        { status: 400 }
      );
    }

    const widget = await addDashboardWidget(userEmail, widgetType, siteId, config);

    return NextResponse.json({ widget });
  } catch (error) {
    console.error('Error adding widget:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const widgetId = searchParams.get('id');
    const email = searchParams.get('email');

    if (!widgetId || !email) {
      return NextResponse.json(
        { error: 'Widget ID and email are required' },
        { status: 400 }
      );
    }

    await removeDashboardWidget(widgetId, email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing widget:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { userEmail, widgetOrder } = await request.json();

    if (!userEmail || !widgetOrder) {
      return NextResponse.json(
        { error: 'userEmail and widgetOrder are required' },
        { status: 400 }
      );
    }

    await updateWidgetPositions(userEmail, widgetOrder);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating widget positions:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
