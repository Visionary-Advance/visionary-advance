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

  try {
    console.log('Exchanging authorization code for tokens...');
    
    const baseUrl = process.env.SQUARE_ENVIRONMENT === 'sandbox' 
      ? 'https://connect.squareupsandbox.com' 
      : 'https://connect.squareup.com';
    
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

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      const errorMsg = tokenData.error_description || tokenData.error || 'unknown_error';
      return NextResponse.redirect(new URL(`/square/error?error=token_exchange_failed&details=${encodeURIComponent(errorMsg)}`, request.url));
    }

    console.log('Token exchange successful!');
    console.log('Merchant ID:', tokenData.merchant_id);

    // ===== FETCH LOCATIONS FIRST =====
    let locations = [];
    let primaryLocationId = null;
    let merchantInfo = {
      businessName: null,
      email: null,
      phone: null,
      country: null,
      address: null
    };
    
    try {
      console.log('Fetching merchant locations...');
      const locationsResponse = await fetch(`${baseUrl}/v2/locations`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Square-Version': '2023-10-18',
          'Accept': 'application/json'
        }
      });

      console.log('Locations response status:', locationsResponse.status);
      const locationsData = await locationsResponse.json();
      console.log('Locations data:', JSON.stringify(locationsData, null, 2));

      if (locationsResponse.ok && locationsData.locations && locationsData.locations.length > 0) {
        locations = locationsData.locations;
        primaryLocationId = locations[0].id;
        
        // Extract business info from primary location
        const primaryLocation = locations[0];
        merchantInfo.businessName = primaryLocation.business_name || primaryLocation.name || null;
        merchantInfo.phone = primaryLocation.phone_number || null;
        merchantInfo.country = primaryLocation.country || primaryLocation.address?.country || null;
        
        // Format address if available
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
        
        console.log('✅ Extracted info from primary location:', merchantInfo);
        console.log(`Found ${locations.length} locations, primary: ${primaryLocationId}`);
      }
    } catch (locationError) {
      console.error('❌ Failed to fetch locations:', locationError);
    }

    // ===== TRY TO GET EMAIL FROM TEAM MEMBER API =====
    try {
      console.log('Attempting to fetch team members for email...');
      const teamResponse = await fetch(`${baseUrl}/v2/team-members/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Square-Version': '2023-10-18',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: {
            filter: {
              status: 'ACTIVE'
            }
          },
          limit: 1
        })
      });

      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        console.log('Team data:', JSON.stringify(teamData, null, 2));
        
        if (teamData.team_members && teamData.team_members.length > 0) {
          // Try to find an owner or admin
          const owner = teamData.team_members.find(m => 
            m.is_owner || 
            m.assigned_locations?.is_all_locations
          );
          
          const emailSource = owner || teamData.team_members[0];
          merchantInfo.email = emailSource.email_address || null;
          
          console.log('✅ Found email from team member:', merchantInfo.email);
        }
      } else {
        console.log('⚠️ Team members API not accessible (may need EMPLOYEES_READ permission)');
      }
    } catch (teamError) {
      console.log('⚠️ Could not fetch team members:', teamError.message);
    }

    // ===== STORE IN DATABASE =====
    const { storeSquareAuth, storeSquareLocations } = await import('@/lib/square-auth');
    
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Use business name if available, otherwise use merchant ID
    const clientId = merchantInfo.businessName 
      ? `client_${merchantInfo.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${tokenData.merchant_id.slice(-8)}`
      : `client_${tokenData.merchant_id}`;
    
    console.log('Storing auth with client_id:', clientId);
    console.log('Business name:', merchantInfo.businessName);
    console.log('Email:', merchantInfo.email);
    console.log('Phone:', merchantInfo.phone);
    
    // Store authentication with merchant info
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

    // Store all locations
    if (locations.length > 0) {
      await storeSquareLocations(clientId, locations);
    }

    // Redirect to success page with merchant info
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
    console.error('Square callback error:', error);
    return NextResponse.redirect(new URL('/square/error?error=server_error', request.url));
  }
}