import express from "express";
import {
  addGstPurchase,
  deleteGstPurchase,
  downloadGstPurchaseCompanySummaryExcel,
  downloadGstPurchaseExcel,
  getGstPurchases,
  gstPurchaseCompanySummary,
  updateGstPurchase,
} from "#controllers/gstPurchase.controller.js";

import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, addGstPurchase)
  .get(protect, admin, getGstPurchases);

router
  .route("/:id")
  .put(protect, admin, updateGstPurchase)
  .delete(protect, admin, deleteGstPurchase);

router.route("/download/excel").post(protect, admin, downloadGstPurchaseExcel);

router.route("/summary/company").get(protect, admin, gstPurchaseCompanySummary);
router
  .route("/download/summary/company")
  .post(protect, admin, downloadGstPurchaseCompanySummaryExcel);

export default router;
