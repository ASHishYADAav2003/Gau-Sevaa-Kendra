import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { authRateLimit } from "../middleware/rate-limit.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post("/login", authRateLimit, validateBody(loginSchema), login);
authRouter.post("/logout", requireAdminAuth, logout);
authRouter.get("/me", requireAdminAuth, me);
