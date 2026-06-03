import { Router } from "express";
import {
  adminGetNotificationConfig,
  adminGetSystemConfig,
  adminUpdateNotificationConfig,
  adminUpdateSystemConfig,
  publicSiteConfig
} from "../controllers/config.controller.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  updateNotificationConfigSchema,
  updateSystemConfigSchema
} from "../validators/config.validator.js";

export const publicConfigRouter = Router();
export const adminConfigRouter = Router();

publicConfigRouter.get("/config", publicSiteConfig);

adminConfigRouter.use(requireAdminAuth);
adminConfigRouter.get("/notifications", adminGetNotificationConfig);
adminConfigRouter.put(
  "/notifications",
  validateBody(updateNotificationConfigSchema),
  adminUpdateNotificationConfig
);
adminConfigRouter.get("/system", adminGetSystemConfig);
adminConfigRouter.put("/system", validateBody(updateSystemConfigSchema), adminUpdateSystemConfig);
