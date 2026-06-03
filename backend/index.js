import { createApp } from "./src/app.js";
import { env } from "./src/config/env.js";
import { prisma } from "./src/lib/prisma.js";
import { ensureBootstrapData } from "./src/services/bootstrap.service.js";

const start = async () => {
  try {
    await prisma.$connect();
    await ensureBootstrapData();

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`Backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);
    process.exit(1);
  }
};

start();
