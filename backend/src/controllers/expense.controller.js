import { asyncHandler } from "../utils/async-handler.js";
import {
  createExpense,
  deleteExpense,
  exportExpenses,
  listExpenses,
  updateExpense
} from "../services/expense.service.js";

export const adminCreateExpense = asyncHandler(async (req, res) => {
  const result = await createExpense(req.validatedBody);
  res.status(201).json(result);
});

export const adminGetExpenses = asyncHandler(async (req, res) => {
  const result = await listExpenses(req.query);
  res.status(200).json(result);
});

export const adminUpdateExpense = asyncHandler(async (req, res) => {
  const result = await updateExpense(req.params.id, req.validatedBody);
  res.status(200).json(result);
});

export const adminDeleteExpense = asyncHandler(async (req, res) => {
  await deleteExpense(req.params.id);
  res.status(200).json({ message: "Expense deleted successfully" });
});

export const adminExportExpenses = asyncHandler(async (req, res) => {
  const buffer = await exportExpenses(req.query);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="expenses-${Date.now()}.xlsx"`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.status(200).send(buffer);
});
