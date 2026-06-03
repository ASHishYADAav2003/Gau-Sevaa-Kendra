import { env } from "../config/env.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  getSessionCookieOptions,
  loginAdmin,
  logoutAdmin
} from "../services/auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const result = await loginAdmin({
    ...req.validatedBody,
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  });

  res.cookie(env.cookieName, result.token, getSessionCookieOptions());
  res.status(200).json({
    message: "Login successful",
    admin: result.admin
  });
});

export const logout = asyncHandler(async (req, res) => {
  await logoutAdmin({
    sessionId: req.session.id,
    adminId: req.adminUser.id
  });

  res.clearCookie(env.cookieName, getSessionCookieOptions());
  res.status(200).json({ message: "Logout successful" });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    admin: {
      id: req.adminUser.id,
      username: req.adminUser.username,
      lastLoginAt: req.adminUser.lastLoginAt
    }
  });
});
