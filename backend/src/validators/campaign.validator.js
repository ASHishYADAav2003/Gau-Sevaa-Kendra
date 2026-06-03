import { z } from "zod";

export const createCampaignSchema = z.object({
  animalId: z.string().trim().optional().nullable(),
  titleEn: z.string().trim().min(1),
  titleHi: z.string().trim().optional().nullable(),
  shortSummaryEn: z.string().trim().min(1),
  shortSummaryHi: z.string().trim().optional().nullable(),
  fullStoryEn: z.string().trim().optional().nullable(),
  fullStoryHi: z.string().trim().optional().nullable(),
  targetAmount: z.coerce.number().min(1),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED", "ARCHIVED"]).optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  commentsEnabled: z.boolean().optional(),
  autoCloseOnGoal: z.boolean().optional()
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const updateCampaignStatusSchema = z.object({
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED", "ARCHIVED"])
});

export const createCampaignUpdateSchema = z.object({
  titleEn: z.string().trim().min(1),
  titleHi: z.string().trim().optional().nullable(),
  bodyEn: z.string().trim().min(1),
  bodyHi: z.string().trim().optional().nullable(),
  imageUrl: z.string().trim().optional().nullable()
});

export const createCampaignCommentSchema = z.object({
  donorName: z.string().trim().min(1),
  donorPhone: z.string().trim().optional().nullable(),
  donorEmail: z.email().optional().nullable(),
  commentText: z.string().trim().min(1).max(1000)
});

export const moderateCampaignCommentSchema = z.object({
  isApproved: z.boolean().optional(),
  isHidden: z.boolean().optional()
});
