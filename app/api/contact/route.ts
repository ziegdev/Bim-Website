import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  const response = await fetch(verifyUrl, {
    method: 'POST',
  });
  const data = await response.json();
  return data.success;
}

export async function POST(request: Request) {
  const { name, email, message, recaptcha } =
    await request.json();
  const isHuman = await verifyRecaptcha(recaptcha);
  if (!isHuman) {
    return NextResponse.json(
      { error: 'reCAPTCHA verification failed' },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 587,
    secure: false,
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASSWORD,
    },
  });

  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          h1 {
            color: #D10062;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: bold;
          }
          .value {
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Contact Form Submission</h1>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${message}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: 'Contact Form',
    to: process.env.CONTACT_EMAIL_USER,
    subject: `New Contact Form Submission from ${name}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return NextResponse.json(
      {
        message: 'Email sent successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error sending email', error);
    return NextResponse.json(
      {
        error: 'Error sending email',
      },
      { status: 500 },
    );
  }
}
