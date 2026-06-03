import { Router } from "express";
import {
  adminCreateCampaign,
  adminCreateCampaignUpdate,
  adminGetCampaign,
  adminListCampaignComments,
  adminListCampaigns,
  adminModerateCampaignComment,
  adminUpdateCampaign,
  adminUpdateCampaignStatus,
  adminUploadCampaignImages,
  getCampaignBySlug,
  getCampaigns,
  getComments,
  postComment
} from "../controllers/campaign.controller.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { campaignImageUpload } from "../middleware/upload.js";
import {
  createCampaignCommentSchema,
  createCampaignSchema,
  createCampaignUpdateSchema,
  moderateCampaignCommentSchema,
  updateCampaignSchema,
  updateCampaignStatusSchema
} from "../validators/campaign.validator.js";

export const campaignRouter = Router();
export const adminCampaignRouter = Router();

campaignRouter.get("/", getCampaigns);
campaignRouter.get("/:slug", getCampaignBySlug);
campaignRouter.get("/:id/comments", getComments);
campaignRouter.post("/:id/comments", validateBody(createCampaignCommentSchema), postComment);

adminCampaignRouter.use(requireAdminAuth);
adminCampaignRouter.get("/", adminListCampaigns);
adminCampaignRouter.post("/", validateBody(createCampaignSchema), adminCreateCampaign);
adminCampaignRouter.get("/:id", adminGetCampaign);
adminCampaignRouter.put("/:id", validateBody(updateCampaignSchema), adminUpdateCampaign);
adminCampaignRouter.patch(
  "/:id/status",
  validateBody(updateCampaignStatusSchema),
  adminUpdateCampaignStatus
);
adminCampaignRouter.post(
  "/:id/images",
  campaignImageUpload.array("images", 10),
  adminUploadCampaignImages
);
adminCampaignRouter.post(
  "/:id/updates",
  validateBody(createCampaignUpdateSchema),
  adminCreateCampaignUpdate
);
adminCampaignRouter.get("/:id/comments", adminListCampaignComments);
adminCampaignRouter.patch(
  "/:id/comments/:commentId",
  validateBody(moderateCampaignCommentSchema),
  adminModerateCampaignComment
);
