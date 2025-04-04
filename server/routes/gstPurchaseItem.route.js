import express from "express";
import {
  addGstPurchaseItem,
  getGstPurchaseItem,
  searchGstPurchaseItems,
  deleteGstPurchaseItem,
  updateGstPurchaseItem,
  downloadGstPurchaseItemsListExcel,
} from "#controllers/gstPurchaseItem.controller.js";

import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, addGstPurchaseItem)
  .get(getGstPurchaseItem);

router.route("/search").get(searchGstPurchaseItems);
router.route("/:id").put(protect, admin, updateGstPurchaseItem);
router.route("/:id").delete(protect, admin, deleteGstPurchaseItem);
router.route("/download/excel").post(protect, admin, downloadGstPurchaseItemsListExcel);

export default router;
