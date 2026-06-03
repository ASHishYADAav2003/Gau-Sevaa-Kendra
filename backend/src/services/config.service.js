import { prisma } from "../lib/prisma.js";
import { toPaise } from "../utils/money.js";

export const getNotificationConfig = async () => prisma.notificationConfig.findFirst();

export const updateNotificationConfig = async (payload) => {
  const config = await prisma.notificationConfig.findFirst();

  return prisma.notificationConfig.update({
    where: { id: config.id },
    data: {
      donationEmailEnabled: payload.donationEmailEnabled,
      notificationEmail: payload.notificationEmail,
      thresholdEnabled: payload.thresholdEnabled,
      thresholdAmountPaise:
        payload.thresholdAmount !== undefined && payload.thresholdAmount !== null
          ? toPaise(payload.thresholdAmount)
          : undefined,
      sendAllSuccessfulDonations: payload.sendAllSuccessfulDonations
    }
  });
};

export const getSystemConfig = async () => prisma.systemConfig.findFirst();

export const updateSystemConfig = async (payload) => {
  const config = await prisma.systemConfig.findFirst();

  return prisma.systemConfig.update({
    where: { id: config.id },
    data: payload
  });
};

export const getPublicSiteConfig = async () => {
  const config = await prisma.systemConfig.findFirst();

  return {
    orgName: config.orgName,
    defaultLanguage: config.defaultLanguage,
    supportedLanguages: config.supportedLanguages.split(","),
    commentsDefaultEnabled: config.commentsDefaultEnabled,
    legalPages: {
      terms: config.termsPageContent,
      privacy: config.privacyPageContent,
      refundPolicy: config.refundPolicyContent
    }
  };
};
