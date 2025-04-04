import express from "express";
import {
  addExpense,
  deleteExpense,
  downloadExpenseExcel,
  downloadExpenseItemSummarySummaryExcel,
  expenseItemSummary,
  getExpense,
  updateExpense,
} from "#controllers/expense.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, admin, addExpense).get(getExpense);
router
  .route("/:id")
  .put(protect, admin, updateExpense)
  .delete(protect, admin, deleteExpense);

router.route("/download/excel").post(protect, admin, downloadExpenseExcel);

router.route("/summary/item").get(expenseItemSummary);
router
  .route("/download/summary/item")
  .post(protect, admin, downloadExpenseItemSummarySummaryExcel);

export default router;
