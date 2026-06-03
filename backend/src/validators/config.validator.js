import { z } from "zod";

export const updateNotificationConfigSchema = z.object({
  donationEmailEnabled: z.boolean().optional(),
  notificationEmail: z.email().optional().nullable(),
  thresholdEnabled: z.boolean().optional(),
  thresholdAmount: z.coerce.number().min(0).optional().nullable(),
  sendAllSuccessfulDonations: z.boolean().optional()
});

export const updateSystemConfigSchema = z.object({
  orgName: z.string().trim().optional(),
  defaultLanguage: z.string().trim().optional(),
  supportedLanguages: z.string().trim().optional(),
  commentsDefaultEnabled: z.boolean().optional(),
  receiptPrefix: z.string().trim().min(2).max(10).optional(),
  legal80GText: z.string().trim().optional().nullable(),
  legal80GNumber: z.string().trim().optional().nullable(),
  legal80GValidity: z.string().trim().optional().nullable(),
  termsPageContent: z.string().trim().optional().nullable(),
  privacyPageContent: z.string().trim().optional().nullable(),
  refundPolicyContent: z.string().trim().optional().nullable()
});
