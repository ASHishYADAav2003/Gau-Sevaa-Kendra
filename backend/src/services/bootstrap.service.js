import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { hashPassword } from "../utils/auth.js";

export const ensureBootstrapData = async () => {
  const adminCount = await prisma.adminUser.count();

  if (adminCount === 0) {
    await prisma.adminUser.create({
      data: {
        username: env.adminUsername,
        passwordHash: await hashPassword(env.adminPassword)
      }
    });
  }

  const notificationConfigCount = await prisma.notificationConfig.count();
  if (notificationConfigCount === 0) {
    await prisma.notificationConfig.create({
      data: {
        notificationEmail: env.smtpFromEmail || null
      }
    });
  }

  const systemConfigCount = await prisma.systemConfig.count();
  if (systemConfigCount === 0) {
    await prisma.systemConfig.create({
      data: {
        orgName: "Ganpati Gauseva",
        supportedLanguages: "en,hi",
        receiptPrefix: "GGS"
      }
    });
  }
};
