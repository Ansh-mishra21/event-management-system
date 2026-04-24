import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaTimesCircle,
  FaCalendarCheck,
  FaHistory,
  FaWallet,
} from "react-icons/fa";


const UserDashboard = () => {
  const { user, authloading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

 /* ================= Fetch Bookings ================= */

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");

      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Cancel Booking ================= */

  const cancelBooking = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await api.delete(`/bookings/${id}`);

        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  /* ================= Booking Filters ================= */

  const today = new Date();

  const upcomingBookings = bookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      b.eventId &&
      new Date(b.eventId.date) >= today,
  );

  const pastBookings = bookings.filter(
    (b) =>
      b.status !== "cancelled" && b.eventId && new Date(b.eventId.date) < today,
  );

   // Stats
  const totalBookings = upcomingBookings.length + pastBookings.length;

  const totalSpent = [...upcomingBookings, ...pastBookings].reduce(
    (sum, b) => sum + b.amount,
    0,
  );


  /* ================= Loading ================= */

  // if (loading)
  //   return (
  //     <div className="text-center py-20 text-xl font-semibold">
  //       Loading dashboard...
  //     </div>
  //   );

  return (
    <div className="max-w-6xl mx-auto">
      {/* ================= Profile Header ================= */}

      <div className="bg-white rounded-2xl shadow-md p-8 mb-12 border flex items-center gap-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white
bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg"
        >
          {user?.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl text-black font-bold mb-2 flex items-center gap-2">
            Welcome back, {user?.name}
          </h1>

          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            User Dashboard
          </p>
        </div>
      </div>

      {/* ================= Dashboard Stats ================= */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Bookings */}

        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <h3 className="text-2xl font-bold">{totalBookings}</h3>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <FaTicketAlt />
            </div>
          </div>
        </div>

        {/* Upcoming */}

        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Upcoming Events</p>
              <h3 className="text-2xl font-bold">{upcomingBookings.length}</h3>
            </div>

            <div className="p-3 rounded-xl bg-green-500 text-white">
              <FaCalendarCheck />
            </div>
          </div>
        </div>

        {/* Past */}

        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Past Events</p>
              <h3 className="text-2xl font-bold">{pastBookings.length}</h3>
            </div>

            <div className="p-3 rounded-xl bg-gray-700 text-white">
              <FaHistory />
            </div>
          </div>
        </div>

        {/* Total Spent */}

        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <h3 className="text-2xl font-bold">₹{totalSpent}</h3>
            </div>

            <div className="p-3 rounded-xl bg-yellow-500 text-white">
              <FaWallet />
            </div>
          </div>
        </div>
      </div>

      {/* ================= Upcoming Bookings ================= */}

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FaTicketAlt />
        Upcoming Bookings
      </h2>

      {upcomingBookings.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border text-center text-gray-500 mb-10">
          No upcoming bookings
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {upcomingBookings.map((booking) => {
            const percent =
              (booking.eventId?.availableSeats / booking.eventId?.totalSeats) *
              100;

            return (
              <div
                key={booking._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Image */}

                <div className="relative h-52 overflow-hidden">
                  <img
                    src={booking.eventId?.image}
                    alt="event"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Payment badge */}

                  <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    {booking.paymentStatus}
                  </span>

                  {/* Category */}

                  <span className="absolute top-4 left-4 bg-white/90 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    {booking.eventId?.category}
                  </span>
                </div>

                {/* Content */}

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2">
                    {booking.eventId?.title}
                  </h3>

                  {/* Date */}

                  <p className="text-sm text-gray-500 mb-1">
                    📅 {new Date(booking.eventId?.date).toLocaleDateString()}
                  </p>

                  {/* Price */}

                  <p className="text-sm text-gray-500 mb-4">
                    💰{" "}
                    {booking.amount === 0 ? "Free Event" : `₹${booking.amount}`}
                  </p>

                  {/* Seats progress */}

                  <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Buttons */}

                  <div className="flex justify-between items-center mt-auto">
                    <Link
                      to={`/events/${booking.eventId._id}`}
                      className="text-sm font-semibold text-purple-600 hover:underline"
                    >
                      View Event
                    </Link>

                    <div className="flex gap-3">
                      <Link
                        to={`/ticket/${booking._id}`}
                        className="px-3 py-1 text-xs text-white rounded-full
bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition"
                      >
                        View Ticket
                      </Link>

                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-3 py-1 text-xs text-red-500 border border-red-400 rounded-full hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= Past Bookings ================= */}

      <h2 className="text-2xl font-bold mb-6">Past Events</h2>

      {pastBookings.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border text-center text-gray-500">
          No past bookings
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              <img
                src={booking.eventId?.image}
                alt="event"
                className="h-28 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-bold mb-2">{booking.eventId?.title}</h3>

                <p className="text-sm text-gray-500">
                  📅 {new Date(booking.eventId?.date).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  💰 {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
