import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createOrUpdateLead } from '@/lib/crm'
import { getUTMFromRequest } from '@/lib/utm'
import { requireRecaptcha } from '@/lib/recaptcha'

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, projectType, budget, timeline, message } = body
    const utmParams = getUTMFromRequest(request)

    // Verify reCAPTCHA
    const recaptchaError = await requireRecaptcha(body, 'contact_form')
    if (recaptchaError) {
      return NextResponse.json(
        { error: recaptchaError.error },
        { status: recaptchaError.status }
      )
    }

    // Check for Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly at info@visionaryadvance.com' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Create/update CRM lead (non-blocking - handles HubSpot sync internally)
    let crmResult = null
    try {
      crmResult = await createOrUpdateLead({
        email,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        phone,
        company,
        source: 'contact_form',
        conversion_page: body.conversion_page || '/contact',
        utm_source: body.utm_source || utmParams.utm_source,
        utm_medium: body.utm_medium || utmParams.utm_medium,
        utm_campaign: body.utm_campaign || utmParams.utm_campaign,
        utm_term: body.utm_term || utmParams.utm_term,
        utm_content: body.utm_content || utmParams.utm_content,
        referrer: body.referrer || utmParams.referrer,
        form_data: {
          projectType,
          message,
        },
        project_type: projectType,
        budget_range: budget,
        timeline,
      })
      console.log('CRM lead result:', crmResult.isNew ? 'New lead created' : 'Lead updated')
    } catch (crmError) {
      console.error('CRM integration failed (non-critical):', crmError)
    }

    return NextResponse.json({
      success: true,
      data,
      lead: crmResult?.lead?.id,
    })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}