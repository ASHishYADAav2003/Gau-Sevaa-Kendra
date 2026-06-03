import XLSX from "xlsx";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { getPagination } from "../utils/pagination.js";
import { getDateRange } from "../utils/date.js";
import { toPaise } from "../utils/money.js";

const buildExpenseWhere = (query) => {
  const where = {};
  const { start, end } = getDateRange(query);

  if (start || end) {
    where.expenseDate = {};
    if (start) {
      where.expenseDate.gte = start;
    }
    if (end) {
      where.expenseDate.lte = end;
    }
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.animalId) {
    where.animalId = query.animalId;
  }

  if (query.campaignId) {
    where.campaignId = query.campaignId;
  }

  return where;
};

export const createExpense = async (payload) =>
  prisma.expenseLedger.create({
    data: {
      ...payload,
      expenseDate: new Date(payload.expenseDate),
      amountPaise: toPaise(payload.amount)
    },
    include: {
      animal: true,
      campaign: true
    }
  });

export const listExpenses = async (query) => {
  const pagination = getPagination(query);
  const where = buildExpenseWhere(query);

  const [items, total] = await Promise.all([
    prisma.expenseLedger.findMany({
      where,
      include: {
        animal: true,
        campaign: true
      },
      orderBy: { expenseDate: "desc" },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.expenseLedger.count({ where })
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

export const updateExpense = async (expenseId, payload) => {
  const existing = await prisma.expenseLedger.findUnique({
    where: { id: expenseId }
  });

  if (!existing) {
    throw new AppError("Expense not found", 404);
  }

  return prisma.expenseLedger.update({
    where: { id: expenseId },
    data: {
      ...payload,
      expenseDate:
        "expenseDate" in payload
          ? new Date(payload.expenseDate)
          : undefined,
      amountPaise: "amount" in payload ? toPaise(payload.amount) : undefined
    },
    include: {
      animal: true,
      campaign: true
    }
  });
};

export const deleteExpense = async (expenseId) => {
  const existing = await prisma.expenseLedger.findUnique({
    where: { id: expenseId }
  });

  if (!existing) {
    throw new AppError("Expense not found", 404);
  }

  await prisma.expenseLedger.delete({
    where: { id: expenseId }
  });
};

export const exportExpenses = async (query) => {
  const items = await prisma.expenseLedger.findMany({
    where: buildExpenseWhere(query),
    include: {
      animal: true,
      campaign: true
    },
    orderBy: { expenseDate: "desc" }
  });

  const rows = items.map((item) => ({
    ExpenseID: item.id,
    ExpenseDate: item.expenseDate.toISOString(),
    Category: item.category,
    AmountINR: item.amountPaise / 100,
    Vendor: item.vendorName || "",
    Animal: item.animal?.name || "",
    Campaign: item.campaign?.titleEn || "",
    Notes: item.notes || ""
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
};
