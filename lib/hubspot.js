// lib/hubspot.js
// HubSpot API integration for contact form submissions

const HUBSPOT_API_BASE = 'https://api.hubapi.com';
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

/**
 * Makes an authenticated request to the HubSpot API
 */
async function hubspotRequest(endpoint, options = {}) {
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.warn('HubSpot Access Token not configured');
    return null;
  }

  const url = `${HUBSPOT_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HubSpot API Error (${response.status}):`, errorText);
    throw new Error(`HubSpot API request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Search for existing contact by email
 */
async function findContactByEmail(email) {
  try {
    const data = await hubspotRequest('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email,
          }],
        }],
      }),
    });

    return data?.results?.[0] || null;
  } catch (error) {
    console.error('Error searching for contact:', error);
    return null;
  }
}

/**
 * Search for existing company by domain or name
 */
async function findCompanyByName(companyName) {
  try {
    const data = await hubspotRequest('/crm/v3/objects/companies/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'name',
            operator: 'EQ',
            value: companyName,
          }],
        }],
      }),
    });

    return data?.results?.[0] || null;
  } catch (error) {
    console.error('Error searching for company:', error);
    return null;
  }
}

/**
 * Create or update a contact in HubSpot
 */
async function createOrUpdateContact({ name, email, phone, company, website, message }) {
  try {
    // Check if contact already exists
    const existingContact = await findContactByEmail(email);

    const properties = {
      email,
      phone,
      ...(company && { company }),
      ...(website && { website }),
      ...(message && { notes_last_contacted: message }),
    };

    // Split name into first and last name
    if (name) {
      const nameParts = name.trim().split(' ');
      properties.firstname = nameParts[0];
      properties.lastname = nameParts.slice(1).join(' ') || nameParts[0];
    }

    if (existingContact) {
      // Update existing contact
      const data = await hubspotRequest(`/crm/v3/objects/contacts/${existingContact.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
      });
      return data;
    } else {
      // Create new contact
      const data = await hubspotRequest('/crm/v3/objects/contacts', {
        method: 'POST',
        body: JSON.stringify({ properties }),
      });
      return data;
    }
  } catch (error) {
    console.error('Error creating/updating contact:', error);
    throw error;
  }
}

/**
 * Create or update a company in HubSpot
 */
async function createOrUpdateCompany(companyName, website = null) {
  if (!companyName) return null;

  try {
    const existingCompany = await findCompanyByName(companyName);

    const properties = {
      name: companyName,
      ...(website && { domain: website.replace(/^https?:\/\//, '').replace(/\/$/, '') }),
    };

    if (existingCompany) {
      // Update existing company
      const data = await hubspotRequest(`/crm/v3/objects/companies/${existingCompany.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
      });
      return data;
    } else {
      // Create new company
      const data = await hubspotRequest('/crm/v3/objects/companies', {
        method: 'POST',
        body: JSON.stringify({ properties }),
      });
      return data;
    }
  } catch (error) {
    console.error('Error creating/updating company:', error);
    return null;
  }
}

/**
 * Create a deal in HubSpot
 */
async function createDeal({ dealName, amount = null, stage = 'appointmentscheduled', contactId, companyId }) {
  try {
    const properties = {
      dealname: dealName,
      dealstage: stage,
      pipeline: 'default',
      ...(amount && { amount }),
    };

    const associations = [];

    // Associate with contact
    if (contactId) {
      associations.push({
        to: { id: contactId },
        types: [{
          associationCategory: 'HUBSPOT_DEFINED',
          associationTypeId: 3, // Deal to Contact
        }],
      });
    }

    // Associate with company
    if (companyId) {
      associations.push({
        to: { id: companyId },
        types: [{
          associationCategory: 'HUBSPOT_DEFINED',
          associationTypeId: 5, // Deal to Company
        }],
      });
    }

    const data = await hubspotRequest('/crm/v3/objects/deals', {
      method: 'POST',
      body: JSON.stringify({
        properties,
        associations,
      }),
    });

    return data;
  } catch (error) {
    console.error('Error creating deal:', error);
    return null;
  }
}

/**
 * Create a task in HubSpot
 */
async function createTask({ subject, notes, dueDate, priority = 'HIGH', contactId, companyId, dealId }) {
  try {
    // Set due date to 1 day from now if not provided
    const taskDueDate = dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const properties = {
      hs_task_subject: subject,
      hs_task_body: notes,
      hs_task_status: 'NOT_STARTED',
      hs_task_priority: priority,
      hs_timestamp: taskDueDate,
    };

    const associations = [];

    // Associate with contact
    if (contactId) {
      associations.push({
        to: { id: contactId },
        types: [{
          associationCategory: 'HUBSPOT_DEFINED',
          associationTypeId: 204, // Task to Contact
        }],
      });
    }

    // Associate with company
    if (companyId) {
      associations.push({
        to: { id: companyId },
        types: [{
          associationCategory: 'HUBSPOT_DEFINED',
          associationTypeId: 192, // Task to Company
        }],
      });
    }

    // Associate with deal
    if (dealId) {
      associations.push({
        to: { id: dealId },
        types: [{
          associationCategory: 'HUBSPOT_DEFINED',
          associationTypeId: 216, // Task to Deal
        }],
      });
    }

    const data = await hubspotRequest('/crm/v3/objects/tasks', {
      method: 'POST',
      body: JSON.stringify({
        properties,
        associations,
      }),
    });

    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
}

/**
 * Main function to handle contact form submission
 * Creates contact, company, deal, and follow-up task
 */
export async function handleContactFormSubmission(formData) {
  const { name, company, email, phone, website, message } = formData;

  try {
    if (!HUBSPOT_ACCESS_TOKEN) {
      console.warn('HubSpot integration skipped - no access token configured');
      return { success: false, message: 'HubSpot not configured' };
    }

    // 1. Create/update contact
    const contact = await createOrUpdateContact({
      name,
      email,
      phone,
      company,
      website,
      message,
    });

    console.log('HubSpot Contact created/updated:', contact.id);

    // 2. Create/update company if provided
    let companyRecord = null;
    if (company) {
      companyRecord = await createOrUpdateCompany(company, website);
      if (companyRecord) {
        console.log('HubSpot Company created/updated:', companyRecord.id);

        // Associate contact with company
        try {
          await hubspotRequest(`/crm/v3/objects/contacts/${contact.id}/associations/companies/${companyRecord.id}/1`, {
            method: 'PUT',
          });
        } catch (error) {
          console.error('Error associating contact with company:', error);
        }
      }
    }

    // 3. Create a deal
    const dealName = `Website Audit - ${company || name}`;
    const deal = await createDeal({
      dealName,
      stage: 'appointmentscheduled', // You can customize this based on your pipeline
      contactId: contact.id,
      companyId: companyRecord?.id,
    });

    if (deal) {
      console.log('HubSpot Deal created:', deal.id);
    }

    // 4. Create a follow-up task
    const task = await createTask({
      subject: `Follow up: Website Audit Request - ${company || name}`,
      notes: `New website audit request from ${name}${company ? ` at ${company}` : ''}\n\nBiggest Challenge: ${message || 'Not provided'}\n\nCurrent Website: ${website || 'Not provided'}\n\nPhone: ${phone}\nEmail: ${email}`,
      priority: 'HIGH',
      contactId: contact.id,
      companyId: companyRecord?.id,
      dealId: deal?.id,
    });

    if (task) {
      console.log('HubSpot Task created:', task.id);
    }

    return {
      success: true,
      contactId: contact.id,
      companyId: companyRecord?.id,
      dealId: deal?.id,
      taskId: task?.id,
    };
  } catch (error) {
    console.error('Error in HubSpot integration:', error);
    return { success: false, error: error.message };
  }
}
