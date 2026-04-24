import React, { useState } from "react";
import api from "../utils/axios";

/*
  Review Form Component
*/

const ReviewForm = ({ eventId, refreshReviews }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await api.post("/reviews", {
        eventId,
        rating,
        comment,
      });

      setComment("");

      /* Refresh reviews */

      refreshReviews();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={submitReview} className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      {/* Rating */}

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>

      {/* Comment */}

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button className="bg-purple-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
