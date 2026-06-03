import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { hashToken, verifySessionToken } from "../utils/auth.js";
import { AppError } from "../utils/app-error.js";

const extractToken = (req) => {
  const cookieToken = req.cookies?.[env.cookieName];

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  return null;
};

export const requireAdminAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifySessionToken(token);
    const tokenHash = hashToken(token);

    const session = await prisma.adminSession.findUnique({
      where: { tokenHash },
      include: { adminUser: true }
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new AppError("Session expired or invalid", 401);
    }

    if (session.adminUser.currentSessionId !== session.id || !session.adminUser.isActive) {
      throw new AppError("Session is no longer active", 401);
    }

    if (payload.sid !== session.id || payload.sub !== session.adminUserId) {
      throw new AppError("Invalid session token", 401);
    }

    req.adminUser = session.adminUser;
    req.session = session;
    req.sessionToken = token;

    next();
  } catch (error) {
    next(error);
  }
};
