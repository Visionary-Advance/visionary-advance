// app/api/leads/route.js
// API route for handling lead form submissions from systems pages

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    const body = await request.json()

    // Check for Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly at info@visionaryadvance.com' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Validate required fields
    const { name, email } = body
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send notification email via Resend (this is the primary action)
    try {
      await resend.emails.send({
        from: 'no-reply@mail.visionaryadvance.com',
        to: ['brandon@visionaryadvance.com'],
        subject: `New Systems Lead: ${body.name} (${body.business_type || 'Not specified'})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #008070; border-bottom: 2px solid #008070; padding-bottom: 10px;">New Systems Lead</h2>

            <h3 style="color: #333; margin-top: 20px;">Contact Information</h3>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
            <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
            <p><strong>Business Type:</strong> ${body.business_type || 'Not specified'}</p>

            <h3 style="color: #333; margin-top: 20px;">Project Details</h3>
            <p><strong>Current Tools:</strong> ${body.current_tools || 'Not provided'}</p>
            <p><strong>Biggest Bottleneck:</strong></p>
            <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${body.biggest_bottleneck || 'Not provided'}</p>
            <p><strong>Desired Outcome:</strong></p>
            <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${body.desired_outcome || 'Not provided'}</p>

            <p style="color: #666; margin-top: 20px; font-size: 12px;">
              <strong>Source Page:</strong> ${body.page_path || 'Unknown'}
            </p>
          </div>
        `,
      })
      console.log('Lead notification email sent successfully')
    } catch (emailError) {
      console.error('Failed to send lead notification email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send notification. Please try again or contact us directly.' },
        { status: 500 }
      )
    }

    // Optional: Save to Supabase if configured (non-blocking)
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { supabase } = await import('@/lib/supabase')

        const leadData = {
          name: body.name,
          email: body.email,
          phone: body.phone || null,
          business_type: body.business_type || null,
          current_tools: body.current_tools || null,
          biggest_bottleneck: body.biggest_bottleneck || null,
          desired_outcome: body.desired_outcome || null,
          page_path: body.page_path || null,
        }

        const { error } = await supabase
          .from('leads')
          .insert([leadData])

        if (error) {
          console.error('Supabase insert error (non-critical):', error)
        } else {
          console.log('Lead saved to Supabase successfully')
        }
      }
    } catch (dbError) {
      // Don't fail the request if DB save fails - email was already sent
      console.error('Supabase save failed (non-critical):', dbError)
    }

    return NextResponse.json(
      { success: true, message: 'Lead submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
