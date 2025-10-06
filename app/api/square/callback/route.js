// app/api/square/callback/route.js - DIAGNOSTIC VERSION
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('\n========================================');
  console.log('🔵 SQUARE CALLBACK STARTED');
  console.log('========================================');
  console.log('Code received:', !!code);
  console.log('State:', state);
  console.log('Error:', error);

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
    
    console.log('\n📡 Exchanging code for tokens...');
    console.log('Environment:', process.env.SQUARE_ENVIRONMENT || 'NOT SET (defaulting to sandbox)');
    console.log('Base URL:', baseUrl);
    console.log('Redirect URI:', redirectUri);
    console.log('Application ID:', process.env.SQUARE_APPLICATION_ID);
    
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
    console.log('Token data keys:', Object.keys(tokenData));

    if (!tokenResponse.ok) {
      console.error('❌ Token exchange failed');
      console.error('Status:', tokenResponse.status);
      console.error('Full error response:', JSON.stringify(tokenData, null, 2));
      
      // Extract detailed error info
      const errorDetail = tokenData.error_description || 
                         tokenData.message || 
                         (tokenData.errors && tokenData.errors[0]?.detail) ||
                         tokenData.error || 
                         'Unknown error';
      
      console.error('Error detail:', errorDetail);
      
      const errorMsg = encodeURIComponent(errorDetail);
      return NextResponse.redirect(
        new URL(`/square/error?error=token_exchange_failed&details=${errorMsg}`, request.url)
      );
    }

    console.log('✅ Token exchange successful!');
    console.log('Merchant ID:', tokenData.merchant_id);
    console.log('Access token length:', tokenData.access_token?.length);

    // ===== FETCH LOCATIONS =====
    let locations = [];
    let primaryLocationId = null;
    let merchantInfo = {
      businessName: null,
      email: null,
      phone: null,
      country: null,
      address: null
    };
    
    console.log('\n📍 Fetching locations...');
    try {
      const locationsResponse = await fetch(`${baseUrl}/v2/locations`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Square-Version': '2023-10-18',
          'Accept': 'application/json'
        }
      });

      console.log('Locations response status:', locationsResponse.status);
      const locationsData = await locationsResponse.json();
      
      console.log('\n📦 FULL LOCATIONS RESPONSE:');
      console.log(JSON.stringify(locationsData, null, 2));

      if (locationsResponse.ok && locationsData.locations && locationsData.locations.length > 0) {
        locations = locationsData.locations;
        primaryLocationId = locations[0].id;
        
        console.log(`\n✅ Found ${locations.length} location(s)`);
        console.log('Primary location ID:', primaryLocationId);
        
        // Extract ALL fields from primary location
        const primaryLocation = locations[0];
        console.log('\n🏢 PRIMARY LOCATION DATA:');
        console.log('- ID:', primaryLocation.id);
        console.log('- Name:', primaryLocation.name);
        console.log('- Business Name:', primaryLocation.business_name);
        console.log('- Phone:', primaryLocation.phone_number);
        console.log('- Country:', primaryLocation.country);
        console.log('- Status:', primaryLocation.status);
        console.log('- Address:', primaryLocation.address);
        console.log('- Capabilities:', primaryLocation.capabilities);
        
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
        
        console.log('\n📋 EXTRACTED MERCHANT INFO:');
        console.log(JSON.stringify(merchantInfo, null, 2));
      } else {
        console.log('⚠️ No locations found or error:', locationsData);
      }
    } catch (locationError) {
      console.error('❌ Location fetch error:', locationError);
      console.error('Error stack:', locationError.stack);
    }

    // ===== TRY TEAM MEMBERS API =====
    console.log('\n👥 Attempting to fetch team members...');
    try {
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
          limit: 5
        })
      });

      console.log('Team response status:', teamResponse.status);
      
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        console.log('\n👤 TEAM MEMBERS RESPONSE:');
        console.log(JSON.stringify(teamData, null, 2));
        
        if (teamData.team_members && teamData.team_members.length > 0) {
          const owner = teamData.team_members.find(m => m.is_owner);
          const emailSource = owner || teamData.team_members[0];
          merchantInfo.email = emailSource.email_address || null;
          
          console.log('✅ Found email:', merchantInfo.email);
        }
      } else {
        const errorData = await teamResponse.json();
        console.log('⚠️ Team API error:', JSON.stringify(errorData, null, 2));
      }
    } catch (teamError) {
      console.log('⚠️ Team fetch error:', teamError.message);
    }

    // ===== STORE IN DATABASE =====
    console.log('\n💾 Storing in database...');
    const { storeSquareAuth, storeSquareLocations } = await import('@/lib/square-auth');
    
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const clientId = merchantInfo.businessName 
      ? `client_${merchantInfo.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${tokenData.merchant_id.slice(-8)}`
      : `client_${tokenData.merchant_id}`;
    
    console.log('Client ID:', clientId);
    console.log('Restaurant Name:', merchantInfo.businessName || tokenData.merchant_id);
    console.log('Email:', merchantInfo.email || 'NULL');
    console.log('Phone:', merchantInfo.phone || 'NULL');
    console.log('Country:', merchantInfo.country || 'NULL');
    console.log('Address:', merchantInfo.address || 'NULL');
    
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

    console.log('\n✅ Database storage complete!');
    console.log('========================================\n');

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
    console.error('\n❌ CALLBACK ERROR:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.log('========================================\n');
    return NextResponse.redirect(new URL('/square/error?error=server_error', request.url));
  }
}