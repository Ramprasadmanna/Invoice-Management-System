import express from "express";
import {
  addGstItems,
  getGstItems,
  searchGstItems,
  deleteGstItem,
  updateGstItem,
  downloadGstItemsListExcel,
  downloadGstItemsListPdf,
} from "#controllers/gstItem.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, admin, addGstItems).get(getGstItems);
router.route("/search").get(searchGstItems);
router
  .route("/:id")
  .put(protect, admin, updateGstItem)
  .delete(protect, admin, deleteGstItem);
router.route("/download/pdf").post(protect, admin, downloadGstItemsListPdf);
router.route("/download/excel").post(protect, admin, downloadGstItemsListExcel);

export default router;
