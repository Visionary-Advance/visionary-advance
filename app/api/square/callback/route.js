// app/api/square/callback/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('Square callback received:', { code: !!code, state, error });

  if (error) {
    console.error('Square OAuth error:', error);
    return NextResponse.redirect(new URL(`/square/error?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(new URL('/square/error?error=no_code', request.url));
  }

  // Optional: Verify state parameter for security
  // const expectedState = 'your_unique_state_value_123';
  // if (state !== expectedState) {
  //   console.error('Invalid state parameter');
  //   return NextResponse.redirect(new URL('/square/error?error=invalid_state', request.url));
  // }

  try {
    console.log('Exchanging authorization code for tokens...');
    
    // Determine the correct base URL based on environment
    const baseUrl = process.env.SQUARE_ENVIRONMENT === 'sandbox' 
      ? 'https://connect.squareupsandbox.com' 
      : 'https://connect.squareup.com';
    
    // Get the redirect URI from the current request
    const redirectUri = `${new URL(request.url).protocol}//${new URL(request.url).host}/api/square/callback`;
    
    console.log('Using redirect_uri:', redirectUri);
    
    // Exchange authorization code for access token
    const tokenResponse = await fetch(`${baseUrl}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.SQUARE_APPLICATION_ID,
        client_secret: process.env.SQUARE_APPLICATION_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json();

    console.log('Token response status:', tokenResponse.status);
    console.log('Token response data:', tokenData);

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      const errorMsg = tokenData.error_description || tokenData.error || 'unknown_error';
      return NextResponse.redirect(new URL(`/square/error?error=token_exchange_failed&details=${encodeURIComponent(errorMsg)}`, request.url));
    }

    console.log('Token exchange successful!');
    console.log('Merchant ID:', tokenData.merchant_id);
    console.log('Access token received:', !!tokenData.access_token);
    console.log('Refresh token received:', !!tokenData.refresh_token);

    // Fetch ALL locations for this merchant
    let locations = [];
    let primaryLocationId = null;
    try {
      console.log('Fetching merchant locations...');
      const locationsResponse = await fetch(`${baseUrl}/v2/locations`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Square-Version': '2023-10-18',
          'Accept': 'application/json'
        }
      });

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        if (locationsData.locations && locationsData.locations.length > 0) {
          locations = locationsData.locations;
          // Get the first location as primary
          primaryLocationId = locations[0].id;
          console.log(`Found ${locations.length} locations, primary: ${primaryLocationId}`);
        }
      }
    } catch (locationError) {
      console.error('Failed to fetch locations:', locationError);
      // Continue anyway - locations can be added later
    }

    // Store auth data in Supabase
    const { storeSquareAuth, storeSquareLocations } = await import('@/lib/square-auth');
    
    // Calculate expiration (30 days from now)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Generate a unique client ID (you may want to customize this)
    const clientId = `client_${tokenData.merchant_id}`;
    
    // Store authentication
    await storeSquareAuth({
      clientId: clientId,
      restaurantName: tokenData.merchant_id, // You can update this later with actual name
      contactEmail: null, // Can be added later
      merchantId: tokenData.merchant_id,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      scopes: tokenData.scope || '',
      expiresAt: expiresAt.toISOString(),
      locationId: primaryLocationId // Store primary location ID
    });

    // Store all locations
    if (locations.length > 0) {
      await storeSquareLocations(clientId, locations);
    }

    // Redirect to success page with merchant info
    const successUrl = new URL('/square/success', request.url);
    successUrl.searchParams.set('merchant_id', tokenData.merchant_id);
    successUrl.searchParams.set('client_id', clientId);
    successUrl.searchParams.set('location_count', locations.length.toString());
    if (primaryLocationId) {
      successUrl.searchParams.set('location_id', primaryLocationId);
    }
    
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Square callback error:', error);
    return NextResponse.redirect(new URL('/square/error?error=server_error', request.url));
  }
}