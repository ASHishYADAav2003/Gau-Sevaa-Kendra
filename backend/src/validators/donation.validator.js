import { z } from "zod";

export const createDonationOrderSchema = z
  .object({
    donationType: z.enum(["GENERAL", "CAMPAIGN"]),
    campaignId: z.string().trim().optional().nullable(),
    amount: z.coerce.number().min(1),
    currency: z.string().default("INR"),
    donor: z.object({
      fullName: z.string().trim().min(1),
      phone: z.string().trim().optional().nullable(),
      email: z.email().optional().nullable(),
      isAnonymousPublic: z.boolean().default(false)
    }),
    taxReceiptRequested: z.boolean().default(false)
  })
  .superRefine((data, ctx) => {
    if (data.donationType === "CAMPAIGN" && !data.campaignId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "campaignId is required for campaign donations",
        path: ["campaignId"]
      });
    }

    if (data.taxReceiptRequested && !data.donor.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required when tax receipt is requested",
        path: ["donor", "email"]
      });
    }
  });

export const verifyDonationSchema = z.object({
  donationId: z.string().trim().min(1),
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  razorpaySignature: z.string().trim().min(1)
});
