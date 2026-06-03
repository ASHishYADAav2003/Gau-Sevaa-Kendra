import path from "path";
import { env } from "../config/env.js";

export const buildPublicUploadUrl = (relativePath) => {
  const normalized = relativePath.replace(/\\/g, "/");
  return `${env.uploadBaseUrl}/${normalized}`;
};

export const getUploadPath = (...parts) => path.join(process.cwd(), "src", "uploads", ...parts);
