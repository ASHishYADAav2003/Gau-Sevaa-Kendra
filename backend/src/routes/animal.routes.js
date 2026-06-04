import { Router } from "express";
import {
  adminCreateAnimal,
  adminCreateMedicalRecord,
  adminDeleteAnimal,
  adminExportAnimals,
  adminGetAnimal,
  adminGetAnimals,
  adminUpdateAnimal,
  adminUploadAnimalImages,
  getAnimal,
  getPublicAnimals
} from "../controllers/animal.controller.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { animalImageUpload } from "../middleware/upload.js";
import {
  createAnimalSchema,
  createMedicalRecordSchema,
  updateAnimalSchema
} from "../validators/animal.validator.js";

export const animalRouter = Router();
export const adminAnimalRouter = Router();

animalRouter.get("/", getPublicAnimals);
animalRouter.get("/:id", getAnimal);

adminAnimalRouter.use(requireAdminAuth);
adminAnimalRouter.post("/", validateBody(createAnimalSchema), adminCreateAnimal);
adminAnimalRouter.get("/", adminGetAnimals);
adminAnimalRouter.get("/export", adminExportAnimals);
adminAnimalRouter.get("/:id", adminGetAnimal);
adminAnimalRouter.put("/:id", validateBody(updateAnimalSchema), adminUpdateAnimal);
adminAnimalRouter.delete("/:id", adminDeleteAnimal);
adminAnimalRouter.post(
  "/:id/images",
  animalImageUpload.array("images", 5),
  adminUploadAnimalImages
);
adminAnimalRouter.post(
  "/:id/medical-records",
  validateBody(createMedicalRecordSchema),
  adminCreateMedicalRecord
);
