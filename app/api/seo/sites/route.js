// app/api/seo/sites/route.js
// Manage SEO sites

import { NextResponse } from 'next/server';
import { getSites, addSite, removeSite, listSearchConsoleSites } from '@/lib/search-console';
import { getGoogleConnectionStatus } from '@/lib/google-auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const includeAvailable = searchParams.get('includeAvailable') === 'true';

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400 }
      );
    }

    // Check if Google is connected
    const status = await getGoogleConnectionStatus(email);
    if (!status.connected) {
      return NextResponse.json(
        { error: 'Google account not connected' },
        { status: 401 }
      );
    }

    // Get tracked sites
    const trackedSites = await getSites(email);

    let response = { sites: trackedSites };

    // Optionally include available sites from Search Console
    if (includeAvailable) {
      try {
        console.log('Fetching available sites from Search Console for:', email);
        const availableSites = await listSearchConsoleSites(email);
        console.log('Search Console returned sites:', JSON.stringify(availableSites, null, 2));
        const trackedUrls = new Set(trackedSites.map(s => s.site_url));
        response.availableSites = availableSites.filter(s => !trackedUrls.has(s.siteUrl));
        console.log('Available sites after filtering:', response.availableSites.length);
      } catch (err) {
        console.error('Error fetching available sites:', err);
        response.availableSites = [];
        response.availableSitesError = err.message;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching SEO sites:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { siteUrl, googleEmail, displayName } = await request.json();

    if (!siteUrl || !googleEmail) {
      return NextResponse.json(
        { error: 'siteUrl and googleEmail are required' },
        { status: 400 }
      );
    }

    const site = await addSite(siteUrl, googleEmail, displayName);

    return NextResponse.json({ site });
  } catch (error) {
    console.error('Error adding SEO site:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('id');

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    await removeSite(siteId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing SEO site:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
