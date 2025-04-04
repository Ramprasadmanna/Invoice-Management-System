import express from "express";
import {
  addItems,
  deleteItem,
  downloadItemsListPdf,
  downloadItemsListExcel,
  getItems,
  searchItems,
  updateItem,
} from "#controllers/cashItem.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, admin, addItems).get(getItems);
router.route("/search").get(searchItems);
router
  .route("/:id")
  .put(protect, admin, updateItem)
  .delete(protect, admin, deleteItem);

router.route("/download/pdf").post(protect, admin, downloadItemsListPdf);
router.route("/download/excel").post(protect, admin, downloadItemsListExcel);

export default router;
