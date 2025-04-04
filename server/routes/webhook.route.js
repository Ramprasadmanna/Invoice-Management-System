import express from "express";
import {
  addWebHookGstOrder,
  getWebHookGstOrders,
  updateToGstSale,
} from "#controllers/webhookGstOrder.controller.js";
import {
  addWebHookOrder,
  getWebHookOrders,
  updateToSale,
} from "#controllers/webhookOrder.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router
  .route(`/${process.env.GST_ORDER_UUID}/gstOrder`)
  .post(addWebHookGstOrder);
router.route("/gstOrder").get(getWebHookGstOrders);
router.route("/:id/confirmGstOrder").post(protect, admin, updateToGstSale);

router.route(`/${process.env.ORDER_UUID}/order`).post(addWebHookOrder);
router.route("/order").get(getWebHookOrders);
router.route("/:id/confirmOrder").post(protect, admin, updateToSale);

export default router;
