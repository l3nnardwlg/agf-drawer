import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

let transporter: nodemailer.Transporter | null = null;

if (config.SMTP_HOST && config.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
}

export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  if (!transporter) {
    if (config.NODE_ENV !== 'test') {
      console.log(`[Email Simulation] To: ${to} | Subject: ${subject}\nBody: ${text}`);
    }
    return true;
  }

  try {
    await transporter.sendMail({
      from: config.SMTP_FROM,
      to,
      subject,
      text,
      html: html ?? `<p>${text.replace(/\n/g, '<br>')}</p>`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email via SMTP:', error);
    return false;
  }
}
