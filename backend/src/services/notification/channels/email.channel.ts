import nodemailer from 'nodemailer';
import { env } from '@config/env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
});

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = ({ to, subject, html }: EmailOptions) =>
  transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

export const sendConfirmationEmail = (email: string, fullName: string) =>
  sendEmail({
    to: email,
    subject: 'Registration Confirmed',
    html: `
      <h1>Welcome, ${fullName}!</h1>
      <p>Your registration has been received successfully.</p>
      <p>Thank you for registering with us.</p>
    `.trim(),
  });
