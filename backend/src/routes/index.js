import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { adminAnimalRouter, animalRouter } from "./animal.routes.js";
import { adminCampaignRouter, campaignRouter } from "./campaign.routes.js";
import { adminConfigRouter, publicConfigRouter } from "./config.routes.js";
import { adminDashboardRouter } from "./dashboard.routes.js";
import { adminDonationRouter, donationRouter } from "./donation.routes.js";
import { adminExpenseRouter } from "./expense.routes.js";
import { receiptRouter } from "./receipt.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/donations", donationRouter);
apiRouter.use("/campaigns", campaignRouter);
apiRouter.use("/animals", animalRouter);
apiRouter.use("/site", publicConfigRouter);
apiRouter.use("/receipts", receiptRouter);
apiRouter.use("/admin/dashboard", adminDashboardRouter);
apiRouter.use("/admin/donations", adminDonationRouter);
apiRouter.use("/admin/campaigns", adminCampaignRouter);
apiRouter.use("/admin/animals", adminAnimalRouter);
apiRouter.use("/admin/expenses", adminExpenseRouter);
apiRouter.use("/admin/config", adminConfigRouter);
