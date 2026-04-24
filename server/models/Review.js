const mongoose = require("mongoose");

/*
  Review Schema

  Stores user reviews for events
*/

const reviewSchema = new mongoose.Schema(
  {
    /* User who wrote review */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* Event being reviewed */

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    /* Rating (1–5 stars) */

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    /* Review text */

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },

  /* Auto timestamps */

  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
