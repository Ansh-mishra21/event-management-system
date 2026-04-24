const express = require("express");
const router = express.Router();

const {
  bookEvent,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  sendBookingOTP,
  getBookingById,
  createBookingAfterPayment,
  validateTicket,
} = require("../controllers/bookingController");

const { protect, admin } = require("../middleware/auth");
const { requireDBUser } = require("../middleware/requireInDb");

// Send OTP before booking (user must be logged in)
router.post("/send-otp", protect, requireDBUser, sendBookingOTP);

// Create booking request (logged-in users only)
router.post("/", protect, requireDBUser, bookEvent);

// Admin confirms booking
router.put("/:id/confirm", protect, requireDBUser, admin, confirmBooking);

// Get logged-in user's bookings
router.get("/my", protect, requireDBUser, getMyBookings);

// Cancel booking
router.delete("/:id", protect, requireDBUser, cancelBooking);

// Get booking by ID (for ticket page)
router.get("/:id", protect, requireDBUser, getBookingById);

// Create booking after successful payment (used by payment controller)
router.post("/payment-booking", protect, requireDBUser, createBookingAfterPayment);

// Validate ticket at event entry (admin only)
router.put("/validate/:id", protect, requireDBUser, admin, validateTicket);

module.exports = router;
