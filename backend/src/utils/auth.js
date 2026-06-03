import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

export const createSessionToken = ({ adminId, sessionId }) =>
  jwt.sign({ sub: adminId, sid: sessionId }, env.jwtSecret, {
    expiresIn: `${env.sessionTtlHours}h`
  });

export const verifySessionToken = (token) => jwt.verify(token, env.jwtSecret);

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
