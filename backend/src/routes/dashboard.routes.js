import { Router } from "express";
import { adminDashboard } from "../controllers/dashboard.controller.js";
import { requireAdminAuth } from "../middleware/auth.js";

export const adminDashboardRouter = Router();

adminDashboardRouter.use(requireAdminAuth);
adminDashboardRouter.get("/", adminDashboard);
