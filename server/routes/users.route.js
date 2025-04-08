import express from "express";
const router = express.Router();
import {
  createUser,
  deleteUser,
  getUsers,
  loginUser,
  logoutUser,
  updateUserProfile,
} from "#controllers/user.controller.js";
import { admin, loginLimiter, protect } from "#middlewares/auth.middleware.js";

router.post("/login", loginLimiter, loginUser);
router.post("/logout", protect, admin, logoutUser);
router.post("/update/:id", protect, admin, updateUserProfile);
router.get("/", protect, admin, getUsers);
router.post("/", protect, admin, createUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
