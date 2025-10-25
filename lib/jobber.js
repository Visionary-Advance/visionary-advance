// lib/jobber.js
import { createClient } from '@supabase/supabase-js';

// Same Supabase instance as Square (tokens database)
const supabase = createClient(
  process.env.SUPABASE_TOKENS_URL,
  process.env.SUPABASE_TOKENS_SERVICE_KEY
);

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
    throw new Error(`Token exchange failed: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// Get Jobber account info
export async function getJobberAccountInfo(accessToken) {
  const query = `
    query {
      account {
        id
        name
      }
    }
  `;

  const response = await fetch('https://api.getjobber.com/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query })
  });

  const result = await response.json();

  console.log('GraphQL Response:', JSON.stringify(result, null, 2));

  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    throw new Error(`GraphQL error: ${result.errors[0].message}`);
  }

  if (!result.data || !result.data.account) {
    console.error('Invalid GraphQL response structure:', result);
    throw new Error('Invalid response from Jobber API - missing account data');
  }

  return result.data.account;
}

// Store tokens in Supabase (same database as Square tokens)
export async function storeJobberTokens(accountId, accountName, tokens) {
  // Use the expires_in value from the token response (default to 1 hour if not provided)
  const expiresInMs = (tokens.expires_in || 3600) * 1000;
  const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

  const { data, error } = await supabase
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

// Get valid token (auto-refreshes if expired)
export async function getValidJobberToken(accountId) {
  const { data: account, error } = await supabase
    .from('jobber_accounts')
    .select('*')
    .eq('account_id', accountId)
    .single();

  if (error || !account) {
    throw new Error('Jobber account not found');
  }

  const now = new Date();
  const expiresAt = new Date(account.token_expires_at);

  if (now >= expiresAt) {
    return await refreshJobberToken(account);
  }

  return account.access_token;
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
    throw new Error('Failed to refresh token');
  }

  const tokens = await response.json();

  // Use the expires_in value from the token response
  const expiresInMs = (tokens.expires_in || 3600) * 1000;
  const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

  const { error } = await supabase
    .from('jobber_accounts')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: expiresAt
    })
    .eq('id', account.id);

  if (error) throw error;

  return tokens.access_token;
}

// Create a client in Jobber from form data
export async function createJobberClient(formData, accessToken) {
  const mutation = `
    mutation CreateClient($input: ClientCreateInput!) {
      clientCreate(input: $input) {
        client {
          id
          firstName
          lastName
          companyName
        }
        userErrors {
          message
          path
        }
      }
    }
  `;

  const variables = {
    input: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.companyName || null,
      emails: [{
        description: "MAIN",
        primary: true,
        address: formData.email
      }],
      phones: formData.phone ? [{
        description: "MOBILE",
        primary: true,
        number: formData.phone
      }] : []
    }
  };

  const response = await fetch('https://api.getjobber.com/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query: mutation, variables })
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL error: ${result.errors[0].message}`);
  }

  if (result.data.clientCreate.userErrors.length > 0) {
    throw new Error(`Jobber error: ${result.data.clientCreate.userErrors[0].message}`);
  }

  return result.data.clientCreate.client;
}

// Create a request (job request) in Jobber
export async function createJobberRequest(formData, accessToken) {
  const mutation = `
    mutation CreateRequest($input: RequestCreateInput!) {
      requestCreate(input: $input) {
        request {
          id
        }
        userErrors {
          message
          path
        }
      }
    }
  `;

  const variables = {
    input: {
      contactName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone || null,
      companyName: formData.companyName || null,
      description: formData.message || "Contact form submission"
    }
  };

  const response = await fetch('https://api.getjobber.com/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query: mutation, variables })
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL error: ${result.errors[0].message}`);
  }

  if (result.data.requestCreate.userErrors.length > 0) {
    throw new Error(`Jobber error: ${result.data.requestCreate.userErrors[0].message}`);
  }

  return result.data.requestCreate.request;
}