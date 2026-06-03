import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { getPagination } from "../utils/pagination.js";
import { slugify } from "../utils/slug.js";
import { toPaise } from "../utils/money.js";
import { buildPublicUploadUrl } from "../utils/file.js";

const getUniqueSlug = async (title, campaignId = null) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.campaign.findFirst({
      where: {
        slug,
        NOT: campaignId ? { id: campaignId } : undefined
      }
    });

    if (!existing) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
};

export const listPublicCampaigns = async (query) => {
  const pagination = getPagination(query);

  const where = {
    status: "ACTIVE"
  };

  const [items, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: {
        images: true,
        animal: true
      },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.campaign.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    }
  };
};

export const getPublicCampaignBySlug = async (slug) => {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      images: true,
      animal: true,
      updates: {
        orderBy: { publishedAt: "desc" }
      },
      comments: {
        where: {
          isApproved: true,
          isHidden: false
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  return campaign;
};

export const listCampaignComments = async (campaignId) => {
  return prisma.campaignComment.findMany({
    where: {
      campaignId,
      isApproved: true,
      isHidden: false
    },
    orderBy: { createdAt: "desc" }
  });
};

export const createCampaignComment = async (campaignId, payload) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  });

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  if (!campaign.commentsEnabled) {
    throw new AppError("Comments are disabled for this campaign", 400);
  }

  return prisma.campaignComment.create({
    data: {
      campaignId,
      ...payload
    }
  });
};

export const createCampaign = async (payload) => {
  const slug = await getUniqueSlug(payload.titleEn);

  return prisma.campaign.create({
    data: {
      slug,
      animalId: payload.animalId || null,
      titleEn: payload.titleEn,
      titleHi: payload.titleHi || null,
      shortSummaryEn: payload.shortSummaryEn,
      shortSummaryHi: payload.shortSummaryHi || null,
      fullStoryEn: payload.fullStoryEn || null,
      fullStoryHi: payload.fullStoryHi || null,
      targetAmountPaise: toPaise(payload.targetAmount),
      status: payload.status || "DRAFT",
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      commentsEnabled: payload.commentsEnabled ?? true,
      autoCloseOnGoal: payload.autoCloseOnGoal ?? true
    },
    include: {
      images: true,
      animal: true
    }
  });
};

export const listAdminCampaigns = async (query) => {
  const pagination = getPagination(query);
  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  const [items, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: {
        images: true,
        animal: true,
        _count: {
          select: {
            donations: true,
            comments: true,
            updates: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.campaign.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    }
  };
};

export const getAdminCampaignById = async (campaignId) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      images: true,
      animal: true,
      updates: {
        orderBy: { publishedAt: "desc" }
      },
      comments: {
        orderBy: { createdAt: "desc" }
      },
      donations: {
        where: { status: "PAID" },
        include: {
          donor: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  return campaign;
};

export const updateCampaign = async (campaignId, payload) => {
  const existing = await prisma.campaign.findUnique({
    where: { id: campaignId }
  });

  if (!existing) {
    throw new AppError("Campaign not found", 404);
  }

  const data = {};

  if (payload.titleEn && payload.titleEn !== existing.titleEn) {
    data.titleEn = payload.titleEn;
    data.slug = await getUniqueSlug(payload.titleEn, campaignId);
  }

  for (const field of [
    "animalId",
    "titleHi",
    "shortSummaryEn",
    "shortSummaryHi",
    "fullStoryEn",
    "fullStoryHi",
    "status",
    "commentsEnabled",
    "autoCloseOnGoal"
  ]) {
    if (field in payload) {
      data[field] = payload[field] ?? null;
    }
  }

  if ("targetAmount" in payload) {
    data.targetAmountPaise = toPaise(payload.targetAmount);
  }

  if ("startDate" in payload) {
    data.startDate = payload.startDate ? new Date(payload.startDate) : null;
  }

  if ("endDate" in payload) {
    data.endDate = payload.endDate ? new Date(payload.endDate) : null;
  }

  return prisma.campaign.update({
    where: { id: campaignId },
    data,
    include: {
      images: true,
      animal: true
    }
  });
};

export const updateCampaignStatus = async (campaignId, status) => {
  return prisma.campaign.update({
    where: { id: campaignId },
    data: { status }
  });
};

export const uploadCampaignImages = async (campaignId, files) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { images: true }
  });

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  const startSortOrder = campaign.images.length;

  const images = await prisma.$transaction(
    files.map((file, index) =>
      prisma.campaignImage.create({
        data: {
          campaignId,
          imageUrl: buildPublicUploadUrl(`uploads/campaigns/${file.filename}`),
          sortOrder: startSortOrder + index
        }
      })
    )
  );

  return images;
};

export const createCampaignUpdate = async (campaignId, payload) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  });

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  return prisma.campaignUpdate.create({
    data: {
      campaignId,
      ...payload
    }
  });
};

export const listAdminCampaignComments = async (campaignId) =>
  prisma.campaignComment.findMany({
    where: { campaignId },
    orderBy: { createdAt: "desc" }
  });

export const moderateCampaignComment = async (campaignId, commentId, payload) => {
  const comment = await prisma.campaignComment.findFirst({
    where: {
      id: commentId,
      campaignId
    }
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  return prisma.campaignComment.update({
    where: { id: commentId },
    data: {
      ...payload,
      moderatedAt: new Date()
    }
  });
};
