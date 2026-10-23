// lib/jobber.js
import { createClient } from '@supabase/supabase-js';

// Lazy-load Supabase client to avoid build-time initialization errors
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

const JOBBER_GRAPHQL_URL = 'https://api.getjobber.com/api/graphql';

// Jobber retires API versions over time. The Developer Center lists the ones
// still supported; override here without a deploy-time code change.
const JOBBER_API_VERSION = process.env.JOBBER_API_VERSION || '2025-01-20';

// Refresh a little before the hour is up so a token can't expire mid-request.
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code) {
  const response = await fetch('https://api.getjobber.com/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.JOBBER_CLIENT_ID,
      client_secret: process.env.JOBBER_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.JOBBER_REDIRECT_URI
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Token exchange error:', error);
    throw new Error(`Token exchange failed: ${JSON.stringify(error)}`);
  }

  const tokens = await response.json();
  console.log('✅ Token exchange successful');
  console.log('📊 Scopes granted:', tokens.scope || '⚠️  NONE - App needs scopes configured in Jobber Developer Center');

  return tokens;
}

// Raw GraphQL call with a known token. Throws on transport and GraphQL
// errors; a 401 is tagged so callers can refresh and retry.
async function jobberFetch(accessToken, query, variables) {
  const response = await fetch(JOBBER_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-JOBBER-GRAPHQL-VERSION': JOBBER_API_VERSION
    },
    body: JSON.stringify({ query, variables })
  });

  if (response.status === 401) {
    const error = new Error('Jobber rejected the access token');
    error.unauthorized = true;
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Jobber API returned ${response.status}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(`GraphQL error: ${result.errors[0].message}`);
  }

  return result.data;
}

// GraphQL call for a stored account: gets a valid token, and on a 401
// refreshes once and retries.
export async function jobberGraphQL(accountId, query, variables) {
  const token = await getValidJobberToken(accountId);
  try {
    return await jobberFetch(token, query, variables);
  } catch (error) {
    if (!error.unauthorized) throw error;
    const fresh = await getValidJobberToken(accountId, { forceRefresh: true });
    return jobberFetch(fresh, query, variables);
  }
}

// Get Jobber account info
export async function getJobberAccountInfo(accessToken) {
  const data = await jobberFetch(accessToken, `
    query {
      account {
        id
        name
      }
    }
  `);

  if (!data?.account) {
    throw new Error('Invalid response from Jobber API - missing account data');
  }

  return data.account;
}

// Store tokens in Supabase (same database as Square tokens)
export async function storeJobberTokens(accountId, accountName, tokens) {
  // Use the expires_in value from the token response (default to 1 hour if not provided)
  const expiresInMs = (tokens.expires_in || 3600) * 1000;
  const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

  const { data, error } = await getSupabaseClient()
    .from('jobber_accounts')
    .upsert({
      account_id: accountId,
      account_name: accountName,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: expiresAt
    }, {
      onConflict: 'account_id'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function loadAccount(accountId) {
  const { data: account, error } = await getSupabaseClient()
    .from('jobber_accounts')
    .select('*')
    .eq('account_id', accountId)
    .single();

  if (error || !account) {
    throw new Error('Jobber account not found');
  }
  return account;
}

// Get valid token (auto-refreshes if expired or about to)
export async function getValidJobberToken(accountId, { forceRefresh = false } = {}) {
  const account = await loadAccount(accountId);

  const expiresAt = new Date(account.token_expires_at).getTime();
  if (!forceRefresh && Date.now() < expiresAt - REFRESH_MARGIN_MS) {
    return account.access_token;
  }

  try {
    return await refreshJobberToken(account);
  } catch (error) {
    // Jobber rotates refresh tokens and invalidates the old one immediately.
    // If two leads arrive together, the second refresh fails because the
    // first already rotated — in that case the row now holds a fresh token.
    const latest = await loadAccount(accountId);
    if (
      latest.refresh_token !== account.refresh_token &&
      Date.now() < new Date(latest.token_expires_at).getTime()
    ) {
      return latest.access_token;
    }
    throw error;
  }
}

// Refresh expired token
async function refreshJobberToken(account) {
  const response = await fetch('https://api.getjobber.com/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.JOBBER_CLIENT_ID,
      client_secret: process.env.JOBBER_CLIENT_SECRET,
      refresh_token: account.refresh_token,
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh Jobber token (${response.status})`);
  }

  const tokens = await response.json();

  // Use the expires_in value from the token response
  const expiresInMs = (tokens.expires_in || 3600) * 1000;
  const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

  // Save both tokens straight away: with rotation on, the old refresh token
  // is already dead.
  const { error } = await getSupabaseClient()
    .from('jobber_accounts')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || account.refresh_token,
      token_expires_at: expiresAt
    })
    .eq('id', account.id);

  if (error) throw error;

  return tokens.access_token;
}

const digitsOf = (value) => (value || '').replace(/\D/g, '').slice(-10);

// Find an existing client by email or phone so a returning customer gets a
// new request on their existing record instead of a duplicate client.
export async function findJobberClient(accountId, { email, phone }) {
  const query = `
    query FindClient($searchTerm: String!) {
      clients(searchTerm: $searchTerm, first: 10) {
        nodes {
          id
          emails { address }
          phones { number }
          clientProperties(first: 20) {
            nodes {
              id
              address { street1 postalCode }
            }
          }
        }
      }
    }
  `;

  const wantEmail = email?.toLowerCase();
  const wantPhone = digitsOf(phone);

  const terms = [email, phone].filter(Boolean);
  for (const searchTerm of terms) {
    const data = await jobberGraphQL(accountId, query, { searchTerm });
    // searchTerm is fuzzy (it also matches names), so confirm the hit.
    const match = data.clients.nodes.find((client) =>
      (wantEmail && client.emails.some((e) => e.address?.toLowerCase() === wantEmail)) ||
      (wantPhone.length === 10 && client.phones.some((p) => digitsOf(p.number) === wantPhone))
    );
    if (match) {
      return {
        id: match.id,
        properties: match.clientProperties.nodes,
      };
    }
  }

  return null;
}

// Create a client in Jobber from form data. Jobber records the app's name as
// the client's Lead Source automatically.
export async function createJobberClient(accountId, { firstName, lastName, companyName, email, phone, address }) {
  const mutation = `
    mutation CreateClient($input: ClientCreateInput!) {
      clientCreate(input: $input) {
        client {
          id
          clientProperties(first: 1) {
            nodes { id }
          }
        }
        userErrors {
          message
          path
        }
      }
    }
  `;

  const input = {
    firstName,
    lastName: lastName || null,
    companyName: companyName || null,
    emails: email ? [{ description: 'MAIN', primary: true, address: email }] : [],
    phones: phone ? [{ description: 'MOBILE', primary: true, number: phone }] : [],
    ...(address ? { properties: [{ address }], billingAddress: address } : {})
  };

  const data = await jobberGraphQL(accountId, mutation, { input });
  const { client, userErrors } = data.clientCreate;

  if (userErrors.length > 0) {
    throw new Error(`Jobber error: ${userErrors[0].message}`);
  }

  return {
    id: client.id,
    propertyId: client.clientProperties.nodes[0]?.id || null,
  };
}

// Add a property to an existing client (a returning customer with a new address)
export async function createJobberProperty(accountId, clientId, address) {
  const mutation = `
    mutation AddProperty($clientId: EncodedId!, $input: PropertyCreateInput!) {
      propertyCreate(clientId: $clientId, input: $input) {
        properties { id }
        userErrors {
          message
          path
        }
      }
    }
  `;

  const data = await jobberGraphQL(accountId, mutation, {
    clientId,
    input: { properties: [{ address }] },
  });
  const { properties, userErrors } = data.propertyCreate;

  if (userErrors.length > 0) {
    throw new Error(`Jobber error: ${userErrors[0].message}`);
  }

  return properties[0]?.id || null;
}

// Create a request (job request) in Jobber. `details` is a list of
// { label, answerText } shown on the request's form in Jobber.
export async function createJobberRequest(accountId, { clientId, propertyId, title, details }) {
  const mutation = `
    mutation CreateRequest($input: RequestCreateInput!) {
      requestCreate(input: $input) {
        request {
          id
          jobberWebUri
        }
        userErrors {
          message
          path
        }
      }
    }
  `;

  const input = {
    clientId,
    title,
    ...(propertyId ? { propertyId } : {}),
    ...(details?.length
      ? { requestDetails: { form: { sections: [{ label: 'Website form', items: details }] } } }
      : {})
  };

  const data = await jobberGraphQL(accountId, mutation, { input });
  const { request, userErrors } = data.requestCreate;

  if (userErrors.length > 0) {
    throw new Error(`Jobber error: ${userErrors[0].message}`);
  }

  return request;
}
