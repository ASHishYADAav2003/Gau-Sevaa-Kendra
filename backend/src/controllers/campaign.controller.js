import { asyncHandler } from "../utils/async-handler.js";
import {
  createCampaign,
  createCampaignComment,
  createCampaignUpdate,
  getAdminCampaignById,
  getPublicCampaignBySlug,
  listAdminCampaignComments,
  listAdminCampaigns,
  listCampaignComments,
  listPublicCampaigns,
  moderateCampaignComment,
  updateCampaign,
  updateCampaignStatus,
  uploadCampaignImages
} from "../services/campaign.service.js";

export const getCampaigns = asyncHandler(async (req, res) => {
  const result = await listPublicCampaigns(req.query);
  res.status(200).json(result);
});

export const getCampaignBySlug = asyncHandler(async (req, res) => {
  const result = await getPublicCampaignBySlug(req.params.slug);
  res.status(200).json(result);
});

export const getComments = asyncHandler(async (req, res) => {
  const result = await listCampaignComments(req.params.id);
  res.status(200).json(result);
});

export const postComment = asyncHandler(async (req, res) => {
  const result = await createCampaignComment(req.params.id, req.validatedBody);
  res.status(201).json(result);
});

export const adminListCampaigns = asyncHandler(async (req, res) => {
  const result = await listAdminCampaigns(req.query);
  res.status(200).json(result);
});

export const adminGetCampaign = asyncHandler(async (req, res) => {
  const result = await getAdminCampaignById(req.params.id);
  res.status(200).json(result);
});

export const adminCreateCampaign = asyncHandler(async (req, res) => {
  const result = await createCampaign(req.validatedBody);
  res.status(201).json(result);
});

export const adminUpdateCampaign = asyncHandler(async (req, res) => {
  const result = await updateCampaign(req.params.id, req.validatedBody);
  res.status(200).json(result);
});

export const adminUpdateCampaignStatus = asyncHandler(async (req, res) => {
  const result = await updateCampaignStatus(req.params.id, req.validatedBody.status);
  res.status(200).json(result);
});

export const adminUploadCampaignImages = asyncHandler(async (req, res) => {
  const result = await uploadCampaignImages(req.params.id, req.files || []);
  res.status(201).json(result);
});

export const adminCreateCampaignUpdate = asyncHandler(async (req, res) => {
  const result = await createCampaignUpdate(req.params.id, req.validatedBody);
  res.status(201).json(result);
});

export const adminListCampaignComments = asyncHandler(async (req, res) => {
  const result = await listAdminCampaignComments(req.params.id);
  res.status(200).json(result);
});

export const adminModerateCampaignComment = asyncHandler(async (req, res) => {
  const result = await moderateCampaignComment(
    req.params.id,
    req.params.commentId,
    req.validatedBody
  );
  res.status(200).json(result);
});
