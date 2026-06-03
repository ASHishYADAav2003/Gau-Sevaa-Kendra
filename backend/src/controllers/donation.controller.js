import { asyncHandler } from "../utils/async-handler.js";
import {
  createDonationOrder,
  exportDonations,
  getAdminDonationById,
  getPublicDonationStatus,
  getReceiptDownloadPayload,
  listAdminDonations,
  processRazorpayWebhook,
  verifyDonationSignature
} from "../services/donation.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const result = await createDonationOrder(req.validatedBody);
  res.status(201).json(result);
});

export const verifyDonation = asyncHandler(async (req, res) => {
  const donation = await verifyDonationSignature(req.validatedBody);
  res.status(200).json({
    verified: true,
    status: donation.status,
    message: "Verification accepted; final confirmation pending webhook"
  });
});

export const webhook = asyncHandler(async (req, res) => {
  const result = await processRazorpayWebhook({
    signature: req.get("x-razorpay-signature"),
    rawBody: req.body
  });

  res.status(200).json(result);
});

export const publicStatus = asyncHandler(async (req, res) => {
  const result = await getPublicDonationStatus(req.params.id);
  res.status(200).json(result);
});

export const downloadReceipt = asyncHandler(async (req, res) => {
  const { buffer, filename } = await getReceiptDownloadPayload({
    receiptNumber: req.params.receiptNumber,
    token: req.query.token
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.status(200).send(buffer);
});

export const listDonations = asyncHandler(async (req, res) => {
  const result = await listAdminDonations(req.query);
  res.status(200).json(result);
});

export const getDonation = asyncHandler(async (req, res) => {
  const result = await getAdminDonationById(req.params.id);
  res.status(200).json(result);
});

export const exportDonationReport = asyncHandler(async (req, res) => {
  const buffer = await exportDonations(req.query);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="donations-${Date.now()}.xlsx"`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.status(200).send(buffer);
});
