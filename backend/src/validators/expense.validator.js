import { z } from "zod";

export const createExpenseSchema = z.object({
  expenseDate: z.string().datetime(),
  amount: z.coerce.number().min(0.01),
  category: z.enum([
    "FODDER",
    "MEDICINE",
    "STAFF",
    "TRANSPORT",
    "MAINTENANCE",
    "UTILITIES",
    "INFRASTRUCTURE",
    "OTHER"
  ]),
  vendorName: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  attachmentUrl: z.string().trim().optional().nullable(),
  animalId: z.string().trim().optional().nullable(),
  campaignId: z.string().trim().optional().nullable()
});

export const updateExpenseSchema = createExpenseSchema.partial();
