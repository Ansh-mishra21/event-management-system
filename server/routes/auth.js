const express = require("express");
const router = express.Router();
const {protect, verifySignup} = require("../middleware/auth");

// Import auth controller functions
const {
  register,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { requireDBUser } = require("../middleware/requireInDb");

// Register new user (OTP will be sent for verification)
router.post("/register", verifySignup, register);

// Login existing user
router.post("/login", protect, login);

// Verify OTP after registration
router.post("/verify-otp", verifyOTP);

// Send OTP for forgot password
router.post("/forgot-password", forgotPassword);

// Reset password using OTP
router.post("/reset-password", resetPassword);

module.exports = router;
