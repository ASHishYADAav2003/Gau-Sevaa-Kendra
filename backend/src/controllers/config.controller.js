import { asyncHandler } from "../utils/async-handler.js";
import {
  getNotificationConfig,
  getPublicSiteConfig,
  getSystemConfig,
  updateNotificationConfig,
  updateSystemConfig
} from "../services/config.service.js";

export const publicSiteConfig = asyncHandler(async (req, res) => {
  const result = await getPublicSiteConfig();
  res.status(200).json(result);
});

export const adminGetNotificationConfig = asyncHandler(async (req, res) => {
  const result = await getNotificationConfig();
  res.status(200).json(result);
});

export const adminUpdateNotificationConfig = asyncHandler(async (req, res) => {
  const result = await updateNotificationConfig(req.validatedBody);
  res.status(200).json(result);
});

export const adminGetSystemConfig = asyncHandler(async (req, res) => {
  const result = await getSystemConfig();
  res.status(200).json(result);
});

export const adminUpdateSystemConfig = asyncHandler(async (req, res) => {
  const result = await updateSystemConfig(req.validatedBody);
  res.status(200).json(result);
});
