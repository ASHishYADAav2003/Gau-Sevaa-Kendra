import { z } from "zod";

export const createAnimalSchema = z.object({
  tagId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  ageMonths: z.coerce.number().int().min(0).optional().nullable(),
  gender: z.string().trim().optional().nullable(),
  breed: z.string().trim().optional().nullable(),
  healthStatus: z.string().trim().optional().nullable(),
  rescueDate: z.string().datetime().optional().nullable(),
  shedLocation: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  status: z.enum(["ACTIVE", "ADOPTED", "DECEASED", "UNDER_TREATMENT"]).optional()
});

export const updateAnimalSchema = createAnimalSchema.partial();

export const createMedicalRecordSchema = z.object({
  recordDate: z.string().datetime(),
  diagnosis: z.string().trim().optional().nullable(),
  treatment: z.string().trim().optional().nullable(),
  vetName: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  attachmentUrl: z.string().trim().optional().nullable()
});
