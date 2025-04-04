import express from "express";
import {
  addGstPaid,
  deleteGstPaid,
  getGstPaid,
  updateGstPaid,
  downloadGstPaidListExcel,
} from "#controllers/gstPaid.controller.js";
import { admin, protect } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, admin, addGstPaid).get(getGstPaid);

router
  .route("/:id")
  .put(protect, admin, updateGstPaid)
  .delete(protect, admin, deleteGstPaid);

router.route("/download/excel").post(protect, admin, downloadGstPaidListExcel);

export default router;
