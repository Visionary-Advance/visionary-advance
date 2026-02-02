// lib/square-auth.js
// Square Token Management and Refresh System

import { createClient } from '@supabase/supabase-js';

// Lazy-load Supabase client to avoid build-time initialization errors
let supabase = null;
function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role for server-side
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return supabase;
}

const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'sandbox' 
  ? 'https://connect.squareupsandbox.com'
  : 'https://connect.squareup.com';

/**
 * Get a valid access token for a client, refreshing if necessary
 */
export async function getValidSquareToken(clientId) {
  try {
    // Get auth record from database
    const { data: auth, error } = await getSupabaseClient()
      .from('square_auth')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .single();

    if (error || !auth) {
      throw new Error(`No active authorization found for client: ${clientId}`);
    }

    // Check if token is expired or expiring soon (within 5 days)
    const expiresAt = new Date(auth.expires_at);
    const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    if (expiresAt <= fiveDaysFromNow) {
      console.log(`Token expiring soon for ${clientId}, refreshing...`);
      return await refreshSquareToken(clientId, auth.refresh_token);
    }

    // Update last used timestamp
    await getSupabaseClient()
      .from('square_auth')
      .update({ last_used_at: new Date().toISOString() })
      .eq('client_id', clientId);

    return auth.access_token;
  } catch (error) {
    console.error('Error getting valid token:', error);
    throw error;
  }
}

/**
 * Refresh an expired or expiring Square access token
 */
export async function refreshSquareToken(clientId, refreshToken) {
  try {
    console.log(`Refreshing token for client: ${clientId}`);

    // Call Square's token refresh endpoint
    const response = await fetch(`${SQUARE_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.SQUARE_APPLICATION_ID,
        client_secret: process.env.SQUARE_APPLICATION_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Token refresh failed:', data);
      
      // Mark as expired in database
      await getSupabaseClient()
        .from('square_auth')
        .update({ 
          status: 'expired',
          error_message: data.errors?.[0]?.detail || 'Token refresh failed'
        })
        .eq('client_id', clientId);

      throw new Error(`Token refresh failed: ${data.errors?.[0]?.detail || 'Unknown error'}`);
    }

    // Calculate new expiration (30 days from now)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Update database with new tokens
    const { error: updateError } = await getSupabaseClient()
      .from('square_auth')
      .update({
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken, // Use new refresh token if provided
        expires_at: expiresAt.toISOString(),
        status: 'active',
        error_message: null,
        last_used_at: new Date().toISOString()
      })
      .eq('client_id', clientId);

    if (updateError) {
      throw new Error(`Failed to update tokens in database: ${updateError.message}`);
    }

    console.log(`Token successfully refreshed for client: ${clientId}`);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

/**
 * Store initial OAuth authorization in database
 */
export async function storeSquareAuth(authData) {
  try {
    const {
      clientId,
      restaurantName,
      contactEmail,
      merchantId,
      accessToken,
      refreshToken,
      scopes,
      expiresAt,
      locationId // Add location ID
    } = authData;

    const { data, error } = await getSupabaseClient()
      .from('square_auth')
      .upsert({
        client_id: clientId,
        restaurant_name: restaurantName,
        contact_email: contactEmail,
        square_merchant_id: merchantId,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        scopes: scopes,
        default_location_id: locationId, // Store location ID
        status: 'active',
        last_used_at: new Date().toISOString()
      }, {
        onConflict: 'client_id'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store auth: ${error.message}`);
    }

    console.log(`Stored Square auth for client: ${clientId}`);
    return data;
  } catch (error) {
    console.error('Error storing Square auth:', error);
    throw error;
  }
}

/**
 * Make an authenticated API call to Square with automatic token refresh
 */
export async function callSquareAPI(clientId, endpoint, options = {}) {
  try {
    // Get valid token (will refresh if needed)
    const token = await getValidSquareToken(clientId);

    // Make API call
    const response = await fetch(`${SQUARE_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
        ...options.headers
      }
    });

    const data = await response.json();

    // If we get an auth error, try refreshing once
    if (response.status === 401) {
      console.log('Got 401, attempting token refresh...');
      
      const { data: auth } = await getSupabaseClient()
        .from('square_auth')
        .select('refresh_token')
        .eq('client_id', clientId)
        .single();

      const newToken = await refreshSquareToken(clientId, auth.refresh_token);

      // Retry the API call with new token
      const retryResponse = await fetch(`${SQUARE_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
          'Square-Version': '2023-10-18',
          ...options.headers
        }
      });

      return await retryResponse.json();
    }

    return data;
  } catch (error) {
    console.error('Error calling Square API:', error);
    throw error;
  }
}

/**
 * Batch refresh tokens that are expiring soon (run as a cron job)
 */
export async function refreshExpiringTokens() {
  try {
    // Find tokens expiring in the next 5 days
    const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    const { data: expiringAuths, error } = await getSupabaseClient()
      .from('square_auth')
      .select('client_id, refresh_token')
      .eq('status', 'active')
      .lt('expires_at', fiveDaysFromNow.toISOString());

    if (error) {
      throw new Error(`Failed to fetch expiring tokens: ${error.message}`);
    }

    console.log(`Found ${expiringAuths?.length || 0} tokens to refresh`);

    // Refresh each token
    const results = await Promise.allSettled(
      expiringAuths.map(auth => 
        refreshSquareToken(auth.client_id, auth.refresh_token)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Token refresh complete: ${successful} successful, ${failed} failed`);

    return { successful, failed, total: expiringAuths.length };
  } catch (error) {
    console.error('Error in batch token refresh:', error);
    throw error;
  }
}

/**
 * Store Square locations for a client
 */
export async function storeSquareLocations(clientId, locations) {
  try {
    // Delete existing locations for this client
    await getSupabaseClient()
      .from('square_locations')
      .delete()
      .eq('client_id', clientId);

    // Insert all locations
    const locationsToInsert = locations.map((location, index) => ({
      client_id: clientId,
      location_id: location.id,
      location_name: location.name || 'Unnamed Location',
      address: location.address ? 
        `${location.address.address_line_1 || ''} ${location.address.locality || ''}, ${location.address.administrative_district_level_1 || ''} ${location.address.postal_code || ''}`.trim() 
        : null,
      phone: location.phone_number || null,
      timezone: location.timezone || null,
      currency: location.currency || 'USD',
      status: location.status || 'ACTIVE',
      capabilities: JSON.stringify(location.capabilities || []),
      is_default: index === 0, // First location is default
    }));

    const { data, error } = await getSupabaseClient()
      .from('square_locations')
      .insert(locationsToInsert)
      .select();

    if (error) {
      throw new Error(`Failed to store locations: ${error.message}`);
    }

    console.log(`Stored ${locations.length} locations for client: ${clientId}`);
    return data;
  } catch (error) {
    console.error('Error storing Square locations:', error);
    throw error;
  }
}

/**
 * Get all locations for a client
 */
export async function getClientLocations(clientId) {
  try {
    const { data, error } = await getSupabaseClient()
      .from('square_locations')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('is_default', { ascending: false }); // Default location first

    if (error) {
      throw new Error(`Failed to get locations: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error getting client locations:', error);
    throw error;
  }
}

/**
 * Get default/primary location ID for a client
 */
export async function getClientLocationId(clientId) {
  try {
    // First try to get from square_locations table (default location)
    const { data: locationData, error: locationError } = await getSupabaseClient()
      .from('square_locations')
      .select('location_id')
      .eq('client_id', clientId)
      .eq('is_default', true)
      .single();

    if (locationData && !locationError) {
      return locationData.location_id;
    }

    // Fallback to square_auth table
    const { data, error } = await getSupabaseClient()
      .from('square_auth')
      .select('default_location_id')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      throw new Error(`No location found for client: ${clientId}`);
    }

    return data.default_location_id;
  } catch (error) {
    console.error('Error getting location ID:', error);
    throw error;
  }
}

/**
 * Revoke Square authorization for a client
 */
export async function revokeSquareAuth(clientId) {
  try {
    const { data: auth } = await getSupabaseClient()
      .from('square_auth')
      .select('access_token')
      .eq('client_id', clientId)
      .single();

    if (!auth) {
      throw new Error(`No auth found for client: ${clientId}`);
    }

    // Call Square's revoke endpoint
    await fetch(`${SQUARE_BASE_URL}/oauth2/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify({
        client_id: process.env.SQUARE_APPLICATION_ID,
        access_token: auth.access_token
      })
    });

    // Update database
    await getSupabaseClient()
      .from('square_auth')
      .update({ status: 'revoked' })
      .eq('client_id', clientId);

    console.log(`Revoked Square auth for client: ${clientId}`);
  } catch (error) {
    console.error('Error revoking auth:', error);
    throw error;
  }
}