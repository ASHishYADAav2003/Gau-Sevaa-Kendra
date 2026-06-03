import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { env, isProduction } from "../config/env.js";
import {
  comparePassword,
  createSessionToken,
  hashToken
} from "../utils/auth.js";
import { AppError } from "../utils/app-error.js";

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  maxAge: env.sessionTtlHours * 60 * 60 * 1000
};

export const loginAdmin = async ({ username, password, ipAddress, userAgent }) => {
  const adminUser = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (!adminUser || !adminUser.isActive) {
    throw new AppError("Invalid username or password", 401);
  }

  const isPasswordValid = await comparePassword(password, adminUser.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid username or password", 401);
  }

  await prisma.adminSession.updateMany({
    where: {
      adminUserId: adminUser.id,
      isRevoked: false
    },
    data: {
      isRevoked: true,
      revokedAt: new Date()
    }
  });

  const session = await prisma.adminSession.create({
    data: {
      adminUserId: adminUser.id,
      tokenHash: `pending-${crypto.randomUUID()}`,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000)
    }
  });

  const token = createSessionToken({ adminId: adminUser.id, sessionId: session.id });
  const tokenHash = hashToken(token);

  await prisma.$transaction([
    prisma.adminSession.update({
      where: { id: session.id },
      data: { tokenHash }
    }),
    prisma.adminUser.update({
      where: { id: adminUser.id },
      data: {
        currentSessionId: session.id,
        lastLoginAt: new Date()
      }
    })
  ]);

  return {
    token,
    admin: {
      id: adminUser.id,
      username: adminUser.username
    }
  };
};

export const logoutAdmin = async ({ sessionId, adminId }) => {
  await prisma.$transaction([
    prisma.adminSession.update({
      where: { id: sessionId },
      data: {
        isRevoked: true,
        revokedAt: new Date()
      }
    }),
    prisma.adminUser.update({
      where: { id: adminId },
      data: {
        currentSessionId: null
      }
    })
  ]);
};

export const getSessionCookieOptions = () => sessionCookieOptions;
