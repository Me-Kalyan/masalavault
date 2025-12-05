import { NextRequest, NextResponse } from 'next/server';

const RECIPIENT_EMAIL = 'helpmasalavault@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Email content
    const emailSubject = `Contact Form: ${subject}`;
    const emailBody = `
New Contact Form Submission from MasalaVault

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the MasalaVault contact form.
Reply directly to this email to respond to ${name} at ${email}
    `.trim();

    const emailHtml = `
      <h2>New Contact Form Submission from MasalaVault</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="color: #6b7280; font-size: 12px;">
        This message was sent from the MasalaVault contact form.<br>
        Reply directly to this email to respond to ${name} at ${email}
      </p>
    `;

    // Option 1: Use Resend (Recommended - requires RESEND_API_KEY in .env)
    // Uncomment and install: npm install resend
    /*
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'MasalaVault <onboarding@resend.dev>', // Update with your verified domain
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject: emailSubject,
        html: emailHtml,
        text: emailBody,
      });
      
      return NextResponse.json(
        { message: 'Message sent successfully' },
        { status: 200 }
      );
    }
    */

    // Option 2: Use SendGrid (requires SENDGRID_API_KEY in .env)
    // Uncomment and install: npm install @sendgrid/mail
    /*
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = await import('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      await sgMail.send({
        to: RECIPIENT_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@masalavault.com',
        replyTo: email,
        subject: emailSubject,
        text: emailBody,
        html: emailHtml,
      });
      
      return NextResponse.json(
        { message: 'Message sent successfully' },
        { status: 200 }
      );
    }
    */

    // Option 3: Use Nodemailer with SMTP (requires SMTP config in .env)
    // Uncomment and install: npm install nodemailer
    /*
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject: emailSubject,
        text: emailBody,
        html: emailHtml,
      });
      
      return NextResponse.json(
        { message: 'Message sent successfully' },
        { status: 200 }
      );
    }
    */

    // Fallback: Log and return success (for development/testing)
    // In production, you should set up one of the email services above
    console.log('='.repeat(50));
    console.log('CONTACT FORM SUBMISSION');
    console.log('='.repeat(50));
    console.log(`To: ${RECIPIENT_EMAIL}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Subject: ${emailSubject}`);
    console.log('\nMessage:');
    console.log(message);
    console.log('='.repeat(50));

    // For now, return success but log that email service needs to be configured
    return NextResponse.json(
      { 
        message: 'Message received. Email service needs to be configured.',
        // Include mailto link as fallback
        mailto: `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
