import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, customerName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email template
    const emailContent = `
Subject: 🎉 Your 30 AI Prompts Are Ready for Download!

Dear ${customerName || 'Valued Customer'},

Thank you for purchasing our 30 Proven AI Prompts for Making Money Online!

Your payment has been processed successfully, and your AI prompts are now ready for download.

🔗 DOWNLOAD YOUR PROMPTS:
https://www.ventaroai.com/download

📋 WHAT YOU'LL GET:
✅ 30 battle-tested AI prompts
✅ Ready-to-use templates for ChatGPT, Claude & more
✅ Prompts for sales, marketing, content creation & freelancing
✅ Instant access - download immediately
✅ Lifetime access - re-download anytime

💡 HOW TO USE:
1. Visit the download link above
2. Click "Download PDF (30 Prompts)"
3. Open the PDF and choose your prompt
4. Copy & paste into your favorite AI tool
5. Customize with your details
6. Start making money with AI!

🆘 NEED HELP?
If you have any questions or need support:
📧 Email: chris.t@ventaroai.com
⏰ Response time: Within 24 hours

💰 START EARNING:
These prompts are designed to help you:
• Generate high-converting sales content
• Create viral social media posts
• Write winning freelance proposals
• Build profitable business strategies
• And much more!

🔖 BOOKMARK THIS:
Save this email and bookmark your download page for easy access anytime.

Thank you for choosing Ventaro AI - Australia's premium AI solutions provider!

Best regards,
The Ventaro AI Team

---
Ventaro AI
Australian-Made AI Solutions
Website: https://www.ventaroai.com
Support: chris.t@ventaroai.com

© 2024 Ventaro AI. All rights reserved.
    `;

    // In a real implementation, you would use a service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // For now, we'll return the email content that can be sent manually
    
    console.log('Email to send:', emailContent);
    
    // Simulate email sending
    return NextResponse.json({
      success: true,
      message: 'Download email prepared successfully',
      emailContent: emailContent,
      recipient: email
    });

  } catch (error) {
    console.error('Error preparing email:', error);
    return NextResponse.json(
      { error: 'Failed to prepare email' },
      { status: 500 }
    );
  }
}