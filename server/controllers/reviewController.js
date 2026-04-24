const Review = require("../models/Review");

/*
  ===============================
  Create Review
  ===============================
*/

exports.createReview = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    /* Check if user already reviewed */

    const existingReview = await Review.findOne({
      userId: req.user.id,
      eventId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this event",
      });
    }

    /* Create review */

    const review = await Review.create({
      userId: req.user.id,
      eventId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/*
  ===============================
  Get Reviews for Event
  ===============================
*/

exports.getEventReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      eventId: req.params.eventId,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= Delete Review =================
// User can delete only their own review

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if review belongs to logged in user

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= Get Average Rating =================

exports.getEventRating = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // find all reviews of this event
    const reviews = await Review.find({ eventId });

    // if no reviews
    if (reviews.length === 0) {
      return res.json({
        avgRating: 0,
        totalReviews: 0,
      });
    }

    const totalReviews = reviews.length;

    // calculate average
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    res.json({
      avgRating,
      totalReviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
