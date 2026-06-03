import crypto from "crypto";
import XLSX from "xlsx";
import { prisma } from "../lib/prisma.js";
import { getRazorpayClient } from "../lib/razorpay.js";
import { sendEmail } from "../lib/mailer.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { buildReceiptDownloadToken, buildReceiptNumber, createReceiptPdfBuffer } from "../utils/receipt.js";
import { formatCurrency, toPaise } from "../utils/money.js";
import { getPagination } from "../utils/pagination.js";
import { getDateRange } from "../utils/date.js";

const createReceiptAndIncrementSequence = async (tx, donation) => {
  const systemConfig = await tx.systemConfig.findFirst();
  if (!systemConfig) {
    throw new AppError("System configuration missing", 500);
  }

  const nextSequence = systemConfig.receiptSequenceNumber + 1;
  const receiptNumber = buildReceiptNumber({
    prefix: systemConfig.receiptPrefix,
    sequence: nextSequence
  });

  await tx.systemConfig.update({
    where: { id: systemConfig.id },
    data: {
      receiptSequenceNumber: nextSequence
    }
  });

  const receipt = await tx.receipt.create({
    data: {
      donationId: donation.id,
      receiptNumber,
      sentToEmail: donation.donor.email || null,
      legalTextSnapshot: systemConfig.legal80GText || null
    }
  });

  await tx.donation.update({
    where: { id: donation.id },
    data: {
      receiptNumber
    }
  });

  return { receipt, systemConfig };
};

const sendDonationEmails = async ({ donation, receipt, systemConfig, campaignTitle }) => {
  const pdfBuffer = await createReceiptPdfBuffer({
    donation,
    receipt,
    systemConfig,
    campaignTitle
  });

  if (donation.donor.email) {
    await sendEmail({
      to: donation.donor.email,
      subject: `Thank you for your donation to ${systemConfig.orgName}`,
      text: `Thank you for your donation of ${formatCurrency(donation.amountPaise)} to ${systemConfig.orgName}.`,
      html: `<p>Thank you for your donation of <strong>${formatCurrency(donation.amountPaise)}</strong> to ${systemConfig.orgName}.</p>`,
      attachments: [
        {
          filename: `${receipt.receiptNumber}.pdf`,
          content: pdfBuffer
        }
      ]
    });
  }

  const notificationConfig = await prisma.notificationConfig.findFirst();
  const shouldSendAdminEmail =
    notificationConfig?.donationEmailEnabled &&
    notificationConfig.notificationEmail &&
    (notificationConfig.sendAllSuccessfulDonations ||
      (notificationConfig.thresholdEnabled &&
        donation.amountPaise >= (notificationConfig.thresholdAmountPaise || 0)));

  if (shouldSendAdminEmail) {
    await sendEmail({
      to: notificationConfig.notificationEmail,
      subject: `New donation received - ${formatCurrency(donation.amountPaise)}`,
      text: [
        `A new donation has been received.`,
        `Amount: ${formatCurrency(donation.amountPaise)}`,
        `Donation Type: ${donation.donationType}`,
        `Donor Name: ${donation.donor.fullName}`,
        `Donor Phone: ${donation.donor.phone || "Not provided"}`,
        `Campaign: ${campaignTitle || "General Donation"}`
      ].join("\n"),
      html: `
        <p>A new donation has been received.</p>
        <p><strong>Amount:</strong> ${formatCurrency(donation.amountPaise)}</p>
        <p><strong>Donation Type:</strong> ${donation.donationType}</p>
        <p><strong>Donor Name:</strong> ${donation.donor.fullName}</p>
        <p><strong>Donor Phone:</strong> ${donation.donor.phone || "Not provided"}</p>
        <p><strong>Campaign:</strong> ${campaignTitle || "General Donation"}</p>
      `
    });
  }
};

const syncCampaignProgress = async (campaignId) => {
  if (!campaignId) {
    return;
  }

  const [campaign, aggregate] = await Promise.all([
    prisma.campaign.findUnique({ where: { id: campaignId } }),
    prisma.donation.aggregate({
      where: {
        campaignId,
        status: "PAID"
      },
      _sum: { amountPaise: true }
    })
  ]);

  if (!campaign) {
    return;
  }

  const raisedAmountPaise = aggregate._sum.amountPaise || 0;
  const shouldClose = campaign.autoCloseOnGoal && raisedAmountPaise >= campaign.targetAmountPaise;

  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      raisedAmountPaise,
      status: shouldClose ? "CLOSED" : campaign.status
    }
  });
};

const findOrCreateDonor = async ({ fullName, phone, email, isAnonymousPublic }) => {
  const conditions = [];

  if (email) {
    conditions.push({ email });
  }

  if (phone) {
    conditions.push({ phone });
  }

  let donor = null;

  if (conditions.length > 0) {
    donor = await prisma.donor.findFirst({
      where: {
        OR: conditions
      }
    });
  }

  if (donor) {
    return prisma.donor.update({
      where: { id: donor.id },
      data: {
        fullName,
        phone: phone || donor.phone,
        email: email || donor.email,
        isAnonymousPublic
      }
    });
  }

  return prisma.donor.create({
    data: {
      fullName,
      phone: phone || null,
      email: email || null,
      isAnonymousPublic
    }
  });
};

export const createDonationOrder = async (payload) => {
  const amountPaise = toPaise(payload.amount);
  let donationType = payload.donationType;
  let campaign = null;
  let redirectedToGeneral = false;

  if (donationType === "CAMPAIGN") {
    campaign = await prisma.campaign.findUnique({
      where: { id: payload.campaignId || undefined }
    });

    if (!campaign || campaign.status !== "ACTIVE") {
      redirectedToGeneral = true;
      donationType = "GENERAL";
      campaign = null;
    } else if (campaign.raisedAmountPaise >= campaign.targetAmountPaise) {
      redirectedToGeneral = true;
      donationType = "GENERAL";
      campaign = null;
    }
  }

  const donor = await findOrCreateDonor(payload.donor);
  const razorpay = getRazorpayClient();
  const receiptRef = `don_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: payload.currency || "INR",
    receipt: receiptRef,
    notes: {
      donationType,
      donorName: donor.fullName
    }
  });

  const donation = await prisma.donation.create({
    data: {
      donorId: donor.id,
      campaignId: campaign?.id || null,
      donationType,
      amountPaise,
      currency: payload.currency || "INR",
      razorpayOrderId: order.id,
      taxReceiptRequested: payload.taxReceiptRequested,
      isAnonymousPublic: payload.donor.isAnonymousPublic,
      donorDisplayName: payload.donor.isAnonymousPublic ? "Anonymous" : donor.fullName
    }
  });

  return {
    donationId: donation.id,
    razorpayOrderId: order.id,
    amountPaise,
    currency: payload.currency || "INR",
    keyId: env.razorpayKeyId,
    redirectedToGeneral
  };
};

export const verifyDonationSignature = async (payload) => {
  const donation = await prisma.donation.findUnique({
    where: { id: payload.donationId }
  });

  if (!donation) {
    throw new AppError("Donation not found", 404);
  }

  if (donation.razorpayOrderId !== payload.razorpayOrderId) {
    throw new AppError("Order mismatch", 400);
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== payload.razorpaySignature) {
    throw new AppError("Invalid Razorpay signature", 400);
  }

  const updated = await prisma.donation.update({
    where: { id: payload.donationId },
    data: {
      status: "ATTEMPTED",
      razorpayPaymentId: payload.razorpayPaymentId,
      razorpaySignature: payload.razorpaySignature
    }
  });

  return updated;
};

const getCampaignTitle = (campaign) => campaign?.titleEn || null;

const finalizePaidDonation = async ({ donationId, razorpayPaymentId, paymentMethod, capturedAt }) => {
  const existingDonation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: {
      donor: true,
      campaign: true,
      receipt: true
    }
  });

  if (!existingDonation) {
    throw new AppError("Donation not found for webhook processing", 404);
  }

  if (existingDonation.status === "PAID" && existingDonation.receipt) {
    return existingDonation;
  }

  const { donation, receipt, systemConfig } = await prisma.$transaction(async (tx) => {
    const updatedDonation = await tx.donation.update({
      where: { id: donationId },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpayPaymentId || existingDonation.razorpayPaymentId,
        paymentMethod: paymentMethod || existingDonation.paymentMethod,
        paymentCapturedAt: capturedAt || new Date()
      },
      include: {
        donor: true,
        campaign: true,
        receipt: true
      }
    });

    if (updatedDonation.receipt) {
      return {
        donation: updatedDonation,
        receipt: updatedDonation.receipt,
        systemConfig: await tx.systemConfig.findFirst()
      };
    }

    const receiptResult = await createReceiptAndIncrementSequence(tx, updatedDonation);
    return {
      donation: {
        ...updatedDonation,
        receipt: receiptResult.receipt
      },
      receipt: receiptResult.receipt,
      systemConfig: receiptResult.systemConfig
    };
  });

  await syncCampaignProgress(donation.campaignId);
  await sendDonationEmails({
    donation,
    receipt,
    systemConfig,
    campaignTitle: getCampaignTitle(donation.campaign)
  });

  return donation;
};

export const processRazorpayWebhook = async ({ signature, rawBody }) => {
  if (!env.razorpayWebhookSecret) {
    throw new AppError("Razorpay webhook secret is not configured", 500);
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new AppError("Invalid Razorpay webhook signature", 400);
  }

  const event = JSON.parse(rawBody.toString("utf-8"));
  const eventId = event.payload?.payment?.entity?.id
    ? `${event.event}:${event.payload.payment.entity.id}`
    : `${event.event}:${Date.now()}`;

  const existingEvent = await prisma.paymentWebhookEvent.findUnique({
    where: {
      razorpayEventId: eventId
    }
  });

  if (existingEvent?.processed) {
    return { processed: true, duplicate: true };
  }

  const webhookEvent =
    existingEvent ||
    (await prisma.paymentWebhookEvent.create({
      data: {
        razorpayEventId: eventId,
        eventType: event.event,
        payloadJson: event,
        signatureHeader: signature,
        isVerified: true
      }
    }));

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload.payment?.entity;
    const orderId = payment?.order_id;
    const donation = await prisma.donation.findUnique({
      where: { razorpayOrderId: orderId }
    });

    if (donation) {
      await finalizePaidDonation({
        donationId: donation.id,
        razorpayPaymentId: payment?.id,
        paymentMethod: payment?.method,
        capturedAt: payment?.created_at ? new Date(payment.created_at * 1000) : new Date()
      });
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment?.entity;
    if (payment?.order_id) {
      await prisma.donation.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          status: "FAILED",
          razorpayPaymentId: payment.id || null,
          paymentFailedReason: payment.error_description || "Payment failed"
        }
      });
    }
  }

  await prisma.paymentWebhookEvent.update({
    where: { id: webhookEvent.id },
    data: {
      processed: true,
      processedAt: new Date()
    }
  });

  return { processed: true, duplicate: false };
};

export const getPublicDonationStatus = async (donationId) => {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: {
      receipt: true
    }
  });

  if (!donation) {
    throw new AppError("Donation not found", 404);
  }

  const receiptToken =
    donation.receipt &&
    buildReceiptDownloadToken({
      donationId: donation.id,
      receiptNumber: donation.receipt.receiptNumber,
      secret: env.jwtSecret
    });

  return {
    id: donation.id,
    status: donation.status,
    amountPaise: donation.amountPaise,
    receiptNumber: donation.receipt?.receiptNumber || null,
    receiptDownloadToken: receiptToken || null
  };
};

export const getReceiptDownloadPayload = async ({ receiptNumber, token }) => {
  const receipt = await prisma.receipt.findUnique({
    where: { receiptNumber },
    include: {
      donation: {
        include: {
          donor: true,
          campaign: true
        }
      }
    }
  });

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  const expectedToken = buildReceiptDownloadToken({
    donationId: receipt.donationId,
    receiptNumber,
    secret: env.jwtSecret
  });

  if (token !== expectedToken) {
    throw new AppError("Invalid receipt download token", 401);
  }

  const systemConfig = await prisma.systemConfig.findFirst();
  const pdfBuffer = await createReceiptPdfBuffer({
    donation: receipt.donation,
    receipt,
    systemConfig,
    campaignTitle: receipt.donation.campaign?.titleEn || null
  });

  return {
    buffer: pdfBuffer,
    filename: `${receipt.receiptNumber}.pdf`
  };
};

const buildDonationWhereClause = (query) => {
  const where = {};
  const { start, end } = getDateRange(query);

  if (start || end) {
    where.createdAt = {};
    if (start) {
      where.createdAt.gte = start;
    }
    if (end) {
      where.createdAt.lte = end;
    }
  }

  if (query.type) {
    where.donationType = query.type;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.campaignId) {
    where.campaignId = query.campaignId;
  }

  if (query.minAmount || query.maxAmount) {
    where.amountPaise = {};
    if (query.minAmount) {
      where.amountPaise.gte = toPaise(query.minAmount);
    }
    if (query.maxAmount) {
      where.amountPaise.lte = toPaise(query.maxAmount);
    }
  }

  if (query.search) {
    where.OR = [
      {
        donor: {
          fullName: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      },
      {
        donor: {
          phone: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      },
      {
        razorpayOrderId: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        razorpayPaymentId: {
          contains: query.search,
          mode: "insensitive"
        }
      }
    ];
  }

  return where;
};

export const listAdminDonations = async (query) => {
  const pagination = getPagination(query);
  const where = buildDonationWhereClause(query);

  const [items, total, aggregate] = await Promise.all([
    prisma.donation.findMany({
      where,
      include: {
        donor: true,
        campaign: true,
        receipt: true
      },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.donation.count({ where }),
    prisma.donation.aggregate({
      where,
      _sum: { amountPaise: true }
    })
  ]);

  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    },
    summary: {
      totalAmountPaise: aggregate._sum.amountPaise || 0
    }
  };
};

export const getAdminDonationById = async (donationId) => {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: {
      donor: true,
      campaign: true,
      receipt: true
    }
  });

  if (!donation) {
    throw new AppError("Donation not found", 404);
  }

  return donation;
};

export const exportDonations = async (query) => {
  const where = buildDonationWhereClause(query);
  const items = await prisma.donation.findMany({
    where,
    include: {
      donor: true,
      campaign: true
    },
    orderBy: { createdAt: "desc" }
  });

  const rows = items.map((item) => ({
    DonationID: item.id,
    Date: item.createdAt.toISOString(),
    DonorName: item.donor.fullName,
    DonorPhone: item.donor.phone || "",
    DonorEmail: item.donor.email || "",
    Type: item.donationType,
    Campaign: item.campaign?.titleEn || "",
    AmountINR: item.amountPaise / 100,
    Status: item.status,
    ReceiptNumber: item.receiptNumber || "",
    RazorpayOrderId: item.razorpayOrderId,
    RazorpayPaymentId: item.razorpayPaymentId || ""
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
};
