import express from "express";
import {
  aggregatedGraphData,
  aggregatedGstPurchaseData,
  aggregatedGstSales_GstPurchase,
  aggregatedGstSalesData,
  aggregatedSalesData,
} from "#controllers/dashboard.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";
const router = express.Router();

router.route("/gstSales").get(protect, admin, aggregatedGstSalesData);
router.route("/gstPurchase").get(protect, admin, aggregatedGstPurchaseData);
router.route("/sales").get(protect, admin, aggregatedSalesData);
router.route("/graph").get(protect, admin, aggregatedGraphData);
router
  .route("/gstsales-gstpurchase")
  .get(protect, admin, aggregatedGstSales_GstPurchase);

export default router;
