import crypto from "crypto";
import PDFDocument from "pdfkit";
import { formatCurrency } from "./money.js";

export const getFinancialYearLabel = (date = new Date()) => {
  const year = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  const nextYearShort = String((year + 1) % 100).padStart(2, "0");
  return `${year}-${nextYearShort}`;
};

export const buildReceiptNumber = ({ prefix, sequence, date = new Date() }) =>
  `${prefix}/${getFinancialYearLabel(date)}/${String(sequence).padStart(6, "0")}`;

export const buildReceiptDownloadToken = ({ donationId, receiptNumber, secret }) =>
  crypto
    .createHmac("sha256", secret)
    .update(`${donationId}:${receiptNumber}`)
    .digest("hex");

export const createReceiptPdfBuffer = async ({ donation, receipt, systemConfig, campaignTitle }) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text(systemConfig.orgName || "Ganpati Gauseva", {
      align: "center"
    });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Donation Receipt`, { align: "center" });
    doc.moveDown();
    doc.text(`Receipt Number: ${receipt.receiptNumber}`);
    doc.text(`Issued At: ${new Date(receipt.issuedAt).toLocaleString("en-IN")}`);
    doc.text(`Donation Date: ${new Date(donation.createdAt).toLocaleString("en-IN")}`);
    doc.moveDown();
    doc.text(`Donor Name: ${donation.donor.fullName}`);
    if (donation.donor.phone) {
      doc.text(`Phone: ${donation.donor.phone}`);
    }
    if (donation.donor.email) {
      doc.text(`Email: ${donation.donor.email}`);
    }
    doc.moveDown();
    doc.text(`Donation Type: ${donation.donationType}`);
    if (campaignTitle) {
      doc.text(`Campaign: ${campaignTitle}`);
    }
    doc.text(`Amount: ${formatCurrency(donation.amountPaise)}`);
    doc.text(`Payment Mode: Online / Razorpay`);
    doc.text(`Razorpay Order ID: ${donation.razorpayOrderId}`);
    if (donation.razorpayPaymentId) {
      doc.text(`Razorpay Payment ID: ${donation.razorpayPaymentId}`);
    }
    doc.moveDown();
    doc.text(systemConfig.legal80GText || "80G details will be updated once registration is finalized.");
    if (systemConfig.legal80GNumber) {
      doc.text(`80G Registration Number: ${systemConfig.legal80GNumber}`);
    }
    if (systemConfig.legal80GValidity) {
      doc.text(`80G Validity: ${systemConfig.legal80GValidity}`);
    }
    doc.moveDown(2);
    doc.text("Authorized Signatory", { align: "right" });

    doc.end();
  });
