const express = require("express");
const router = express.Router();

const {
  createReview,
  getEventReviews,
  deleteReview,
  getEventRating,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/auth");

/*

Create Review

User must be logged in
*/

router.post("/", protect, createReview);

/*

Get Average Rating

IMPORTANT: must be before /:eventId
*/

router.get("/rating/:eventId", getEventRating);

/*

Get All Reviews for Event

*/

router.get("/:eventId", getEventReviews);

/*

Delete Review

Only review owner can delete
*/

router.delete("/:id", protect, deleteReview);

module.exports = router;
