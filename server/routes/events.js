const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect, admin } = require("../middleware/auth");

// Get all events (public)
router.get("/", getEvents);

// Get single event details (public)
router.get("/:id", getEventById);

// Create new event (admin only)
router.post("/", protect, admin, createEvent);

// Update event (admin only)
router.put("/:id", protect, admin, updateEvent);

// Delete event (admin only)
router.delete("/:id", protect, admin, deleteEvent);

module.exports = router;
