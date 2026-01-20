# HubSpot Integration Setup Guide

This guide will help you set up the HubSpot CRM integration for your contact forms.

## What Gets Created in HubSpot

When someone submits a contact form on your website, the integration automatically creates:

1. **Contact** - The person who submitted the form
   - Email, phone, name
   - Notes about their inquiry

2. **Company** - Their construction company (if provided)
   - Company name
   - Website domain

3. **Deal** - A sales opportunity
   - Deal name: "Website Audit - [Company/Name]"
   - Stage: Appointment Scheduled
   - Associated with contact and company

4. **Task** - A high-priority follow-up task
   - Subject: "Follow up: Website Audit Request"
   - Due: 24 hours from submission
   - Includes all form details
   - Associated with contact, company, and deal

## Setup Instructions

### Step 1: Create a Private App in HubSpot

1. Log in to your HubSpot account
2. Click the **Settings** icon (⚙️) in the top navigation
3. In the left sidebar, navigate to **Integrations** → **Private Apps**
4. Click **Create a private app**
5. Give it a name like "Visionary Advance Website Integration"
6. Add a description: "Integration for website contact forms"

### Step 2: Set the Required Scopes

In the **Scopes** tab, enable the following permissions:

**CRM Scopes:**
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.companies.read`
- `crm.objects.companies.write`
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `crm.schemas.contacts.read`
- `crm.schemas.companies.read`
- `crm.schemas.deals.read`

**Additional Scopes:**
- `crm.objects.owners.read` (for task assignment)

### Step 3: Create and Copy the Access Token

1. Click **Create app**
2. Review the permissions and click **Continue creating**
3. You'll see an **Access Token** - this is your `HUBSPOT_ACCESS_TOKEN`
4. **IMPORTANT**: Copy this token immediately - you won't be able to see it again!
5. Store it securely

### Step 4: Add to Environment Variables

Add the access token to your `.env.local` file (or your hosting platform's environment variables):

```
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 5: Deploy and Test

1. Deploy your application with the new environment variable
2. Submit a test contact form
3. Check your HubSpot CRM to verify:
   - A new contact was created
   - A company was created (if you provided one)
   - A deal was created
   - A follow-up task was created

## Customization Options

### Change the Deal Stage

By default, deals are created in the "Appointment Scheduled" stage. To change this:

1. Open `lib/hubspot.js`
2. Find the `createDeal` function call in `handleContactFormSubmission`
3. Change the `stage` parameter to match your HubSpot pipeline stage

Example:
```javascript
const deal = await createDeal({
  dealName,
  stage: 'qualifiedtobuy', // Change this to your desired stage
  contactId: contact.id,
  companyId: companyRecord?.id,
});
```

### Change Task Priority or Due Date

To adjust task settings:

1. Open `lib/hubspot.js`
2. Find the `createTask` function call
3. Modify the `priority` or `dueDate` parameters

Example:
```javascript
const task = await createTask({
  subject: `Follow up: Website Audit Request - ${company || name}`,
  notes: `...`,
  priority: 'MEDIUM', // HIGH, MEDIUM, or LOW
  // dueDate: custom ISO date string
  contactId: contact.id,
  companyId: companyRecord?.id,
  dealId: deal?.id,
});
```

## Troubleshooting

### Integration Not Working

1. **Check the logs**: Look at your deployment logs for HubSpot-related errors
2. **Verify token**: Make sure `HUBSPOT_ACCESS_TOKEN` is set correctly
3. **Check scopes**: Ensure all required scopes are enabled in your private app
4. **Test manually**: Try making a curl request to HubSpot API with your token

### Duplicate Contacts

The integration automatically searches for existing contacts by email before creating new ones. If you're seeing duplicates:

1. Check that emails are being passed correctly
2. Verify the search is working in `findContactByEmail` function

### Tasks Not Showing Up

Tasks require proper association type IDs. If tasks aren't appearing:

1. Verify you have the `crm.objects.owners.read` scope
2. Check that association type IDs are correct (204 for Contact, 192 for Company, 216 for Deal)

## Non-Blocking Behavior

The HubSpot integration is **non-blocking**, meaning:

- If HubSpot is down, the contact form will still work
- Email notifications will still be sent
- Users will still see a success message
- HubSpot errors are logged but don't affect the user experience

This ensures your website remains functional even if HubSpot has issues.

## Security Notes

- Never commit your `HUBSPOT_ACCESS_TOKEN` to version control
- Keep your `.env.local` file in `.gitignore`
- Rotate your access token periodically
- Use environment variables on your hosting platform (Vercel, etc.)
- Monitor your HubSpot API usage in the private app settings

## Support

For HubSpot API documentation, visit:
- [HubSpot Private Apps Guide](https://developers.hubspot.com/docs/api/private-apps)
- [CRM API Documentation](https://developers.hubspot.com/docs/api/crm/understanding-the-crm)
- [Associations API](https://developers.hubspot.com/docs/api/crm/associations)
