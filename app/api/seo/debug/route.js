// app/api/seo/debug/route.js
// Debug endpoint for Search Console API

import { NextResponse } from 'next/server';
import { getValidGoogleToken, getGoogleConnectionStatus } from '@/lib/google-auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const results = {
      email,
      steps: []
    };

    // Step 1: Check connection status
    const status = await getGoogleConnectionStatus(email);
    results.connectionStatus = status;
    results.steps.push({
      step: 'Check connection',
      success: status.connected,
      details: status
    });

    if (!status.connected) {
      return NextResponse.json(results);
    }

    // Step 2: Get valid token
    let token;
    try {
      token = await getValidGoogleToken(email);
      results.steps.push({
        step: 'Get valid token',
        success: true,
        tokenPreview: token ? `${token.substring(0, 20)}...` : null
      });
    } catch (err) {
      results.steps.push({
        step: 'Get valid token',
        success: false,
        error: err.message
      });
      return NextResponse.json(results);
    }

    // Step 3: Call Search Console API directly
    try {
      const response = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { rawResponse: responseText };
      }

      results.steps.push({
        step: 'Call Search Console API',
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (data.siteEntry) {
        results.sites = data.siteEntry;
        results.siteCount = data.siteEntry.length;
      }
    } catch (err) {
      results.steps.push({
        step: 'Call Search Console API',
        success: false,
        error: err.message
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
