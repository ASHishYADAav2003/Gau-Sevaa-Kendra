import { Router } from "express";
import {
  adminCreateExpense,
  adminDeleteExpense,
  adminExportExpenses,
  adminGetExpenses,
  adminUpdateExpense
} from "../controllers/expense.controller.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createExpenseSchema, updateExpenseSchema } from "../validators/expense.validator.js";

export const adminExpenseRouter = Router();

adminExpenseRouter.use(requireAdminAuth);
adminExpenseRouter.post("/", validateBody(createExpenseSchema), adminCreateExpense);
adminExpenseRouter.get("/", adminGetExpenses);
adminExpenseRouter.get("/export", adminExportExpenses);
adminExpenseRouter.put("/:id", validateBody(updateExpenseSchema), adminUpdateExpense);
adminExpenseRouter.delete("/:id", adminDeleteExpense);
