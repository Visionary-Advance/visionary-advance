import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { handleContactFormSubmission } from '@/lib/hubspot';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, website, message } = body;

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

    // Create HubSpot records (non-blocking - don't fail if HubSpot has issues)
    let hubspotResult = null;
    try {
      hubspotResult = await handleContactFormSubmission({
        name,
        company,
        email,
        phone,
        website,
        message,
      });
      console.log('HubSpot integration result:', hubspotResult);
    } catch (hubspotError) {
      console.error('HubSpot integration failed (non-critical):', hubspotError);
    }

    return NextResponse.json({
      success: true,
      data: emailData,
      hubspot: hubspotResult,
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}