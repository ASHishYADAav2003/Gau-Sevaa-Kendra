import { Router } from "express";
import { downloadReceipt } from "../controllers/donation.controller.js";

export const receiptRouter = Router();

receiptRouter.get("/:receiptNumber/download", downloadReceipt);
