// lib/google-auth.js
// Google OAuth Token Management for Search Console API

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Lazy-load Supabase client
let supabase = null;
function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
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

const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GOOGLE_REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

// Scopes needed for Search Console
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

/**
 * Sign state parameter with HMAC SHA256 for CSRF protection
 */
function signState(data) {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET;
  if (!secret) {
    throw new Error('GOOGLE_OAUTH_STATE_SECRET is not configured');
  }

  const payload = JSON.stringify(data);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Combine payload and signature, base64 encode
  const state = Buffer.from(JSON.stringify({ payload, signature })).toString('base64url');
  return state;
}

/**
 * Verify and decode signed state parameter
 */
function verifyState(state) {
  try {
    const secret = process.env.GOOGLE_OAUTH_STATE_SECRET;
    if (!secret) {
      throw new Error('GOOGLE_OAUTH_STATE_SECRET is not configured');
    }

    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
    const { payload, signature } = decoded;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      throw new Error('Invalid state signature');
    }

    return JSON.parse(payload);
  } catch (error) {
    console.error('State verification failed:', error);
    throw new Error('Invalid or expired state parameter');
  }
}

/**
 * Generate Google OAuth authorization URL
 */
export function generateOAuthUrl(returnUrl = '/admin', adminEmail = null) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  // Create signed state with timestamp, return URL, and admin email
  const stateData = {
    returnUrl,
    adminEmail, // Include admin email to link the connection
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex')
  };
  const state = signState(stateData);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent', // Force consent to always get refresh token
    state
  });

  return `${GOOGLE_OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Token exchange failed:', data);
    throw new Error(data.error_description || data.error || 'Token exchange failed');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in, // seconds
    tokenType: data.token_type,
    scope: data.scope
  };
}

/**
 * Fetch user info from Google
 */
export async function getGoogleUserInfo(accessToken) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return await response.json();
}

/**
 * Store Google OAuth tokens in database (upsert)
 * Uses adminEmail as the primary key for lookups, stores googleEmail for display
 */
export async function storeGoogleAuth(authData) {
  const {
    adminEmail,  // Admin user's email (used for lookup)
    googleEmail, // Google account email (for display)
    accessToken,
    refreshToken,
    expiresIn,
    scopes
  } = authData;

  // Use adminEmail as primary key, fall back to googleEmail for backwards compatibility
  const primaryEmail = adminEmail || googleEmail;

  // Calculate expiration time
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  const { data, error } = await getSupabaseClient()
    .from('google_oauth')
    .upsert({
      email: primaryEmail,
      google_email: googleEmail, // Store the actual Google account email
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt.toISOString(),
      scopes: scopes ? scopes.split(' ') : SCOPES,
      status: 'active',
      error_message: null,
      last_used_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'email'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to store Google auth: ${error.message}`);
  }

  console.log(`Stored Google auth for admin: ${primaryEmail} (Google: ${googleEmail})`);
  return data;
}

/**
 * Get a valid access token for an email, refreshing if necessary
 */
export async function getValidGoogleToken(email) {
  try {
    const { data: auth, error } = await getSupabaseClient()
      .from('google_oauth')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .single();

    if (error || !auth) {
      throw new Error(`No active Google authorization found for: ${email}`);
    }

    // Check if token is expired or expiring soon (within 5 minutes)
    const expiresAt = new Date(auth.expires_at);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

    if (expiresAt <= fiveMinutesFromNow) {
      console.log(`Token expiring soon for ${email}, refreshing...`);
      return await refreshGoogleToken(email, auth.refresh_token);
    }

    // Update last used timestamp
    await getSupabaseClient()
      .from('google_oauth')
      .update({ last_used_at: new Date().toISOString() })
      .eq('email', email);

    return auth.access_token;
  } catch (error) {
    console.error('Error getting valid Google token:', error);
    throw error;
  }
}

/**
 * Refresh an expired Google access token
 */
export async function refreshGoogleToken(email, refreshToken) {
  try {
    console.log(`Refreshing Google token for: ${email}`);

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Token refresh failed:', data);

      // Mark as expired in database
      await getSupabaseClient()
        .from('google_oauth')
        .update({
          status: 'expired',
          error_message: data.error_description || data.error || 'Token refresh failed',
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      throw new Error(`Token refresh failed: ${data.error_description || data.error}`);
    }

    // Calculate new expiration
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    // Update database with new token
    const { error: updateError } = await getSupabaseClient()
      .from('google_oauth')
      .update({
        access_token: data.access_token,
        // Google may not return a new refresh token, keep existing
        refresh_token: data.refresh_token || refreshToken,
        expires_at: expiresAt.toISOString(),
        status: 'active',
        error_message: null,
        last_used_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (updateError) {
      throw new Error(`Failed to update tokens: ${updateError.message}`);
    }

    console.log(`Token successfully refreshed for: ${email}`);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    throw error;
  }
}

/**
 * Check Google connection status for an email (looks up by admin email)
 */
export async function getGoogleConnectionStatus(email) {
  try {
    const { data, error } = await getSupabaseClient()
      .from('google_oauth')
      .select('email, google_email, status, last_used_at, created_at, error_message')
      .eq('email', email)
      .single();

    if (error || !data) {
      return { connected: false };
    }

    return {
      connected: data.status === 'active',
      email: data.google_email || data.email, // Show Google email for display
      adminEmail: data.email,
      status: data.status,
      lastUsed: data.last_used_at,
      connectedAt: data.created_at,
      error: data.error_message
    };
  } catch (error) {
    console.error('Error checking Google connection status:', error);
    return { connected: false, error: error.message };
  }
}

/**
 * Revoke Google authorization for an email
 */
export async function revokeGoogleAuth(email) {
  try {
    const { data: auth, error } = await getSupabaseClient()
      .from('google_oauth')
      .select('access_token, refresh_token')
      .eq('email', email)
      .single();

    if (error || !auth) {
      throw new Error(`No auth found for: ${email}`);
    }

    // Try to revoke token at Google (best effort, don't fail if this errors)
    try {
      await fetch(`${GOOGLE_REVOKE_URL}?token=${auth.access_token}`, {
        method: 'POST'
      });
    } catch (revokeError) {
      console.warn('Failed to revoke token at Google:', revokeError);
    }

    // Update database status
    const { error: updateError } = await getSupabaseClient()
      .from('google_oauth')
      .update({
        status: 'revoked',
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (updateError) {
      throw new Error(`Failed to update status: ${updateError.message}`);
    }

    console.log(`Revoked Google auth for: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error revoking Google auth:', error);
    throw error;
  }
}

// Export state functions for use in API routes
export { signState, verifyState };
