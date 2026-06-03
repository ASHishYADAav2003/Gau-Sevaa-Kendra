import { Router } from "express";
import { webhook } from "../controllers/donation.controller.js";

export const webhookRouter = Router();

webhookRouter.post("/", webhook);
