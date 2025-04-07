import express from "express";

import {
  addCustomer,
  getCustomers,
  searchCustomers,
  deleteCustomer,
  updateCustomer,
  downloadCustomerListExcel,
  downloadCustomerListPdf,
} from "#controllers/customer.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, addCustomer)
  .get(protect, admin, getCustomers);
router.route("/search").get(protect, admin, searchCustomers);
router
  .route("/:id")
  .put(protect, admin, updateCustomer)
  .delete(protect, admin, deleteCustomer);
router.route("/download/pdf").post(protect, admin, downloadCustomerListPdf);
router.route("/download/excel").post(protect, admin, downloadCustomerListExcel);

export default router;
