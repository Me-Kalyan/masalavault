# Email Setup Instructions

The contact form is ready to send emails to `helpmasalavault@gmail.com`. To enable actual email sending, you need to configure one of the following email services:

## Option 1: Resend (Recommended - Easiest)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Uncomment the Resend code block in `app/api/contact/route.ts`
5. Install Resend: `npm install resend`
6. Update the `from` email with your verified domain

## Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@masalavault.com
   ```
4. Uncomment the SendGrid code block in `app/api/contact/route.ts`
5. Install SendGrid: `npm install @sendgrid/mail`

## Option 3: Nodemailer (SMTP)

1. Get SMTP credentials from your email provider (Gmail, Outlook, etc.)
2. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   ```
3. Uncomment the Nodemailer code block in `app/api/contact/route.ts`
4. Install Nodemailer: `npm install nodemailer`

## Current Status

Currently, the contact form logs submissions to the console. The form will work and show success messages, but emails won't be sent until you configure one of the services above.

For Gmail specifically, you'll need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use that app password in SMTP_PASS

