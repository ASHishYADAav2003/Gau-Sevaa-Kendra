import { prisma } from "../lib/prisma.js";

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfCurrentMonth = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfCurrentYear = () => {
  const date = new Date();
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getDashboardMetrics = async () => {
  const [today, month, year, statusCounts, campaignStats, expenseStats, animalStatusDistribution, donorGroups] =
    await Promise.all([
      prisma.donation.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: startOfToday() }
        },
        _sum: { amountPaise: true },
        _count: { id: true }
      }),
      prisma.donation.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: startOfCurrentMonth() }
        },
        _sum: { amountPaise: true },
        _count: { id: true }
      }),
      prisma.donation.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: startOfCurrentYear() }
        },
        _sum: { amountPaise: true },
        _count: { id: true }
      }),
      prisma.donation.groupBy({
        by: ["status"],
        _count: { id: true }
      }),
      prisma.campaign.findMany({
        select: {
          id: true,
          titleEn: true,
          targetAmountPaise: true,
          raisedAmountPaise: true,
          status: true
        },
        orderBy: { raisedAmountPaise: "desc" }
      }),
      prisma.expenseLedger.groupBy({
        by: ["category"],
        _sum: { amountPaise: true }
      }),
      prisma.animal.groupBy({
        by: ["status"],
        _count: { id: true }
      }),
      prisma.donation.groupBy({
        by: ["donorId"],
        _count: { donorId: true }
      })
    ]);

  const repeatDonors = donorGroups.filter((group) => group._count.donorId > 1).length;
  const newDonors = donorGroups.length - repeatDonors;

  return {
    donations: {
      today,
      month,
      year,
      statusCounts
    },
    campaigns: campaignStats,
    expenses: expenseStats,
    animals: animalStatusDistribution,
    donors: {
      total: donorGroups.length,
      new: newDonors,
      repeat: repeatDonors
    }
  };
};
