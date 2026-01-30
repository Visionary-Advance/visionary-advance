import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createOrUpdateLead } from '@/lib/crm';
import { getUTMFromRequest } from '@/lib/utm';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, website, message } = body;
    const utmParams = getUTMFromRequest(request);

    // Check for Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly.' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email notification
    const emailData = await resend.emails.send({
      from: 'no-reply@mail.visionaryadvance.com', // Change this to your verified domain
      to: ['brandon@visionaryadvance.com'], // Change this to your email
      subject: `New Construction Lead (${company})`,
      html: `
        <h2>New Website Audit Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Current Website:</strong> ${website || 'Not provided'}</p>
        <p><strong>Biggest Challenge:</strong></p>
        <p>${message || 'Not provided'}</p>
      `,
    });

    // Create/update CRM lead (non-blocking - handles HubSpot sync internally)
    let crmResult = null;
    try {
      // Split name into first and last
      const nameParts = name ? name.trim().split(' ') : [];
      const firstName = nameParts[0] || null;
      const lastName = nameParts.slice(1).join(' ') || null;

      crmResult = await createOrUpdateLead({
        email,
        first_name: firstName,
        last_name: lastName,
        full_name: name,
        phone,
        company,
        website,
        source: 'contact_form',
        conversion_page: body.conversion_page || '/construction-websites',
        utm_source: body.utm_source || utmParams.utm_source,
        utm_medium: body.utm_medium || utmParams.utm_medium,
        utm_campaign: body.utm_campaign || utmParams.utm_campaign,
        utm_term: body.utm_term || utmParams.utm_term,
        utm_content: body.utm_content || utmParams.utm_content,
        referrer: body.referrer || utmParams.referrer,
        form_data: {
          message,
          challenge: message,
        },
        business_type: 'construction',
      });
      console.log('CRM lead result:', crmResult.isNew ? 'New lead created' : 'Lead updated');
    } catch (crmError) {
      console.error('CRM integration failed (non-critical):', crmError);
    }

    return NextResponse.json({
      success: true,
      data: emailData,
      lead: crmResult?.lead?.id,
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}