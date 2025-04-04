import express from "express";
import {
  addCashSale,
  deleteCashSale,
  getCashSales,
  updateCashSale,
  previewCashSaleInvoicePdf,
  downloadCashSaleInvoicePdf,
  downloadCashSalesListPdf,
  downloadCashSalesListExcel,
  sendInvoiceEmail,
  salesSummary,
  salesProductSummary,
  downloadSalesCustomerSummaryExcel,
  downloadSalesProductSummaryExcel,
} from "#controllers/cashSales.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, admin, addCashSale).get(getCashSales);

router
  .route("/:id")
  .put(protect, admin, updateCashSale)
  .delete(protect, admin, deleteCashSale);

router
  .route("/invoice/preview/:id")
  .get(protect, admin, previewCashSaleInvoicePdf);

router.route("/invoice/sendMail/:id").get(protect, admin, sendInvoiceEmail);

router
  .route("/invoice/download/:id")
  .get(protect, admin, downloadCashSaleInvoicePdf);

router.route("/download/pdf").post(protect, admin, downloadCashSalesListPdf);
router
  .route("/download/excel")
  .post(protect, admin, downloadCashSalesListExcel);

router.route("/summary/customers").get(protect, admin, salesSummary);
router
  .route("/download/summary/customers")
  .post(protect, admin, downloadSalesCustomerSummaryExcel);

router.route("/summary/product").get(protect, admin, salesProductSummary);
router
  .route("/download/summary/product")
  .post(protect, admin, downloadSalesProductSummaryExcel);
  
export default router;
