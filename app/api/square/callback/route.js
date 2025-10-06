// app/api/square/callback/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('========================================');
  console.log('🔵 SQUARE CALLBACK STARTED');
  console.log('Code received:', !!code);
  console.log('State:', state);
  console.log('Error:', error);
  console.log('========================================');

  if (error) {
    console.error('❌ OAuth error:', error);
    return NextResponse.redirect(new URL(`/square/error?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    console.error('❌ No authorization code received');
    return NextResponse.redirect(new URL('/square/error?error=no_code', request.url));
  }

  try {
    const baseUrl = process.env.SQUARE_ENVIRONMENT === 'production'
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';
    
    const redirectUri = `${new URL(request.url).protocol}//${new URL(request.url).host}/api/square/callback`;
    
    console.log('📡 Exchanging code for tokens...');
    console.log('Environment:', process.env.SQUARE_ENVIRONMENT || 'NOT SET');
    console.log('Base URL:', baseUrl);
    console.log('Redirect URI:', redirectUri);
    console.log('Has Application ID?', !!process.env.SQUARE_APPLICATION_ID);
    console.log('Has Application Secret?', !!process.env.SQUARE_APPLICATION_SECRET);
    
    // Validate env vars before calling Square
    if (!process.env.SQUARE_APPLICATION_ID) {
      console.error('❌ SQUARE_APPLICATION_ID is not set!');
      return NextResponse.redirect(
        new URL('/square/error?error=config_error&details=Missing%20SQUARE_APPLICATION_ID', request.url)
      );
    }
    
    if (!process.env.SQUARE_APPLICATION_SECRET) {
      console.error('❌ SQUARE_APPLICATION_SECRET is not set!');
      return NextResponse.redirect(
        new URL('/square/error?error=config_error&details=Missing%20SQUARE_APPLICATION_SECRET', request.url)
      );
    }
    
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

    if (!tokenResponse.ok) {
      console.error('❌ Token exchange failed:', tokenData);
      const errorMsg = tokenData.error_description || tokenData.error || 'unknown_error';
      return NextResponse.redirect(
        new URL(`/square/error?error=token_exchange_failed&details=${encodeURIComponent(errorMsg)}`, request.url)
      );
    }

    console.log('✅ Token exchange successful!');
    console.log('Merchant ID:', tokenData.merchant_id);

    // Fetch locations
    let locations = [];
    let primaryLocationId = null;
    let merchantInfo = {
      businessName: null,
      email: null,
      phone: null,
      country: null,
      address: null
    };
    
    console.log('📍 Fetching locations...');
    try {
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
          primaryLocationId = locations[0].id;
          
          const primaryLocation = locations[0];
          merchantInfo.businessName = primaryLocation.business_name || primaryLocation.name || null;
          merchantInfo.phone = primaryLocation.phone_number || null;
          merchantInfo.country = primaryLocation.country || primaryLocation.address?.country || null;
          
          if (primaryLocation.address) {
            const addr = primaryLocation.address;
            merchantInfo.address = [
              addr.address_line_1,
              addr.address_line_2,
              addr.locality,
              addr.administrative_district_level_1,
              addr.postal_code
            ].filter(Boolean).join(', ');
          }
          
          console.log('✅ Found locations:', locations.length);
          console.log('Business name:', merchantInfo.businessName);
        }
      }
    } catch (locationError) {
      console.error('⚠️ Location fetch error:', locationError.message);
    }

    // Store in database
    console.log('💾 Storing in database...');
    const { storeSquareAuth, storeSquareLocations } = await import('@/lib/square-auth');
    
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const clientId = merchantInfo.businessName 
      ? `client_${merchantInfo.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${tokenData.merchant_id.slice(-8)}`
      : `client_${tokenData.merchant_id}`;
    
    await storeSquareAuth({
      clientId: clientId,
      restaurantName: merchantInfo.businessName || tokenData.merchant_id,
      contactEmail: merchantInfo.email,
      merchantId: tokenData.merchant_id,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      scopes: tokenData.scope || '',
      expiresAt: expiresAt.toISOString(),
      locationId: primaryLocationId,
      phone: merchantInfo.phone,
      country: merchantInfo.country,
      address: merchantInfo.address
    });

    if (locations.length > 0) {
      await storeSquareLocations(clientId, locations);
    }

    console.log('✅ Success! Redirecting...');

    // Redirect to success
    const successUrl = new URL('/square/success', request.url);
    successUrl.searchParams.set('merchant_id', tokenData.merchant_id);
    successUrl.searchParams.set('client_id', clientId);
    successUrl.searchParams.set('location_count', locations.length.toString());
    
    if (merchantInfo.businessName) {
      successUrl.searchParams.set('business_name', merchantInfo.businessName);
    }
    if (merchantInfo.email) {
      successUrl.searchParams.set('email', merchantInfo.email);
    }
    if (primaryLocationId) {
      successUrl.searchParams.set('location_id', primaryLocationId);
    }
    
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('❌ Callback error:', error);
    return NextResponse.redirect(new URL('/square/error?error=server_error', request.url));
  }
}

export async function POST(request) {
  return GET(request);
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';