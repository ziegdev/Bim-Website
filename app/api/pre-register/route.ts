import { NextResponse } from 'next/server';
import { google, drive_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Readable } from 'stream';
import nodemailer from 'nodemailer';

async function getGoogleDriveClient() {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(
      /\\n/g,
      '\n',
    ),
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

async function appendToDriveCsv(
  fileId: string,
  data: string,
) {
  const drive = await getGoogleDriveClient();

  const response = await drive.files.get({
    fileId: fileId,
    fields: 'id, name, mimeType',
  });

  if (response.data.mimeType !== 'text/csv') {
    throw new Error('The specified file is not a CSV file');
  }

  const currentContent = await drive.files.get(
    { fileId: fileId, alt: 'media' },
    { responseType: 'stream' },
  );

  const currentContentString = await new Promise<string>(
    (resolve, reject) => {
      let content = '';
      (currentContent.data as Readable).on(
        'data',
        (chunk) => (content += chunk),
      );
      (currentContent.data as Readable).on('end', () =>
        resolve(content),
      );
      (currentContent.data as Readable).on('error', reject);
    },
  );

  const newContent = currentContentString + data;

  await drive.files.update({
    fileId: fileId,
    media: {
      mimeType: 'text/csv',
      body: Readable.from([newContent]),
    },
  });
}

async function sendEmail(
  name: string,
  email: string,
  phone: string,
  dob: string,
) {
  const transporter = nodemailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 587,
    secure: false,
    auth: {
      user: process.env.PRE_REGISTER_EMAIL_USER,
      pass: process.env.PRE_REGISTER_EMAIL_PASSWORD,
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
          <h1>New Pre-Registration Submission</h1>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${phone}</div>
          </div>
          <div class="field">
            <div class="label">Date of Birth:</div>
            <div class="value">${dob}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from:
      'Pre-Registration Form <' +
      process.env.PRE_REGISTER_EMAIL_USER +
      '>',
    to: process.env.PRE_REGISTER_EMAIL_USER,
    subject: `New Pre-Registration Submission from ${name}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: Request) {
  const { name, email, phone, dob, TOC } =
    await request.json();

  if (!TOC) {
    return NextResponse.json(
      { error: 'You must accept the terms and conditions' },
      { status: 400 },
    );
  }

  const csvData = `${name},${email},${phone},${dob},${new Date().toISOString()}\n`;

  try {
    await Promise.all([
      appendToDriveCsv(
        process.env.GOOGLE_DRIVE_FILE_ID!,
        csvData,
      ),
      sendEmail(name, email, phone, dob),
    ]);

    console.log(
      'Data appended to Google Drive CSV and email sent successfully',
    );
    return NextResponse.json(
      {
        message: 'Pre-registration submitted successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      'Error processing pre-registration',
      error,
    );
    return NextResponse.json(
      { error: 'Error submitting pre-registration' },
      { status: 500 },
    );
  }
}
