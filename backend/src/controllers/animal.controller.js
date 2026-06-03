import { asyncHandler } from "../utils/async-handler.js";
import {
  createAnimal,
  createMedicalRecord,
  exportAnimals,
  getAnimalById,
  listAdminAnimals,
  listPublicAnimals,
  updateAnimal,
  uploadAnimalImages
} from "../services/animal.service.js";

export const getPublicAnimals = asyncHandler(async (req, res) => {
  const result = await listPublicAnimals(req.query);
  res.status(200).json(result);
});

export const getAnimal = asyncHandler(async (req, res) => {
  const result = await getAnimalById(req.params.id);
  res.status(200).json(result);
});

export const adminCreateAnimal = asyncHandler(async (req, res) => {
  const result = await createAnimal(req.validatedBody);
  res.status(201).json(result);
});

export const adminGetAnimals = asyncHandler(async (req, res) => {
  const result = await listAdminAnimals(req.query);
  res.status(200).json(result);
});

export const adminGetAnimal = asyncHandler(async (req, res) => {
  const result = await getAnimalById(req.params.id);
  res.status(200).json(result);
});

export const adminUpdateAnimal = asyncHandler(async (req, res) => {
  const result = await updateAnimal(req.params.id, req.validatedBody);
  res.status(200).json(result);
});

export const adminUploadAnimalImages = asyncHandler(async (req, res) => {
  const result = await uploadAnimalImages(req.params.id, req.files || []);
  res.status(201).json(result);
});

export const adminCreateMedicalRecord = asyncHandler(async (req, res) => {
  const result = await createMedicalRecord(req.params.id, req.validatedBody);
  res.status(201).json(result);
});

export const adminExportAnimals = asyncHandler(async (req, res) => {
  const buffer = await exportAnimals(req.query);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="animals-${Date.now()}.xlsx"`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.status(200).send(buffer);
});
