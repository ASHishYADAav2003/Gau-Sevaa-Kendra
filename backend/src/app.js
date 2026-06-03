import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { webhookRouter } from "./routes/webhook.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigins.length ? env.corsOrigins : true,
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
  app.use(
    "/api/v1/webhooks/razorpay",
    express.raw({ type: "application/json" }),
    webhookRouter
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      service: "ganpati-gauseva-backend",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/v1", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
