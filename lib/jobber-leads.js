// lib/jobber-leads.js
// Lead intake for client websites: a site posts its contact form to
// /api/integrations/jobber/lead with its secret key, and the lead lands in the
// contractor's Jobber as a Client (matched or new) + Property + Request.
//
// Sites, keys and connect invites are managed with scripts/jobber-site.mjs.
// Schema: supabase/migrations/20261023_jobber_lead_intake.sql

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import {
  findJobberClient,
  createJobberClient,
  createJobberProperty,
  createJobberRequest,
} from '@/lib/jobber';

let supabase = null;
function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
    );
  }
  return supabase;
}

// Holds the OAuth state + site invite between /api/jobber/authorize and the callback.
export const OAUTH_COOKIE = 'jobber_oauth';

// A resubmission of the same lead inside this window is treated as a
// double-click and not sent to Jobber again.
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export const hashSecret = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

// Look up the site a secret key belongs to. Returns null for unknown or
// deactivated keys.
export async function getSiteByKey(key) {
  if (!key) return null;
  const { data } = await getSupabaseClient()
    .from('jobber_lead_sites')
    .select('*')
    .eq('key_hash', hashSecret(key))
    .eq('active', true)
    .maybeSingle();
  return data || null;
}

// Check a connect invite (the ?site=&invite= link sent to the contractor).
export async function getSiteForInvite(slug, invite) {
  if (!slug || !invite) return null;
  const { data: site } = await getSupabaseClient()
    .from('jobber_lead_sites')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (!site?.connect_token_hash) return null;
  if (site.connect_token_expires_at && new Date(site.connect_token_expires_at) < new Date()) return null;

  const expected = Buffer.from(site.connect_token_hash, 'hex');
  const actual = Buffer.from(hashSecret(invite), 'hex');
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;

  return site;
}

// Point a site at the Jobber account that just connected, and burn the invite.
export async function linkSiteToJobberAccount(siteId, accountId) {
  const { error } = await getSupabaseClient()
    .from('jobber_lead_sites')
    .update({
      jobber_account_id: accountId,
      connect_token_hash: null,
      connect_token_expires_at: null,
      connected_at: new Date().toISOString(),
    })
    .eq('id', siteId);
  if (error) throw error;
}

const US_STATES = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS',
  missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK',
  oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
};
const STATE_CODES = new Set(Object.values(US_STATES));

/**
 * Best-effort split of a one-box US address ("123 Oak St, Eugene, OR 97401")
 * into Jobber's address fields. Anything it can't place stays in street1, and
 * the raw text is also kept on the request, so a bad parse never loses data.
 */
export function parseUsAddress(raw) {
  const text = (raw || '').trim().replace(/\s+/g, ' ');
  if (!text) return null;

  let rest = text;
  let postalCode = null;
  let province = null;

  // Last ZIP (or ZIP+4) in the string, so a 5-digit house number doesn't win.
  const zip = rest.match(/\b(\d{5})(?:-\d{4})?\b(?!.*\b\d{5}\b)/);
  if (zip) {
    postalCode = zip[1];
    rest = (rest.slice(0, zip.index) + rest.slice(zip.index + zip[0].length)).trim();
  }

  rest = rest.replace(/[,\s]*(usa|united states)$/i, '').replace(/[,\s]+$/, '');

  // State: a trailing 2-letter code or full name. A bare code is only trusted
  // after a comma or before a ZIP, so "12 Oak Ct" doesn't become Connecticut.
  const codeMatch = rest.match(/(,?)\s*\b([A-Za-z]{2})$/);
  if (codeMatch && STATE_CODES.has(codeMatch[2].toUpperCase()) && (codeMatch[1] || postalCode)) {
    province = codeMatch[2].toUpperCase();
    rest = rest.slice(0, codeMatch.index).replace(/[,\s]+$/, '');
  } else {
    const lower = rest.toLowerCase();
    // Longest first, so "West Virginia" isn't read as "Virginia".
    const name = Object.keys(US_STATES).sort((a, b) => b.length - a.length).find((n) => new RegExp(`[,\\s]${n}$`).test(lower));
    if (name) {
      province = US_STATES[name];
      rest = rest.slice(0, rest.length - name.length).replace(/[,\s]+$/, '');
    }
  }

  // City: the last comma-separated part, when there is more than one part.
  const parts = rest.split(',').map((p) => p.trim()).filter(Boolean);
  let city = null;
  let street1 = rest;
  if (parts.length >= 2) {
    city = parts.pop();
    street1 = parts.join(', ');
  }

  return {
    street1: street1 || text,
    ...(city ? { city } : {}),
    ...(province ? { province } : {}),
    ...(postalCode ? { postalCode } : {}),
    ...(postalCode || province ? { country: 'US' } : {}),
  };
}

const clean = (value, max = 500) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

// Validate and normalize the posted body. Returns { lead } or { errors }.
export function normalizeLead(body) {
  const lead = {
    name: clean(body?.name, 120),
    firstName: clean(body?.firstName, 60),
    lastName: clean(body?.lastName, 60),
    companyName: clean(body?.companyName, 120),
    phone: clean(body?.phone, 40),
    email: clean(body?.email, 200).toLowerCase(),
    address: clean(body?.address, 300),
    service: clean(body?.service, 120),
    message: clean(body?.message, 4000),
    pageUrl: clean(body?.pageUrl, 500),
  };

  if (!lead.firstName && lead.name) {
    const [first, ...rest] = lead.name.split(' ');
    lead.firstName = first;
    lead.lastName = lead.lastName || rest.join(' ');
  }

  const errors = {};
  if (!lead.firstName) errors.name = 'Name is required';
  if (!lead.phone && !lead.email) errors.phone = 'A phone number or email is required';
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.email = 'Invalid email';

  return Object.keys(errors).length ? { errors } : { lead };
}

const sameStreet = (a, b) =>
  (a || '').toLowerCase().replace(/[^a-z0-9]/g, '') === (b || '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function recordSubmission(site, lead, fields) {
  const db = getSupabaseClient();
  const { error } = await db.from('jobber_lead_submissions').insert({
    site_id: site.id,
    phone_digits: lead.phone.replace(/\D/g, '').slice(-10) || null,
    service: lead.service || null,
    lead,
    ...fields,
  });
  if (error) console.error('Failed to log Jobber lead submission:', error);

  if (fields.status === 'sent') {
    await db.from('jobber_lead_sites').update({ last_lead_at: new Date().toISOString() }).eq('id', site.id);
  }
}

async function findRecentDuplicate(site, lead) {
  const phoneDigits = lead.phone.replace(/\D/g, '').slice(-10);
  if (!phoneDigits) return null;

  const { data } = await getSupabaseClient()
    .from('jobber_lead_submissions')
    .select('jobber_request_id, service')
    .eq('site_id', site.id)
    .eq('status', 'sent')
    .eq('phone_digits', phoneDigits)
    .gte('created_at', new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString())
    .order('created_at', { ascending: false })
    .limit(5);

  return data?.find((row) => (row.service || '') === (lead.service || '')) || null;
}

/**
 * Send one lead to the site's Jobber account.
 * Returns { status: 'sent' | 'duplicate', requestId, clientId? }; throws on failure
 * (after logging the failure).
 */
export async function sendLeadToJobber(site, lead) {
  const duplicate = await findRecentDuplicate(site, lead);
  if (duplicate) {
    await recordSubmission(site, lead, { status: 'duplicate', jobber_request_id: duplicate.jobber_request_id });
    return { status: 'duplicate', requestId: duplicate.jobber_request_id };
  }

  const accountId = site.jobber_account_id;
  const address = parseUsAddress(lead.address);

  try {
    let clientId;
    let propertyId = null;
    const existing = await findJobberClient(accountId, { email: lead.email, phone: lead.phone });

    if (existing) {
      clientId = existing.id;
      if (address) {
        const known = existing.properties.find((p) => sameStreet(p.address?.street1, address.street1));
        propertyId = known?.id || (await createJobberProperty(accountId, clientId, address));
      } else if (existing.properties.length === 1) {
        propertyId = existing.properties[0].id;
      }
    } else {
      const created = await createJobberClient(accountId, {
        firstName: lead.firstName,
        lastName: lead.lastName,
        companyName: lead.companyName,
        email: lead.email,
        phone: lead.phone,
        address,
      });
      clientId = created.id;
      propertyId = created.propertyId;
    }

    const details = [
      lead.service && { label: 'Service', answerText: lead.service },
      lead.address && { label: 'Address (as entered)', answerText: lead.address },
      lead.message && { label: 'Message', answerText: lead.message },
      lead.pageUrl && { label: 'Submitted from', answerText: lead.pageUrl },
    ].filter(Boolean);

    const request = await createJobberRequest(accountId, {
      clientId,
      propertyId,
      title: lead.service ? `${lead.service} (website request)` : 'Website request',
      details,
    });

    await recordSubmission(site, lead, {
      status: 'sent',
      jobber_client_id: clientId,
      jobber_request_id: request.id,
      matched_existing_client: Boolean(existing),
    });

    return { status: 'sent', requestId: request.id, clientId };
  } catch (error) {
    await recordSubmission(site, lead, { status: 'failed', error: String(error.message || error).slice(0, 1000) });
    throw error;
  }
}
