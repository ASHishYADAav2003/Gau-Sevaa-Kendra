import { Router } from "express";
import {
  createOrder,
  exportDonationReport,
  getDonation,
  listDonations,
  publicStatus,
  verifyDonation
} from "../controllers/donation.controller.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  createDonationOrderSchema,
  verifyDonationSchema
} from "../validators/donation.validator.js";

export const donationRouter = Router();
export const adminDonationRouter = Router();

donationRouter.post("/create-order", validateBody(createDonationOrderSchema), createOrder);
donationRouter.post("/verify", validateBody(verifyDonationSchema), verifyDonation);
donationRouter.get("/:id/public-status", publicStatus);

adminDonationRouter.use(requireAdminAuth);
adminDonationRouter.get("/", listDonations);
adminDonationRouter.get("/export", exportDonationReport);
adminDonationRouter.get("/:id", getDonation);
