import express from "express";
import {
  addGstSale,
  updateGstSale,
  deleteGstSale,
  getGstSales,
  previewGstSaleInvoicePdf,
  downloadGstSaleInvoicePdf,
  sendInvoiceEmail,
  downloadGstSalesListPdf,
  downloadGstSalesListExcel,
  downloadGstSalesCustomerSummaryExcel,
  downloadGstSalesHsnSummaryExcel,
  downloadGstSalesProductSummaryExcel,
  gstSalesCustomerSummary,
  gstSalesHsnSummary,
  gstSalesProductSummary,
} from "#controllers/gstSales.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, addGstSale)
  .get(protect, admin, getGstSales);

router
  .route("/:id")
  .delete(protect, admin, deleteGstSale)
  .put(protect, admin, updateGstSale);

router
  .route("/invoice/preview/:id")
  .get(protect, admin, previewGstSaleInvoicePdf);
router.route("/invoice/sendMail/:id").get(protect, admin, sendInvoiceEmail);

router
  .route("/invoice/download/:id")
  .get(protect, admin, downloadGstSaleInvoicePdf);
router.route("/download/excel").post(protect, admin, downloadGstSalesListExcel);
router.route("/download/pdf").post(protect, admin, downloadGstSalesListPdf);

router.route("/summary/customers").get(protect, admin, gstSalesCustomerSummary);
router
  .route("/download/summary/customers")
  .post(protect, admin, downloadGstSalesCustomerSummaryExcel);

router.route("/summary/hsn").get(protect, admin, gstSalesHsnSummary);
router
  .route("/download/summary/hsn")
  .post(protect, admin, downloadGstSalesHsnSummaryExcel);

router.route("/summary/product").get(protect, admin, gstSalesProductSummary);
router
  .route("/download/summary/product")
  .post(protect, admin, downloadGstSalesProductSummaryExcel);

export default router;
