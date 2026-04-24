import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaStar,
  FaShareAlt,
} from "react-icons/fa";

const EventDetail = () => {
  /* ================= Get Event ID ================= */

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  /* ================= State ================= */

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  /* Reviews state */

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  /* ================= Fetch Event ================= */

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    fetchRating();

    fetchReviews();
  }, [id]);

  /* ================= Share Event ================= */

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href,
    };

    try {
      // If browser supports native share
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // fallback → copy link

        await navigator.clipboard.writeText(window.location.href);

        alert("Event link copied to clipboard!");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  /* ================= Fetch Reviews ================= */

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  // ================= Fetch Rating =================

  const fetchRating = async () => {
    try {
      const { data } = await api.get(`/reviews/rating/${id}`);

      setAvgRating(data.avgRating);
      setTotalReviews(data.totalReviews);
    } catch (error) {
      console.error("Error fetching rating");
    }
  };

  /* ================= Submit Review ================= */

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/reviews", {
        eventId: id,
        rating,
        comment,
      });

      setComment("");

      /* refresh reviews */

      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting review");
    }
  };

  /* ================= Razorpay Payment ================= */

  const handlePayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setPaymentLoading(true);

      const { data } = await api.post("/payments/create-order", {
        amount: event.ticketPrice,
      });

      const options = {
        key: "rzp_test_SOqY0dkiZ0CgUr",
        amount: data.amount,
        currency: data.currency,
        name: "Eventify",
        description: event.title,
        order_id: data.id,

        handler: async function (response) {
          const bookingRes = await api.post("/bookings/payment-booking", {
            eventId: event._id,
            paymentId: response.razorpay_payment_id,
          });

          const booking = bookingRes.data.booking;

          navigate(`/ticket/${booking._id}`);
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    } finally {
      setPaymentLoading(false);
    }
  };

  // ================= Delete Review =================

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);

      fetchReviews(); // refresh list
    } catch (error) {
      alert("Failed to delete review");
    }
  };

  /* ================= Loading UI ================= */

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading event...
      </div>
    );

  /* ================= Event Calculations ================= */

  const seatPercentage = (event.availableSeats / event.totalSeats) * 100;

  const eventDate = new Date(event.date);
  const now = new Date();

  const isPast = eventDate < now;
  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* ================= HERO SECTION ================= */}

      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-12">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-[420px] object-cover"
        />

        {/* SHARE BUTTON */}

        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <FaShareAlt />

            <span className="hidden sm:inline">Share Event</span>
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        <div className="absolute bottom-10 left-10 text-white">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-semibold">
            {event.category}
          </span>

          <h1 className="text-5xl font-extrabold mt-3">{event.title}</h1>
          <div className="flex items-center gap-2 mt-3 text-yellow-400">
            <FaStar />

            <span className="text-white font-semibold">
              {avgRating ? avgRating.toFixed(1) : "0"} / 5
            </span>

            <span className="text-gray-300 text-sm">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid md:grid-cols-3 gap-12">
        {/* ================= EVENT INFO ================= */}

        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6">About this event</h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {event.description}
          </p>

          {/* Event Info */}

          <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
            <div className="flex items-center gap-3 text-lg">
              <FaCalendarAlt className="text-purple-600" />
              {eventDate.toLocaleDateString()}
            </div>

            <div className="flex items-center gap-3 text-lg">
              <FaMapMarkerAlt className="text-purple-600" />
              {event.location}
            </div>
          </div>

          {/* ================= REVIEWS SECTION ================= */}

          <div className="mt-16">
            {/* ===== SECTION HEADER ===== */}

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Event Reviews
              </h2>

              <span className="text-gray-500 text-sm">
                {reviews.length} Reviews
              </span>
            </div>

            {/* ================= REVIEW FORM ================= */}

            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 mb-12">
              <h3 className="text-xl font-semibold mb-6">
                Share your experience
              </h3>

              <form onSubmit={submitReview}>
                {/* ===== STAR RATING ===== */}

                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer text-2xl transition transform hover:scale-110 
            ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}

                  <span className="ml-3 text-gray-500 text-sm">
                    {rating} / 5
                  </span>
                </div>

                {/* ===== COMMENT BOX ===== */}

                <textarea
                  placeholder="Tell others about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl p-4 mb-6 focus:ring-2 focus:ring-purple-500 outline-none"
                />

                {/* ===== SUBMIT BUTTON ===== */}

                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* ================= REVIEWS LIST ================= */}

            <div className="grid md:grid-cols-2 gap-6">
              {reviews.length === 0 && (
                <p className="text-gray-500">No reviews yet.</p>
              )}

              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition"
                >
                  {/* HEADER */}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}

                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        {review.userId?.name?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.userId?.name}
                        </p>

                        {/* Stars */}

                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* DELETE BUTTON */}

                    {user && review.userId._id === user._id && (
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="text-red-500 text-sm font-semibold hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* COMMENT */}

                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= BOOKING CARD ================= */}

        <div className="sticky top-28">
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Booking Details</h3>

            <div className="flex justify-between mb-6">
              <span className="text-gray-500">Ticket Price</span>

              <span className="text-2xl font-bold">
                {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
              </span>
            </div>

            {/* Seats */}

            <div className="flex justify-between text-sm mb-3">
              <span className="flex items-center gap-2 text-gray-500">
                <FaChair />
                Seats Left
              </span>

              <span className="font-semibold">
                {event.availableSeats} / {event.totalSeats}
              </span>
            </div>

            {/* Progress */}

            <div className="w-full bg-gray-200 h-3 rounded-full mb-8">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                style={{ width: `${seatPercentage}%` }}
              ></div>
            </div>

            {/* Book Button */}

            <button
              onClick={handlePayment}
              disabled={isSoldOut || paymentLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition
              ${
                isSoldOut
                  ? "bg-gray-300 text-gray-500"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105"
              }
              `}
            >
              {paymentLoading
                ? "Processing..."
                : isSoldOut
                  ? "Sold Out"
                  : "Book Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
