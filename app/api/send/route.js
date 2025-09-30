import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, website, message } = body;

    const data = await resend.emails.send({
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

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}