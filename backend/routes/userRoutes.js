import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  verifyUserAccount,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
  updateUserProfileImage,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========================== AUTH & REGISTRATION ==========================
router
  .route("/")
  .post(createUser) // Register User
  .get(authenticate, authorizeAdmin, getAllUsers); // Get All Users (Admin)

router.post("/auth", loginUser); // Login
router.post("/logout", logoutCurrentUser); // Logout

// ========================== EMAIL VERIFICATION ==========================
router.post("/verify-account", verifyUserAccount);
router.post("/resend-verification-otp", resendVerificationOtp);

// ========================== PASSWORD RESET ==========================
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ========================== USER PROFILE ==========================
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ✅ Profile Image Update Route
router.put("/profile/image", authenticate, updateUserProfileImage);

// ========================== ADMIN MANAGEMENT ==========================
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

export default router;
