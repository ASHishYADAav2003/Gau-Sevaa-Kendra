import dotenv from "dotenv";

dotenv.config();

const parseOrigins = (origins) =>
  origins
    ? origins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  appUrl: process.env.APP_URL || "http://localhost:4000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  cookieName: process.env.COOKIE_NAME || "gg_admin_session",
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS || 12),
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "change-me",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 465),
  smtpSecure: String(process.env.SMTP_SECURE || "true") === "true",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFromEmail: process.env.SMTP_FROM_EMAIL || "",
  smtpFromName: process.env.SMTP_FROM_NAME || "Ganpati Gauseva",
  uploadBaseUrl: process.env.UPLOAD_BASE_URL || "http://localhost:4000",
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS)
};

export const isProduction = env.nodeEnv === "production";
