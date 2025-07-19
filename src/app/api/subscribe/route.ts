import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email template for admin notification
    const adminEmailContent = `
Subject: New Subscription to Ventaro AI Newsletter

Hello,

A new user has subscribed to the Ventaro AI newsletter:

Email: ${email}
Date: ${new Date().toLocaleString()}

This user is interested in receiving updates about AI tools, prompts, and business strategies.

Best regards,
Ventaro AI System
    `;

    // In a real implementation, you would use a service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // to send an email to the admin (chris.t@ventarosales.com)
    // and a confirmation email to the subscriber
    
    console.log('Admin notification email:', adminEmailContent);
    console.log('Would send to: chris.t@ventarosales.com');
    
    // Simulate email sending
    return NextResponse.json({
      success: true,
      message: 'Subscription successful',
      adminNotificationSent: true,
      subscriberEmail: email
    });

  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}