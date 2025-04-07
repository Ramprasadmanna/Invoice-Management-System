import express from "express";
import {
  addExpenseItem,
  getExpenseItem,
  searchExpenseItemItems,
  updateExpenseItem,
  deleteExpenseItem,
  downloadExpenseItemsListExcel,
} from "#controllers/expenseItem.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();
router
  .route("/")
  .post(protect, admin, addExpenseItem)
  .get(protect, admin, getExpenseItem);

router.route("/search").get(protect, admin, searchExpenseItemItems);
router.route("/:id").put(protect, admin, updateExpenseItem);
router.route("/:id").delete(protect, admin, deleteExpenseItem);
router
  .route("/download/excel")
  .post(protect, admin, downloadExpenseItemsListExcel);

export default router;
