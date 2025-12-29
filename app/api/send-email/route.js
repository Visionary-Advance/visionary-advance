import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { handleContactFormSubmission } from '@/lib/hubspot'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, projectType, budget, timeline, message } = body

    const fullName = `${firstName} ${lastName}`.trim()

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'no-reply@mail.visionaryadvance.com', // Change this to your verified domain
      to: ['brandon@visionaryadvance.com'], // Change this to your email
      subject: `New Project Inquiry from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #008070; border-bottom: 2px solid #008070; padding-bottom: 10px;">New Project Inquiry</h2>

          <h3 style="color: #333; margin-top: 20px;">Contact Information</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>

          <h3 style="color: #333; margin-top: 20px;">Project Details</h3>
          <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
          <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>

          <h3 style="color: #333; margin-top: 20px;">Project Description</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    // Create HubSpot records (non-blocking - don't fail if HubSpot has issues)
    let hubspotResult = null
    try {
      const projectDetails = `Project Type: ${projectType || 'Not specified'}\nBudget: ${budget || 'Not specified'}\nTimeline: ${timeline || 'Not specified'}\n\n${message || ''}`

      hubspotResult = await handleContactFormSubmission({
        name: fullName,
        company,
        email,
        phone,
        website: null,
        message: projectDetails,
      })
      console.log('HubSpot integration result:', hubspotResult)
    } catch (hubspotError) {
      console.error('HubSpot integration failed (non-critical):', hubspotError)
    }

    return NextResponse.json({
      success: true,
      data,
      hubspot: hubspotResult,
    })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}