import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

const isMailConfigured = () =>
  Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.smtpFromEmail);

export const getMailer = () => {
  if (!isMailConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass
      }
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  const mailer = getMailer();

  if (!mailer) {
    console.warn(`Mailer not configured. Skipping email to ${to}`);
    return { skipped: true };
  }

  return mailer.sendMail({
    from: `"${env.smtpFromName}" <${env.smtpFromEmail}>`,
    to,
    subject,
    text,
    html,
    attachments
  });
};
